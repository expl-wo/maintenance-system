import request from '@/utils/request'

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

// 分页获取用户列表，所有用户
export function getUserAll(params) {
  debugger
  return request({
    url: '/api/permissions/userInfo',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum, // 查询第几页数据，默认第一页
      uName: params.uName || '', // 模糊匹配，用户姓名
      uPy: params.uPy || '', // 模糊匹配，用户姓名拼音
      userId: params.userId || '', // 模糊匹配，员工编号
      gsbmId: params.gsbmId || '', // 模糊匹配，员工编号
      gsbmName: params.gsbmName || '' // 模糊匹配，归属部门名称
    }
  })
}
// 分页获取用户列表,不包括不可登陆用户
export function getUser(params) {
  return request({
    url: '/api/permissions/userInfo/query',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum, // 查询第几页数据，默认第一页
      uName: params.uName || '', // 模糊匹配，用户姓名
      uPy: params.uPy || '', // 模糊匹配，用户姓名拼音
      userId: params.userId || '', // 模糊匹配，员工编号
      lsbmId: params.gsbmId || '', // 模糊匹配，归属部门名称
      lsbmName: params.gsbmName || '' // 模糊匹配，归属部门名称
    }
  })
}

export function getRepairUser(params) {
  return request({
    url: '/api/gcproduction/reportInfo/getReporterUser',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum, // 查询第几页数据，默认第一页
      uName: params.uName || '', // 模糊匹配，用户姓名
      uPy: params.uPy || '', // 模糊匹配，用户姓名拼音
      userId: params.userId || '', // 模糊匹配，员工编号
      gsbmId: params.gsbmId || '', // 模糊匹配，归属部门名称
      gsbmName: params.gsbmName || '', // 模糊匹配，归属部门名称
      reportId:params.reportId
    }
  })
}

/**
 * https://www.showdoc.com.cn/meswd?page_id=5922114439493728
 * /zhpt2mes/sync/user
 * POST
 * 从综合平台更新单个用户
 */

export function updateUser(data) {
  return request({
      url: '/zhpt2mes/sync/user',
      method: 'POST',
      data
  })
}
//分页查找当前的登录用户列表
export function currentLogonUser(data) {
  return request({
    url: '/lgnlog/currlist',
    method: 'get',
    data:data
  })
}

//分页查找历史的登录用户列表
export function historyLogonUser(data) {
  return request({
    url: '/lgnlog/hislist',
    method: 'get',
    data:data
  })
}
//分页统计用户历史登录信息
export function hisstatisticsLogonUser(data) {
  return request({
    url: '/lgnlog/hisstatistics',
    method: 'get',
    data:data
  })
}

//设置外协管理账号
export function setNonLocal(data) {
  return request({
    url: '/user/setNonLocal',
    method: 'post',
    data
  })
}
