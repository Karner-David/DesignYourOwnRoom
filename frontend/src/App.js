import React, { useState } from 'react';
import UploadArea from './components/UploadArea';

const App = () => {
    const [image, setImage] = useState(null);

    const handleImageUpload = (file) => {
        setImage(URL.createObjectURL(file));
    };

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h2>3D Room Designer</h2>
            <UploadArea onUpload={handleImageUpload} />
            {image && <img src={image} alt="Uploaded" width="200" />}
        </div>
    );
};

export default App;
