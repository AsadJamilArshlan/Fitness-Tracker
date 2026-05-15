import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isUserFetched, setIsUserFetched] = useState(
    localStorage.getItem("token") ? false : true,
  );
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState([]);
  const [allActivityLogs, setAllActivityLogs] = useState([]);

  const signup = async (credentials) => {
    try {
      const { data } = await api.post("/api/auth/local/register", credentials);

      setUser({ ...data.user, token: data.jwt });
      if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
        setOnboardingCompleted(true);
      }
      localStorage.setItem("token", data.jwt);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error?.message || error?.message);
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await api.post("/api/auth/local", {
        identifier: credentials.email,
        password: credentials.password,
      });

      setUser({ ...data.user, token: data.jwt });
      if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
        setOnboardingCompleted(true);
      }
      localStorage.setItem("token", data.jwt);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error?.message || error?.message);
    }
  };

  const fetchUser = async (token) => {
    try {
      const { data } = await api.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser({ ...data, token });
      if (data?.age && data?.weight && data?.goal) {
        setOnboardingCompleted(true);
      }
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error?.message || error?.message);
    }
    setIsUserFetched(true);
  };

  const fetchFoodLogs = async (token) => {
    try {
      const { data } = await api.get("/api/food-logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllFoodLogs(data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error?.message || error?.message);
    }
  };

  const fetchActivityLogs = async (token) => {
    try {
      const { data } = await api.get("/api/activity-logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllActivityLogs(data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error?.message || error?.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setOnboardingCompleted(false);
    setAllActivityLogs([]);
    setAllFoodLogs([]);
    api.defaults.headers.common["Authorization"] = "";
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        await fetchUser(token);
        await fetchFoodLogs(token);
        await fetchActivityLogs(token);
      })();
    }
  }, []);

  const value = {
    user,
    setUser,
    isUserFetched,
    fetchUser,
    signup,
    login,
    logout,
    onboardingCompleted,
    setOnboardingCompleted,
    allFoodLogs,
    allActivityLogs,
    setAllFoodLogs,
    setAllActivityLogs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
