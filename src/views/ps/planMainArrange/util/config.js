// 算出一年有多少个周，并返回每一同的开始和结束时间
import constants from "@/utils/constants";

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


//根据状态获取颜色样式类
/*计划、开工中 图例正常颜色
暂停 暂停颜色
冻结、取消  灰色
已完工  提前颜色 肯定有进度
工位超上限， 超期*/
/*
cancel: '-100', //已取消
    frozen: '-50', //冻结
    back: '-5',//返工
    waitScheduled: '0',//待排产
    dismantlingPlan: '5',//仅拆解计划
    preScheduling: '10',//预排节点计划
    issuePlan: '15',//已下发计划
    start: '20',//已开工
    finish: '25',//已完工*/

export const getGantClzByStatus = status => {
    if (status == constants.mainPlanStatus.waitScheduled ||
        status == constants.mainPlanStatus.preScheduling ||
        status == constants.mainPlanStatus.dismantlingPlan ||
        status == constants.mainPlanStatus.issuePlan ||
        status == constants.mainPlanStatus.start) { //正常
        return 'normal';
    } else if (status == constants.mainPlanStatus.cancel ||
        status == constants.mainPlanStatus.frozen ||
        status == constants.mainPlanStatus.back) { //暂停
        return 'cellsuspend';
    } else if (status == constants.mainPlanStatus.finish) {//已完工
        return 'celladvance';
    } else { //冻结、取消
        return 'normal'
    }
}
