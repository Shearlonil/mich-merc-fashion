import httpService from "../axios/http-service";

const checkout = async (data) => {
  return await httpService.post(`/orders/checkout`, data);
};

const getNewOrders = async () => {
  return await httpService.get(`/orders`);
};

const orderSearch = async (data) => {
  return await httpService.post(`/orders/search`, data);
};

const paginateOrderSearch = async (data, pageNumber) => {
  return await httpService.post(`/orders/search/${pageNumber}`, data);
};

export default {
  checkout,
  getNewOrders,
  orderSearch,
  paginateOrderSearch,
};
