/**
 * Created by fp
 */
import request from '@/utils/request'

const url = {
  //数据字典获取	get
  getItem: '/api/pbpermissions/dict/get-item',
  //新增 	POST
  addOrUpdate: '/api/pbpermissions/dict',
  //删除	POST
  delete: '/api/pbpermissions/dict/del',
  //根据编码获取数据字典明细项 POST
  getDetail: '/api/pbpermissions/dict/get-detail',
//编码唯一判断 POST
  codeUnion: '/api/pbpermissions/dict/code-union',
  list: '/api/pbpermissions/dict/list'

}

export default {
  url: url,
  list(params) {
    return request({
      url: url.list,
      method: 'get',
      params
    })
  },
  codeUnion(params) {
    return request({
      url: url.codeUnion,
      method: 'post',
      data: params
    })
  },
  getDetail(params) {
    return request({
      url: url.getDetail,
      method: 'post',
      data: params
    })
  },
  getItem(params) {
    return request({
      url: url.getItem,
      method: 'get',
      params
    })
  },
  getByCode(params) {
    return request({
      url: url.getByCode,
      method: 'post',
      data: params
    })
  },
  addOrUpdate(params) {
    return request({
      url: url.addOrUpdate,
      method: 'POST',
      data: params
    })
  },
  delete(params) {
    return request({
      url: url.delete,
      method: 'post',
      data: params
    })
  }
}
