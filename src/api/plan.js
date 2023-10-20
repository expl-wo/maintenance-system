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
