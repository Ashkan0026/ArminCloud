// src/services/companies.service.js
import { get, post, patch } from "./api";

/**
 * companies.service.js
 * Matches your backend routes:
 *  - POST /companies/create
 *  - GET  /companies/get
 *
 * Optional (if you implement later):
 *  - PATCH /companies/:id
 *
 * IMPORTANT:
 * Assumes Vite proxy mode => "/api/..."
 * If using VITE_API_BASE_URL instead, remove "/api" prefix.
 */

export const companiesService = {
  async createCompany(payload) {
    // payload: { name, email?, password? }
    // NOTE: Your current Company model only has "name".
    // Email/password must be handled in auth layer if needed.
    return post("/api/companies/create", payload);
  },

  async getCompanies() {
    return get("/api/companies/get");
  },

  // Optional — if you add update endpoint later
  async updateCompany(id, payload) {
    return patch(`/api/companies/${id}`, payload);
  },
};
