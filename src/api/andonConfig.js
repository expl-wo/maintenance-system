import request from '@/utils/request'

// Andon异常分类分页查询
export function getAndonConfigCateList() {
  return request({
    url: '/andonConfig/cate',
    method: 'get'
  })
}

// Andon异常分类修改
export function getAndonConfigCateUpdate(data) {
    return request({
        url: '/andonConfig/cate',
        method: 'POST',
        data
    })
}

// Andon异常分类删除
export function deleteAndonConfigCate(data) {
  return request({
    url: '/andonConfig/cate',
    method: 'DELETE',
    data
  })
}

// Andon异常项分页查询
export function getAndonAbnormalList(params) {
  return request({
    url: '/andonConfig/abnormal',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 100, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      cateId: params.cateId || ''
    }
  })
}

// Andon异常项修改
export function getAndonAbnormalUpdate(data) {
  return request({
      url: '/andonConfig/abnormal',
      method: 'POST',
      data
  })
}

// Andon异常项删除
export function deleteAndonAbnormal(data) {
  return request({
    url: '/andonConfig/abnormal',
    method: 'DELETE',
    data
  })
}

// 升级提醒分页查询
export function getUpgradeConfigList(params) {
  return request({
    url: '/andonConfig/upgradeConfig',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 100, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      abnormalId: params.abnormalId || ''
    }
  })
}

// 升级提醒添加修改
export function getUpgradeConfigUpdate(data) {
  return request({
      url: '/andonConfig/upgradeConfig',
      method: 'POST',
      data
  })
}

// 升级提醒删除
export function deleteUpgradeConfig(data) {
  return request({
    url: '/andonConfig/upgradeConfig',
    method: 'DELETE',
    data
  })
}


// 标签查询
export function getAndonConfigTagList(params) {
  return request({
    url: '/andonConfig/tag',
    method: 'get',
    params: {
      abnormalId: params.abnormalId || ''
    }
  })
}

// 标签添加修改
export function getAndonConfigTagUpdate(data) {
  return request({
      url: '/andonConfig/tag',
      method: 'POST',
      data
  })
}

// 标签删除
export function deleteAndonConfigTag(data) {
  return request({
    url: '/andonConfig/tag',
    method: 'DELETE',
    data
  })
}

// 升级模板分页查询
export function getUpgradeTempList(params) {
  return request({
    url: '/andonConfig/upgradeTemp',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 100, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1 // 查询第几页数据，默认第一页
    }
  })
}

// 升级模板添加修改
export function getUpgradeTempUpdate(data) {
  return request({
    url: '/andonConfig/upgradeTemp',
    method: 'POST',
    data
  })
}

// 升级模板删除
export function deleteUpgradeTemp(data) {
  return request({
    url: '/andonConfig/upgradeTemp',
    method: 'DELETE',
    data
  })
}

// Andon分类顶级节点的类型列表
export function getAndonCateList() {
  return request({
    url: '/andonConfig/beanCate',
    method: 'get'
  })
}
