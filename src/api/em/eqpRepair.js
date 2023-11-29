import request from '@/utils/request'

// 设备维修记录查询
export function getEqpRepairRecList(params) {
  return request({
    url: '/eqpRepair/rec',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1 ,// 查询第几页数据，默认第一页
      repairManName:params.repairManName,//模糊搜索条件
      strDate:params.strDate||'',
      endDate:params.endDate||'',
      eqpName:params.eqpName||'',
      usingDepId: params.usingDepId || null,
      currentStatus: params.status
    }
  })
}

// 设备维修使用备件记录查询
export function getRepSpList(params) {
  return request({
    url: '/eqpRepair/repSp',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      orderNum: params.orderNum || '' // 查询的维修记录维修单号
    }
  })
}
// 设备维修照片查询查询
export function getRepPicture(params) {
  return request({
    url: '/eqpRepair/repairPic',
    method: 'get',
    params: {
      id: params.id,
      type: params.type
    }
  })
}
// 维修等待记录查询
export function getRepWaitRec(params) {
  return request({
    url: '/eqpRepair/waitRec',
    method: 'get',
    params: params
  })
}
