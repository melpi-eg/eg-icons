"use client";
import { useSelector } from "react-redux";

/**
 * Returns information about the user's role.
 *
 * @returns {Object} An object containing the user's role and whether they are an admin or super admin.
 * @property {boolean} isAdmin Whether the user is an admin or super admin.
 * @property {boolean} isSuperAdmin Whether the user is a super admin.
 * @property {string | null} role The user's role as a string, or null if the user is not logged in.
 */
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
