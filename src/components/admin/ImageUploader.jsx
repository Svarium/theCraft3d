import React, { useState } from 'react';
import { uploadImage } from '../../services/cloudinaryService';
import Loader from '../ui/Loader';

const ImageUploader = ({ onUpload, label = "Subir Imagen" }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const result = await uploadImage(file);
            onUpload(result); // Pass { secure_url, public_id } to parent
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="form-group">
            <label className="image-upload-label" style={{
                display: 'block',
                marginBottom: '0.5rem',
                cursor: 'pointer',
                border: '2px dashed var(--accent)',
                padding: '1rem',
                textAlign: 'center',
                borderRadius: '8px',
                color: 'var(--text-secondary)'
            }}>
                {uploading ? (
                    <span>Subiendo...</span>
                ) : (
                    <>
                        <span>{label}</span>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            disabled={uploading}
                        />
                    </>
                )}
            </label>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ImageUploader;
