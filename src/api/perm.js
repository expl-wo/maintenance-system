import request from '@/utils/request'

// 查询所有菜单
export function getAlltree() {
  return request({
    url: '/perm/alltree',
    method: 'get'
  })
}

// 查询当前用户所拥有的所有菜单
export function getHasAllTree() {
  return request({
    url: '/api/permissions/permission/queryAll',
    method: 'get'
  })
}


