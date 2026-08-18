/** "Custom 3D Printed Mug" -> "custom-3d-printed-mug" */
export const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
