import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import os


def get_malaria_prediction(img_path, model_path):
    """
    Loads the model and predicts the class of a single image.
    Returns a dictionary with label and confidence.
    """
    # 1. Load the model (compile=False for faster loading during inference)
    model = keras.models.load_model(model_path, compile=False)

    # 2. Preprocess the image (Exact match to 'decode_and_resize' in training)
    img = tf.io.read_file(img_path)
    # Decode to tensor
    img = tf.image.decode_image(img, channels=3, expand_animations=False)
    # This line resizes AND converts to float32 [0, 1] range
    img = tf.image.convert_image_dtype(img, tf.float32)
    img = tf.image.resize(img, (224, 224))

    # Add batch dimension: (1, 224, 224, 3)
    img_array = tf.expand_dims(img, axis=0)

    # 3. Predict
    prediction = model.predict(img_array, verbose=0)[0][0]

    # 4. Map back to class names
    # Based on the training code: 1 = Infected, 0 = Uninfected
    if prediction > 0.5:
        label = "Infected"
        confidence = float(prediction)
    else:
        label = "Uninfected"
        confidence = float(1 - prediction)

    return {
        "prediction": label,
        "confidence": round(confidence, 4),
        "raw_score": float(prediction)
    }