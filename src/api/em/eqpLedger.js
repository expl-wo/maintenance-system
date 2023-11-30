import request from '@/utils/request'
import { getPlanSimpleList } from '@/api/process'

// 设备分类查询
export function getCateList(params) {
  return request({
    url: '/api/equipment/eqpLedger/cate',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      name: params.name || '', // 模糊匹配，分类名称
      description: params.description || '' ,// 模糊匹配，分类描述，描述此分类的意义等
      type: params.type,//区分数据查询类型
    }
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
    params: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      name: params.name || '', // 模糊匹配，设备名称
      number: params.number || '', // 模糊匹配，设备编号
      eqpClazz: params.eqpClazz || '', // 设备分类
      usingDepartment: params.usingDepartment || '', // 模糊匹配，使用部门
      status: params.status || '', // 模糊匹配，使用状态，枚举
      isLimit: params.isLimit,
      workshop: params.workshop || '',
      usingDepId: params.usingDepId || null
    }
  })
}

// 设备等级查询
//hsseg
export function getHsseManageLevelList(params) {
  return request({
    url: '/api/equipment/eqpLedger/hsseManageLevel',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      name: params.name || '', // 模糊匹配，等级名称
      description: params.description || '' ,// 模糊匹配，等级描述
    }
  })
}
//生产管理
export function getProductionManageLevelList(params) {
  return request({
    url: '/api/equipment/eqpLedger/productionManageLevel',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      name: params.name || '', // 模糊匹配，等级名称
      description: params.description || '' ,// 模糊匹配，等级描述
    }
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
    params: {
      id: params.id || '' // 设备id
    }
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
    params: {
      id: params.id || '' // 设备id
    }
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
    params: {
      eqpClassId: params.eqpClassId || '', // 分类id
      toAndonTime: params.toAndonTime
    }
  })
}

export function responseConfirm(data) {
  return request({
    url: '/api/equipment/eqpLedger/eqpManager',
    method: 'POST',
    data
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
