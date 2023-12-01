import request from '@/utils/request'
import timeTranslate from '@/utils/common.js'
export function getSparePartsList(params) {
  return request({
    url: '/api/equipment/spareParts/sparePart',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum, // 查询第几页数据，默认第一页
      materialCode: params.materialCode, //备品备件编号
      materialName: params.materialName, //备品备件名称
    }
  })
}
export function getSparePartsRecords(params) {
  return request({
    url: '/api/equipment/spareParts/getSparePartsRecord',
    method: 'get',
    params: params
  })
}
export function getSparePartsBom(params){
  return request({
    url: '/api/equipment/spareParts/getSparePartsBom',
    method: 'get',
    params: params
  })
}
export function addSparePartsBom(data){
  return request({
    url: '/api/equipment/spareParts/addSparePartsBom',
    method: 'post',
    data
  })
}

export function editSparePartsBom(data){
  return request({
    url: '/api/equipment/spareParts/editSparePartsBom',
    method: 'post',
    data
  })
}
export function deleteSparePartsBom(params){
  return request({
    url: '/api/equipment/spareParts/deleteSparePartsBom',
    method: 'post',
    params: {
      id: params, //设备编号
    }
  })
}
export function applySpareParts(data){
  return request({
    url: '/api/equipment/spareParts/applySpareParts',
    method: 'post',
    data
  })
}

export function getSparePartsApplyRecord(params){
  return request({
    url: '/api/equipment/spareParts/getSparePartsApplyRecord',
    method: 'get',
    params
  })
}
export function editApply(data){
  return request({
    url: '/api/equipment/spareParts/editApply',
    method: 'post',
    data
  })
}
export function applyToOA(data){
  return request({
    url: '/api/equipment/spareParts/applyToOA',
    method: 'post',
    data
  })
}
export function deleteApply(params){
  return request({
    url: '/api/equipment/spareParts/deleteApply',
    method: 'post',
    params:{
      id:params
    }
  })
}

export function importApplyRecord(data) {
    return request({
        url: '/endpoint/qrcodeexcel/applySparePartsRecordImport',
        method: 'POST',
        data
    })
}

export function applyEnsure(data) {
    return request({
        url: '/api/equipment/spareParts/applyEnsure',
        method: 'POST',
        data
    })
}
