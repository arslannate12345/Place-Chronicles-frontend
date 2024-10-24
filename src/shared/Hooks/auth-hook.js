import { useCallback, useEffect, useState } from "react";

let logoutTimer;

export const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [token, setToken] = useState(false);

  // Check for token in localStorage when the app loads

  const login = useCallback((uuid, token, expirationDate) => {
    setToken(token);

    setUserId(uuid);
    // Store token and userId in localStorage

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

    setTokenExpirationDate(tokenExpirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uuid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    // Remove token and userId from localStorage
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }

    return () => {
      clearTimeout(logoutTimer); // Cleanup on unmount
    };
  }, [token, logout, tokenExpirationDate]);
  useEffect(() => {
    let isMounted = true; // Track if the component is mounted
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      if (isMounted) {
        // Check if still mounted
        login(
          storedData.userId,
          storedData.token,
          new Date(storedData.expiration)
        );
      }
    }

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [login]);

  return { token, login, logout, userId };
};
