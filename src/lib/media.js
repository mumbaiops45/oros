/**
 * What the API's productMediaUpload filter accepts. Mirrors
 * IMAGE_EXTENSIONS / VIDEO_EXTENSIONS in oros_backend's cloudinaryUpload.js
 * and the 100 MB multer limit — checking here turns a rejected upload into a
 * message next to the file instead of a failed request.
 */

export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
export const VIDEO_EXTENSIONS = ["mp4", "mov", "webm"];

export const MEDIA_ACCEPT =
  "image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm";

export const MEDIA_MAX_BYTES = 100 * 1024 * 1024;

const extensionOf = (name = "") =>
  String(name).toLowerCase().split(".").pop() || "";

/** "IMAGE" | "VIDEO" | null, decided the same way the API decides it. */
export const mediaTypeOf = (file) => {
  const mime = String(file?.type || "").toLowerCase();

  if (mime.startsWith("image/")) return "IMAGE";
  if (mime.startsWith("video/")) return "VIDEO";

  const extension = extensionOf(file?.name);

  if (IMAGE_EXTENSIONS.includes(extension)) return "IMAGE";
  if (VIDEO_EXTENSIONS.includes(extension)) return "VIDEO";

  return null;
};

/** Empty string when the file is fine, otherwise why it was rejected. */
export const mediaRejectReason = (file) => {
  if (!mediaTypeOf(file)) {
    return "Only jpg, png, webp, mp4, mov and webm files are allowed";
  }

  if (file.size > MEDIA_MAX_BYTES) {
    return "Larger than the 100 MB upload limit";
  }

  return "";
};

export const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
