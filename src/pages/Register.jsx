import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import PageWrapper from '../components/ui/PageWrapper';
import Container from '../components/ui/Container';

import Loader from '../components/ui/Loader';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { registerWithEmail } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (password !== confirmPassword) {
            setIsLoading(false);
            return setError('Las contraseñas no coinciden.');
        }

        if (password.length < 6) {
            setIsLoading(false);
            return setError('La contraseña debe tener al menos 6 caracteres.');
        }

        try {
            await registerWithEmail(email, password, name);
            navigate('/profile');
        } catch (err) {
            setError('Error al registrarse. Intenta nuevamente.');
            console.error(err);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loader fullScreen text="Creando cuenta..." />;
    }

    return (
        <PageWrapper>
            <Container>
                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-header">
                            <h2>Crear Cuenta</h2>
                            <p>Únete a la comunidad de The Craft</p>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleRegister} className="auth-form">
                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Tu Nombre"
                                />
                            </div>
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
                            <div className="form-group">
                                <label>Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                Registrarse
                            </button>
                        </form>

                        <div className="auth-footer">
                            ¿Ya tienes cuenta?
                            <Link to="/login" className="auth-link">Inicia Sesión</Link>
                        </div>
                    </div>
                </div>
            </Container>
        </PageWrapper>
    );
};

export default Register;
