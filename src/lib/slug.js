/** "Custom 3D Printed Mug" -> "custom-3d-printed-mug" */
export const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * "custom-3d-printed-mug" -> "Custom 3d Printed Mug"
 *
 * A readable stand-in for a record's real name when only the URL is on hand —
 * page titles rendered on the server, before the client has fetched anything.
 */
export const titleFromSlug = (value = "") =>
  String(value)
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || "Catalogue";
