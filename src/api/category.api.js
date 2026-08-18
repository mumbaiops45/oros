import api, { unwrap } from "@/lib/axios";
import { CATEGORY } from "./endpoints";
import { toFormData } from "./formData";

export const listCategories = (params) =>
  api.get(CATEGORY.list, { params }).then(unwrap);

export const createCategory = (values, file) =>
  api.post(CATEGORY.create, toFormData(values, "image", file)).then(unwrap);

export const updateCategory = (id, values, file) =>
  api.put(CATEGORY.update(id), toFormData(values, "image", file)).then(unwrap);

export const deleteCategory = (id) =>
  api.delete(CATEGORY.remove(id)).then(unwrap);
