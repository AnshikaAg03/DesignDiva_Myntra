from flask import Flask, request, jsonify, send_from_directory, render_template
from PIL import Image
import numpy as np
import pickle
import tensorflow
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalMaxPooling2D
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from sklearn.neighbors import NearestNeighbors
from numpy.linalg import norm
import os
import base64
from io import BytesIO

app = Flask(__name__, static_folder='static', template_folder='templates')

# local_base_path = r'C:\Users\deban\OneDrive\Desktop\MyntraHack\kaggle\input\fashion-product-images-small\images'
local_base_path = os.path.join(app.static_folder, 'product-images')
feature_list = np.array(pickle.load(open('embeddings.pkl', 'rb')))
filenames = pickle.load(open('filenames.pkl', 'rb'))

filenames = [os.path.join(local_base_path, os.path.basename(fname)) for fname in filenames]

model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
model.trainable = False

model = tensorflow.keras.Sequential([
    model,
    GlobalMaxPooling2D()
])

def feature_extraction(img_path, model):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    expanded_img_array = np.expand_dims(img_array, axis=0)
    preprocessed_img = preprocess_input(expanded_img_array)
    result = model.predict(preprocessed_img).flatten()
    normalized_result = result / norm(result)

    return normalized_result

def recommend(features, feature_list):
    neighbors = NearestNeighbors(n_neighbors=10, algorithm='brute', metric='euclidean')
    neighbors.fit(feature_list)

    distances, indices = neighbors.kneighbors([features])

    return indices

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        filename = os.path.join('uploads', file.filename)
        file.save(filename)

        features = feature_extraction(filename, model)
        indices = recommend(features, feature_list)

        recommendations = [os.path.basename(filenames[idx]) for idx in indices[0]]
        return jsonify({'recommendations': recommendations})

@app.route('/upload_canvas', methods=['POST'])
def upload_canvas():
    data = request.get_json()
    if 'image' not in data:
        return jsonify({'error': 'No image data'})

    image_data = data['image']
    image_data = image_data.split(',')[1] 
    image_data = base64.b64decode(image_data)

    image_path = os.path.join('uploads', 'canvas_image.png')
    with open(image_path, 'wb') as f:
        f.write(image_data)

    features = feature_extraction(image_path, model)
    indices = recommend(features, feature_list)
    print(indices)
    recommendations = [os.path.basename(filenames[idx]) for idx in indices[0]]

    return jsonify({'recommendations': recommendations})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

@app.route('/images/<path:filename>')
def images(filename):
    return send_from_directory(local_base_path, filename)

@app.route('/chatbot')
def chatbot():
    return render_template('chatbot.html')

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)
