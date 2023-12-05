import request from '@/utils/request'

// 日工作模板查询
export function getDailyWorkTempList() {
  return request({
    url: '/api/gcplan/factoryCalendar/dailyWorkTemp',
    method: 'get'
  })
}

// 日工作模板新增编辑
export function getDailyWorkTempUpdate(data) {
    return request({
        url: '/api/gcplan/factoryCalendar/dailyWorkTemp',
        method: 'POST',
        data
    })
}

// 日工作模板逻辑删除
export function deleteDailyWorkTemp(data) {
    return request({
        url: '/api/gcplan/factoryCalendar/dailyWorkTemp',
        method: 'DELETE',
        data
    })
}

// 日工作模板时间查询
export function getTempTimeList(params) {
    return request({
        url: '/api/gcplan/factoryCalendar/tempTime',
        method: 'get',
        data: {
            tempId: params.tempId || '' // 模板主键id
        }
    })
}

// 日工作模板时间新增编辑
export function getTempTimeUpdate(data) {
    return request({
        url: '/api/gcplan/factoryCalendar/tempTime',
        method: 'POST',
        data
    })
}

// 日工作模板时间逻辑删除
export function deleteTempTime(data) {
    return request({
        url: '/api/gcplan/factoryCalendar/deletetempTime',
        method: 'POST',
        data
    })
}

// 月工作模板快速设定
export function getQuickSetCalendarUpdate(data) {
    return request({
        url: '/api/gcplan/factoryCalendar/quickSetCalendar',
        method: 'POST',
        data
    })
}

// 月工作模板查询(没绑定模板的日期不会展示)
export function getCalendarTempList(params) {
    return request({
    url: '/api/gcplan/factoryCalendar/calendarTemp',
        method: 'get',
        data: {
            date: params.date || '', // 月份，格式:yyyy-MM，其余格式验证不通过
            type: params.type
        }
    })
}

// 月工作模板修改
export function getCalendarTempUpdate(data) {
    return request({
        url: '/api/gcplan/factoryCalendar/calendarTemp',
        method: 'POST',
        data
    })
}


// 月工作模板删除
export function deleteCalendarTemp(data) {
    return request({
        url: '/api/gcplan/factoryCalendar/calendarTemp',
        method: 'DELETE',
        data
    })
}

// 产线月工作模板查询(没绑定模板的日期不会展示)
export function getPLCalendarTempList(params) {
    return request({
        url: '/api/gcplan/pLCalendar/pLCalendarTemp',
        method: 'get',
        data: {
            productLineId: params.productLineId || '', // 产线id
            date: params.date || '' // 月份，格式:yyyy-MM，其余格式验证不通过
        }
    })
}

// 产线月工作模板删除
export function deletePLCalendarTemp(data) {
    return request({
        url: '/api/gcplan/pLCalendar/pLCalendarTemp',
        method: 'DELETE',
        data
    })
}

// 产线日历月工作模板修改
export function getPLCalendarTempUpdate(data) {
    return request({
        url: '/api/gcplan/pLCalendar/pLCalendarTemp',
        method: 'POST',
        data
    })
}

// 产线日历月工作模板快速设定
export function getQuickSetPLCalendarUpdate(data) {
    return request({
        url: '/api/gcplan/pLCalendar/quickSetPLCalendar',
        method: 'POST',
        data
    })
}

// 日历组织类型
export function calendarType(data) {
  return request({
    url: '/api/gcplan/factoryCalendar/calendarType',
    method: 'GET',
    data
  })
}

