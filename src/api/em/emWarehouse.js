import request from '@/utils/request'

const url = {
  //新增/修改平库   POST
  addUptWarehouse: '/eqpWarehouse/addUptWarehouse',
  //删除平库  GET
  deleteWarehouse: '/eqpWarehouse/deleteWarehouse',
  //查看平库 GET
  getWarehouse:'/eqpWarehouse/getWarehouse',

  //转库
  exchangeEmWarehouse:'/eqpWarehouse/exchangeEmWarehouse',

  //查看入库信息
  getReceiptEm:'/eqpWarehouse/getReceiptEm',

  //生成出库任务
  sendIssueTask:'/eqpWarehouse/sendIssueTask'
}

export default {

  addUptWarehouse(params) {
    return request({
      url: url.addUptWarehouse,
      method: 'post',
      data: params
    })
  },
  deleteWarehouse(params) {
    return request({
      url: url.deleteWarehouse,
      method: 'post',
      data: params
    })
  },
  getWarehouse(params) {
    return request({
      url: url.getWarehouse,
      method: 'get',
      params
    })
  },
  exchangeEmWarehouse(params){
    return request({
      url:url.exchangeEmWarehouse,
      method: 'post',
      data: params
    })
  },
  getReceiptEm(params){
    return request({
      url:url.getReceiptEm,
      method: 'post',
      data: params
    })
  },
  sendIssueTask(params){
    return request({
      url:url.sendIssueTask,
      method: 'post',
      data: params
    })
  }
}

