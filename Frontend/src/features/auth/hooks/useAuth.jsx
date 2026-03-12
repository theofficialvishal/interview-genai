import { AuthContext } from "../auth.context";
import { useContext, useEffect } from "react";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);
  const handleRegister = async (username, email, password) => {
    try {
      setLoading(true);
      const data = await register(username, email, password);
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const data = await login(email, password);
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await logout();
      setUser(null);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
        const data = await getMe();
        if (data) {
            setUser(data.user);
        }
        setLoading(false);
    }
    getAndSetUser();
  }, []);

  return {
    user,
    handleRegister,
    handleLogin,
    handleLogout,
    loading,
    setLoading,
  };
};
