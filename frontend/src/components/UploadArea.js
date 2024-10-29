import React, { useRef } from 'react';

const UploadArea = ({ onUpload }) => {
    const fileInputRef = useRef(null)

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files[0] && files[0].type.startsWith('image/')) {
            onUpload(files[0]);
        } else {
            alert("Please upload an image file.");
        }
    };

    const handleClick = () => fileInputRef.current.click();

    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={handleClick}
            style={{
                border: "2px dashed #ddd",
                padding: "20px",
                cursor: "pointer",
                margin: "10px",
                textAlign: "center"
            }}
        >
            <p>Drag & Drop Image Here or Click to Upload</p>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={(e) => onUpload(e.target.files[0])}
            />
        </div>
    );
};

export default UploadArea;