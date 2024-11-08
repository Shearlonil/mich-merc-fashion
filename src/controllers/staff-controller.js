import httpService from "../axios/http-service";

const updatePassword = async (data) => {
  return await httpService.put("/staff/update-pw", data);
};

const updateTermsAndAgreement = async (data) => {
  return await httpService.post("/terms/update", data);
};

export default {
  updatePassword,
  updateTermsAndAgreement,
};
