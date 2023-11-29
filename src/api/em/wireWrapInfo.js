/**
 * Created by fp
 */
import request from '@/utils/request'

const url = {
  //新增 	POST
  addOrUpdate: '/wireWrap',
  //删除	POST
  delete: '/wireWrap/del',
  //根据编码获取明细项 POST
  getDetail: '/wireWrap/get-detail',
  //编码唯一判断 POST
  codeUnion: '/wireWrap/code-union',
  list: '/wireWrap/page-list'

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
