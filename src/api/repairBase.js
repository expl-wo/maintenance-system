import request from '@/utils/request'

// 故障分类查询
export function getCateList(params) {
  return request({
    url: '/repairBase/cate',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      name: params.name || '' // 模糊匹配，故障分类名称
    }
  })
}

// 故障分类的新增与编辑
export function getCateUpdate(data) {
    return request({
        url: '/repairBase/cate',
        method: 'POST',
        data
    })
}

// 故障分类删除
export function deleteCate(data) {
    return request({
      url: '/repairBase/cate',
      method: 'DELETE',
      data
    })
}

// 故障因素查询
export function getFactorList(params) {
    return request({
      url: '/repairBase/factor',
      method: 'get',
      params: {
        pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
        pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
        name: params.name || '' // 模糊匹配，故障分类名称
      }
    })
}

// 故障因素的新增与编辑
export function getFactorUpdate(data) {
  return request({
        url: '/repairBase/factor',
        method: 'POST',
        data
    })
}

// 故障因素删除
export function deleteFactor(data) {
    return request({
      url: '/repairBase/factor',
      method: 'DELETE',
      data
    })
}
