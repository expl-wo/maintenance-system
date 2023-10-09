import Axios, { AxiosResponse } from "axios";
import qs from "qs";
import {getToken} from "@/utils/auth";

export const CONTENT_TYPE = "Content-Type";

export const FORM_URLENCODED =
  "application/x-www-form-urlencoded; charset=UTF-8";

export const APPLICATION_JSON = "application/json; charset=UTF-8";

export const TEXT_PLAIN = "text/plain; charset=UTF-8";

const service = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10 * 60 * 1000,
});

service.interceptors.request.use(
  (config) => {
    !config.headers && (config.headers = {});
    config.headers["Admin-Work-Version"] = "x";
    if (!config.headers[CONTENT_TYPE]) {
      config.headers[CONTENT_TYPE] = APPLICATION_JSON;
    }
    if (config.headers[CONTENT_TYPE] === FORM_URLENCODED) {
      config.data = qs.stringify(config.data);
    }
    const token = getToken();
    if(token){
        config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error.response);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
      return response;
  },
  (error) => {
      if(error && error.response){
          return error.response
      }else{
          return {
                data: {
                    code: 500,
                    msg: '服务器故障，请联系信息部员工'
                }
          }
      }
  }
);

export default service;
