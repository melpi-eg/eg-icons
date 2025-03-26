"use client";
import { setUser } from "@/store/reducers/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/api/users";

function useCurrentUser() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  const fetchCurrentUser = async () => {
    const res = await getCurrentUser();

    if (!res.error) {
      dispatch(setUser(res.data));
      setIsLoading(false);
    } else {
      router.push("/login");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetchCurrentUser();
  }, []);

  return { isLoading, user };
}

export default useCurrentUser;
