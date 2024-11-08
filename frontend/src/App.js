import React, { useState } from 'react';
import UploadArea from './components/UploadArea';
import ModelViewer from './components/ModelViewer'

const App = () => {
    const [modelData, setModelData] = useState(null);

    const handleUpload = (data) => {
        console.log("Received 3D Model Data:", data); 
    
        if (data && data["3D_model_data"] && data["3D_model_data"].vertices && data["3D_model_data"].faces) {
            const vertices = data["3D_model_data"].vertices; 
            const faces = data["3D_model_data"].faces;       
    
            setModelData({ vertices, faces }); 
            console.log("Formatted 3D Model data: ", { vertices, faces }); 
        } else {
            console.error("Unexpected data format received from backend:", data);
            alert("Failed to process the uploaded image. Please try again.");
        }
    };
    

    return (
        <div>
            <h1>Design Your Room</h1>
            <UploadArea onUpload={handleUpload}/>
            {modelData && (
                    <ModelViewer modelData={modelData}/>
            )}
        </div>
    );
};

export default App;
