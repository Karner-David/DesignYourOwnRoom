import React, { useRef } from 'react';

const UploadArea = ({ onUpload }) => {
    const fileInputRef = useRef(null)

    const handleDrop = async (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files[0] && files[0].type.startsWith('image/')) {
            await uploadImage(files[0]);
        } else {
            alert("Please upload an image file.");
        }
    };

    const handleClick = () => fileInputRef.current.click();

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("http://127.0.0.1:5000/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const result = await response.json();
            onUpload(result);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload the image. Please try again.");
        }
    };

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
                onChange={(e) => uploadImage(e.target.files[0])}
            />
        </div>
    );
};

export default UploadArea;