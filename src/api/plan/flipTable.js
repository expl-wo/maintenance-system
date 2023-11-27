import request from '@/utils/request'

const flipOrder = ['350T铁芯翻转台', '330T铁芯翻转台', '60T铁芯翻转台', '130T铁芯翻转台', '160T铁心翻转台', '机器人']

function  getFlipIndex(tableName){
  let index = -1;
  flipOrder.some((item, itemIndex)=>{
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
  //叠片计划-新增或修改翻转台信息  POST
  insertFlipTable: '/flipTable/insertFlipTable',

  //叠片计划-删除翻转台信息 POST
  deleteFlipTable: '/flipTable/deleteFlipTable',

  //叠片计划-获取翻转台列表  GET
  findAllFlipTable: '/flipTable/findAllFlipTable',

  //叠片计划-查询已生成叠片计划的工单列表  GET
  queryLaminationList:'/plan/week/queryLaminationList',
  //叠片计划-查询叠片节点生产信息 GET
  queryFlipTableProducts:'/plan/week/queryFlipTableProducts',
  //获取叠片的前序节点
  queryFlipTableRowHeader: '/plan/week/queryFlipTableRowHeader',
  //修改生产号翻转台 POST
  updateFlipTable: '/plan/week/updateFlipTable'
}

export default {
  updateFlipTable(params) {
    return request({
      url: url.updateFlipTable,
      method: 'post',
      data: params
    })
  },
  queryFlipTableRowHeader(params) {
    return request({
      url: url.queryFlipTableRowHeader,
      method: 'get',
      params
    })
  },
  queryFlipTableProducts(params) {
    return request({
      url: url.queryFlipTableProducts,
      method: 'post',
      data: params
    })
  },
  queryLaminationList(params) {
    return request({
      url: url.queryLaminationList,
      method: 'get',
      params
    })
  },
  insertFlipTable(params) {
    return request({
      url: url.insertFlipTable,
      method: 'post',
      data: params
    })
  },
  deleteFlipTable(params) {
    return request({
      url: url.deleteFlipTable,
      method: 'post',
      data: params
    })
  },
  findAllFlipTable(params) {
    return new Promise((resolve, reject)=>{
      request({
        url: url.findAllFlipTable,
        method: 'get',
        params
      }).then(response=>{
        let data  = response.data;
        data.sort((item1, item2)=>{
          let item1Index = getFlipIndex(item1.tableName);
          let item2Index = getFlipIndex(item2.tableName);
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
}

