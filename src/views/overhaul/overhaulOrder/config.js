const WORK_ORDER_MAP = {
    'waitCheck': {
        value: 1,
        text: '指派项目经理',
        tagType: 'warning'
    },
    'check': {
        value: 2,
        text: '指派组员',
        tagType: ''
    },
    'underway': {
        value: 3,
        text: '工序执行',
        tagType: 'success'
    },
    'finish': {
        value: 4,
        text: '检修报告',
        tagType: 'info'
    },
    'pause': {
        value: 5,
        text: '报告审批',
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
//设备清单列表
const DEVICE_COLUMNS = [
    { type: "selection", width: 50, align: "center" },
    {
        prop: "deviceName",
        label: "设备名称",
        align: "center",
    },
    {
        prop: "model",
        label: "型号",
        align: "center",
    },
    {
        prop: "isUse",
        label: "是否已领用",
        align: "center",
    },
    {
        prop: "user",
        label: "领用人",
        align: "center",
    },
    {
        prop: "useTime",
        label: "领用时间",
        align: "center",
    },
    {
        prop: "operation",
        label: "操作",
        align: "center",
        width: 150,
    },
]
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
        width: 280,
        fixed: "right"
    },
]
//每个流程对应的tab项
const TAB_LIST_MAP = {
    //试验
    experiment:
        [{ label: "工序信息", name: "processInfo", components: "ProcessInfo" },
        { label: "工序问题查看", name: "issueTable", components: "IssueTable" },
        {
            label: "试验作业指导书",
            name: "experimentInstruction",
            components: "TemplateReport",
        },
        {
            label: "试验报告 ",
            name: "experimentReport",
            components: "TemplateReport",
        },
        { label: "录像标记", name: "videoAndImg", components: "videoMark" },
        { label: "标记记录", name: "markRecord", components: "MarkerRecord" }
        ],
    //厂内生产
    factoryCreate: [
        { label: "工序信息", name: "processInfo", components: "ProcessInfo" },
        { label: "工序问题查看", name: "issueTable", components: "IssueTable" },
        {
            label: "拆解作业BOM",
            name: "BomVue",
            components: "BomVue",
        },
        {
            label: "生产作业指导书",
            name: "createInstruction",
            components: "TemplateReport",
        },

        {
            label: "生产作业执行报告",
            name: "createReport",
            components: "TemplateReport",
        },
        { label: "录像标记", name: "videoAndImg", components: "videoMark" },
        { label: "标记记录", name: "markRecord", components: "MarkerRecord" }
    ],
    //厂内拆解
    factoryDismantle: [
        { label: "工序信息", name: "processInfo", components: "ProcessInfo" },
        { label: "工序问题查看", name: "issueTable", components: "IssueTable" },
        {
            label: "施工方案",
            name: "constructionScheme",
            components: "TemplateReport",
        },
        {
            label: "返厂拆解作业指导书",
            name: "returnInstruction",
            components: "TemplateReport",
        },
        {
            label: "厂内拆解BOM",
            name: "BomVue",
            components: "BomVue",
        },
        {
            label: "解体分析报告",
            name: "BreakdownReport",
            components: "TemplateReport",
        },
        { label: "录像标记", name: "videoAndImg", components: "videoMark" },
        { label: "标记记录", name: "markRecord", components: "MarkerRecord" }
    ],
    //现场拆解
    siteDismantle: [
        { label: "工序信息", name: "processInfo", components: "ProcessInfo" },
        { label: "工序问题查看", name: "issueTable", components: "IssueTable" },
        {
            label: "施工方案",
            name: "constructionScheme",
            components: "TemplateReport",
        },
        {
            label: "装运拆解作业指导书",
            name: "operationInstruction",
            components: "TemplateReport",
        },
        {
            label: "设备清单",
            name: "deviceList",
            components: "DeviceList",
        },

        {
            label: "拆解BOM",
            name: "BomVue",
            components: "BomVue",
        },
        {
            label: "返厂清单",
            name: "returnList",
            components: "ReturnList",
        },
        {
            label: "现场拆解报告",
            name: "siteDisassemblyReport",
            components: "TemplateReport",
        },
        { label: "录像标记", name: "videoAndImg", components: "videoMark" },
        { label: "标记记录", name: "markRecord", components: "MarkerRecord" }
    ],
    //现场检修，
    siteOverhaul: [
        { label: "工序信息", name: "processInfo", components: "ProcessInfo" },
        { label: "工序问题查看", name: "issueTable", components: "IssueTable" },
        {
            label: "施工方案",
            name: "constructionScheme",
            components: "TemplateReport",
        },
        {
            label: "现场检修作业指导书",
            name: "operationInstruction",
            components: "TemplateReport",
        },
        {
            label: "设备清单",
            name: "deviceList",
            components: "DeviceList",
        },
        {
            label: "现场检修试验报告",
            name: "testInstruction",
            components: "TemplateReport",
        },
        {
            label: "现场检修竣工报告",
            name: "finishReport",
            components: "TemplateReport",
        },
        { label: "录像标记", name: "videoAndImg", components: "videoMark" },
        { label: "标记记录", name: "markRecord", components: "MarkerRecord" }
    ],
    //现场勘探
    surveyItem: [
        { label: "工序信息", name: "processInfo", components: "ProcessInfo" },
        { label: "工序问题查看", name: "issueTable", components: "IssueTable" },
        { label: "勘查报告", name: "report", components: "TemplateReport" },
        { label: "录像标记", name: "videoAndImg", components: "VideoMark" },
        { label: "标记记录", name: "markRecord", components: "MarkerRecord" },
    ],
    //返厂检修-检修报告
    finishReport: [
        { label: "检修报告", name: "factoryFinishReport", components: "TemplateReport" },
    ]
}
// 返厂清单表格项
const RETURN_COLUMNS = [
    {
        prop: "id",
        label: "序号",
        align: "center",
        width: 50
    },
    {
        prop: "productNumber",
        label: "生产号",
        align: "center",
    },
    {
        prop: "materialName",
        label: "物料名称",
        align: "center",
    },
    {
        prop: "pipelineCode",
        label: "父节点流水码",
        align: "center",
    },
    {
        prop: "classifyName",
        label: "父节点分类名",
        align: "center",
    },
    {
        prop: "status",
        label: "状态",
        align: "center",
        width: 100,
    },
    {
        prop: "demo",
        label: "复核备注信息",
        align: "center",
    },
    {
        prop: "operation",
        label: "操作",
        align: "center",
        width: 150,
    },
]
/**
 * BOM复核状态
 */
const BOM_STATUS = {
    1: "未复核",
    2: "已复核",
    3: "复核不通过"
}
const COMMON_FORMAT = "yyyy-MM-dd HH:mm:ss" //统一时间格式
export {
    WORK_ORDER_MAP,
    WORK_ORDER_STATUS,
    PROCESS_COLUMNS_MAP,
    DEVICE_COLUMNS,
    ORDER_COLUMNS,
    TAB_LIST_MAP, //工序的tab相关枚举
    RETURN_COLUMNS,
    BOM_STATUS,
    COMMON_FORMAT
};