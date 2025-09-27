/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useMemo, useState } from "react";
import axiosOrig, { type AxiosInstance } from "axios";

export type AppContextType = {
  axios: AxiosInstance;
  token: string | null;
  setToken: (token: string | null) => void;
  userRole: string;
  setUserRole: (role: string) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [userRole, setUserRole] = useState<string>("super");

  const axios = useMemo(() => axiosOrig.create({}), []);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token, axios]);

  const value: AppContextType = {
    axios,
    token,
    setToken,
    userRole,
    setUserRole,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook moved to separate file to keep this file component-only for Fast Refresh.
