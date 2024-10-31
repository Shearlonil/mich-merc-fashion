import httpService from "../axios/http-service";

const checkout = async (data) => {
  return await httpService.post(`/orders/checkout`, data);
};

const changeOrderStatus = async (purchase_order_id) => {
  return await httpService.put(`/orders/status/${purchase_order_id}`);
};

const getNewOrders = async () => {
  return await httpService.get(`/orders/list`);
};

const paginateOrders = async (pageNumber, pageSize, pageSpan, max_order_id) => {
  return await httpService.post(`/orders/list/${pageNumber}`, {
    pageSize,
    max_order_id,
    pageSpan,
  });
};

const searchByPurchaseOrderID = async (id) => {
  return await httpService.get(`/orders/search/${id}`);
};

const orderSearch = async (data) => {
  return await httpService.post(`/orders/search`, data);
};

const paginateOrderSearch = async (data, pageNumber) => {
  return await httpService.post(`/orders/search/${pageNumber}`, data);
};

export default {
  checkout,
  changeOrderStatus,
  getNewOrders,
  paginateOrders,
  searchByPurchaseOrderID,
  orderSearch,
  paginateOrderSearch,
};
