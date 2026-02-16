import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import PageWrapper from '../components/ui/PageWrapper';
import Container from '../components/ui/Container';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <Loader fullScreen />;
    if (!product) return <PageWrapper><Container><h1>Pieza Extraviada</h1><Button onClick={() => navigate('/')}>Volver al Inicio</Button></Container></PageWrapper>;

    const images = product.images || [];

    return (
        <PageWrapper className="product-detail-page">
            <Container>
                <div style={{ paddingTop: '8rem', paddingBottom: '5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }} className="product-detail-grid">

                    {/* --- Gallery Section --- */}
                    <div className="gallery-section">
                        <Card style={{ padding: '0.5rem', borderRadius: '24px', overflow: 'hidden', height: '600px' }}>
                            <img
                                src={images[activeImage]?.url}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px' }}
                            />
                        </Card>

                        {images.length > 1 && (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                {images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        style={{
                                            width: '80px', height: '80px', cursor: 'pointer', borderRadius: '12px', overflow: 'hidden',
                                            border: activeImage === idx ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)',
                                            opacity: activeImage === idx ? 1 : 0.6,
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- Info Section --- */}
                    <div className="product-info-section" style={{ position: 'sticky', top: '100px' }}>
                        <span style={{ textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            Objeto de Colección
                        </span>
                        <h1 style={{ fontSize: '3.5rem', margin: '1rem 0', fontWeight: '800' }}>{product.name}</h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff' }}>${product.price}</span>
                            <span style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', fontSize: '0.85rem', opacity: 0.6 }}>
                                {product.stock} unidades disponibles
                            </span>
                        </div>

                        <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '3rem' }}>
                            <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', opacity: 0.4, marginBottom: '1rem' }}>Mística del Objeto</h4>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.8 }}>{product.description}</p>
                        </div>

                        <Button
                            style={{ width: '100%', padding: '1.5rem', fontSize: '1.1rem', letterSpacing: '2px' }}
                            disabled={product.stock <= 0}
                        >
                            {product.stock > 0 ? 'ADQUIRIR PIEZA' : 'FUERA DE STOCK'}
                        </Button>

                        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', opacity: 0.4 }}>
                            Envío místico gratuito a todo el país.
                        </p>
                    </div>
                </div>
            </Container>
        </PageWrapper>
    );
};

export default ProductDetail;
