import os
import numpy as np
import pickle as pkl
from numpy.linalg import norm
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.applications import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalMaxPool2D
import tensorflow as tf
from sklearn.neighbors import NearestNeighbors
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Load precomputed data
features_list = pkl.load(open('Image_features.pkl', 'rb'))
filenames = pkl.load(open('filenames.pkl', 'rb'))

# Load model
resnet = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
resnet.trainable = False
model = tf.keras.models.Sequential([resnet, GlobalMaxPool2D()])

# NearestNeighbors
neighbors = NearestNeighbors(n_neighbors=6, algorithm='brute', metric='euclidean')
neighbors.fit(features_list)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def extract_features(img_path, model):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_expand_dim = np.expand_dims(img_array, axis=0)
    img_preprocess = preprocess_input(img_expand_dim)
    result = model.predict(img_preprocess).flatten()
    return result / norm(result)

@app.route("/recommend", methods=["POST"])
def recommend():
    if "image" not in request.files:
        return jsonify({"error": "Image file is required"}), 400

    file = request.files["image"]
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    # Extract features and get recommendations
    features = extract_features(filepath, model)
    distances, indices = neighbors.kneighbors([features])

    # Get image names or product IDs
    results = [filenames[i] for i in indices[0][1:]]  # Skip the first (uploaded) image

    return jsonify({"recommended": results})

if __name__ == "__main__":
    app.run(port=5001)
