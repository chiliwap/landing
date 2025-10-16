"use client";

import { useEffect, useState, useTransition } from "react";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, startLoading] = useTransition();

    useEffect(() => {
        async function fetchUser() {
            try {
                startLoading(async () => {
                    const res = await fetch("/api/auth/me");
                    if (!res.ok) throw new Error("Not authenticated");
                    const data = await res.json();
                    setUser(data.user);
                });
            } catch {
                setUser(null);
            }
        }
        fetchUser();
    }, []);

    const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
    };

    return {
        user,
        loading,
        isAuthenticated: !!user,
        logout,
    };
}
