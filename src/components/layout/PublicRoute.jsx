import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import Loader from '../ui/Loader';

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loader fullScreen />;
    }

    if (user) {
        return <Navigate to="/profile" replace />;
    }

    return children;
};

export default PublicRoute;
