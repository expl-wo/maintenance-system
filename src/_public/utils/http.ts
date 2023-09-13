import { AxiosResponse } from 'axios'
import { App } from 'vue'
import request from './axios.config'
import useUserStore from "@/_public/store/modules/user";
import router from '@/_public/router/index'
import { ElMessage } from "element-plus";
import Constants from "@/_public/utils/constants";
import {extend} from "@/_public/utils/index";

export interface HttpOption {
  url: string
  data?: any
  params?:any,
  method?: string
  headers?: any
  beforeRequest?: () => void
  afterRequest?: () => void
  config?: any
}

export interface Response<T = any> {
  code: number
  msg: string
  data: T
}

export function http<T = any>({
  url,
  data,
  params,
  method,
  headers,
  beforeRequest,
  afterRequest,
  config={}
}: HttpOption) {
  const successHandler = (res: AxiosResponse<Response<T>>) => {
    if (res.data && res.data.code === Constants.respCode.success) {
      return res.data
    }
    if(res.data.code === 40301 || res.data.code === 10042 || res.data.code === 10041){
      ElMessage.closeAll();
      ElMessage.error(res.data.msg||'登录已过期，请重新登录');
      const userStore = useUserStore();
      const routeValue = router.currentRoute.value;
      userStore.logout().then(_=>{
        const fullPath =routeValue.fullPath;
        let query = {};
        if(fullPath){
          if(fullPath.indexOf('redirect')>=0){
            query = routeValue.query;
          }else{
            query = {
              redirect: fullPath
            }
          }
        }
        window.setTimeout(()=>{
          router.push({
            path: '/login',
            query
          }).then(_=>{
            window.location.reload();
          })
        }, 1500)
      })
    }else{
      return res.data;
    }
    // throw new Error(res.data.msg || '请求失败，未知异常')
  }
  const failHandler = (error: Response<Error>) => {
    afterRequest && afterRequest();
    return null;
    // throw new Error(error.msg || '请求失败，未知异常')
  }
  beforeRequest && beforeRequest()
  method = method || 'GET'
  method = method.toUpperCase();
  const tempParams = Object.assign(
    typeof data === 'function' ? data() : data || {},
    {}
  )
  if(method === 'GET'){
    return request.get(url, {params:tempParams }).then(successHandler, failHandler)
  }else if(method === 'DELETE'){
    return request.delete(url, {params:tempParams }).then(successHandler, failHandler)
  }else{
    const tempConfig:any = {headers: headers};
    if(params){
      tempConfig.params = params;
    }
    extend(tempConfig, config);
    return request
        .post(url, tempParams, tempConfig)
        .then(successHandler, failHandler)
  }
}

export function get<T = any>({
  url,
  data,
  method = 'GET',
  beforeRequest,
  afterRequest,
}: HttpOption): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    beforeRequest,
    afterRequest,
  })
}




export function post<T = any>({
  url,
  data,
  params,
  method = 'POST',
  headers,
  beforeRequest,
  afterRequest,
}: HttpOption): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    params,
    headers,
    beforeRequest,
    afterRequest,
  })
}

function adornUrl(url){
  return process.env.VUE_APP_BASE_API + url;
}

function install(app: App): void {
  app.config.globalProperties.$http = http

  app.config.globalProperties.$get = get

  app.config.globalProperties.$post = post
}

export default {
  install,
  get,
  post,
}

declare module '@vue/runtime-core' {
  // 为 `this.$` 提供类型声明
  interface ComponentCustomProperties {
    $get: <T>(options: HttpOption) => Promise<Response<T>>
    $post: <T>(options: HttpOption) => Promise<Response<T>>
  }
}
