import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ImageUploader from './ImageUploader';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from '../../utils/cloudinary';
import { fill } from '@cloudinary/url-gen/actions/resize';
import toast from 'react-hot-toast';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [drops, setDrops] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', dropId: '', images: [] });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchDrops();
    }, []);

    const fetchProducts = async () => {
        const querySnapshot = await getDocs(collection(db, "products"));
        setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchDrops = async () => {
        const querySnapshot = await getDocs(collection(db, "drops"));
        setDrops(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const handleImageUpload = (imageData) => {
        // Enforce limit of 3 images
        if ((formData.images?.length || 0) >= 3) {
            toast.error('Límite de 3 imágenes alcanzado');
            return;
        }

        setFormData(prev => ({
            ...prev,
            images: [...(prev.images || []), { url: imageData.secure_url, publicId: imageData.public_id }]
        }));
        toast.success('Imagen añadida');
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const baseData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                dropId: formData.dropId,
                images: formData.images || [],
                isVisible: true
            };

            if (editingId) {
                await updateDoc(doc(db, "products", editingId), baseData);
                toast.success('Objeto actualizado con éxito');
                setEditingId(null);
            } else {
                await addDoc(collection(db, "products"), {
                    ...baseData,
                    createdAt: serverTimestamp()
                });
                toast.success('¡Nueva pieza forjada! ⚒️');
            }

            setFormData({ name: '', description: '', price: '', stock: '', dropId: '', images: [] });
            fetchProducts();
        } catch (err) {
            console.error(err);
            toast.error('Error al guardar pieza');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product.id);
        setFormData(product);
        toast('Editando pieza...', { icon: '⚒️' });
    };

    const handleDelete = async (id) => {
        toast((t) => (
            <div style={{ padding: '5px' }}>
                <p style={{ marginBottom: '10px' }}>¿Deseas eliminar este producto?</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        className="btn-admin-small btn-delete-premium"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await deleteDoc(doc(db, "products", id));
                                toast.success('Producto borrado');
                                fetchProducts();
                            } catch (err) {
                                toast.error('Error al borrar');
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
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Gestión de Productos</h3>

            <form onSubmit={handleSubmit} className="admin-form-grid">
                <div className="input-group full-width">
                    <label className="input-label">Nombre del Producto</label>
                    <input className="form-input" placeholder="Ej: Cráneo de Obsidiana" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                </div>

                <div className="input-group full-width">
                    <label className="input-label">Detalles del Objeto</label>
                    <textarea className="form-input" placeholder="Describe la pieza..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required rows="3" />
                </div>

                <div className="input-group">
                    <label className="input-label">Precio ($)</label>
                    <input className="form-input" type="number" placeholder="0.00" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                </div>

                <div className="input-group">
                    <label className="input-label">Unidades Disponibles</label>
                    <input className="form-input" type="number" placeholder="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required />
                </div>

                <div className="input-group full-width">
                    <label className="input-label">Vincular a Colección</label>
                    <select className="form-input" value={formData.dropId} onChange={e => setFormData({ ...formData, dropId: e.target.value })} required>
                        <option value="">Seleccionar Drop...</option>
                        {drops.map(d => <option key={d.id} value={d.id} style={{ color: 'white', background: '#261434' }}>{d.name}</option>)}
                    </select>
                </div>

                <div className="input-group full-width">
                    <label className="input-label">Galería Multimedia</label>
                    <ImageUploader onUpload={handleImageUpload} label="Añadir Arte Visual" />

                    <div className="thumbnails" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                        {formData.images?.map((img, index) => (
                            <div key={index} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <img src={img.url} alt="" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                                <button type="button" onClick={() => removeImage(index)} style={{
                                    position: 'absolute', top: 5, right: 5, background: 'rgba(255,50,50,0.9)', color: 'white',
                                    border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                }}>×</button>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="btn-submit-premium full-width" disabled={loading}>
                    {editingId ? 'Actualizar Pieza' : 'Forjar Producto'}
                </button>
            </form>

            <div className="product-list" style={{ marginTop: '3rem' }}>
                <h4 style={{ marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', opacity: 0.5 }}>Fragmentos de la Noche</h4>
                {products.map(product => {
                    const dropName = drops.find(d => d.id === product.dropId)?.name;
                    return (
                        <div key={product.id} className="item-card">
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{product.name}</h4>
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '4px', alignItems: 'center' }}>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: '700' }}>${product.price}</p>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.4 }}>|</span>
                                    <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Stock: {product.stock}</p>
                                    {dropName && (
                                        <>
                                            <span style={{ fontSize: '0.8rem', opacity: 0.4 }}>|</span>
                                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>Drop: {dropName}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="item-actions">
                                <button onClick={() => handleEdit(product)} className="btn-admin-small btn-edit-premium">Editar</button>
                                <button onClick={() => handleDelete(product.id)} className="btn-admin-small btn-delete-premium">Eliminar</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductManager;
