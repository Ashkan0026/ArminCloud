// src/services/auth.service.js
import { api, post, get } from "./api";

/**
 * auth.service.js
 * - Centralized auth calls + token/session helpers
 *
 * IMPORTANT:
 * You MUST align these endpoints with your backend.
 * I’m providing BOTH patterns:
 *  A) "recommended auth routes" (clean REST)
 *  B) "your current style" using /users/create, /companies/create, etc.
 *
 * Pick one set and delete the other to avoid confusion.
 */

// ------------------------------
// Session helpers
// ------------------------------
export const session = {
  getToken() {
    return localStorage.getItem("token");
  },
  setToken(token) {
    localStorage.setItem("token", token);
  },
  clear() {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_mode");
  },
  getMode() {
    return localStorage.getItem("auth_mode") || "user";
  },
  setMode(mode) {
    localStorage.setItem("auth_mode", mode);
  },
};

// ------------------------------
// A) Recommended auth endpoints
// (Use these if you add /auth routes in your backend)
// ------------------------------
export const authService = {
  // User
  async registerUser(payload) {
    // POST /auth/user/register
    // payload: { name, email, password }
    return post("/api/auth/user/register", payload);
  },

  async loginUser(payload) {
    // POST /auth/user/login
    // payload: { email, password }
    // expected response: { token, user }
    const data = await post("/api/auth/user/login", payload);
    persistAuth("user", data);
    return data;
  },

  // Company
  async registerCompany(payload) {
    // POST /auth/company/register
    // payload: { name, email, password }
    return post("/api/auth/company/register", payload);
  },

  async loginCompany(payload) {
    // POST /auth/company/login
    // payload: { email, password }
    const data = await post("/api/auth/company/login", payload);
    persistAuth("company", data);
    return data;
  },

  async me() {
    // GET /auth/me (optional)
    return get("/api/auth/me");
  },

  logout() {
    session.clear();
  },
};

// Persist token + auth_mode from any login response shape
function persistAuth(mode, data) {
  // Typical: { token, user } or { token, company }
  // Some backends: { accessToken: "..." }
  const token = data?.token || data?.accessToken || data?.jwt || null;

  if (token) {
    session.setToken(token);
    session.setMode(mode);
  }
}

// ------------------------------
// B) Fallback for your current routes style
// If you DON'T have /auth endpoints yet, but only /users/create etc.
// NOTE: With your current models, you do NOT have a real "company login"
// unless you implemented it separately. This is just a pattern.
// ------------------------------

// export const authService = {
//   async registerUser(payload) {
//     // POST /users/create
//     return post("/api/users/create", payload);
//   },

//   async loginUser(payload) {
//     // You need a real endpoint for login (e.g., /users/login)
//     const data = await post("/api/users/login", payload);
//     persistAuth("user", data);
//     return data;
//   },

//   async registerCompany(payload) {
//     // POST /companies/create
//     // But your Company model only has name, so "email/password" won't be stored
//     return post("/api/companies/create", payload);
//   },

//   async loginCompany(payload) {
//     // You need a real endpoint for company login (e.g., /companies/login)
//     const data = await post("/api/companies/login", payload);
//     persistAuth("company", data);
//     return data;
//   },

//   async me() {
//     return get("/api/auth/me");
//   },

//   logout() {
//     session.clear();
//   },
// };

// ------------------------------
// Optional: direct axios access if needed
// ------------------------------
export { api };
