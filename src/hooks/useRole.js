"use client";
import { useSelector } from "react-redux";

export default function useRole() {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return {
      isAdmin: false,
      isSuperAdmin: false,
      role: null,
    };
  }

  return {
    isAdmin: user.role === "ADMIN" || user.role === "SUPERADMIN",
    isSuperAdmin: user.role === "SUPERADMIN",
    role: user.role,
  };
}
