// src/services/machines.service.js
import { get, post, patch } from "./api";

/**
 * machines.service.js
 * Matches your backend routes:
 *  - POST  /machines/create
 *  - GET   /machines/get
 *  - PATCH /machines/:id/assign
 *
 * IMPORTANT:
 * Assumes Vite proxy mode => "/api/..."
 * If using VITE_API_BASE_URL instead, remove "/api" prefix.
 */

export const machinesService = {
  async createMachine(payload) {
    // payload: { memorySize: number, diskSize: number }
    return post("/api/machines/create", payload);
  },

  async getMachines() {
    return get("/api/machines/get");
  },

  async assignMachine(id, payload) {
    // Common patterns:
    // payload could be { userId } OR { userId, companyId } depending on backend.
    // Adjust to your backend controller.
    return patch(`/api/machines/${id}/assign`, payload);
  },
};
