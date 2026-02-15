import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../hooks/useRole';
import logo from '../../assets/LOGO.png';
import './Navbar.css';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const { isAdmin } = useRole();

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="brand">
                    <img src={logo} alt="The Craft Logo" className="brand-logo" />
                </Link>

                <ul className="nav-links">
                    <li>
                        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/drop" className={({ isActive }) => isActive ? 'active' : ''}>
                            Drop
                        </NavLink>
                    </li>

                    {isAdmin && (
                        <li>
                            <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>
                                Admin
                            </NavLink>
                        </li>
                    )}

                    {user ? (
                        <>
                            <li>
                                <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                                    Profile
                                </NavLink>
                            </li>
                            <li>
                                <button onClick={logout} className="nav-btn logout-btn">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>
                                Login
                            </NavLink>
                        </li>
                    )}

                    <li>
                        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                            {theme === 'dark' ? '☼' : '☾'}
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
