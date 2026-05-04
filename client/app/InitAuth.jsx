"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "./slices/authSlice";

const InitAuth = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  return children;
};

export default InitAuth;