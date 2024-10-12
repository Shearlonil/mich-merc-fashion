import httpService from "../axios/http-service";

const fetchAll = async (reqBody, pageSpan) => {
  return await httpService.post(`/applicant/all/${pageSpan}`, reqBody);
};

const findById = async (id) => {
  return await httpService.get(`/applicant/find/${id}`);
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

const fetchRecentItems = async (id) => {
  return await httpService.download(`/applicant/cv/${id}`);
};

export default {
  fetchAll,
  findById,
  fetchRecentItemsByCatID,
  fetchRecentItemsByCatName,
  fetchRecentItems,
};
