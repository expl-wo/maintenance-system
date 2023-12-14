import request from '@/utils/request';
//获取节点数据
export function findAllNode(params) {
  return request({
    url: '/api/gcplan/nodeBasic/queryAllNode',
    method: 'get',
    data: {
      type: params.type,
      name: params.name,
      pg_pagenum: params.pg_pagenum,
      pg_pagesize: params.pg_pagesize,
    }
  })
}

//修改节点前置条件
export function updateNodeOrder(data) {
  return request({
    url: '/api/gcplan/nodeOrder/insertNodeOrder',
    method: 'post',
    data
  })
}

//节点坐标-查询
export function queryCoordinate(data) {
  return request({
    url: '/api/gcplan/nodeCoordinate/coordinate',
    method: 'get',
    data:{
      id:data.id,
      nodeId:data.nodeId,
      name:data.name,
      pageSize: data.pg_pagesize,
      pageNum: data.pg_pagenum,
    }
  })
}

//节点坐标-新增/修改
export function updateOrAddcoordinate(data) {
  return request({
    url: '/api/gcplan/nodeCoordinate/coordinate',
    method: 'post',
    data
  })
}

//按类型获取节点数据
export function findByType(data) {
  return request({
    url: '/api/gcplan/nodeBasic/findByType',
    method: 'get',
    data: {
      type: data,
    }
  })
}

//获取未绑定节点的分类数据
export function queryMaterialNotNode(params) {
  return request({
    url: '/api/gcplan/materialnode/queryMaterialNotNode',
    method: 'get',
    data: {
      clazzCode: params.clazzCode,
      clazzName: params.clazzName
    }
  })
}

//根据节点id获取分类数据
export function queryListMaterialNode(data) {
  return request({
    url: '/api/gcplan/materialnode/queryListMaterialNode',
    method: 'get',
    data: {
      nodeId: data,
    }
  })
}

//删除节点与物料分类数据
export function deleteMaterNode(data) {
  return request({
    url: '/api/gcplan/materialnode/deleteMaterNode',
    method: 'post',
    data
  })
}

//添加节点与物料分类数据
export function insertMaterialNode(data) {
  return request({
    url: '/api/gcplan/materialnode/insertMaterialNode',
    method: 'post',
    data
  })
}

//删除节点与图纸特征号关系
export function deleteDrawingNode(data) {
  return request({
    url: '/api/gcplan/drawingnode/deleteDrawingNode',
    method: 'post',
    data
  })
}

//添加节点与与图纸特征号关系
export function insertDrawingNode(data) {
  return request({
    url: '/api/gcplan/drawingnode/insertDrawingNode',
    method: 'post',
    data
  })
}

//根据节点获取图纸图纸数据
export function queryDrawByNode(data) {
  return request({
    url: '/api/gcplan/drawingnode/queryListDrawingNode',
    method: 'get',
    data: {
      nodeId: data,
    }
  })
}

/**PLM工序对应节点*/
export function PlmProcessNode(params) {
  return request({
    url: '/api/gcplan/nodeAndPlm/queryListPLMProcess',
    method: 'get',
    data: {
      pg_pagenum: params.pg_pagenum,
      pg_pagesize: params.pg_pagesize,
      gxUid: params.gxUid,
      gxName: params.gxName,
      name:params.name
    }
  })
}
/** PLM工序下关联的子工艺模板头信息 */
export function queryListCrafts(params) {
  return request({
    url: '/api/gcplan/nodeAndPlm/queryListPlmProcessCrafts',
    method: 'get',
    data:{
      plmProcessId:params.plmProcessId,
      pg_pagenum: params.pg_pagenum,
      pg_pagesize: params.pg_pagesize,


    }
  })
}
/**新增、修改子工艺模板头**/
export function insertPLMProcessCrafts(data) {
  return request({
    url: '/api/gcplan/nodeAndPlm/insert',
    method: 'post',
    data:data
  })
}
/**删除子工艺模板头**/
export function deleteProcessCrafts(data) {
  return request({
    url: '/api/gcplan/nodeAndPlm/deleteProcessCrafts',
    method: 'post',
    data
  })
}
/**查询工序对应的子工艺模板头**/
export function findAllCrafts(params) {
  return request({
    url: '/api/gcplan/nodeAndPlm/findAllCrafts',
    method: 'get',
    data: {
      pg_pagenum: params.pg_pagenum,
      pg_pagesize: params.pg_pagesize,
      craftsName: params.craftsName,
      craftsCode:params.craftsCode

    }
  })
}
/**查询某子工艺模板头下的子关于模板行信息**/
export function findAllCraftsDes(params) {
  return request({
    url: '/api/gcplan/nodeAndPlm/findAllCraftsDes',
    method: 'get',
    data: {
      craftsId: params.craftsId,
      craftsDeCode:params.craftsDeCode,
      craftsDeName:params.craftsDeName,
      pg_pagenum: params.pg_pagenum,
      pg_pagesize: params.pg_pagesize,
    }
  })
}
/**查询子工艺模板行**/
export function findAllCraftsDe(params) {
  return request({
    url: '/api/gcplan/nodeAndPlm/findCraftsDe',
    method: 'get',
    data: {
      craftsDeCode:params.craftsDeCode,
      craftsDeName:params.craftsDeName,
      pg_pagenum: params.pg_pagenum,
      pg_pagesize: params.pg_pagesize,
    }
  })
}
/**新增子工艺模板头先后顺序*/
export function insertCraftsOrder(data) {
  return request({
    url: 'api/gcplan/nodeAndPlm/insertCraftsOrder',
    method: 'post',
    data:data
  })
}
/**新增子工艺模板行先后顺序*/
export function insertCraftsDeOrder(data) {
  return request({
    url: 'api/gcplan/nodeAndPlm/insertCraftsDeOrder',
    method: 'post',
    data:data
  })
}
/**新增、修改子工艺模板行*/
export function insertCraftsDe(data) {
  return request({
    url: 'api/gcplan/nodeAndPlm/insertDe',
    method: 'post',
    data
  })
}

/**删除子工艺模板行*/
export function deleteProcessCraftsDe(data) {
  return request({
    url: 'api/gcplan/nodeAndPlm/deleteProcessCraftsDe',
    method: 'post',
    data
  })
}



// 二维码工单
export function getPlanList(params) {
  return request({
    url: 'api/gcplan/qrOrder/findInfo',
    method: 'get',
    params: {
      searchKey: params.searchKey || '', // 模糊搜索
      pg_pagesize: params.pg_pagesize , // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum  // 查询第几页数据，默认第一页
    }
  })
}

/**查询工艺模板*/
export function getHbCraftMode(params) {
  return request({
    url: '/api/gcplan/mesProcessPlan/pageList',
    method: 'get',
    data: {
      processPlanName : params.processPlanName,
      processPlanNumber: params.processPlanNumber,
      pg_pagenum: params.pg_pagenum,
      pg_pagesize: params.pg_pagesize,

    }
  })
}
/**查询工序列表*/
export function queryProduces(params) {
  return request({
    url: '/api/gcplan/mesProcessPlan/queryProduces',
    method: 'get',
    data: {
      gxUid : params.gxUid,
      gxName: params.gxName,
      name:params.name,
      pg_pagenum: params.pg_pagenum,
      pg_pagesize: params.pg_pagesize,

    }
  })
}
/**新增、保存工艺模板*/
export function saveProcess(data) {
  return request({
    url: '/api/gcplan/mesProcessPlan/saveProcess',
    method: 'post',
    data
  })
}

/**查询工序列表*/
export function Produces(params) {
  return request({
    url: '/api/gcplan/mesProcessPlan/procedure',
    method: 'get',
    data: {
      gxUid : params.gxUid,
      gxName: params.gxName,
      pg_pagenum: params.pg_pagenum,
      pg_pagesize: params.pg_pagesize,

    }
  })
}
//保存选择的工序
export function saveProcedure(data) {
  return request({
    url: '/api/gcplan/mesProcessPlan/saveProcedure',
    method: 'post',
    data:data,
  })
}
//工艺模板对应工序查询
export function procedure(params) {
  return request({
    url: '/api/gcplan/mesProcessPlan/procedure',
    method: 'get',
    data:{
      processPlanId:params.processPlanId,
      gxUid:params.gxUid,
      gxName:params.gxName,
      workshopName:params.workshopName,
      workshopNumber:params.workShopNumber,
      pg_pagenum: params.pg_pagenum,
      pg_pagesize: params.pg_pagesize,

    }
  })
}

/**子工艺模板头对应工步**/
export function getWorkContent(params) {
  return request({
    url: '/api/gcplan/nodeAndPlm/getWorkContent',
    method: 'get',
    data:{
      stepId:params.stepId,
      stepCode:params.stepCode,
      stepName:params.stepName,
      pg_pagenum: params.pg_pagenum,
      pg_pagesize: params.pg_pagesize,

    }
  })
}

/**保存工步**/
export function saveWorkContent(data) {
  return request({
    url: '/api/gcplan/nodeAndPlm/saveWorkContent',
    method: 'post',
    data: data
  })
}


/**新增工步*/
export function insertGxUid(data) {
  return request({
    url: 'api/gcplan/nodeAndPlm/insertGxUid',
    method: 'post',
    data:data
  })
}

/**删除工步**/
export function deleteWorkContent(data) {
  return request({
      url: '/api/gcplan/nodeAndPlm/deleteWorkContent',
    method: 'post',
    data: data
  })
}


/**新增、修改工序*/
export function saveGx(data) {
  return request({
    url: 'api/gcplan/nodeAndPlm/saveGx',
    method: 'post',
    data
  })
}

/**删除工序*/
export function deleteGx(data) {
  return request({
    url: 'api/gcplan/nodeAndPlm/deleteGx',
    method: 'post',
    data
  })
}

/**删除工艺模板*/
export function deleteProcessPlan(data) {
  return request({
    url: 'api/gcplan/mesProcessPlan/deleteProcessPlan',
    method: 'post',
    data
  })
}


/**删除工艺模板对应工序*/
export function deleteProcedure(data) {
  return request({
    url: 'api/gcplan/mesProcessPlan/deleteProcedure',
    method: 'post',
    data:data
  })
}

//工位查询
export function productionLine(data) {
  return request({
    url: 'api/gcplan/mesProcessPlan/productionLine',
    method: 'get',
  })
}
