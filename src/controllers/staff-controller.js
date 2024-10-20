import httpService from "../axios/http-service";

const updatePassword = async (data) => {
    return await httpService.put('/staff/update-pw', data);
}

export default {
    updatePassword,
}