/**
 * Created by fp
 */
import request from '@/utils/request';
export function pageList(params) {
  return request({
    url: '/api/gcplan/element/pageList',
    method: 'get',
    data: {
      code :params.code,
      name :params.name,
      value :params.value,
      pg_pagenum: params.pg_pagenum,
      pg_pagesize: params.pg_pagesize,
    }
  })
}


/**新增参数**/
export function insert(params) {
  return request({
    url: '/api/gcplan/element/insertFreezeReason',
    method: 'post',
    data:params
  })
}

/**删除参数**/
export function deleteElement(data) {
  return request({
    url: '/api/gcplan/element/deleteElement',
    method: 'post',
    data
  })
}



