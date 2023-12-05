import request from '@/utils/request'

// 点检配置查询
export function getMainConfList(params) {
  return request({
    url: '/api/equipment/eqpCheck/mainConf',
    method: 'get',
      data: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      name: params.name || '', // 模糊匹配，点检计划名称
      eqpName:params.eqpName || '', // 模糊匹配，设备名称
      type:(params.type===undefined || params.type===100) ? '' : params.type, //点检类型
      description: params.description || '', // 模糊匹配，点检计划描述
      isLinked: params.isLinked|| 0
    }
  })
}

// 点检配置新增与编辑
export function getMainConfUpdate(data) {
    return request({
        url: '/api/equipment/eqpCheck/mainConf',
        method: 'POST',
        data:{
            cName:data.name,
            cType:data.type,
            cDesc:data.description,
            cCycle:data.cycle,
            cycleUnit:data.cycleUnit
        }
    })
}

// 点检配置删除
export function deleteMainConf(data) {
    return request({
      url: '/api/equipment/eqpCheck/mainConf',
      method: 'DELETE',
      data
    })
}

// 点检项目配置查询
export function getItemConf(params) {
    return request({
      url: '/api/equipment/eqpCheck/itemConf',
      method: 'get',
      data:params
    })
}

// 点检项新增与编辑
export function getItemConfUpdate(data) {
    return request({
        url: '/api/equipment/eqpCheck/itemConf',
        method: 'POST',
        data
    })
}

// 点检配置删除
export function deleteItemConf(data) {
    return request({
      url: '/api/equipment/eqpCheck/itemConf',
      method: 'DELETE',
      data
    })
}

// 点检项目配置查询
export function getEqpConf(params) {
  return request({
    url: '/api/equipment/eqpCheck/eqpConf',
    method: 'get',
    data: params
  })
}

// 点检配置设备挂接
export function getEqpConfUpdate(data) {
    return request({
        url: '/api/equipment/eqpCheck/eqpConf',
        method: 'POST',
        data
    })
}

// 点检项图示上传
export function getPicUpLoad(data) {
    return request({
        url: '/api/equipment/eqpCheck/pic',
        method: 'POST',
        data
    })
}

// 点检记录查询
export function getMainRec(params) {
  return request({
    url: '/api/equipment/eqpCheck/mainRec',
    method: 'get',
      data: {
      pg_pagesize: params.pg_pagesize || 1000, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      creatorName: params.creatorName || '', // 模糊匹配，点检人
      eqpName: params.eqpName || '', // 模糊匹配，点检设备名称
      eqpClazz: params.eqpClazz || '', // 点检分类
      strDate:params.strDate||'',
      endDate:params.endDate||'',
      usingDepId: params.usingDepId || null,
      type: params.checkType,
      status:params.status
    }
  })
}

// 点检记录查询
export function getItemRec(params) {
  return request({
    url: '/api/equipment/eqpCheck/itemRec',
    method: 'get',
      data: {
      mainRecId: params.mainRecId || '' // 点检主记录表主键id
    }
  })
}

// 点检记录查询
export function genCheckTask() {
  return request({
    url: '/api/equipment/eqpCheck/generateCheckTask',
    method: 'get'
  })
}

//导入
export function importCheck(data) {
    return request({
        url: '/endpoint/qrcodeexcel/import',
        method: 'POST',
        data
    })
}

//查询专业点检配置数据
export function proEqpConf(params) {
  return request({
    url: '/api/equipment/eqpCheck/proCheckEqpConf',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize || 1000, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      checkId: params.checkId || null
    }
  })
}

// 专业点检配置设备删除
export function deleteProEqp(data) {
  return request({
    url: '/api/equipment/eqpCheck/delProEqpConf',
    method: 'DELETE',
    data
  })
}

//新增或编辑专业点检的设备配置
export function proCheckEqp(data) {
  return request({
    url: '/api/equipment/eqpCheck/proCheckEqpConf',
    method: 'POST',
    data
  })
}
