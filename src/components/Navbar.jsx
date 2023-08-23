/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const Navbar = ({ isLoggedIn }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar navbar-dark bg-primary">
      <Link to="/" className="navbar-brand"  style={{margin:"5px"}}>
        Photo Contest App
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            {isLoggedIn ? (
              <Link to="/logout" className="nav-link">
                Logout
              </Link>
            ) : (
              <Link to="/login" className="nav-link">
                Login
              </Link>
            )}
          </li>
          <li className="nav-item">
            {isLoggedIn && (
              <li className="nav-item">
                <Link to="/create" className="nav-link">
                  Create Contest
                </Link>
              </li>
            )}
            
          </li>
          <li className="nav-item">
            {!isLoggedIn && (
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            )}
            
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
