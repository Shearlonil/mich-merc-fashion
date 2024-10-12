import httpService from "../axios/http-service";

const fetchAll = async (reqBody, pageSpan) => {
  return await httpService.post(`/applicant/all/${pageSpan}`, reqBody);
};

const findById = async (id) => {
  return await httpService.get(`/applicant/find/${id}`);
};

const fetchRecentItemsByCat = async (pageSize, cat_id) => {
  return await httpService.post(`/items/cat/recent`, { pageSize, cat_id });
};

const fetchRecentItems = async (id) => {
  return await httpService.download(`/applicant/cv/${id}`);
};

export default {
  fetchAll,
  findById,
  fetchRecentItemsByCat,
  fetchRecentItems,
};
