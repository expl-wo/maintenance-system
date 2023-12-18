import request from '@/utils/request';

const url = {
    //更新工单属性
    propertySet: '/api/gcplan/mesOrder/propertySet',
}

export default {
    url,
    propertySet(params) {
        return request({
            url: url.propertySet,
            method: 'post',
            data: params
        })
    },
}

