import request from '@/utils/request'

// 炉子的顺序能否按9 10 13 14 1 3 4这样排

const dryingOrder = ['9#汽相罐', '10#汽相罐', '13#汽相罐', '14#汽相罐', '1#汽相罐', '3#汽相罐', '4#汽相罐']

function  getDryingIndex(tableName){
  let index = -1;
  dryingOrder.some((item, itemIndex)=>{
    if( tableName.indexOf(item) >=0 ){
      index = itemIndex;
      return true;
    }else{
      return false;
    }
  })
  return index;
}

const url = {
  //干燥罐信息-新增/修改干燥罐信息  POST
  insertDryingTank: '/api/gcplan/dryingTank/insertDryingTank',

  //干燥罐信息-删除干燥罐信息 POST
  deleteDryingTank: '/api/gcplan/dryingTank/deleteDryingTank',

  //干燥罐信息-查询干燥罐列表  GET
  findAllDryingTank: '/api/gcplan/dryingTank/findAllDryingTank',

  //干燥罐信息-新增时获取设备列表  GET
  getEquipmentList: '/api/gcplan/dryingTank/getEquipmentList',

  //干燥罐信息-新增时获取干燥班组列表  GET
  getClazzList: '/api/gcproduction/dryingTank/getClazzList',

  //干燥罐信息-新增时获取组织信息  GET
  getWorkShop: '/api/gcproduction/dryingTank/getWorkShop',

  //干燥罐入出炉登记-查询干燥罐及最新入出炉状态数据 GET
  queryDryingInout: '/api/gcproduction/dryingInout/queryDryingInout',

  //干燥罐入出炉登记-入炉登记 POST
  putRecord: '/api/gcproduction/dryingInout/putRecord',

  //干燥罐入出炉登记-入炉登记确认 POST
  putRecordConfirm: '/api/gcproduction/dryingInout/putRecordConfirm',

  //干燥罐入出炉登记-出炉登记 POST
  outRecord: '/api/gcproduction/dryingInout/outRecord',

  //干燥罐入出炉登记-出炉登记确认 POST
  outRecordConfirm: '/api/gcproduction/dryingInout/outRecordConfirm',

  //干燥罐入出炉登记-查询可入炉 & 已入炉生产号  GET
  getDryingInoutProduct: '/api/gcproduction/dryingInout/getDryingInoutProduct',

  //干燥罐入出炉登记-修改状态 POST
  update: '/api/gcproduction/dryingInout/update',

  //工艺方案管理-查询 GET
  getList: '/processPlan/getList',

  //工艺方案管理-查询 GET
  getListPage: '/processPlan/getListPage',

  //工艺方案管理-新增/修改 POST
  addOrUpdate: '/processPlan/addOrUpdate',

  //工艺方案管理-新增/删除 DELETE
  delete: '/processPlan/delete',
  // 入炉变更
  furnaceEntryChange: '/api/gcproduction/dryingInout/furnaceEntryChange',
  // 清空入炉
  clearTankRecord: '/api/gcproduction/dryingInout/clearTankRecord',
  dryingRecord: '/api/gcproduction/dryingInout/dryingRecord',
  inTankProduct: '/api/gcproduction/dryingInout/inTankProduct',
  cancelSingle: '/api/gcproduction/dryingInout/cancelSingle',
}

export default {

  getWorkShop(params) {
    return request({
      url: url.getWorkShop,
      method: 'get',
      data: params
    })
  },
  insertDryingTank(params) {
    return request({
      url: url.insertDryingTank,
      method: 'post',
      data: params
    })
  },
  deleteDryingTank(params) {
    return request({
      url: url.deleteDryingTank,
      method: 'post',
      data: params
    })
  },
  findAllDryingTank(params) {
    return new Promise((resolve, reject)=>{
      request({
        url: url.findAllDryingTank,
        method: 'get',
        data:params
      }).then(response=>{
        let data  = response.data;
        data.sort((item1, item2)=>{
          let item1Index = getDryingIndex(item1.dryingTankCode);
          let item2Index = getDryingIndex(item2.dryingTankCode);
          if(item1Index >= 0 && item2Index >= 0){
            return item1Index - item2Index;
          }else if(item1Index >= 0 && item2Index < 0){
            return -1;
          }else{
            return 1;
          }
        })
        resolve(response);
      }).catch(reason=>{
        reject(reason)
      })
    })
  },
  getEquipmentList(params) {
    return request({
      url: url.getEquipmentList,
      method: 'get',
      data: params
    })
  },
  getClazzList(params) {
    return request({
      url: url.getClazzList,
      method: 'get',
      data: params
    })
  },
  queryDryingInout(params) {
    return request({
      url: url.queryDryingInout,
      method: 'get',
      data: params
    })
  },
  putRecord(params) {
    return request({
      url: url.putRecord,
      method: 'post',
      data: params
    })
  },
  outRecord(params) {
    return request({
      url: url.outRecord,
      method: 'post',
      data: params
    })
  },
  getDryingInoutProduct(params) {
    return request({
      url: url.getDryingInoutProduct,
      method: 'get',
      data: params
    })
  },
  update(params) {
    return request({
      url: url.update,
      method: 'post',
      data: params
    })
  },
  getList(params) {
    return request({
      url: url.getList,
      method: 'get',
      data: params
    })
  },
  getListPage(params) {
    return request({
      url: url.getListPage,
      method: 'get',
      data: params
    })
  },
  addOrUpdate(params) {
    return request({
      url: url.addOrUpdate,
      method: 'post',
      data: params
    })
  },
  delete(params) {
    return request({
      url: url.delete,
      method: 'delete',
      data: params
    })
  },
  putRecordConfirm(params) {
    return request({
      url: url.putRecordConfirm,
      method: 'post',
      data: params
    })
  },
  outRecordConfirm(params) {
    return request({
      url: url.outRecordConfirm,
      method: 'post',
      data: params
    })
  },
  furnaceEntryChange(params) {
    return request({
      url: url.furnaceEntryChange,
      method: 'post',
      data: params
    })
  },
  clearTankRecord(params) {
    return request({
      url: url.clearTankRecord,
      method: 'post',
      data: params
    })
  },
  dryingRecord(params) {
    return request({
      url: url.dryingRecord,
      method: 'get',
      data: params
    })
  },
  inTankProduct(params) {
    return request({
      url: url.inTankProduct,
      method: 'GET',
      data: params
    })
  },
  cancelSingle(params) {
    return request({
      url: url.cancelSingle,
      method: 'get',
      data: params
    })
  },
}
