import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'

// 分页获取物料列表(查询)
export function getMaterialList(params) {
  return request({
    url: '/materialbom/material',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      name: params.name || '', // 模糊匹配，物料名称
      number: params.number || '', // 模糊匹配，物料编号
      kggKeyPart: params.kggKeyPart || '', // 精确匹配，（1是  0否），是否开关柜关键件
      dqKeyPart: params.dqKeyPart || '', // 精确匹配，（1是  0否），是否电气关键件
      bbKeyPart: params.bbKeyPart || '' // 精确匹配，（1是  0否），是否本部关键件
    }
  })
}

// 分页查询父节点为空的BOM根节点
export function getMaterialTopBomList(params) {
  return request({
    url: '/materialbom/topbom',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 10, // 每页显示多少条数据，默认为10条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      name: params.name || '', // 模糊匹配，物料名称
      number: params.number || '' // 模糊匹配，物料编号
    }
  })
}

// 分页查询指定父节点的BOM直属子节点
export function getMaterialDirectsubbomList(params) {
  return request({
    url: '/materialbom/directsubbom',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 100, // 每页显示多少条数据，为了尽量显示完整，默认为100条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      name: params.name || '', // 模糊匹配，需查找的BOM直属子物料名称
      number: params.number || '' // 精确匹配，BOM节点的编号值
    }
  })
}

// 查询所有物料分类
export function getMaterialCatesList(params) {
  return request({
    url: '/materialbom/material/cates',
    method: 'get',
    params: {
      clazzCode: params.clazzCode || '', // 分类编号，模糊匹配
      clazzName: params.clazzName || '' // 分类名称，模糊匹配
    }
  })
}

export function findDrawingList(params) {
  console.log(params)
  return request({
    url: '/downDrawing/findNumber',
    method: 'get',
    params: {
      pg_pagesize: params.pg_pagesize || 100, // 每页显示多少条数据，为了尽量显示完整，默认为100条
      pg_pagenum: params.pg_pagenum || 1, // 查询第几页数据，默认第一页
      productNo: params.productNo || '' // 模糊匹配生产号、柜号、项目名
    }
  })
}

export function findDrawingPath(data) {
  return request({
    url: '/downDrawing/findDrawingPath',
    method: 'POST',
    data
  })
}
export function downFile(params) {
  return axios({
    url: process.env.VUE_APP_BASE_API + '/downFile',
    timeout: 30000, // 请求超时时间10s
    headers: {
      // 'Content-Type': 'application/x-zip-compressed',
      'token': getToken()
    },
    xhrFields: {
      withCredentials: true
    },
    method: 'get',
    params: {
      path: params.path
    },
    responseType: 'blob'
  })
}
