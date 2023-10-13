import request from '@/utils/request'

// 父菜单选择查询
export function getPermissiontreeList() {
    return request({
      url: '/api/pbpermissions/permission/queryTree',
      method: 'get'
    })
}

// 菜单新增或编辑
// export function getPermissiontreeUpdate(params) {
//     return request({
//         url: '/permission/tree',
//         method: 'get',
//         params: {
//             id: params.id || '', // id
//             name: params.name || '', // 权限名称
//             code: params.code || '', // 权限编号,唯一，新增时填写，编辑时不可修改
//             type: params.type || 1, // 权限类型 枚举 1：菜单 2：按钮
//             url: params.url || '', // 权限服务端功能路径
//             viewPath: params.viewPath || '', // 权限对应的视图组件路径
//             method: params.method || 'GET', // 调用方法，GET, POST, PUT等
//             iconName: params.iconName || '', // 权限图标名称
//             fid: params.fid || '', // 父权限ID
//             enabled: params.enabled || 1, // 本功能权限是否可用 枚举 0：否 1：是
//             showOrder: params.showOrder || 1, // 显示顺序
//         }
//     })
// }

// 菜单新增或编辑
export function getPermissiontreeUpdate(data) {
    return request({
        url: '/api/pbpermissions/permission/save',
        method: 'post',
        data
    })
}

//获取菜单
export function userMenuTree(data) {
  return request({
    url: '/api/pbpermissions/my/currperm',
    method: 'get',
    data
  });
}

