import os
import numpy as np
import pickle as pkl
from numpy.linalg import norm
from flask import Flask, request, jsonify, send_from_directory  # 🔥 NEW
from flask_cors import CORS
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalMaxPool2D
import tensorflow as tf
from sklearn.neighbors import NearestNeighbors
from werkzeug.utils import secure_filename
import json

# Load product details JSON
with open("C:/Users/Aastha/Documents/Fashion_ecommerce/backend-fashion/static/product_details.json", "r") as f:
    product_details = json.load(f)

app = Flask(__name__)
CORS(app)

# Load precomputed data
features_list = pkl.load(open('C:/Users/Aastha/Documents/Fashion_ecommerce/backend-fashion/ai_data/Image_features.pkl', 'rb'))
filenames = pkl.load(open('C:/Users/Aastha/Documents/Fashion_ecommerce/backend-fashion/ai_data/filenames.pkl', 'rb'))

# Load model
resnet = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
resnet.trainable = False
model = tf.keras.models.Sequential([resnet, GlobalMaxPool2D()])

# NearestNeighbors
neighbors = NearestNeighbors(n_neighbors=9, algorithm='brute', metric='euclidean')
neighbors.fit(features_list)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# NEW: dataset image directory
DATASET_IMAGE_FOLDER = 'C:/Users/Aastha/Documents/AI-ML/venv/data/front_female_images'

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

    recommended = []
    for i in indices[0][1:]:  # skip uploaded image
        filename = os.path.basename(filenames[i])
        image_url = f"http://localhost:5001/dataset_images/{filename}"

        # Find product by matching image filename
        product = next((p for p in product_details if filename in p["image"]), None)

        if product:
            recommended.append({
                "image": image_url,
                "name": product["name"],
                "price": product["price"]
            })

    return jsonify({"recommended": recommended})
# NEW: serve dataset images by filename
@app.route('/dataset_images/<path:filename>')
def dataset_images(filename):
    return send_from_directory(DATASET_IMAGE_FOLDER, filename)

if __name__ == "__main__":
    app.run(port=5001)
