import React, { createContext, useEffect, useState } from "react";
import api from "../api";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useState(
    localStorage.getItem("awesomeTransactionsToken") || ""
  );

  // Atualiza o localStorage sempre que o token mudar
  useEffect(() => {
    if (token) {
      localStorage.setItem("awesomeTransactionsToken", token);
    } else {
      localStorage.removeItem("awesomeTransactionsToken");
    }
  }, [token]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        if (error.response) {
          console.error("HTTP error:", error.response.status);
          console.error("Error details:", error.response.data);

          // Se o token for inválido (ex: 401), remove
          if (error.response.status === 401) {
            setToken(null);
          }
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      }
    };

    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={[token, setToken]}>
      {props.children}
    </UserContext.Provider>
  );
};
