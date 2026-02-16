import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ImageUploader from './ImageUploader';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../../utils/cloudinary';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import toast from 'react-hot-toast';

const DropManager = () => {
    const [drops, setDrops] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', endDate: '', coverImage: null });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDrops();
    }, []);

    const fetchDrops = async () => {
        const querySnapshot = await getDocs(collection(db, "drops"));
        const dropsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort by created/active
        setDrops(dropsData.sort((a, b) => b.createdAt - a.createdAt));
    };

    const handleImageUpload = (imageData) => {
        setFormData(prev => ({ ...prev, coverImage: { url: imageData.secure_url, publicId: imageData.public_id } }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingId) {
                const dropRef = doc(db, "drops", editingId);
                // Don't send createdAt or isActive if not needed/calculated
                await updateDoc(dropRef, {
                    name: formData.name,
                    description: formData.description,
                    endDate: formData.endDate,
                    coverImage: formData.coverImage
                });
                toast.success('Drop actualizado con éxito ✨');
                setEditingId(null);
            } else {
                await addDoc(collection(db, "drops"), {
                    ...formData,
                    isActive: true,
                    createdAt: serverTimestamp()
                });
                toast.success('¡Nuevo Drop lanzado! 🚀');
            }

            setFormData({ name: '', description: '', endDate: '', coverImage: null });
            fetchDrops();
        } catch (err) {
            console.error(err);
            toast.error('Hubo un error al guardar el Drop');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (drop) => {
        setEditingId(drop.id);
        const dateStr = drop.endDate;
        setFormData({
            name: drop.name,
            description: drop.description,
            endDate: dateStr || '',
            coverImage: drop.coverImage
        });
        toast('Editando drop...', { icon: '📝' });
    };

    const handleDelete = async (id) => {
        toast((t) => (
            <div style={{ padding: '5px' }}>
                <p style={{ marginBottom: '10px' }}>¿Deseas eliminar este Drop?</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        className="btn-admin-small btn-delete-premium"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await deleteDoc(doc(db, "drops", id));
                                toast.success('Drop eliminado');
                                fetchDrops();
                            } catch (err) {
                                toast.error('Error al eliminar');
                            }
                        }}
                    >
                        Sí, borrar
                    </button>
                    <button
                        className="btn-admin-small"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        ), { duration: 6000 });
    };

    return (
        <div className="admin-section">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Gestión de Drops</h3>

            <form onSubmit={handleSubmit} className="admin-form-grid">
                <div className="input-group">
                    <label className="input-label">Nombre del Drop</label>
                    <input
                        type="text"
                        placeholder="Ej: Nocturna Craft"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="form-input"
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Finaliza el</label>
                    <input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                        required
                        className="form-input"
                    />
                </div>

                <div className="input-group full-width">
                    <label className="input-label">Misión / Descripción</label>
                    <textarea
                        placeholder="Describe la mística de este drop..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        required
                        className="form-input"
                    />
                </div>

                <div className="input-group full-width">
                    <label className="input-label">Multimedia de Portada</label>
                    <ImageUploader onUpload={handleImageUpload} label={formData.coverImage ? "Reemplazar Portada" : "Subir Arte de Portada"} />
                    {formData.coverImage && (
                        <div className="preview-container">
                            <img src={formData.coverImage.url} alt="Preview" className="preview-image" />
                        </div>
                    )}
                </div>

                {error && <p className="error-message full-width">{error}</p>}

                <button type="submit" className="btn-submit-premium full-width" disabled={loading}>
                    {loading ? 'Sincronizando...' : (editingId ? 'Guardar Cambios' : 'Lanzar Drop')}
                </button>
            </form>

            <div className="drops-list" style={{ marginTop: '3rem' }}>
                <h4 style={{ marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', opacity: 0.5 }}>Historial de Lanzamientos</h4>
                {drops.map(drop => (
                    <div key={drop.id} className="item-card">
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            {drop.coverImage?.publicId && (
                                <AdvancedImage cldImg={
                                    cld.image(drop.coverImage.publicId)
                                        .resize(fill().width(80).height(80).gravity(autoGravity()))
                                        .format('auto')
                                        .quality('auto')
                                } style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            )}
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{drop.name}</h4>
                                <p style={{ fontSize: '0.85rem', opacity: 0.6, marginTop: '4px' }}>Cierre: {new Date(drop.endDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="item-actions">
                            <button onClick={() => handleEdit(drop)} className="btn-admin-small btn-edit-premium">Editar</button>
                            <button onClick={() => handleDelete(drop.id)} className="btn-admin-small btn-delete-premium">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DropManager;
