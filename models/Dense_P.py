import tensorflow as tf
import numpy as np
from tensorflow import keras

# Configuration used during training
IMG_SIZE = (224, 224)

def predict_image(img_path, model_path):
    """
    Processes an image and returns the prediction class and confidence.
    """
    # 1. Load the model (compile=False for faster loading during inference)
    model = keras.models.load_model(model_path, compile=False)

    # 2. Load and Preprocess the image
    img = tf.io.read_file(img_path)
    img = tf.image.decode_image(img, channels=3, expand_animations=False)
    img = tf.image.convert_image_dtype(img, tf.float32)
    img = tf.image.resize(img, IMG_SIZE)
    img = tf.expand_dims(img, axis=0)  # Create batch axis (1, 224, 224, 3)

    # 3. Run Inference
    prediction_prob = model.predict(img)[0][0]

    # 4. Interpret Results
    # Threshold 0.5: > 0.5 is Pneumonia, <= 0.5 is Normal
    label = "Pneumonia" if prediction_prob > 0.5 else "Normal"
    confidence = prediction_prob if prediction_prob > 0.5 else (1 - prediction_prob)

    return {
        "label": label,
        "confidence": float(confidence),
        "probability": float(prediction_prob)
    }