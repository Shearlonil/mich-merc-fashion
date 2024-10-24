import httpService from "../axios/http-service";

const create = async (data) => {
  let formData = new FormData();
  formData.append("title", data.product_name);
  formData.append("status", data.available.value);
  formData.append("price", data.price);
  formData.append("desc", data.description);
  formData.append("category", data.category.value);
  formData.append("discount", 0.0);

  // attach array of files
  for (var i = 0; i < data.image_upload.length; i++) {
    formData.append("imgs", data.image_upload[i]);
  }

  return await httpService.post(`/items/create`, formData);
};

const update = async (id, formData) => {
  let data = {
    title: formData.product_name,
    status: formData.available.value,
    price: formData.price,
    desc: formData.description,
    discount: formData.discount,
    category: formData.category.value,
  };

  return await httpService.put(`/items/update/${id}`, data);
};

const findById = async (item_id) => {
  return await httpService.get(`/items/find/${item_id}`);
};

const unlinkImg = async (item_id, img_id) => {
  return await httpService.put(`/items/imgs/remove`, { item_id, img_id });
};

const updateImgs = async (item_id, data) => {
  let formData = new FormData();
  // attach array of files
  for (var i = 0; i < data.image_upload.length; i++) {
    formData.append("imgs", data.image_upload[i]);
  }
  return await httpService.put(`/items/imgs/update/${item_id}`, formData);
};

const random = async (limit) => {
  return await httpService.get(`/items/random/${limit}`);
};

const randomFetchWithCat = async (limit, cat_id, item_id) => {
  return await httpService.post(`/items/random`, { limit, cat_id, item_id });
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

const productSearch = async (data) => {
  return await httpService.post(`/items/search`, data);
};

const paginateProductSearch = async (data, pageNumber) => {
  return await httpService.post(`/items/search/${pageNumber}`, data);
};

export default {
  create,
  update,
  findById,
  unlinkImg,
  updateImgs,
  random,
  randomFetchWithCat,
  fetchRecentItemsByCatID,
  fetchRecentItemsByCatName,
  paginateItemsByCatName,
  productSearch,
  paginateProductSearch,
};
