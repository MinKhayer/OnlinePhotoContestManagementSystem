
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({onLogout}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include", // Send cookies along with the request
      });

      if (response.ok) {
        onLogout()
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
handleLogout();
  return ;
};

export default LogoutButton;
