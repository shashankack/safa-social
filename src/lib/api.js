// api.js
import { http } from "./http";

/**
 * Activities API (evently backend)
 * - List all activities for the authenticated organizer
 * - Supports query filters: status, type, clubId, page, limit, sortBy, order
 */
export const listActivities = (params) =>
  http.get("/activities", { params }).then((r) => r.data);

/**
 * Get single activity details
 */
export const getActivity = (slug) =>
  http.get(`/activities/${slug}`).then((r) => r.data);

/**
 * Register for an activity
 * - POST /activities/:id/register
 * - Body: { firstName, lastName, email, phone, ticketCount }
 */
export const registerForActivity = (activitySlug, payload) =>
  http.post(`/activities/${activitySlug}/register`, payload).then((r) => r.data);

/**
 * Get current organizer info
 */
export const getOrganizerInfo = () =>
  http.get("/organizers/me").then((r) => r.data);

/**
 * Organizer login — returns a JWT
 * - POST /organizer/login
 * - Body: { email, password }
 */
export const organizerLogin = (email, password) =>
  http.post("/organizer/login", { email, password }).then((r) => r.data);

/**
 * List organizer registrations (requires Bearer token)
 * - GET /organizer/registrations
 */
export const getOrganizerRegistrations = (token) =>
  http
    .get("/organizer/registrations", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((r) => r.data);
