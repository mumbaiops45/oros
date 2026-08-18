/**
 * Role helpers. The API gates its write routes with `authorize("admin")`, and
 * the env-backed super admin outranks every named role — so those two are the
 * roles that may open the admin panel. Everyone else is a customer.
 */

export const ADMIN_ROLES = ["admin", "superAdmin"];

export const isAdmin = (user) =>
  Boolean(user) && ADMIN_ROLES.includes(user.role);

/** Where a signed-in user's "Dashboard" link goes. */
export const dashboardPath = (user) => (isAdmin(user) ? "/admin" : "/account");

/** First name, for the navbar — a full name gets long on a crowded bar. */
export const firstName = (user) =>
  String(user?.name || "").trim().split(/\s+/)[0] || "Account";

/** The API stores phones as typed; the forms send digits only. */
export const normalisePhone = (value = "") =>
  String(value).replace(/\D/g, "").slice(-10);
