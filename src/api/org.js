import request from '@/utils/request'

// 组织机构列表查询
export function getOrgAll(params) {
  return request({
    url: '/api/gcpermissions/org/query',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum, // 查询第几页数据，默认第一页
      oName: params.oName || '', // 模糊匹配，部门姓名
      oCode: params.oCode || '' // 模糊匹配，部门编号
    }
  })
}

// 组织机构树查询
export function getOrgAlltree() {
  return request({
    url: '/api/gcpermissions/org/queryTree',
    method: 'get'
  })
}

// 班组信息查询
export function getWkClazzAlltree() {
  return request({
    url: '/api/gcproduction/wkclazz/alltree',
    method: 'get'
  })
}

// 查询班组用户分页查询
export function getWkcUser(params) {
  return request({
    url: '/api/gcproduction/wkclazz/users',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum, // 查询第几页数据，默认第一页
      wkcId: params.wkcId || '', // 班组ID
      userName: params.userName || '' // 用户姓名或编号
    }
  })
}

// 获得人员图片
export function getUsrPic(params) {
  return request({
    url: '/api/gcproduction/wkclazz/getPicPath',
    method: 'get',
    params: {
      userId: params.userId || '' // 用户id
    }
  })
}

export function upLoadUserPic(data) {
  return request({
    url: '/api/gcproduction/wkclazz/setpic',
    method: 'POST',
    data
  })
}

// 查询用户所在班组的所有成员
export function getClazzUser() {
  return request({
    url: '/api/gcproduction/wkclazz/getClazzUser',
    method: 'get'
  })
}

