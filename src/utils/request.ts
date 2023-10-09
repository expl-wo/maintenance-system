import {HttpOption, Response, http} from "@/utils/http";

function request<T = any>({
    url,
    data,
    method = 'POST',
    headers,
    beforeRequest,
    afterRequest,
    config
 }: HttpOption): Promise<Response<T>> {
    return http<T>({
        url,
        method,
        data,
        headers,
        beforeRequest,
        afterRequest,
        config
    })
}

export default request;
