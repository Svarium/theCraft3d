import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/ui/PageWrapper';
import Container from '../components/ui/Container';
import './Auth.css'; // Reuse auth styles for consistency

const Profile = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className="loading-screen">Cargando perfil...</div>;
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Reciente';
        // Handle Firestore Timestamp or Date object
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <PageWrapper>
            <Container>
                <div className="auth-container" style={{ alignItems: 'flex-start', paddingTop: '4rem' }}>
                    <div className="auth-card" style={{ maxWidth: '800px', display: 'flex', gap: '2rem', flexDirection: 'column' }}>
                        <div className="auth-header" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div className="profile-avatar" style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--accent), #261434)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: 'white',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                overflow: 'hidden'
                            }}>
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    user.name ? user.name.charAt(0).toUpperCase() : 'U'
                                )}
                            </div>

                            <div>
                                <h2>Mi Perfil</h2>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span className="role-badge" style={{
                                        display: 'inline-block',
                                        background: 'var(--accent)',
                                        color: 'white',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
                                        textTransform: 'uppercase'
                                    }}>
                                        {user.role || 'User'}
                                    </span>
                                    {user.emailVerified ? (
                                        <span style={{
                                            color: '#4ade80',
                                            background: 'rgba(74, 222, 128, 0.1)',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '8px',
                                            fontSize: '0.8rem',
                                            border: '1px solid rgba(74, 222, 128, 0.2)'
                                        }}>
                                            ✓ Verificado
                                        </span>
                                    ) : (
                                        <span style={{
                                            color: '#fbbf24',
                                            background: 'rgba(251, 191, 36, 0.1)',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '8px',
                                            fontSize: '0.8rem',
                                            border: '1px solid rgba(251, 191, 36, 0.2)'
                                        }}>
                                            ⚠️ No Verificado
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="profile-details" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="detail-group">
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Nombre</label>
                                <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>{user.name || 'Sin nombre'}</p>
                            </div>
                            <div className="detail-group">
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email</label>
                                <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>{user.email}</p>
                            </div>
                            <div className="detail-group">
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Miembro desde</label>
                                <p style={{ fontSize: '1.2rem', fontWeight: '500' }}>{formatDate(user.createdAt)}</p>
                            </div>
                            <div className="detail-group">
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ID</label>
                                <p style={{ fontSize: '0.9rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{user.uid}</p>
                            </div>
                        </div>

                        <div className="auth-divider">
                            <span>Historial de Órdenes</span>
                        </div>

                        <div className="orders-placeholder" style={{
                            textAlign: 'center',
                            padding: '2rem',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '8px',
                            color: 'var(--text-secondary)'
                        }}>
                            <p>Aún no has realizado ninguna compra.</p>
                            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Tus drops adquiridos aparecerán aquí.</p>
                        </div>
                    </div>
                </div>
            </Container>
        </PageWrapper>
    );
};

export default Profile;
