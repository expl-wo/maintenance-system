import request from '@/utils/request'

// 设备列表初始化（查询所有设备）
export function getEqpInitList(params) {
  return request({
    url: '/api/equipment/eqpCommon/eqpInit',
    method: 'get',
    params: {
      id: params.id || '', // 设备分类id（在按分类检索的情况下必填，不填写将检索所有设备的id和名称）
      eqpName: params.eqpName || '', // 设备名称
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      pg_pagesize: params.pg_pagesize || 10 // 查询数量，默认10
    }
  })
}
// 设备列表初始化（查询所有设备）
export function getOrgInitList(params) {
  return request({
    url: '/api/equipment/eqpCommon/orgInit',
    method: 'get',
    params: {
      orgName: params.orgName || '', // 设备名称
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      pg_pagesize: params.pg_pagesize || 10 // 查询数量，默认10
    }
  })
}
