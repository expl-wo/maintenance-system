import request from '@/utils/request'

const url = {
  //新增/修改月产能   POST
  insertReactorCapacity: '/reactorCapacity/insertReactorCapacity',
  //删除月产能  GET
  deleteReactorCapacity: '/reactorCapacity/deleteReactorCapacity',
  //查看月产能 GET
  findReactorCapacity:'/reactorCapacity/findReactorCapacity',

}

export default {

  insertReactorCapacity(params) {
    return request({
      url: url.insertReactorCapacity,
      method: 'post',
      data: params
    })
  },
  deleteReactorCapacity(params) {
    return request({
      url: url.deleteReactorCapacity,
      method: 'post',
      data: params
    })
  },
  findReactorCapacity(params) {
    return request({
      url: url.findReactorCapacity,
      method: 'get',
      params
    })
  },
}

