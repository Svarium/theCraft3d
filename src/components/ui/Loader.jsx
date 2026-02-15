import React from 'react';

const Loader = ({ fullScreen = false, text = "Cargando..." }) => {
    const containerStyle = fullScreen ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(28, 15, 38, 0.9)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        color: 'var(--accent)'
    } : {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        color: 'var(--accent)'
    };

    return (
        <div style={containerStyle}>
            <div className="spinner"></div>
            {text && <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{text}</p>}
            <style>{`
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(163, 109, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: var(--accent);
                    animation: spin 1s ease-in-out infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loader;
