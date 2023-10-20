import request from '@/utils/request'

const url = {
  //新增/修改入炉规则   POST
  insertFurnaceRules: '/api/gcplan/dryingTank/insertFurnaceRules',
  //工单入炉规则-查看工单入炉规则  GET
  findAllFurnaceRules: '/api/gcplan/dryingTank/findAllFurnaceRules',
  //新增时查询车间组织信息 GET
  findWorkShop:'/api/gcplan/dryingTank/findWorkShop',

  //期量干燥罐入炉时间-新增/修改干燥罐信息及时间 POST
  insertTankTime: '/api/gcplan/dryingTank/insertTankTime',
  // 期量干燥罐入炉时间-查询期量表下的干燥罐信息及时间 GET timeLimitId
  findTankTime: '/api/gcplan/dryingTank/findTankTime',
  //期量干燥罐入炉时间-删除期量表下的干燥罐信息及时间  POST
  deleteTankTime: '/api/gcplan/dryingTank/deleteTankTime'
}

export default {
  insertTankTime(params) {
    return request({
      url: url.insertTankTime,
      method: 'post',
      data: params
    })
  },
  findTankTime(params) {
    return request({
      url: url.findTankTime,
      method: 'get',
      data: params
    })
  },
  deleteTankTime(params) {
    return request({
      url: url.deleteTankTime,
      method: 'post',
      data: params
    })
  },
  findWorkShop(params) {
    return request({
      url: url.findWorkShop,
      method: 'get',
      params
    })
  },
  findAllFurnaceRules(params) {
    return request({
      url: url.findAllFurnaceRules,
      method: 'get',
      data: params
    })
  },
  insertFurnaceRules(params) {
    return request({
      url: url.insertFurnaceRules,
      method: 'post',
      data: params
    })
  },
}

