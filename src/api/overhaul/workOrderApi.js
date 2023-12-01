import request from '@/utils/request'
//添加勘查工单
export function addWorkOrder(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-order/add',
        method: 'post',
        data
    })
}
//编辑
export function editWorkOrder(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-order/edit',
        method: 'post',
        data
    })
}
//根据ID查询工单详情
export function findWorkOrder(id) {
    return request({
        url: '/api/evo-ims-overhaul/work-order/find',
        method: 'get',
        data: { id }
    })
}
//获取产品大类 
export function getProdCategory() {
    return request({
        url: '/api/evo-ims-overhaul/work-order/product-type',
        method: 'get'
    })
}
//分页获取工单
export function getWorkOrderPage(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-order/page',
        method: 'post',
        data
    })
}
//批量删除工单
export function batchDelWorkOrder(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-order/batch-delete',
        method: 'post',
        data
    })
}
//设置工单状态
export function setWorkOrderStatus(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-order/set-status',
        method: 'post',
        data
    })
}
//获取工序信息分页
export function getWorkInfoPage(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-procedure/page-info',
        method: 'post',
        data
    })
}
//保存工序节点信息
export function saveTreeInfo(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-procedure/tree-save',
        method: 'post',
        data
    })
}
//工单绑定模板 
export function bindTreeTemplate(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-procedure/bind-template',
        method: 'post',
        data
    })
}
//查询工序树
export function getWorkTree(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-procedure/tree-info',
        method: 'post',
        data
    })
}
//分页查询检修工序列表
export function getWorkList(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-procedure/page-info',
        method: 'post',
        data
    })
}
//绑定视频
export function bindDev(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-procedure/binding-dev-channel',
        method: 'post',
        data
    })
}
//工序复核人员
export function bindReview(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-procedure/binding-review-info',
        method: 'post',
        data
    })
}
//工序信息绑定
export function bindDispatch(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-procedure/binding-dispatch',
        method: 'post',
        data
    })
}
//绑定大件设备 
export function bindBigComponent(data) {
    return request({
        url: '/api/evo-ims-overhaul/middle-big-equipment/report-use',
        method: 'post',
        data
    })
}
//获取大件设备 
export function getBigComponent(middleId) {
    return request({
        url: '/api/evo-ims-overhaul/middle-big-equipment/query',
        method: 'get',
        data: { middleId }
    })
}
//获取大件设备清单
export function getBigComponentList(data) {
    return request({
        url: '/api/evo-ims-overhaul/middle-big-equipment/query-use',
        method: 'get',
        data
    })
}
//工序发起OA审核 
export function oAExamine(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-procedure/oa-examine',
        method: 'post',
        data
    })
}
//根据文档类型查询文档模板
export function getWorkDocmentTemplate(type) {
    return request({
        url: '/api/evo-ims-overhaul/template-manage/query-by-type',
        method: 'get',
        data: { type }
    })
}
//获取文档信息
export function getWorkDocmentInfo(data) {
    return request({
        url: '/api/evo-ims-overhaul/doc-info/relation',
        method: 'post',
        data
    })
}
//选择模板生成PDF
export function createPDF(data) {
    return request({
        url: '/api/evo-ims-overhaul/doc-info/loading',
        method: 'post',
        config: { responseType: 'blob', timeout: 100000 },
        data
    })
}
//保存工序文档
export function saveWorkDocmentInfo(data) {
    return request({
        url: '/api/evo-ims-overhaul/doc-info/save',
        method: 'post',
        data,
        config: {
            timeout: 100000
        }
    })
}
//下载工序文档
export function downloadWorkDocmentInfo(data) {
    return request({
        url: '/api/evo-ims-overhaul/doc-info/download',
        method: 'post',
        data
    })
}
//上传工序文档
export function uploadWorkDocmentInfo(data) {
    return request({
        url: '/api/evo-ims-overhaul/doc-info/upload',
        method: 'post',
        data,
        config: {
            timeout: 100000
        }
    })
}
//审核文档信息
export function checkWorkDocmentInfo(data) {
    return request({
        url: '/api/evo-ims-overhaul/doc-info/oa-examine',
        method: 'post',
        data
    })
}
//获取商机列表
export function getBusinessOrderList(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-order/niche-list',
        method: 'post',
        data
    })
}

//获取勘查工单模板
export function getProcedureTemplate(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-order/work-procedure-template',
        method: 'post',
        data
    })
}
//工序指派
export function dispatchWorkOrder(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-order/process-appoint',
        method: 'post',
        data
    })
}
//获取派工(工序指派)信息
export function getAppiontInfo(data) {
    return request({
        url: '/api/evo-ims-overhaul/work-order/query-appoint',
        method: 'post',
        data
    })
}