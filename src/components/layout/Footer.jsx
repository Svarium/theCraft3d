import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <p>&copy; {new Date().getFullYear()} THE CRAFT. Gothic 3D Printing.</p>
                <div className="footer-links">
                    <span>Elegance</span>
                    <span>•</span>
                    <span>Mystery</span>
                    <span>•</span>
                    <span>Craft</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
