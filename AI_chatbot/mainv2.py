import os
import tempfile
import base64
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_community.document_loaders import PyMuPDFLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import PromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain

# --- CONFIGURATION ---
load_dotenv()
PERSIST_DIRECTORY = "./medical_vectordb"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    print("WARNING: GOOGLE_API_KEY not found in environment variables.")

app = FastAPI(title="Medical RAG Chatbot API")

# --- CORS MIDDLEWARE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- GLOBAL INITIALIZATION ---
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = Chroma(
    persist_directory=PERSIST_DIRECTORY,
    embedding_function=embedding_model
)

# --- DATA MODELS ---
class QueryRequest(BaseModel):
    query: str
    user_id: str

class QueryResponse(BaseModel):
    answer: str

# --- CORE FUNCTIONS ---
def extract_text_from_pdf(file_path):
    loader = PyMuPDFLoader(file_path)
    return loader.load()

def extract_text_from_image(image_bytes):
    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")
    
    encoded_string = base64.b64encode(image_bytes).decode('utf-8')
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0, google_api_key=GOOGLE_API_KEY)

    message = HumanMessage(
        content=[
            {
                "type": "text",
                "text": "You are a highly accurate medical data extractor. Extract all text, numbers, tabular data, and physician notes from this medical report image exactly as written. Do not summarize or interpret, just transcribe accurately."
            },
            {
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{encoded_string}"}
            }
        ]
    )
    response = llm.invoke([message])
    return [Document(page_content=response.content, metadata={"source": "uploaded_image"})]

async def process_document(file: UploadFile, user_id: str):
    documents = []
    temp_file_path = None
    clean_user_id = user_id.strip().strip('"').strip("'")

    try:
        file_bytes = await file.read()
        file_name = file.filename.lower()

        if file_name.endswith(".pdf"):
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
                temp_file.write(file_bytes)
                temp_file_path = temp_file.name
            documents = extract_text_from_pdf(temp_file_path)
        elif file_name.endswith((".png", ".jpg", ".jpeg")):
            documents = extract_text_from_image(file_bytes)
        else:
            raise ValueError("Unsupported file format. Please upload PDF, PNG, or JPG.")

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
        chunks = text_splitter.split_documents(documents)

        for chunk in chunks:
            chunk.metadata["user_id"] = clean_user_id
            chunk.metadata["doc_type"] = "guideline" if clean_user_id == "public" else "patient_report"

        vectorstore.add_documents(chunks)
        return True
    except Exception as e:
        raise Exception(f"Error processing file: {str(e)}")
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)

def setup_rag_chain(current_user_id):
    if not GOOGLE_API_KEY:
         raise HTTPException(status_code=500, detail="Gemini API Key missing")
         
    search_filter = {
        "$or": [
            {"user_id": "public"},
            {"user_id": current_user_id}
        ]
    }

    retriever = vectorstore.as_retriever(search_kwargs={"k": 4, "filter": search_filter})
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0, google_api_key=GOOGLE_API_KEY)

    prompt_template = """
            You are a professional, empathetic, and highly accurate medical AI assistant.
            You have two main jobs:
            1. Analyzing Uploaded Reports: If the user asks about their specific lab results, documents, or data, rely STRICTLY on the provided Context. Do not invent patient details.
            2. General Medical Knowledge: If the user asks general medical questions (e.g., symptoms, prevention, general treatments) and the information is not in the Context, use your extensive pre-trained medical knowledge.

            Guidelines for ALL responses:
            - Break down complex medical jargon into clear, patient-accessible language.
            - Never attempt to diagnose a user definitively. 
            - Always include a brief, polite disclaimer that you are an AI.

            Context:
            {context}

            User Query: {input}

            Response:
            """
    prompt = PromptTemplate.from_template(prompt_template)
    document_chain = create_stuff_documents_chain(llm, prompt)
    return create_retrieval_chain(retriever, document_chain)

# --- API ENDPOINTS ---
@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    user_id: str = Form(..., description="User ID or 'public' for global documents")
):
    try:
        await process_document(file, user_id)
        return {"status": "success", "message": f"File {file.filename} processed successfully."}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import traceback

@app.post("/query", response_model=QueryResponse)
async def query_chatbot(request: QueryRequest):
    try:
        clean_user_id = request.user_id.strip().strip('"').strip("'")
        print(f"DEBUG: Processing query for user: {clean_user_id}")
        
        chain = setup_rag_chain(current_user_id=clean_user_id)
        response = chain.invoke({"input": request.query})
        
        print(f"DEBUG: Backend Chain Keys: {response.keys() if isinstance(response, dict) else type(response)}")
        
        # Check for expected key
        answer = response.get("answer") if isinstance(response, dict) else None
        if not answer:
             print("WARNING: 'answer' key missing or empty in chain output.")
             
        return {"answer": answer or "I'm sorry, I couldn't generate a response."}
    except Exception as e:
        print("!!! BACKEND ERROR !!!")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))