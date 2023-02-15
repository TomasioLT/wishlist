import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const ProtectedAdmin = ({ children }) => {
  const { user } = UserAuth();
  const navigate = useNavigate();

  if (!user.admin) {
    navigate("/"); // navigate to home page or other desired URL
    return null; // return null to prevent rendering the children
  }
  return children;
};

export default ProtectedAdmin;
