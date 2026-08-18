/**
 * Category and subcategory writes are multipart because they carry an image.
 * Undefined and null keys are dropped: the API spreads req.body straight into
 * findByIdAndUpdate, so sending a key at all is what overwrites it.
 */
export const toFormData = (values, fileField, file) => {
  const form = new FormData();

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null) continue;
    form.append(key, typeof value === "boolean" ? String(value) : value);
  }

  if (file) form.append(fileField, file);

  return form;
};
