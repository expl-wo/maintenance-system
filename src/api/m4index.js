import request from '@/utils/request'

const outTmpToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJBOTUzMDUyODc5REU1MUU1RjdFNEIyQjM5MTkzMDY5RUVEQTM5RkNCQ0VDNDREQjZDNkI5MTZBOTU5QzBCRjY1IiwibGduVGltZSI6IjIwMjUtMTItMzAgMDA6MDA6MDAiLCJleHAiOjE3ODkzMTkzNjl9.FdqAq-QyEhAqgSbjPG5KOTuEzeQTl-IWump2rqP2j1I';

// 获取则线图
export function getLine(params) {
  return request({
    url: '/statistics/mesorder/monthamount4year',
    method: 'get',
    params:{
      startYearMonth:params.startYearMonth,
      endYearMonth:params.endYearMonth
    }
  })
}

// 获取柱状图
// export function getBar(params) {
//   return request({
//     url: '/statistics/workTime/clazzWorkTime',
//     method: 'get',
//     params:{
//       month:params
//     }
//   })
// }
export function getBar(params) {
  return request({
    url: '/statistics/workTime/HBClazzWorkTime',
    method: 'get',
    params:{
      month:params
    }
  })
}

// 获取饼图
export function getPie(params) {
  return request({
    url: '/statistics/andon/countByMonth',
    method: 'get',
    params:{
      month:params
    }
  })
}


// 获取则线图
export function getLineOut(params) {
  return request({
    url: '/statistics/mesorder/monthamount4year',
    method: 'get',
    params:{
      tmptoken: outTmpToken,
      startYearMonth:params.startYearMonth,
      endYearMonth:params.endYearMonth
    }
  })
}

// 获取柱状图
export function getBarOut(params) {
  return request({
    url: '/statistics/workTime/clazzWorkTime',
    method: 'get',
    params:{
      tmptoken: outTmpToken,
      month:params
    }
  })
}

// 获取饼图
export function getPieOut(params) {
  return request({
    url: '/statistics/andon/countByMonth',
    method: 'get',
    params:{
      tmptoken: outTmpToken,
      month:params
    }
  })
}
