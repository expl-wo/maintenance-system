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
  searchByPlan:  '/api/gcplan/productPlan/searchByPlan',
  //生产主计划-修改交货期 POST
  changeDelivery: '/api/gcplan/plan/proplan/changeDelivery',
  //入炉计划列表
  queryFurnaceList: '/api/gcplan/plan/week/queryFurnaceList',//已完成
  //入炉计划-查询入炉节点生产信息
  queryFurnaceProducts: '/api/gcplan/plan/week/queryFurnaceProducts',//已完成
  //入炉计划-前置条件校验
  furnaceBeforeHand: '/api/gcplan/plan/week/furnaceBeforeHand',//已完成
  //根据id查干燥罐
  findTankById: '/api/gcplan/dryingTank/findTankById',//已完成
  //车间周计划申请-按钮-检查完成的工单加入周计划  POST
  addWeekPlan: '/api/gcplan/plan/week/addWeekPlan',//待zy
  //车间周计划申请-按钮-审批周计划  POST
  approveWeekPlan: '/api/gcplan/plan/week/approveWeekPlan',//已完成
  //修改计划时间
  updatePlanDate: '/api/gcplan/plan/week/updateNodePlan',//已完成
  //入炉计划-修改干燥罐
  updateTank: '/api/gcplan/plan/week/updateFurnace',//已完成
  //车间周计划申请-按钮-删除周计划 POST
  delWeekPlan: '/api/gcplan/plan/week/delWeekPlan',//待定
  //试验计划-查询试验节点的主计划以及主计划其下的其他节点
  findPlanWithNodes: '/api/gcplan/plan/proplan/findPlanWithNodes',//待
  optionalProduct: '/api/gcplan/plan/proplan/optionalProduct',//已完成
  //查询试验计划  GET
  getExperimentPlan: '/api/gcplan/plan/proplan/getExperimentPlan',//已完成
  //修改试验计划
  editExperimentPlan: '/api/gcplan/plan/proplan/editExperimentPlan',//已完成
  //加入试验计划
  addToExperimentPlan: '/api/gcplan/plan/proplan/addToExperimentPlan',//已完成
  //试验计划-修改销售回复时间和回复人
  updateSales: '/api/gcplan/plan/proplan/updateSales',//已完成
  //车间计划申请-按钮-选择工单申请周计划 POST
  applyWeekPlan: '/api/gcplan/productPlan/compilation/applayPlan',
  //计划审批  POST
  approvalPlan: '/api/gcplan/plan/proplan/approvalPlan',
  //删除试验计划  POST
  delPlan: '/api/gcplan/plan/proplan/delPlan',
  //计划审批
  approvalPlanZ: '/api/gcplan/productPlan/compilation/approvePlan',
  //修改生产号期量表 Get
  updateProductLimit: '/api/gcplan/productPlan/updateProductLimit',
  //期量表配置-查询期量列表 get
  queryMainList: '/api/gcplan/timelimitMain/query',
  //查询所有计划节点
  findAllPlanNode: '/api/gcplan/productPlan/findAllPlanNode',
  //删除、恢复计划节点
  modifyPlanNodes: '/api/gcplan/productPlan/modifyPlanNodes',
  //mes工艺路线绑定获取A10
  getOrderList: '/api/gcplan/productPlan/getOrderList',
  //获取MES工艺模板
  getMesProcessList: '/api/gcplan/productPlan/getMesProcessList',
  //绑定MES工艺路线
  bindProcessPlan: '/api/gcplan/productPlan/bindProcessPlan',
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
  freezeWork(params) {
    return request({
      url: url.freezeWork,
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
  changeDelivery(params) {
    return request({
      url: url.changeDelivery,
      method: 'post',
      data: params
    })
  },
  queryFurnaceList(params) {
    return request({
      url: url.queryFurnaceList,
      method: 'get',
      data: params
    })
  },
  queryFurnaceProducts(params) {
    return request({
      url: url.queryFurnaceProducts,
      method: 'post',
      data: params
    })
  },
  furnaceBeforeHand(params) {
    return request({
      url: url.furnaceBeforeHand,
      method: 'post',
      data: params
    })
  },
  findTankById(params) {
    return request({
      url: url.findTankById,
      method: 'get',
      data: params
    })
  },
  addWeekPlan(params) {
    return request({
      url: url.addWeekPlan,
      method: 'post',
      data: params
    })
  },
  approveWeekPlan(params) {
    return request({
      url: url.approveWeekPlan,
      method: 'post',
      data: params
    })
  },
  updatePlanDate(params) {
    return request({
      url: url.updatePlanDate,
      method: 'post',
      data: params
    })
  },
  updateTank(params) {
    return request({
      url: url.updateTank,
      method: 'post',
      data: params
    })
  },
  delWeekPlan(params) {
    return request({
      url: url.delWeekPlan,
      method: 'post',
      data: params
    })
  },
  findPlanWithNodes(params) {
    return request({
      url: url.findPlanWithNodes,
      method: 'post',
      data: params
    })
  },
  optionalProduct(params) {
    return request({
      url: url.optionalProduct,
      method: 'get',
      data: params
    })
  },
  getExperimentPlan(params) {
    return request({
      url: url.getExperimentPlan,
      method: 'get',
      data: params
    })
  },
  addToExperimentPlan(params) {
    return request({
      url: url.addToExperimentPlan,
      method: 'post',
      data: params
    })
  },
  editExperimentPlan(params) {
    return request({
      url: url.editExperimentPlan,
      method: 'post',
      data: params
    })
  },
  updateSales(params) {
    return request({
      url: url.updateSales,
      method: 'post',
      data: params
    })
  },
  applyWeekPlan(params) {
    return request({
      url: url.applyWeekPlan,
      method: 'post',
      data: params
    })
  },
  approvalPlan(params) {
    return request({
      url: url.approvalPlan,
      method: 'post',
      data: params
    })
  },
  delPlan(params) {
    return request({
      url: url.delPlan,
      method: 'post',
      data: params
    })
  },
  approvalPlanZ(params) {
    return request({
      url: url.approvalPlanZ,
      method: 'post',
      data: params
    })
  },
  queryMainList(params) {
    return request({
      url: url.queryMainList,
      method: 'get',
      data:{
        pageSize: params.pageSize,
        pageNum: params.pageNum,
      }
    })
  },
  updateProductLimit(params) {
    return request({
      url: url.updateProductLimit,
      method: 'post',
      data: params
    })
  },
  searchByPlan(params) {
    return request({
      url: url.searchByPlan,
      method: 'get',
      data: params
    })
  },
  findAllPlanNode(params){
    return request({
      url: url.findAllPlanNode,
      method: 'get',
      data: {
        planId: params.planId,
        type: params.type,
        name: params.name,
        pg_pagenum: params.pg_pagenum,
        pg_pagesize: params.pg_pagesize,
      }
    })
  },
  modifyPlanNodes(params){
    return request({
      url: url.modifyPlanNodes,
      method: 'post',
      data: params
    })
  },
  getOrderList(params){
    return request({
      url: url.getOrderList,
      method: 'get',
      data: params
    })
  },
  getMesProcessList(params){
    return request({
      url: url.getMesProcessList,
      method: 'get',
      data: params
    })
  },
  bindProcessPlan(params){
    return request({
      url: url.bindProcessPlan,
      method: 'post',
      data: params
    })
  },
}
