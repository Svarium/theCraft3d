import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../ui/Loader';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../hooks/useRole';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const { role } = useRole();
    const location = useLocation();

    if (loading) {
        return <Loader fullScreen text="Verificando sesión..." />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        // User is logged in but doesn't have required role
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
