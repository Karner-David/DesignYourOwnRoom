from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from PIL import Image

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the 3D Model API!"})

model = tf.keras.models.load_model('../../model_checkpoint.keras')
default_material_properties = [0.5, 0.5, 0.5, # diffuse (Kd)
                               0.1, 0.1, 0.1, # specular (Ks)
                               0.5,           # shininess (Ns)
                               0.1, 0.1, 0.1, # ambience (Ka)
                               1.0,           # transparency (d)
                               2              # illumination
                              ]

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    # We definitely got a file
    file = request.files['image']
    img = Image.open(file.stream)

    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    img = img.resize((256, 256))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    material_properties = np.array(default_material_properties)
    material_properties = np.expand_dims(material_properties, axis=0)

    prediction = model.predict([img_array, material_properties])

    result = prediction.tolist()
    return jsonify({"3D_model_data": result})

if __name__ == '__main__':
    app.run(debug=True, port=5000)