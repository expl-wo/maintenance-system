import moment from 'moment'
// 算出一年有多少个周，并返回每一同的开始和结束时间
export const mapWeeksOfyear = ({year, week} = {}) => {
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


/*冻结       -2
已取消     -1
待排产      0
粗排        1
已下发      2
生成工序计划 3
已开工      10
已完工      4*/
//根据状态获取颜色样式类
/*计划、开工中 图例正常颜色
暂停 暂停颜色
冻结、取消  灰色
已完工  提前颜色 肯定有进度
工位超上限， 超期*/

export const getGantClzByStatus = status => {
    if (status == '0' || status == '1' || status == '10' || status == '2') { //正常
        return 'normal';
    } else if (status == '-1') { //暂停
        return 'cellsuspend';
    } else if (status == '4') {//已完工
        return 'celladvance';
    } else if (status == '20') {//工位超上限
        return 'cellalarm'
    } else if (status == '-2') { //冻结、取消
        return 'cellsuspend'
    }
}
