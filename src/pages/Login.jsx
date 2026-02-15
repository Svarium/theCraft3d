import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import PageWrapper from '../components/ui/PageWrapper';
import Container from '../components/ui/Container';

import Loader from '../components/ui/Loader';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { loginWithEmail, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to where the user came from, or to profile by default
    const from = location.state?.from?.pathname || '/profile';

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await loginWithEmail(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Error al iniciar sesión. Verifica tus credenciales.');
            console.error(err);
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setIsLoading(true);
        try {
            await loginWithGoogle();
            navigate(from, { replace: true });
        } catch (err) {
            setError('Error al iniciar sesión con Google.');
            console.error(err);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loader fullScreen text="Iniciando sesión..." />;
    }

    return (
        <PageWrapper>
            <Container>
                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-header">
                            <h2>Bienvenido de nuevo</h2>
                            <p>Ingresa a tu cuenta para continuar</p>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button onClick={handleGoogleLogin} className="google-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                                <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.614-1.013 7.663-2.729l-3.623-3.258Z" />
                                <path fill="#4A90E2" d="M19.834 21.27C21.638 19.597 22.822 17.51 23.404 14.8H12v-5.045h16.485c.168.904.258 1.835.258 2.829 0 4.22-.98 7.788-3.327 10.12l-5.582-4.434Z" />
                                <path fill="#FBBC05" d="M23.658 9.755A12.023 12.023 0 0 0 12 0v4.909a7.077 7.077 0 0 1 6.545 4.846Z" opacity="0" />
                                <path fill="#FBBC05" d="M5.277 14.268A7.11 7.11 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
                            </svg>
                            Continuar con Google
                        </button>

                        <div className="auth-divider">
                            <span>O continúa con email</span>
                        </div>

                        <form onSubmit={handleEmailLogin} className="auth-form">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="tu@email.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Contraseña</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{
                                background: 'var(--accent)',
                                color: 'white',
                                padding: '1rem',
                                borderRadius: '8px',
                                fontWeight: 'bold'
                            }}>
                                Iniciar Sesión
                            </button>
                        </form>

                        <div className="auth-footer">
                            ¿No tienes cuenta?
                            <Link to="/register" className="auth-link">Regístrate</Link>
                        </div>
                    </div>
                </div>
            </Container>
        </PageWrapper>
    );
};

export default Login;
