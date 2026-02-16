import React, { useState } from 'react';
import PageWrapper from '../components/ui/PageWrapper';
import Container from '../components/ui/Container';
import DropManager from '../components/admin/DropManager';
import ProductManager from '../components/admin/ProductManager';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('drops');

    return (
        <PageWrapper>
            <Container>
                <div className="admin-dashboard">
                    <div className="admin-header">
                        <h2>Panel de Administración</h2>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div className="admin-tabs-container">
                            <button
                                onClick={() => setActiveTab('drops')}
                                className={`admin-tab-btn ${activeTab === 'drops' ? 'active' : ''}`}
                            >
                                Gestión de Drops
                            </button>
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                            >
                                Gestión de Productos
                            </button>
                        </div>
                    </div>

                    <div className="admin-form-container">
                        {activeTab === 'drops' ? <DropManager /> : <ProductManager />}
                    </div>
                </div>
            </Container>
        </PageWrapper>
    );
};

export default Admin;
