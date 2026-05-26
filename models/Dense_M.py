import tensorflow as tf
import numpy as np
from tensorflow import keras

# 1. Load your saved model (Ensure the .keras file is in your server directory)
def predict_malaria(image_path, model_path):
    """
    Core function for website backend:
    Inputs: path to uploaded image
    Outputs: Dictionary with class and probability
    """
    IMG_SIZE = (224, 224)

    # Load the model (compile=False for faster loading during inference)
    model = keras.models.load_model(model_path, compile=False)

    # Load and preprocess the image exactly as done during training
    img = tf.io.read_file(image_path)
    img = tf.image.decode_image(img, channels=3, expand_animations=False)
    img = tf.image.convert_image_dtype(img, tf.float32)
    img = tf.image.resize(img, IMG_SIZE)

    # Add batch dimension (1, 224, 224, 3)
    img_array = tf.expand_dims(img, 0)

    # Run inference
    prediction = model.predict(img_array, verbose=0)[0][0]

    # Thresholding (Infected = 1, Uninfected = 0 based on your training labels)
    label = "Infected" if prediction > 0.5 else "Uninfected"
    confidence = float(prediction if prediction > 0.5 else (1 - prediction))

    return {
        "prediction": label,
        "probability": confidence * 100,
        "raw_score": prediction
    }