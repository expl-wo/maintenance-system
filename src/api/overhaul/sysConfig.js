import request from '@/utils/request'

// 查询MES班组数据
export function getListData() {
  return request({
    url: '/evo-ims-overhaul/business/mes-work-clazz',
    method: 'get',
    
  })
}

// 查询配置信息
export function getSysConfig() {
  return request({
    url: '/evo-ims-overhaul/business/work-clazz',
    method: 'get',
    
  })
}

// 配置业务班组
export function configWorkClazz(data) {
  return request({
    url: '/evo-ims-overhaul/business/work-clazz',
    method: 'post',
    data
  })
}