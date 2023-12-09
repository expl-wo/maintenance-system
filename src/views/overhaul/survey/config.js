import { COMMOM_WORK_ORDER_MAP } from '@/views/overhaul/constants.js';
//勘查工单时间轴
const TIME_LINE = [
    {
        content: "创建工单",
        timestamp: "",
        otherInfo: "",
        processState: 1,
        isActive: true,
    },
    {
        content: "审批完成",
        timestamp: "",
        otherInfo: "",
        processState: 2,
        isActive: true,
    },
    {
        content: "指派项目经理",
        timestamp: "",
        otherInfo: "",
        processState: 3,
        isActive: true,
    },
    {
        content: "指派组员",
        timestamp: "",
        otherInfo: "",
        isActive: true,
        processState: 4,
    },
    {
        content: "现场勘查",
        timestamp: "",
        otherInfo: "",
        isActive: true,
        processState: 5,
    },
    {
        content: "勘查报告",
        timestamp: "",
        otherInfo: "",
        isActive: false,
        processState: 6,
    },
    {
        content: "报告审批",
        timestamp: "",
        otherInfo: "",
        isShowLine: false,
        processState: 7,
        isActive: false,
    }
]
//勘查工单对应的工单状态
const WORK_ORDER_MAP = {
    'createOrder': {
        value: 1,
        text: '创建工单',
        tagType: ''
    },
    'check': {
        value: 2,
        text: '审批完成',
        tagType: 'success'
    },
    'underway': {
        value: 5,
        text: '现场勘查',
        tagType: ''
    },
    'surveyReport': {
        value: 6,
        text: '勘查报告',
        tagType: 'success'
    },
    'checkReport': {
        value: 7,
        text: '报告审批',
        tagType: 'success'
    },
    ...COMMOM_WORK_ORDER_MAP
}
const WORK_ORDER_STATUS = {}
Object.values(WORK_ORDER_MAP).forEach(item => (WORK_ORDER_STATUS[item.value] = { text: item.text, tagType: item.tagType })); //处理状态数据

//工单列表
const ORDER_COLUMNS = [
    { type: "selection", width: 30 },
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
        width: 130,
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
        sortable: 'custom',
        align: "center",
        width: 180,
    },
    {
        prop: "planEndTime",
        label: "计划完成时间",
        sortable: 'custom',
        align: "center",
        width: 180,
    },
    {
        prop: "actualStartTime",
        label: "实际开始时间",
        sortable: 'custom',
        align: "center",
        width: 180,
    }, {
        prop: "actualEndTime",
        label: "实际完成时间",
        sortable: 'custom',
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
    ORDER_COLUMNS,
    TIME_LINE
};