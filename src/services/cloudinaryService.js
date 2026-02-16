const CLOUD_NAME = 'dr10cqnsp';
const UPLOAD_PRESET = 'thecraft_unsigned';
const FOLDER = 'the-craft';

/**
 * Uploads a file to Cloudinary
 * @param {File} file - The file to upload
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
export const uploadImage = async (file) => {
    if (!file) throw new Error('No file provided');

    // Validations
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        throw new Error('Formato no soportado. Usa JPG, PNG o WEBP.');
    }

    if (file.size > 3 * 1024 * 1024) { // 3MB
        throw new Error('El archivo es muy pesado. Máximo 3MB.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', FOLDER);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Error al subir la imagen');
        }

        const data = await response.json();
        return {
            secure_url: data.secure_url,
            public_id: data.public_id
        };
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};
