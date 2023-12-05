import request from '@/utils/request'

// 获取本人的用户详情
export function getInfo() {
  return request({
    url: '/api/pbpermissions/my/info',
    method: 'get',
  })
}

// 获取本人当前所使用角色的权限集合
export function getCurrperm() {
  return request({
    url: '/my/currperm',
    method: 'get'
  })
}

// 切换我当前的使用角色
export function getChgcurrrole(data) {
  return request({
    url: '/my/chgcurrrole',
    method: 'post',
    data
  })
}

// 当前用户退出登录
export function postLogout(data) {
  return request({
    url: '/my/logout',
    method: 'post',
    data
  })
}
//个人消息 列表
export function getMyMessage(data) {
  return request({
    url: '/my/msg/list',
    method: 'get',
    params:data
  })
}
//个人消息 列表已读
export function postMessRead(data) {
  return request({
    url: '/my/msg/read',
    method: 'post',
    data
  })
}
//修改个人密码
export function postRePassword(data) {
  return request({
    url: '/my/chgpwd',
    method: 'post',
    data
  })
}
