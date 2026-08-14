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

const organizerAuth = (token) => ({
  Authorization: `Bearer ${token}`,
});

/**
 * List organizer registrations (requires Bearer token)
 * - GET /organizer/registrations
 */
export const getOrganizerRegistrations = (token) =>
  http
    .get("/organizer/registrations", {
      headers: organizerAuth(token),
    })
    .then((r) => r.data);

/**
 * Confirm a pending (manual) registration after payment is verified
 * - PATCH /organizer/registrations/:registrationId/confirm
 */
export const confirmOrganizerRegistration = (token, registrationId) =>
  http
    .patch(`/organizer/registrations/${registrationId}/confirm`, null, {
      headers: organizerAuth(token),
    })
    .then((r) => r.data);

/**
 * Cancel a pending registration
 * - PATCH /organizer/registrations/:registrationId/cancel
 */
export const cancelOrganizerRegistration = (token, registrationId) =>
  http
    .patch(`/organizer/registrations/${registrationId}/cancel`, null, {
      headers: organizerAuth(token),
    })
    .then((r) => r.data);

/**
 * Mark a confirmed registration as attended
 * - PATCH /organizer/registrations/:registrationId/attendance
 */
export const markOrganizerAttendance = (token, registrationId) =>
  http
    .patch(`/organizer/registrations/${registrationId}/attendance`, null, {
      headers: organizerAuth(token),
    })
    .then((r) => r.data);

/**
 * Confirm a waiting-list registrant (moves them to registered)
 * - PATCH /organizer/waiting-list/:registrationId/confirm
 */
export const confirmWaitingListRegistration = (token, registrationId) =>
  http
    .patch(`/organizer/waiting-list/${registrationId}/confirm`, null, {
      headers: organizerAuth(token),
    })
    .then((r) => r.data);

/**
 * Remove someone from the waiting list
 * - PATCH /organizer/waiting-list/:registrationId/remove
 */
export const removeWaitingListRegistration = (token, registrationId) =>
  http
    .patch(`/organizer/waiting-list/${registrationId}/remove`, null, {
      headers: organizerAuth(token),
    })
    .then((r) => r.data);
