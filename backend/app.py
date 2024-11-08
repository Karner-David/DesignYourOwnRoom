from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from PIL import Image
import os
import open3d as o3d
import numpy as np

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

def point_cloud_to_mesh(point_cloud):
    pcd = o3d.geometry.PointCloud()
    pcd.points = o3d.utility.Vector3dVector(point_cloud)

    pcd.estimate_normals(search_param=o3d.geometry.KDTreeSearchParamHybrid(radius=0.1, max_nn=30))

    mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(pcd, depth=9)

    vertices_to_remove = densities < np.percentile(densities, 10)
    mesh.remove_vertices_by_mask(vertices_to_remove)
    return mesh

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['image']
    try:

        img = Image.open(file.stream)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img = img.resize((256, 256))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        material_properties = np.array(default_material_properties)
        material_properties = np.expand_dims(material_properties, axis=0)

        point_cloud = model.predict([img_array, material_properties])[0]

        mesh = point_cloud_to_mesh(point_cloud)
        
        return jsonify({"vertices": np.asarray(mesh.vertices).tolist(),
                        "faces": np.asarray(mesh.triangles).tolist()})
    except Exception as e:
        return jsonify({"error": f"Failed to process the image: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)