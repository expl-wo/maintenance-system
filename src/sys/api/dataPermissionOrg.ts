//部门列表的分页查询
import {Response} from "@/_public/utils/http";
import request from "@/_public/utils/request";
import {transformList2Tree} from "@/_public/utils";
import constants from "@/_public/utils/constants";

function filterTreeData(treeData, resultTree){
    treeData.forEach(item=>{
        if(item.domainDataDisabled !== constants.flag.y){
           const {children,...newItem} = item;
            resultTree.push(newItem);
            if(item.children && item.children.length > 0){
                newItem.children = [];
                filterTreeData(item.children, newItem.children);
            }
        }
    })
    return resultTree.filter(item=>{
        return item.id == constants.department.rootId
    });
}
function formTreeToList(treeData){
    const data = [];
    set(treeData, data);
    function set(formatData, resultData){
        formatData.forEach(item=>{
            resultData.push(item);
            if(item.children && item.children.length > 0){
                set(item.children, resultData);
            }
        })

    }
    return data;
}



export function getTreeList(showAll=true): Promise<Response> {
    return new Promise((resolve, reject) => {
        request({
            url: "/api/admin/dataPermissionOrg/queryList",
            method: 'get',
        }).then(response => {
            response.data.forEach(item=>{
                item.id = item.id + '';
                item.fId = item.fId + '';
            })
            let treeData = transformList2Tree(response.data, 'id', 'fId');
            if(!showAll){
                //如果只显示数据域的部门
                const newTreeData = [];
                treeData = filterTreeData(treeData, newTreeData);
            }
            resolve({
                code: 200,
                msg: '',
                data: treeData
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

export function getDataPermList() {
    return new Promise((resolve, reject) => {
        request({
            url: "/api/admin/dataPermissionOrg/queryList",
            method: 'get',
            data: {
                domainDataDisabled: constants.flag.n
            }
        }).then(response => {
            response.data.forEach(item=>{
                item.id = item.id + '';
                item.fId = item.fId + '';
            })
            let treeData = transformList2Tree(response.data, 'id', 'fId');
            const newTreeData = [];
            treeData = filterTreeData(treeData, newTreeData);
            const listData = formTreeToList(treeData);
            resolve({
                code: 200,
                msg: '',
                data: treeData,
                listData: listData
            });
        }).catch(reason => {
            resolve({
                code: 200,
                msg: '',
                data: [],
                listData: []
            })
        })
    })
}

export function deleteDataPermissionOrg(data){
    return request({
        url: '/api/admin/dataPermissionOrg/deleteById',
        method: 'POST',
        data
    })
}

export function insertOrUpdate(data){
    return request({
        url: '/api/admin/dataPermissionOrg/insertOrUpdate',
        method: 'POST',
        data
    })
}

export function switchById(data){
    return request({
        url: '/api/admin/dataPermissionOrg/switchById',
        method: 'POST',
        data
    })
}