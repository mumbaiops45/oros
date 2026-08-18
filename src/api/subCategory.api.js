import api, { unwrap } from "@/lib/axios";
import { SUBCATEGORY } from "./endpoints";
import { toFormData } from "./formData";

export const listSubCategories = (params) =>
  api.get(SUBCATEGORY.list, { params }).then(unwrap);

export const createSubCategory = (values, file) =>
  api.post(SUBCATEGORY.create, toFormData(values, "image", file)).then(unwrap);

export const updateSubCategory = (id, values, file) =>
  api
    .put(SUBCATEGORY.update(id), toFormData(values, "image", file))
    .then(unwrap);

export const deleteSubCategory = (id) =>
  api.delete(SUBCATEGORY.remove(id)).then(unwrap);
