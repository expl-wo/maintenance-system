import request from '@/utils/request'

/**
 *  上传文件
 * @param {*} data 传参
 * @returns 
 */
export function uploadFile(data) {
    return request({
        url: '/api/file/upload',
        method: 'post',
        data,
        // headers: {'Content-Type': 'multipart/form-data'}
    })
}
