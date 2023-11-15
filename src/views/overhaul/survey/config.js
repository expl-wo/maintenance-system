const WORK_ORDER_MAP = {
    'waitCheck': {
        value: 1,
        text: '待审批',
        tagType: 'warning'
    },
    'check': {
        value: 2,
        text: '申请中',
        tagType: ''
    },
    'underway': {
        value: 3,
        text: '勘查中',
        tagType: 'success'
    },
    'finish': {
        value: 4,
        text: '勘察结束',
        tagType: 'info'
    },
    'pause': {
        value: 5,
        text: '暂停',
        tagType: 'danger'
    },
}
const WORK_ORDER_STATUS = {}
Object.values(WORK_ORDER_MAP).forEach(item => (WORK_ORDER_STATUS[item.value] = { text: item.text, tagType: item.tagType })); //处理状态数据

// 现场勘查表格项
const PROCESS_COLUMNS_MAP = {
    //工序
    1: [
        {
            prop: "measureName",
            label: "标准工序名称",
        },
        {
            prop: "measureCode",
            label: "标准工序编号",
        },
        {
            prop: "measure",
            label: "标准要求",
        },
        {
            prop: "groupLeader",
            label: "组长",
        },
        {
            prop: "assistantGroupLeader",
            label: "副组长",
        },
        {
            prop: "members",
            label: "成员",
        },
        {
            prop: "finishStatus",
            label: "完工状态",
        },
        {
            prop: "approvalStatus",
            label: "复核状态",
        },
        {
            prop: "process",
            label: "工序进度",
        },
        {
            prop: "startTime",
            label: "开工时间",
        },
        {
            prop: "endTime",
            label: "完工时间",
        },
        {
            prop: "operation",
            label: "操作",
            width: 150,
        },
    ],
    //子工序头
    2: [
        {
            prop: "subProcessName",
            label: "子工序名头称",
        },
        {
            prop: "groupLeader",
            label: "组长",
        },
        {
            prop: "assistantGroupLeader",
            label: "副组长",
        },
        {
            prop: "members",
            label: "成员",
        },
        {
            prop: "process",
            label: "子工序行完成度",
        },
        {
            prop: "finishStatus",
            label: "完工状态",
        },
        {
            prop: "approvalStatus",
            label: "复核状态",
        },
        {
            prop: "operation",
            label: "操作",
            width: 150,
        },
    ],
    //子工序行
    3: [
        {
            prop: "processRowName",
            label: "子工序行名称",
        },
        {
            prop: "groupLeader",
            label: "组长",
        },
        {
            prop: "assistantGroupLeader",
            label: "副组长",
        },
        {
            prop: "members",
            label: "成员",
        },
        {
            prop: "frequency",
            label: "频次",
        },
        {
            prop: "finishStatus",
            label: "当前状态",
        },
        {
            prop: "approvalStatus",
            label: "复核状态",
        },
        {
            prop: "operation",
            label: "操作",
            width: 150,
        },
    ]
}
//工单列表
const ORDER_COLUMNS = [
    { type: "selection", width: 50, align: "center" },
    {
        prop: "prodNumber",
        label: "生产号",
        align: "center",
        width: 110,
    },
    {
        prop: "prodCategory",
        label: "产品大类",
        align: "center",
        width: 110,
    },
    {
        prop: "voltageLevel",
        label: "电压等级",
        align: "center",
        width: 110,
    },
    {
        prop: "projName",
        label: "项目名称",
        align: "center",
        width: 110,
    },
    {
        prop: "accountName",
        label: "账套",
        align: "center",
        width: 110,
    },
    {
        prop: "orderStatus",
        label: "状态",
        align: "center",
        width: 100,
    },
    {
        prop: "handlerName",
        label: "当前处理人",
        align: "center",
        width: 110,
    },
    {
        prop: "summitterName",
        label: "提交人",
        align: "center",
        width: 110,
    },
    {
        prop: "planStartTime",
        label: "计划开始时间",
        sortable: true,
        align: "center",
        width: 180,
    },
    {
        prop: "planEndTime",
        label: "计划完成时间",
        sortable: true,
        align: "center",
        width: 180,
    },
    {
        prop: "actualStartTime",
        label: "实际开始时间",
        sortable: true,
        align: "center",
        width: 180,
    }, {
        prop: "actualEndTime",
        label: "实际完成时间",
        sortable: true,
        align: "center",
        width: 180,
    },
    {
        prop: "operation",
        label: "操作",
        align: "center",
        width: 300,
        fixed: "right"
    },
]
export {
    WORK_ORDER_MAP,
    WORK_ORDER_STATUS,
    PROCESS_COLUMNS_MAP,
    ORDER_COLUMNS,
};