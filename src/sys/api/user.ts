import { post, get } from '@/_public/utils/http'

const url = {
  //获取部门列表 get
  userPageList: '/api/admin/user/getPageList',
  initUser: '/api/admin/init/user',
  updateUser: '/api/admin/init/updateUser',
  userMenuTree: '/api/admin/permission/queryAll',
  getUserListByIds: '/api/admin/user/getUserListByIds'
}

export function getUserListByIds(data) {
  return post({
    url: url.getUserListByIds,
    data
  });
}

export function userMenuTree() {
  return post({
    url: url.userMenuTree,
    data: {}
  });
}

export function userPageList(data) {
  return post({
    url: url.userPageList,
    data
  });
}

export function initUser(data) {
  return get({
    url: url.initUser,
    data
  });
}

export function updateUser(data){
  return get({
    url: url.updateUser,
    data
  });
}

//查询部门接口
export function getOrganizationList() {
  return get({
    url: "/department/list",
  });
}

//查询角色接口
export function getRoleList() {
  return get({
    url: "/role/list",
  });
}
//添加用户接口
export function getUserAdd(data) {
  return post({
    url: "/user/add",
    data,
  });
}
//查询角色接口
export function getUserDetail(userNumber) {
  return get({
    url: "/user/detail",
    data: {
      userNumber,
    },
  });
}

//更新用户接口
export function getUserUpdate(data) {
  return post({
    url: "/user/update",
    data,
  });
}

//删除用户
export function deleteUser(userNumber) {
  return post({
    url: "/user/delete",
    params: {
      userNumber
    },
  });
}

//是否禁用用户
export function isDisable(available, id) {
  return post({
    url: "/api/admin/user/ban",
    data: {
      available,
      id
    }
  });
}