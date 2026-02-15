import { useAuth } from '../context/AuthContext';

export const useRole = () => {
    const { user } = useAuth();

    const role = user?.role || 'guest';

    const hasRole = (requiredRole) => role === requiredRole;

    // Hierarchy: superadmin > admin > user
    const isAdmin = role === 'admin' || role === 'superadmin';
    const isSuperAdmin = role === 'superadmin';
    const isUser = role === 'user' || isAdmin; // Everyone logged in is at least user

    return {
        role,
        isAdmin,
        isSuperAdmin,
        isUser,
        hasRole
    };
};
