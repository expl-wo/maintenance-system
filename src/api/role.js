import request from '@/utils/request'

// 角色列表分页查询
export function getRole(params) {
  return request({
    url: '/api/pbpermissions/role/query',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      rName: params.rName || '', // 模糊匹配，角色名称
      rIntro: params.rIntro || '', // 模糊匹配，角色介绍，描述此角色的用途等
      rEnabled: parseInt(params.rEnabled)==0?0:1 // 精确匹配，此角色是否可用，bool值，参见枚举值定义
    }
  })
}

// 角色删除
export function deleteRole(data) {
  return request({
    url: '/api/pbpermissions/role/delete',
    method: 'POST',
    data
  })
}

// 角色列表 新增与编辑的保存操作
export function getRolePost(data) {
  return request({
    url: '/api/pbpermissions/role/save',
    method: 'POST',
    data
  })
}

// 角色列表 新增与编辑的保存操作
export function getPermtree(params) {
  return request({
    url: '/api/pbpermissions/rolePerm/queryTree',
    method: 'GET',
    data: {
      roleId: params.roleId // 角色id
    }
  })
}

// 角色与权限的绑定 保存操作
export function getPerm(data) {
  return request({
    url: '/api/pbpermissions/rolePerm/save',
    method: 'POST',
    data
  })
}

// 角色分类查询
export function getRoleCate(params) {
  return request({
    url: '/api/pbpermissions/roleCate/query',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum, // 查询第几页数据，默认第一页
      cName: params.cName || '' // 模糊匹配，角色分类名称
    }
  })
}

// 角色分类 添加和修改
export function postRoleCate(data) {
  console.log(data)
  return request({
    url: '/api/pbpermissions/roleCate/save',
    method: 'POST',
    data: data,
  })
}

// 角色分类删除
export function deleteRoleCate(data) {
  return request({
    url: '/api/pbpermissions/roleCate/delete',
    method: 'POST',
    data
  })
}

// 角色用户分页查询
export function getRoleUser(params) {
  return request({
    url: '/api/pbpermissions/userRole/query',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum, // 查询第几页数据，默认第一页
      roleId: params.roleId || '', // 模糊匹配，角色主键，一般选择填入，禁止手工填写
      roleName: params.roleName || '', // 模糊匹配，角色名称
      ownerGsbmId: params.ownerGsbmId || '', // 精确匹配，角色拥有者的归属部门主键，选择填入，禁止手工填写
      ownerId: params.ownerId || '', // 精确匹配，角色拥有者的主键，选择填入，禁止手工填写
      ownerName: params.ownerName || '' // 模糊匹配，角色拥有者的用户姓名
    }
  })
}

// 角色用户分配的新增与修改 保存操作
export function postRoleUser(data) {
  return request({
    url: '/api/pbpermissions/userRole/save',
    method: 'POST',
    data
  })
}

// 删除角色用户
export function deleteRoleUser(data) {
  return request({
    url: '/api/pbpermissions/userRole/delete',
    method: 'POST',
    data
  })
}

// 分页查找角色部门非本部门的授权列表
export function getRoleMngneown(params) {
  return request({
    url: '/role/mngneown',
    method: 'get',
    data: {
      pg_pagesize: params.pg_pagesize, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum, // 查询第几页数据，默认第一页
      roleId: params.roleId || '', // 模糊匹配，角色主键，一般选择填入，禁止手工填写
      roleName: params.roleName || '', // 模糊匹配，角色名称
      ownerGsbmName: params.ownerGsbmName || '', // 精确匹配，角色拥有者的归属部门主键，选择填入，禁止手工填写
      deptId: params.deptId || '' // 精确匹配，角色授权部门的主键，选择填入，禁止手工填写
    }
  })
}

// 角色已包含的权限ID数组集合
export function getRolePermids(params) {
  return request({
    url: '/api/pbpermissions/permission/queryIds',
    method: 'get',
    data: {
      roleId: params.roleId || '' // 精确匹配，角色授权部门的主键，选择填入，禁止手工填写
    }
  })
}

