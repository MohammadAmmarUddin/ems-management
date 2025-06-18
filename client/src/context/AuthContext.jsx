import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const userContext = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_EMS_Base_URL;


  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/api/user/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUser(response.data.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = (user) => {
    setUser(user);
  };
  const logout = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (token) {
        await axios.post(
          `${baseUrl}/api/user/logout/${user._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      setUser(null);

    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <userContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => useContext(userContext);
export default AuthContext;
