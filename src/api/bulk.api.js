import api from "@/lib/axios";
import { BULK } from "./endpoints";

/** Streams the xlsx template straight to a download. */
export const downloadImportTemplate = async () => {
  const response = await api.get(BULK.template, { responseType: "blob" });

  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");

  link.href = url;
  link.download = "product-import-template.xlsx";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const bulkImportProducts = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api.post(BULK.import, form).then((response) => response.data?.data);
};

export const bulkUploadMedia = (files) => {
  const form = new FormData();
  for (const file of files) form.append("files", file);
  return api.post(BULK.media, form).then((response) => response.data?.data);
};
