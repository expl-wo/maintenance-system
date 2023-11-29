import request from '@/utils/request'

// 大修计划查询
export function getOverHaulTopList(params) {
  return request({
    url: '/overHaul/getPlan',
    method: 'POST',
    data: params
  })
}

// 大修新增与编辑
export function getOverHaulTopUpdate(data) {
  return request({
      url: '/overHaul',
      method: 'POST',
      data
  })
}

// 大修删除
export function deleteOverHaulTop(data) {
  return request({
    url: '/overHaul',
    method: 'DELETE',
    data
  })
}

// 保养项图示保存
export function getUploadFileUpdate(data) {
  return request({
      url: '/overHaul/uploadFile',
      method: 'POST',
      data
  })

}
export function overhaulOa(params) {
  return request({
    url:'/overHaul/overhaulOa',
    method: 'POST',
    data:params
  })
}

export  function overhaulCheckOa(params) {
  return request({
    url:'/overHaul/overhaulCheckOa',
    method:'POST',
    data:params
  })
}
