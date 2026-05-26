import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

def predict_single_image(img_path, model_path):
    """
    Takes an image path, preprocesses the image,
    and returns a dictionary with prediction, confidence, and raw score.
    """
    # 1. Load the model (compile=False for faster loading during inference)
    model = tf.keras.models.load_model(model_path, compile=False)

    # 2. Load and Preprocess the image
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    # Add batch dimension and normalize (rescale 1/255 as done in training)
    img_array = np.expand_dims(img_array, axis=0) / 255.0

    # 3. Perform Prediction
    predictions = model.predict(img_array)
    prediction = predictions[0]
    predicted_class_idx = np.argmax(prediction)
    confidence = float(np.max(prediction))

    # 4. Map to Label
    # Based on your training generator: 0 is Cancer, 1 is Normal
    class_names = ['Cancer', 'Normal']
    label = class_names[predicted_class_idx]

    return {
        "prediction": label,
        "confidence": confidence,
        "raw_score": prediction
    }