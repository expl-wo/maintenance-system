import request from '@/utils/request'

// 按时间倒序分页查询工序计划列表的简单信息，主用于在下拉列表中显示
export function getPlanSimpleList(params) {
  return request({
    url: '/process/plan/simplelist',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 1000, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      name: params.name || '', // 模糊匹配，工艺计划名称
      number: params.number || '', // 模糊匹配，工艺计划编号
      th: params.th || '' // 模糊匹配，图号
    }
  })
}
// 根据条件筛选出是否含节拍表的工艺计划
export function getPlanSimpleHasBeatList(params) {
  return request({
    url: '/process/plan/simpleBeatList',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 1000, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      name: params.name || '', // 模糊匹配，工艺计划名称
      number: params.number || '', // 模糊匹配，工艺计划编号
      th: params.th || '', // 模糊匹配，图号
      hasBeat: params.hasBeat || ''
    }
  })
}

// 根据工艺计划ID查找包含的工序树
export function getPlanTreeList(params) {
  return request({
    url: '/process/plantree',
    method: 'get',
    params: {
      planId: params.planId // 精确匹配，工艺计划ID
    }
  })
}

export function getSkillLevelByUserId(params) {
  return request({
    url: '/plan/cate/skillLevel',
    method: 'get',
    params: {
      userId: params // 工序所属工艺计划ID
    }
  })
}
export function addSkillLevel(data) {
  return request({
    url: '/plan/cate/skillLevel',
    method: 'post',
    data
  })
}

// 1根据工序ID查找与工序相关的工具列表
export function getProctoolsList(params) {
  return request({
    url: '/process/proctools',
    method: 'get',
    params: {
      procedureId: params.procedureId // 精确匹配，工序ID
    }
  })
}

// 2根据工序ID查找与工序相关的物料列表
export function getProcmaterialsList(params) {
  return request({
    url: '/process/procmaterials',
    method: 'get',
    params: {
      procedureId: params.procedureId // 精确匹配，工序ID
    }
  })
}

// 3根据工序ID查找与工序相关的控制特征列表
export function getProctrlsList(params) {
  return request({
    url: '/process/proctrls',
    method: 'get',
    params: {
      procedureId: params.procedureId // 精确匹配，工序ID
    }
  })
}

// 4根据工序ID查找与工序相关的文档列表
export function getProcfilesList(params) {
  return request({
    url: '/process/procfiles',
    method: 'get',
    params: {
      procedureId: params.procedureId // 精确匹配，工序ID
    }
  })
}

// 据工艺计划ID查找包含的工序树
export function getProcessList(params) {
  return request({
    url: '/process/list',
    method: 'get',
    params: {
      processPlanId: params.processPlanId, // 工序所属工艺计划ID
      name: params.name, // 模糊匹配，工序名称
      number: params.number // 模糊匹配，工序编号
    }
  })
}

// 根据图号查找一个最新的工艺计划
export function getProcessLatest4thList(params) {
  return request({
    url: '/process/plan/latest4th',
    method: 'get',
    params: {
      bomNumber: params.th, // 工序所属工艺计划ID
      th: params.th // 工序所属工艺计划ID
    }
  })
}

// 自动生成节拍排产
export function autoBeatting(data) {
  return request({
    url: '/plan/beattime/autoUsing',
    method: 'post',
    data
  })
}
