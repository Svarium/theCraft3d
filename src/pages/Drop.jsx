import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageWrapper from '../components/ui/PageWrapper';
import Container from '../components/ui/Container';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const ProductCard = ({ product, navigate }) => {
    const [currentImg, setCurrentImg] = useState(0);
    const images = product.images || [];

    const nextImg = (e) => {
        e.stopPropagation();
        setCurrentImg((prev) => (prev + 1) % images.length);
    };

    const prevImg = (e) => {
        e.stopPropagation();
        setCurrentImg((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <Card className="product-card-premium" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }} onClick={() => navigate(`/product/${product.id}`)}>
            <div className="product-card-visual" style={{ height: '320px', overflow: 'hidden', borderRadius: '12px', position: 'relative' }}>
                <img
                    src={images[currentImg]?.url}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s ease' }}
                />

                {images.length > 1 && (
                    <>
                        <div className="carousel-controls">
                            <button className="carousel-btn prev" onClick={prevImg}>‹</button>
                            <button className="carousel-btn next" onClick={nextImg}>›</button>
                        </div>
                        <div className="carousel-dots">
                            {images.map((_, i) => (
                                <span key={i} className={`dot ${currentImg === i ? 'active' : ''}`} />
                            ))}
                        </div>
                    </>
                )}

                <div className="card-overlay-btn">
                    <span>VER DETALLE</span>
                </div>
            </div>

            <div style={{ padding: '1.5rem 0 0.5rem 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '1.2rem', margin: 0 }}>{product.name}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: '800', fontSize: '1.1rem' }}>${product.price}</span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{product.stock} left</span>
                </div>
                <button className="btn-detail-small">VER PIEZA →</button>
            </div>
        </Card>
    );
};

const Drop = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({ drops: [], products: [], selectedDrop: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    // Specific Drop View
                    const dropSnap = await getDoc(doc(db, "drops", id));
                    const pq = query(collection(db, "products"), where("dropId", "==", id), where("isVisible", "==", true));
                    const pSnapshot = await getDocs(pq);

                    setData({
                        selectedDrop: dropSnap.exists() ? { id: dropSnap.id, ...dropSnap.data() } : null,
                        products: pSnapshot.docs.map(d => ({ id: d.id, ...d.data() })),
                        drops: []
                    });
                } else {
                    // General Drops Listing
                    const q = query(collection(db, "drops"), where("isActive", "==", true), orderBy("createdAt", "desc"));
                    const querySnapshot = await getDocs(q);
                    setData({
                        drops: querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })),
                        products: [],
                        selectedDrop: null
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <Loader fullScreen />;

    // --- Sub-View: Specific Drop Products ---
    if (id && data.selectedDrop) {
        return (
            <PageWrapper>
                <section className="drop-header" style={{
                    paddingTop: '6rem', paddingBottom: '3rem', textAlign: 'center',
                    background: `linear-gradient(rgba(28, 15, 38, 0.9), rgba(28, 15, 38, 1)), url(${data.selectedDrop.coverImage?.url})`,
                    backgroundSize: 'cover'
                }}>
                    <Container>
                        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{data.selectedDrop.name}</h1>
                        <p style={{ maxWidth: '700px', margin: '0 auto', opacity: 0.7 }}>{data.selectedDrop.description}</p>
                    </Container>
                </section>

                <Container>
                    <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem', paddingBottom: '5rem' }}>
                        {data.products.map(product => (
                            <ProductCard key={product.id} product={product} navigate={navigate} />
                        ))}
                    </div>
                </Container>
            </PageWrapper>
        );
    }

    // --- Main View: All Active Drops ---
    return (
        <PageWrapper>
            <Container>
                <div style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>Colecciones de Leyenda</h1>

                    <div className="drops-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '3rem' }}>
                        {data.drops.map(drop => (
                            <div key={drop.id} className="drop-card-premium" onClick={() => navigate(`/drop/${drop.id}`)} style={{ cursor: 'pointer' }}>
                                <div style={{ height: '400px', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
                                    <img src={drop.coverImage?.url} alt={drop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))' }}>
                                        <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{drop.name}</h3>
                                        <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>Ver Colección →</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {data.drops.length === 0 && (
                        <div style={{ textAlign: 'center', opacity: 0.7, marginTop: '3rem' }}>
                            <h3>No active drops at the moment.</h3>
                        </div>
                    )}
                </div>
            </Container>
        </PageWrapper>
    );
};

export default Drop;
