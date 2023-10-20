import request from '@/utils/request'

// 查询期量主表
export function queryMainList(params) {
  return request({
    url: '/api/gcplan/timelimit/queryMainList',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      code: params.code || null, // 模糊匹配，分类名称
      name: params.name || null // 模糊匹配，分类描述，描述此分类的意义等
    }
  })
}

// 查询期量设计型号对应关系列表
export function queryDeList(params) {
  return request({
    url: '/api/gcplan/timelimit/queryDeList',
    method: 'get',
    data: {
      timeLimitId: params.limitId || null,
      nodeName: params.nodeName || null
    }
  })
}

// 查询期量设计型号对应关系列表
export function queryModelList(params) {
  return request({
    url: '/api/gcplan/timelimitModel/queryModelList',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      model: params.model || null, // 模糊匹配，分类名称
      limitName: params.limitName || null ,// 模糊匹配，分类描述，描述此分类的意义等
      isUnBound: params.isUnBound || 0,
    }
  })
}

// 删除期量行
export function delLimitDe(params) {
  debugger
  return request({
    url: '/api/gcplan/timelimit/delLimitDe',
    method: 'delete',
    data: {
      id: params.id,
    }
  })
}

// 新增或修改期量行
export function insertOrUpdateLimitDe(params) {
  return request({
    url: '/api/gcplan/timelimit/insertOrUpdateLimitDe',
    method: 'post',
    data: params
  })
}

// 删除期量
export function delMainLimit(params) {
  return request({
    url: '/api/gcplan/timelimitMain/delMainLimit',
    method: 'post',
    data: params
  })
}

// 新增或修改期量
export function insertOrUpdateMainLimit(params) {
  return request({
    url: '/api/gcplan/timelimit/insertOrUpdateMainLimit',
    method: 'post',
    data: params
  })
}

// 设计型号绑定期量
export function insertLimitModel(params) {
  return request({
    url: '/api/gcplan/timelimitModel/insertLimitModel',
    method: 'post',
    data: params
  })
}

// 设计型号解绑期量
export function unBound(params) {
  return request({
    url: '/api/gcplan/timelimitModel/unBound',
    method: 'post',
    data: params
  })
}

// 查询本部计划工单池
export function queryHBMesOrderList(params) {
  return request({
    url: '/api/gcplan/timelimit/queryHBMesOrderList',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      keyWord: params.keyWord || null, // 模糊匹配，分类名称
    }
  })
}

// 查询可手动同步mes工单的erp销售合同和erp工单
export function queryHandToMesOrder(params) {
  return request({
    url: '/api/gcplan/timelimit/queryHandToMesOrder',
    method: 'get',
    data: {
      pg_pagesize: params.pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pagenum || 1, // 查询第几页数据，默认第一页
      productNo: params.productNo || null, // 模糊匹配，分类名称
      isOrder: params.isOrder || false,
    }
  })
}

// 手动同步mes工单
export function toMesOrder(params) {
  return request({
    url: '/api/gcplan/timelimit/toMesOrder',
    method: 'post',
    data: params
  })
}
