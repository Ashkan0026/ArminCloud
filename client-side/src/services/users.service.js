// src/services/users.service.js
import { get, post, patch } from "./api";

/**
 * users.service.js
 * Matches your backend routes:
 *  - POST /users/create
 *  - GET  /users/get
 *
 * Optional (if you implement later):
 *  - PATCH /users/:id  (update user)
 *
 * IMPORTANT:
 * If you are using Vite proxy "/api", keep "/api" prefix.
 * If you are using VITE_API_BASE_URL without proxy, remove "/api".
 *
 * I’m assuming proxy mode => "/api/..."
 */

export const usersService = {
  async createUser(payload) {
    // payload: { name, email, password }
    return post("/api/users/create", payload);
  },

  async getUsers() {
    return get("/api/users/get");
  },

  // Optional — only works if you add endpoint in backend
  async updateUser(id, payload) {
    // payload: partial user fields
    return patch(`/api/users/${id}`, payload);
  },
};
