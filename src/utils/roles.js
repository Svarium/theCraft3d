export const ROLES = {
    USER: 'user',
    ADMIN: 'admin',
    SUPERADMIN: 'superadmin',
};

export const hasRole = (userProfile, role) => {
    if (!userProfile || !userProfile.role) return false;

    if (userProfile.role === ROLES.SUPERADMIN) return true;
    if (userProfile.role === ROLES.ADMIN && role !== ROLES.SUPERADMIN) return true;

    return userProfile.role === role;
};

export const isAdmin = (userProfile) => {
    return userProfile?.role === ROLES.ADMIN || userProfile?.role === ROLES.SUPERADMIN;
};
