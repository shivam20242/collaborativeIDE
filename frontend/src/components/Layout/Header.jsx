import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return null;
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 onClick={() => navigate('/')} className="header-title">
            Collaborative Code Editor
          </h1>
        </div>
        
        <div className="header-right">
          {user && (
            <div className="user-menu">
              <span className="user-greeting">
                Welcome, {user.username}
              </span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header