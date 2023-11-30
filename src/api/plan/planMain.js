import request from '@/utils/request';

const url = {
    //查询生产主计划及其节点GET
    planListWithNodes: '/api/gcplan/productPlan/planListWithNodes',
    //计划申请
    applayPlan: '/api/gcplan/productPlan/compilation/applayPlan',
    //计划审批
    approvePlan: '/api/gcplan/productPlan/compilation/approvePlan',
	getOpInfo:'/api/gcplan/productPlan/getOpInfo',
	editNodePlan:'/api/gcplan/productPlan/compilation/editNodePlan',
}

export default {
    url,
    planListWithNodes(params) {
        return request({
            url: url.planListWithNodes,
            method: 'post',
            data: params
        })
    },
    applayPlan(params){
        return request({
            url: url.applayPlan,
            method: 'post',
            data: params
        })
    },
    approvePlan(params){
        return request({
            url: url.approvePlan,
            method: 'post',
            data: params
        })
    },
	getOpInfo(params){
		return request({
		    url: url.getOpInfo,
		    method: 'get',
		    data: params
		})
	},
	editNodePlan(params){
		return request({
		    url: url.editNodePlan,
		    method: 'post',
		    data: params
		})
	},
}

