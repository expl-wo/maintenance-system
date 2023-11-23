import scss from '@/styles/variables.scss'
export default {
  getSimpleProgressData(){
    return [{
      progressStatus: 5,
      clz: 'Plan',
      color: scss.Plan,
      label: '计划'
    },{
      progressStatus: 10,
      clz: 'Start',
      color: scss.Start,
      label: '开工'
    },{
      progressStatus: 20,
      clz: 'Finished',
      color: scss.Finished,
      label: '完工'
    },{
      progressStatus: 20,
      clz: 'defaultColor',
      color: scss.defaultColor,
      label: '其它'
    }]
  },
  getProgressData() {
    return [{
      progressStatus: 5,
      clz: 'Plan',
      color: scss.Plan,
      label: '计划'
    },{
      progressStatus: 10,
      clz: 'Start',
      color: scss.Start,
      label: '开工'
    },{
      progressStatus: 20,
      clz: 'Finished',
      color: scss.Finished,
      label: '完工'
    },{
      progressStatus: 20,
      clz: 'overDueUnfinished',
      status: -1,
      color: scss.overDueUnfinished,
      label: '超期未完工'
    },{
      progressStatus: -3,
      clz: 'Cancel',
      color: scss.Cancel,
      label: '已取消'
    },{
      progressStatus: -1,
      clz: 'Back',
      color: scss.Back,
      label: '返工'
    },{
      progressStatus: 0,
      clz: 'Normal',
      color: scss.Normal,
      label: '未生成任务'
    },{
      progressStatus: 3,
      clz: 'HaveGx',
      color: scss.HaveGx,
      label: '已生成任务'
    },{
      progressStatus: 4,
      clz: 'Suspended',
      color: scss.Suspended,
      label: '暂停'
    },{
      progressStatus: 15,
      clz: 'Report',
      color: scss.Report,
      label: '仅报工'
    },]
  }
}

/*  //生产单状态颜色字段
  $Plan: #42abfa; //计划  5
  $Start: #0000fe; //开工 10
  $Finished: #00ff7f; //完工  20
  $overDueUnfinished: #fe4401; //超期未完工  status为-1  progressStatus不等于完工20

  $Cancel:#000000;//已取消 -3
  $Back: #ff00fe; //返工 -1
  $Normal: #b0c4dd; //未生成任务 0
  $HaveGx: #708090; //已生成任务 3
  $Suspended: #fea501; //暂停  4
  $Report: #326f8e; //仅报工 15
   */

