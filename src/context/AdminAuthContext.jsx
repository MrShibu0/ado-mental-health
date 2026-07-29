import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyAuth = async () => {
    try {
      const res = await fetch("/api/admin/verify");
      if (res.ok) {
        const data = await res.json();
        setAdmin(data.admin);
      } else {
        setAdmin(null);
      }
    } catch (err) {
      console.error("Auth verification error:", err);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setAdmin(data.admin);
        toast.success(data.message || "Logged in successfully!");
        return { success: true };
      } else {
        toast.error(data.error || "Login failed.");
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Network error. Please try again.");
      return { success: false, error: "Network error" };
    }
  };

  const logout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        setAdmin(null);
        toast.success("Logged out successfully.");
        window.location.href = "/admin/login";
      } else {
        toast.error("Failed to log out.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Network error. Failed to log out.");
    }
  };

  const updateAdminState = (updatedAdmin) => {
    setAdmin(updatedAdmin);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, verifyAuth, updateAdminState }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};
