import request from '@/utils/request';

const url = {
  //查询生产主计划及其节点GET
  planListWithNodes: '/api/gcplan/productPlan/planListWithNodes',
  //冻结模块-解冻工单 POST
  unfreezeWork: '/api/gcplan/planFreeze/unFreezeWork',
  //冻结模块-冻结工单 POST
  freezeWork: '/api/gcplan/planFreeze/freezeWork',
  //冻结模块-查看工单冻结信息 GET
  findFreezeByPlan: '/api/gcplan/planFreeze/findFreezeByPlan',
  //生产主计划-增加工单备注
  addWorkRemark: '/api/gcplan/plan/proplan/addWorkRemarks',
  //生产主计划-查询工单备注 get
  findWorkRemarks: '/api/gcplan/plan/proplan/findWorkRemarks',
  //生产主计划-查询修改交货期历史记录 get
  findDeliveryUpdRecord: '/api/gcplan/plan/proplan/findDeliveryUpdRecord',
  //工单返修状态设置
  setRepair: '/api/gcplan/plan/proplan/setRepair',
  //生产主计划-修改生产完工时间 POST
  updateTime:'/api/gcplan/plan/proplan/updateTime',
  //生产主计划-批量修改生产完工时间 POST
  updateTimeList:'/api/gcplan/plan/proplan/updateTimeList',
  //查询生产主计划及其节点导出
  mainPlanExport: '/api/gcplan/plan/proplan/mainPlanExport',
  //工单设置是否限制前后工序关系
  setLimitRelation: '/api/gcplan/plan/proplan/setLimitRelation',
  //生产主计划-修改交货期 POST
  changePlanComple:'/api/gcplan/plan/proplan/changePlanComple',
  //查询产品型号列表
  queryProductModel: '/api/gcplan/plan/proplan/queryProductModel',
  //节点基础数据-查询关键节点  GET
  findByType: '/api/gcplan/nodeBasic/findByType',
  //查询节点坐标数据及其前置条件
  getNodeCoordinateAndConditions: '/api/gcplan/nodeCoordinate/getNodeCoordinateAndConditions',
  //是否有磁屏蔽GET
  isMagnetic: '/api/gcplan/nodeCoordinate/isMagnetic',
  //  生产主计划--生产节点报工详情  GET
  searchByPlan:  '/api/gcplan/baseConfigWeb/searchByPlan',
}

export default {
  url,
  planListWithNodes(params){
    return request({
      url: url.planListWithNodes,
      method: 'post',
      data: params
    })
  },
  unfreezeWork(params){
    return request({
      url: url.unfreezeWork,
      method: 'post',
      data: params
    })
  },
  findFreezeByPlan(params) {
    return request({
      url: url.findFreezeByPlan,
      method: 'get',
      data: params
    })
  },
  addWorkRemark(params) {
    return request({
      url: url.addWorkRemark,
      method: 'post',
      data: params
    })
  },
  findWorkRemarks(params) {
    return request({
      url: url.findWorkRemarks,
      method: 'get',
      data: params
    })
  },
  findDeliveryUpdRecord(params) {
    return request({
      url: url.findDeliveryUpdRecord,
      method: 'get',
      data: params
    })
  },
  setRepair(params) {
    return request({
      url: url.setRepair,
      method: 'post',
      data: params
    })
  },
  updateTime(params){
    return request({
      url: url.updateTime,
      method: 'post',
      data: params
    })
  },
  updateTimeList(params){
    return request({
      url: url.updateTimeList,
      method: 'post',
      data: params
    })
  },
  mainPlanExport(params) {
    return request({
      url: url.mainPlanExport,
      method: 'post',
      data: params
    })
  },
  setLimitRelation(params) {
    return request({
      url: url.setLimitRelation,
      method: 'post',
      data: params
    })
  },
  changePlanComple(params){
    return request({
      url: url.changePlanComple,
      method: 'post',
      data: params
    })
  },
  queryProductModel(params) {
    return request({
      url: url.queryProductModel,
      method: 'get',
      data: params
    })
  },
  findByType(params) {
    return request({
      url: url.findByType,
      method: 'get',
      data: params
    })
  },
  getNodeCoordinateAndConditions(params) {
    return request({
      url: url.getNodeCoordinateAndConditions,
      method: 'get',
      data: params
    })
  },
  isMagnetic(params) {
    return request({
      url: url.isMagnetic,
      method: 'get',
      data: params
    })
  },
}
