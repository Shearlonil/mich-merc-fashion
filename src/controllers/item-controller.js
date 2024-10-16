import httpService from "../axios/http-service";

const create = async (data) => {
  let formData = new FormData();
  formData.append("title", data.product_name);
  formData.append("status", data.available.value);
  formData.append("price", data.price);
  formData.append("desc", data.description);
  formData.append("category_id", data.category.value);

  // attach array of files
  for (var i = 0; i < data.image_upload.length; i++) {
    formData.append("imgs", data.image_upload[i]);
  }
  console.log("Form data:", formData);

  return await httpService.post(`/items/create`, formData);
};

const findById = async (item_id) => {
  return await httpService.get(`/items/find/${item_id}`);
};

const random = async (limit) => {
  return await httpService.get(`/items/random/${limit}`);
};

const fetchRecentItemsByCatID = async (pageSize, cat_id) => {
  return await httpService.post(`/items/recent/by-cat-id`, {
    pageSize,
    cat_id,
  });
};

const fetchRecentItemsByCatName = async (pageSize, cat_name) => {
  return await httpService.post(`/items/recent/by-cat-name`, {
    pageSize,
    cat_name,
  });
};

const paginateItemsByCatName = async (
  pageSize,
  cat_name,
  max_item_id,
  pageSpan
) => {
  return await httpService.post(`/items/paginate/by-cat-name`, {
    pageSize,
    cat_name,
    max_item_id,
    pageSpan,
  });
};

const fetchRecentItems = async (id) => {
  return await httpService.download(`/applicant/cv/${id}`);
};

export default {
  create,
  findById,
  random,
  fetchRecentItemsByCatID,
  fetchRecentItemsByCatName,
  paginateItemsByCatName,
  fetchRecentItems,
};
