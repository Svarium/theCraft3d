import React from 'react';
import './PageWrapper.css';

const PageWrapper = ({ children, className = '' }) => {
    return (
        <main className={`page-wrapper ${className}`}>
            {children}
        </main>
    );
};

export default PageWrapper;
