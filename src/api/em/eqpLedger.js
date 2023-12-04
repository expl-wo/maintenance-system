import request from '@/utils/request'
import { getPlanSimpleList } from '@/api/process'

// 设备分类查询
export function getCateList(params) {
  return request({
    url: '/api/equipment/eqpLedger/cate',
    method: 'get',
    data:params
  })
}

// 查询设备分类，主用于在下拉列表中显示
export function getEqCateList() {
  return request({
    url: '/api/equipment/eqpLedger/eqpClazz',
    method: 'get'
  })
}

//
export function setWorkTime(data) {
  return request({
    url: '/api/equipment/eqpLedger/setEqpWorkTime',
    method: 'post',
    data
  })
}
// 设备台账查询
export function getInfoList(params) {
  return request({
    url: '/api/equipment/eqpLedger/info',
    method: 'get',
    data:params
  })
}

// 设备等级查询
//hsseg
export function getHsseManageLevelList(params) {
  return request({
    url: '/api/equipment/eqpLedger/hsseManageLevel',
    method: 'get',
    data:params
  })
}
//生产管理
export function getProductionManageLevelList(params) {
  return request({
    url: '/api/equipment/eqpLedger/productionManageLevel',
    method: 'get',
    data:params
  })
}

// 设备图片保存
export function getPicUpdate(data) {
  return request({
    url: '/api/equipment/eqpLedger/pic',
    method: 'POST',
    data
  })
}

// 设备文件查询
export function getFileList(params) {
  return request({
    url: '/api/equipment/eqpLedger/file',
    method: 'get',
    data:params
  })
}
export function getFileUpdate(data) {
  return request({
    url: '/api/equipment/eqpLedger/file',
    method: 'POST',
    data
  })
}
// 设备文件删除
export function deleteFile(data) {
  return request({
    url: '/api/equipment/eqpLedger/file',
    method: 'DELETE',
    data
  })
}

// 设备图片查询
export function getPicList(params) {
  return request({
    url: '/api/equipment/eqpLedger/pic',
    method: 'get',
    data:params
  })
}

// 设备图片删除
export function deletePic(data) {
  return request({
    url: '/api/equipment/eqpLedger/pic',
    method: 'DELETE',
    data
  })
}

export function timetoandon(params) {
  return request({
    url: '/api/equipment/eqpLedger/timetoandon',
    method: 'POST',
    data:params
  })
}

export function responseConfirm(data) {
  return request({
    url: '/api/equipment/eqpLedger/eqpManager',
    method: 'POST',
    data
  })
}

// 设备台账查询
export function equipExport(params) {
  return request({
    url: '/api/equipment/eqpLedger/export',
    config: {
      responseType: 'blob' // 表明返回服务器返回的数据类型'
    },
    method: 'post',
    data:params
  })
}

//导入设备责任人
export function importManager(data) {
    return request({
        url: '/endpoint/qrcodeexcel/importManager',
        method: 'POST',
        data
    })
}

//查寻设备使用部门
export function finEqpDep(params) {
  return request({
    url: '/api/equipment/eqpLedger/finEqpDep',
    method: 'get',
  })
}
