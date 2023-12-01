import qs from 'qs'
import request from '@/utils/request'

// ----------------文档模板

// 查询模板库列表（包含安全须知）
export function getTemplateData(params) {
  return request({
    url: `/evo-ims-overhaul/template-manage/query-by-type?${qs.stringify(params)}`,
    method: 'get'
  })
}
// 查询模板库列表（不包含安全须知）
export function getTempData(params) {
  return request({
    url: `/evo-ims-overhaul/template-manage/query-by-condition?${qs.stringify(params)}`,
    method: 'get'
  })
}
// 根据id查询模板详情
export function getTemplateById(params) {
  return request({
    url: `/evo-ims-overhaul/template-manage/query-by-id?${qs.stringify(params)}`,
    method: 'get'
  })
}
// 查询模板类型数据
export function getTemplateTypeList(params) {
  return request({
    url: `/evo-ims-overhaul/template-manage/query-doc-type`,
    method: 'get'
  })
}
// 修改模板
export function addOrEditTemplate(data) {
  return request({
    url: `/evo-ims-overhaul/template-manage/create-or-update`,
    method: 'post',
    data
  })
}
// 查询模板库列表
export function getTemplateList(params) {
  return request({
    url: `/evo-ims-overhaul/template-manage/query-by-condition?${qs.stringify(params)}`,
    method: 'get'
  })
}
// 删除模板
export function deleteTemplate(params) {
  return request({
    url: `/evo-ims-overhaul/template-manage/delete?${qs.stringify(params)}`,
    method: 'delete'
  })
}

// ----------------设备清单模板相关

// 查询设备清单模板
export function getDeviceTempList(params) {
  return request({
    url: `/evo-ims-overhaul/device-list-template/page?${qs.stringify(params)}`,
    method: 'get'
  })
}
// 获取设备类型选项
export function getDeviceType() {
  return request({
    url: `/evo-ims-overhaul/device-list-template/device-model`,
    method: 'get'
  })
}
// 获取设备编码选项
export function getDeviceModel(params) {
  return request({
    url: `/evo-ims-overhaul/device-list-template/device-model-id?${qs.stringify(params)}`,
    method: 'get'
  })
}
// 新增设备清单模板
export function addDeviceTemp(data) {
  return request({
    url: `/evo-ims-overhaul/device-list-template/save`,
    method: 'post',
    data
  })
}
// 根据id查询设备模板详情
export function getDeviceTempById(params) {
  return request({
    url: `/evo-ims-overhaul/device-list-template/query?${qs.stringify(params)}`,
    method: 'get'
  })
}
// 删除设备清单模板
export function delDeviceTemp(params) {
  return request({
    url: `/evo-ims-overhaul/device-list-template/delete-temple?${qs.stringify(params)}`,
    method: 'delete'
  })
}

// ----------------拆解BOM模板
// 
export function getDrawingNoList(data) {
  return request({
    url: `/evo-ims-overhaul/device-list-template/save`,
    method: 'post',
    data
  })
}
// 查询型号列表
export function getModelList(data) {
  return request({
      url: '/evo-ims-overhaul/work-order/time-limit-model',
      method: 'post',
      data: data
  })
}
// 查询已绑定的型号列表
export function getUsedModelList(params) {
  return request({
      url: `/evo-ims-overhaul/bom-template/used-model?${qs.stringify(params)}`,
      method: 'get'
  })
}
//获取大部件
export function getBigComponent(data) {
  return request({
      url: '/evo-ims-overhaul/work-order/plm-big-component',
      method: 'post',
      data: data
  })
}
//获取物料类别 
export function getMaterial(data) {
  return request({
      url: '/evo-ims-overhaul/work-order/wms-material-class',
      method: 'post',
      data: data
  })
}
// 获取BOM模板分页数据
export function getBomTemplateList(data) {
  return request({
    url: `/evo-ims-overhaul/bom-template/page`,
    method: 'post',
    data
  })
}
// 新增BOM模板
export function addOrUpdateBomTemplate(data) {
  return request({
    url: `/evo-ims-overhaul/bom-template/add-or-update`,
    method: 'post',
    data
  })
}
// 复制BOM模板
export function copyBomTemplate(data) {
  return request({
    url: `/evo-ims-overhaul/bom-template/clone`,
    method: 'post',
    data
  })
}
// 删除BOM模板
export function deleteBomTemplate(data) {
  return request({
    url: `/evo-ims-overhaul/bom-template/batch-delete`,
    method: 'post',
    data: data.id
  })
}
// 根据模板ID查询BOM模板详情
export function getBomTemplateById(params) {
  return request({
    url: `/evo-ims-overhaul/bom-template/find?${qs.stringify(params)}`,
    method: 'get'
  })
}
// BOM树添加节点
export function addBomTreeNode(data) {
  return request({
    url: `/evo-ims-overhaul/bom-template/tree/add`,
    method: 'post',
    data
  })
}
// BOM树编辑节点
export function editBomTreeNode(data) {
  return request({
    url: `/evo-ims-overhaul/bom-template/tree/edit`,
    method: 'post',
    data
  })
}
// BOM树删除节点
export function deleteBomTreeNode(data) {
  return request({
    url: `/evo-ims-overhaul/bom-template/tree/delete`,
    method: 'post',
    data
  })
}
