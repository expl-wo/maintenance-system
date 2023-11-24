import moment from 'moment'
// 算出一年有多少个周，并返回每一同的开始和结束时间
export const mapWeeksOfyear = ({ year, week } = {}) => {
  year = year + ''
  const nowYear = year ? year : moment().year()
  let handleYear = moment(year, 'YYYY/MM/DD')//设置正在处理的年份
  let totalWeeks = handleYear.endOf('year').week()
  if (totalWeeks === 1) {
    totalWeeks = handleYear.endOf('year').subtract(1, 'weeks').week()
  }
  //本周的开始时间
  let nowWeekStartDate = moment().startOf('week').format('YYYY-MM-DD')
  const arr = getWeekNew(nowYear, totalWeeks, nowWeekStartDate)
  return arr
}

function getWeekNew(year, num, nowWeekStartDate) {
  const arr = []
  let startWeekYear = ''
  let startDate = moment(year).week()
  if (startDate === 1) {
    //获取本周第一天
    startWeekYear = moment(year).startOf('weeks')
  } else {
    startWeekYear = moment(year).add(1, 'weeks').startOf('weeks')
  }
  for (let i = 1; i <= num; i++) {
    let startDateTemp = startWeekYear.startOf('week').format('YYYY-MM-DD');
    let endDateTemp = moment(startWeekYear).endOf('week').format('YYYY-MM-DD');
    let obj = {
      value: i,
      name: i + '周',
      nowWeek: nowWeekStartDate === startDateTemp,
      startDate: startDateTemp,
      endDate: endDateTemp
    }
    startWeekYear.add('1', 'week')
    arr.push(obj)
  }
  return arr
}
