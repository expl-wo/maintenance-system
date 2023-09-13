import request from '@/_public/utils/request'
import {transformList2Tree} from '@/_public/utils/index'
import {Response} from "@/_public/utils/http";

//部门列表的分页查询
export function getOrganizationList(): Promise<Response> {
    return new Promise((resolve, reject) => {
        request({
            url: "/api/admin/department/queryList",
            method: 'get',
        }).then(response => {
            response.data.forEach(item=>{
                item.id = item.id + '';
                item.fid = item.fid + '';
            })
            const treeData = transformList2Tree(response.data, 'id', 'fid');
          /*  const resultData = treeData.find(item => {
                return item.id == '21';
            })*/
            resolve({
                code: 200,
                msg: '',
                data: treeData
                // data: [resultData]
            });
        }).catch(reason => {
            resolve({
                code: 200,
                msg: '',
                data: []
            })
        })
    })
}

//查询部门详情
export function getOrganizationDetail(departmentId) {
    return request({
        url: "/api/admin/department/detail",
        method: 'get',
        data: {
            departmentId
        }
    });
}

export function syncZhglDepart(){
    return request({
        url: "/api/admin/init/department",
        method: 'get',
    });
}

export function getProductDepartList(){
    return request({
        url: "/api/admin/department/queryProductDepartList",
        method: 'get',
    });
}

export function updateZhglDepart(){
    return request({
        url: "/api/admin/init/updateDepartment",
        method: 'get',
    });
}

