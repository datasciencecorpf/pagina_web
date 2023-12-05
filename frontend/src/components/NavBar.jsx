import React, { useContext} from "react";
import "./css/TopBar.css";
import { Link} from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [token, setToken] = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("awesomeLeadsToken");

    navigate("/");
  };

  

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link to="/table" className="navbar-item">
          <img
            className="img-responsive white-image"
            src="/logoFer.png"
            alt="Logo"
          />
        </Link>
      </div>
      
      
        <div className="navbar-end" >
          {token && (
            
              <button className="button" onClick={handleLogout}>
                Logout
              </button>
           
          )}
        </div>
      
    </nav>
  );
}
