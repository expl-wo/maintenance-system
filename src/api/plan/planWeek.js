import request from '@/utils/request';

const url = {
  //查询生产主计划及其节点GET
  planListWithNodes: '/api/gcplan/productPlan/planListWithNodes',
}

export default {
  url,
  planListWithNodes(params){
    return request({
      url: url.planListWithNodes,
      method: 'get',
      data: params
    })
  }
}
