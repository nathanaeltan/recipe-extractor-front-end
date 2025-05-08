import api from "./api";
import { toast } from "sonner";

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

export const signup = async (data: SignupData) => {
  try {
    const response = await api.post("/signup", data);
    toast.success("Account created successfully!");
    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const login = async (data: LoginData) => {
  try {
    // Using URLSearchParams for form data as per OAuth2 requirements
    const formData = new URLSearchParams();
    formData.append("username", data.username);
    formData.append("password", data.password);

    const response = await api.post("/token", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Save token to localStorage
    localStorage.setItem("token", response.data.access_token);
    toast.success("Login successful!");
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
  toast.success("Logged out successfully!");
};

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};