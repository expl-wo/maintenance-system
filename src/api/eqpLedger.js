import request from '@/utils/request'
import { getPlanSimpleList } from '@/api/process'

// 辅材类型查询
export function getAuxiliaryType(params) {
  return request({
    url: '/api/gcplan/baseData/getAuxiliaryType',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      auxiliaryTypeName: params.auxiliaryTypeName || '', // 模糊匹配，分类名称
    }
  })
}
/**新增、修改辅材类型**/
export function saveAuxiliaryType(params) {
  return request({
    url: '/api/gcplan/baseData/saveAuxiliaryType',
    method: 'post',
    data:params
  })
}

/**删除辅材类型**/
export function deleteAuxiliaryType(data) {
  return request({
    url: '/api/gcplan/baseData/deleteAuxiliaryType',
    method: 'post',
    data
  })
}

// 主材类型查询
export function getMainMaterialType(params) {
  return request({
    url: '/api/gcplan/baseData/getMainMaterialType',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      mainTypeName: params.mainTypeName || '', // 模糊匹配，分类名称
    }
  })
}


/**新增、修改主材类型**/
export function saveMainMaterialType(params) {
  return request({
    url: '/api/gcplan/baseData/saveMainMaterialType',
    method: 'post',
    data:params
  })
}

/**删除主材类型**/
export function deleteMainMaterialType(data) {
  return request({
    url: '/api/gcplan/baseData/deleteMainMaterialType',
    method: 'post',
    data
  })
}
// 设备类型查询
export function getEquipmentType(params) {
  return request({
    url: '/api/gcplan/baseData/getEquipmentType',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      equipmentTypeName: params.equipmentTypeName || '', // 模糊匹配，分类名称
    }
  })
}

/**新增、修改设备类型**/
export function saveEquipmentType(params) {
  return request({
    url: '/api/gcplan/baseData/saveEquipmentType',
    method: 'post',
    data:params
  })
}

/**删除设备类型**/
export function deleteEquipmentType(data) {
  return request({
    url: '/api/gcplan/baseData/deleteEquipmentType',
    method: 'post',
    data
  })
}
// 工器具类型查询
export function getToolsType(params) {
  return request({
    url: '/api/gcplan/baseData/getToolsType',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      toolsTypeName: params.toolsTypeName || '', // 模糊匹配，分类名称
    }
  })
}
/**新增、修改工器具类型**/
export function saveToolsType(params) {
  return request({
    url: '/api/gcplan/baseData/saveToolsType',
    method: 'post',
    data:params
  })
}

/**删除工器具类型**/
export function deleteToolsType(data) {
  return request({
    url: '/api/gcplan/baseData/deleteToolsType',
    method: 'post',
    data
  })
}



/**新增、修改中工序对应辅材表信息**/
export function saveAuxiliary(params) {
  return request({
    url: '/api/gcplan/baseData/saveAuxiliary',
    method: 'post',
    data:params
  })
}

/**查询中工序对应的辅材表信息**/
export function getCrafsAndAuxiliary(params) {
  return request({
    url: '/api/gcplan/baseData/getCrafsAndAuxiliary',
    method: 'get',
    data: {
      crafsId:params.crafsId,
      auxiliaryTypeName: params.auxiliaryTypeName , // 模糊匹配，分类名称
      crafsName:params.crafsName,
      pg_pagesize: params.pg_pagesize, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum , // 查询第几页数据，默认第一页
    }
  })
}

/**删除中工序对应辅材表信息**/
export function deleteAuxiliary(data) {
  return request({
    url: '/api/gcplan/baseData/deleteAuxiliary',
    method: 'post',
    data
  })
}

// 查询中工序对应主材表信息
export function getCrafsAndMain(params) {
  return request({
    url: '/api/gcplan/baseData/getCrafsAndMain',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      mainTypeName: params.mainTypeName ,// 模糊匹配，分类名称
      crafsName:params.crafsName
    }
  })
}


/**新增、修改中工序对应主材表信息**/
export function saveMain(params) {
  return request({
    url: '/api/gcplan/baseData/saveMain',
    method: 'post',
    data:params
  })
}

/**删除中工序对应主材表信息**/
export function deleteMain(data) {
  return request({
    url: '/api/gcplan/baseData/deleteMain',
    method: 'post',
    data
  })
}
// 查询中工序对应设备表信息
export function getCrafsAndEquipment(params) {
  return request({
    url: '/api/gcplan/baseData/getCrafsAndEquipment',
    method: 'get',
    data: {
      crafsId: params.crafsId,
      equipmentTypeName: params.equipmentTypeName , // 模糊匹配，分类名称
      crafsName:params.crafsName,
      pg_pagesize: params.pg_pagesize,
      pg_pagenum: params.pg_pagenum ,
    }
  })
}

/**新增、修改中工序对应设备表信息**/
export function saveEquipment(params) {
  return request({
    url: '/api/gcplan/baseData/saveEquipment',
    method: 'post',
    data:params
  })
}

/**删除中工序对应设备表信息**/
export function deleteEquipment(data) {
  return request({
    url: '/api/gcplan/baseData/deleteEquipment',
    method: 'post',
    data
  })
}
// 查询中工序对应工器具表信息
export function getCrafsAndTools(params) {
  return request({
    url: '/api/gcplan/baseData/getCrafsAndTools',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      toolsTypeName: params.toolsTypeName || '', // 模糊匹配，分类名称
      crafsName:params.crafsName
    }
  })
}
/**新增、修改中工序对应工器具表信息**/
export function saveTools(params) {
  return request({
    url: '/api/gcplan/baseData/saveTools',
    method: 'post',
    data:params
  })
}

/**删除中工序对应工器具表信息**/
export function deleteTools(data) {
  return request({
    url: '/api/gcplan/baseData/deleteTools',
    method: 'post',
    data
  })
}
