export default {
  getNormalColumnList(){
    return [{
      label: '生产号',
      property: 'productNo'
    }, {
      label: '设计型号',
      property: 'model'
    }, {
      label: '产值',
      property: 'noTaxAmount'
    }, {
      label: '产量',
      property: 'outPut'
    }, {
      label: '产品期量',
      property: 'timeLimitName'
    }, {
      label: '生产车间(装配)',
      property: 'workShop'
    }, {
      label: '图号',
      property: 'drawingNo'
    }, {
      label: '设计来源',
      property: 'designSource'
    }, {
      label: '用户单位',
      property: 'customerName'
    }, {
      label: '台量',
      property: 'count'
    }, {
      label: '状态',
      property: 'stateName'
    }, {
      label: '重点性',
      property: 'importmentLevel'
    }, {
      label: '紧急性',
      property: 'urgentLevel'
    }, {
      label: '实际进度',
      property: 'processStatus'
    }, {
      label: '厂内开工时间',
      property: 'actualStartTime'
    }, {
      label: '计划生产完工时间',
      property: 'planCompletime'
    },{
      label: '厂内完工时间',
      property: 'dateEnd'
    }, {
      label: '企管部批复',
      property: 'orderIssuedTime'
    }, {
      label: '是否返修',
      property: 'isRepair'
    },{
      label:'生产完工时间',
      property:'completionTime'
    }]
  }
}
