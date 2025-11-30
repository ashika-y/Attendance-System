// src/services/authService.js
import axios from "axios";

// IMPORTANT: CHANGE THIS URL IF YOUR BACKEND RUNS ON DIFFERENT PORT
const API = axios.create({
  baseURL: "http://localhost:5000/api",  // <--- CHANGE IF NEEDED
  headers: { "Content-Type": "application/json" }
});

export default {
  async login(data) {
    // final endpoint → http://localhost:5000/api/auth/login
    const res = await API.post("/auth/login", data);
    return res.data; // expected: { token, user }
  },

  getCurrentUser() {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }
};
