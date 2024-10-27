import httpService from "../axios/http-service";

const checkout = async (data) => {
  return await httpService.post(`/order/checkout`, data);
};

export default {
  checkout,
};
