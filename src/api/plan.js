import request from '@/utils/request';
//获取节点数据
export function findAllNode(params) {
  return request({
    url: '/api/gcplan/nodeBasic/queryAllNode',
    method: 'get',
    params: {
      type: params.type,
      workshopName: params.workshopName,
      name: params.name,
      pg_pagenum: params.pg_pagenum,
      pg_pagesize: params.pg_pagesize,
    }
  })
}
