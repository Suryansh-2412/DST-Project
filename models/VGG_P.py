import tensorflow as tf
import numpy as np
from tensorflow import keras


def predict_pneumonia(image_path, model_path):
    # 1. Load the saved model
    # Note: compile=False is faster for inference
    model = keras.models.load_model(model_path, compile=False)

    # 2. Preprocess the image (Must match training logic)
    img = tf.io.read_file(image_path)
    img = tf.image.decode_image(img, channels=3, expand_animations=False)
    img = tf.image.convert_image_dtype(img, tf.float32)
    img = tf.image.resize(img, (224, 224))
    img = tf.expand_dims(img, axis=0)  # Create batch axis (1, 224, 224, 3)

    # 3. Predict
    prediction = model.predict(img, verbose=0)
    probability = float(prediction[0][0])

    # 4. Format Result
    label = "Pneumonia" if probability > 0.5 else "Normal"
    confidence = probability if label == "Pneumonia" else (1 - probability)

    return {
        "label": label,
        "probability": probability,
        "confidence_score": confidence
    }