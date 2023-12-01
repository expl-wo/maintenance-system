import request from '@/utils/request'

// 保养设备配置查询
export function getEqpConfList(params) {
  return request({
    url: '/api/equipment/eqpMtc/eqpConf',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 1000, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      mainId: params.mainId || '' ,// 需查询的点检配置表主键id
      eqpId: params.eqpId
    }
  })
}

// 保养配置查询
export function getMainConfList(params) {
  return request({
    url: '/api/equipment/eqpMtc/mainConf',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 1000, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      name: params.name || '', // 保养主数据名称
      eqpName: params.eqpName || '', // 设备名称
      isLinked: params.isLinked || 0,
      cycleType: params.cycleType
    }
  })
}
export function eqpConfDaily(params) {
  return request({
    url: '/api/equipment/eqpMtc/eqpConfDaily',
    method: 'get',
    params: params
  })
}
export function genMaintainTask() {
  return request({
    url: '/api/equipment/eqpMtc/genMaintainTask',
    method: 'get'
  })
}
// 点检配置设备挂接
export function eqpConfDailyUpdate(data) {
    return request({
        url: '/api/equipment/eqpMtc/eqpConfDaily',
        method: 'post',
        data
    })
}

// 保养配置新增与编辑
export function getMainConfUpdate(data) {
  return request({
      url: '/api/equipment/eqpMtc/mainConf',
      method: 'POST',
      data
  })
}

// 保养配置删除
export function deleteMainConf(data) {
  return request({
    url: '/api/equipment/eqpMtc/mainConf',
    method: 'DELETE',
    data
  })
}

// 保养项配置查询
export function getItemConfList(params) {
  return request({
    url: '/api/equipment/eqpMtc/itemConf',
    method: 'get',
    data:params
  })
}

// 保养项新增与编辑
export function getItemConfUpdate(data) {
  return request({
      url: '/api/equipment/eqpMtc/itemConf',
      method: 'POST',
      data
  })
}

// 保养项删除
export function deleteItemConf(data) {
  return request({
    url: '/api/equipment/eqpMtc/delItemConf',
    method: 'POST',
    data
  })
}

// 保养设备挂接新增与编辑
export function getEqpConfUpdate(data) {
  return request({
      url: '/api/equipment/eqpMtc/eqpConf',
      method: 'POST',
      data
  })
}

// 保养设备删除
export function deleteEqpConf(data) {
  return request({
    url: '/api/equipment/eqpMtc/eqpConf',
    method: 'DELETE',
    data
  })
}

// 保养单查询
export function getDspList(params) {
  return request({
    url: '/api/equipment/eqpMtc/dsp',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 1000, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      eqpName: params.eqpName || '', // 模糊查询，保养的设备名称
      status: (params.status===undefined) ? 100 : params.status, // 派工单状态
      eqpClazz: params.eqpClazz || '', // 设备分类
      cycleType:params.cycleType,
      usingDepId: params.usingDepId || null,
      name:params.name || null
    }
  })
}

// 保养派工
export function getDspUpdate(data) {
  return request({
      url: '/api/equipment/eqpMtc/dsp',
      method: 'POST',
      data
  })
}

// 保养验收
export function getAcpUpdate(data) {
  return request({
      url: '/api/equipment/eqpMtc/acp',
      method: 'POST',
      data
  })
}

// 保养派工单删除
export function deleteAcpConf(data) {
  return request({
    url: '/api/equipment/eqpMtc/acpConf',
    method: 'DELETE',
    data
  })
}

// 保养主记录查询
export function getMainRecList(params) {
  return request({
    url: '/api/equipment/eqpMtc/mainRec',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 1000, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      eqpName: params.eqpName || '', // 模糊查询，保养的设备名称
      eqpClazz: params.eqpClazz || '', // 设备分类
      strDate:params.strDate||'',
      endDate:params.endDate||'',
      cycleType:params.cycleType,
      usingDepId: params.usingDepId || null,
      name:params.name || null,
      status:params.status
    }
  })
}

// 保养主记录项查询
export function getItemRecList(params) {
  return request({
    url: '/api/equipment/eqpMtc/itemRec',
    method: 'get',
    params: {
      id: params.id || '' // 每页显示多少条数据，默认为10条
    }
  })
}

// 保养项图示保存
export function getPicUpdate(data) {
  return request({
      url: '/api/equipment/eqpMtc/pic',
      method: 'POST',
      data
  })
}

// 设备保养使用备件记录查询
export function getMtcSpList(params) {
  return request({
    url: '/api/equipment/eqpMtc/mtcSp',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 1000, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      dspNumber: params.dspNumber || '' // 查询的保养记录保养单号
    }
  })
}

// 保养设备配置选择设备查询
export function getMtcEqpInitList(params) {
  return request({
    url: '/api/equipment/eqpMtc/mtcEqpInit',
    method: 'get',
    params: {
      id: params.id || '', // 保养主配置id
      eqpName: params.eqpName || '', // 设备名称
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      pg_pagesize: params.pg_pagesize || 10 // 查询数量，默认10
    }
  })
}

//导入
export function importMtc(data) {
    return request({
        url: '/endpoint/qrcodeexcel/importMtc',
        method: 'POST',
        data
    })
}

//导入设备点检数据
export function integrityImport(data) {
    return request({
        url: '/endpoint/qrcodeexcel/integrityImport',
        method: 'POST',
        data
    })
}

// 保养设备配置选择设备查询
export function queryTreeEqp(params) {
  return request({
    url: '/api/equipment/eqpMtc/queryTreeEqp',
    method: 'get',
    params: {
      eqpId: params.eqpId || '',
      eqpName: params.eqpName || '',
    }
  })
}
