import { COMMOM_WORK_ORDER_MAP } from '@/views/overhaul/constants.js';
//检修工单对应的状态
const WORK_ORDER_MAP = {
    'createOrder': {
        value: 1,
        text: '创建工单',
        tagType: ''
    },
    'workExecution': {
        value: 8,
        text: '工序执行',
        tagType: ''
    },
    'completionReport': {
        value: 9,
        text: '竣工报告',
        tagType: 'warning'
    },
    'checkCompletionReport': {
        value: 10,
        text: '竣工报告审批',
        tagType: 'success'
    },
    'siteDismantle': {
        value: 11,
        text: '返厂检修现场拆解',
        tagType: ''
    },
    'factoryDismantle': {
        value: 12,
        text: '返厂检修厂内拆解',
        tagType: ''
    },

    'factoryCreate': {
        value: 13,
        text: '厂内生产',
        tagType: ''
    },
    'experiment': {
        value: 14,
        text: '试验',
        tagType: ''
    },
    'finishReport': {
        value: 15,
        text: '检修报告',
        tagType: 'success'
    },
    ...COMMOM_WORK_ORDER_MAP
}
// 时间轴枚举
const TIME_LINE = {
    0: [{
        content: "指派项目经理",
        timestamp: "",
        otherInfo: "",
        processState: 3,
        isActive: false,
    },
    {
        content: "指派组员",
        timestamp: "",
        otherInfo: "",
        isActive: false,
        processState: 4,
    },
    {
        content: "工序执行",
        timestamp: "",
        otherInfo: "",
        isActive: false,
        processState: 8,
    },
    {
        content: "竣工报告",
        timestamp: "",
        otherInfo: "",
        isActive: false,
        processState: 9,
    },
    {
        content: "竣工报告审批",
        timestamp: "",
        otherInfo: "",
        isShowLine: false,
        processState: 10,
        isActive: false,
    }],
    1: [{
        content: "返厂检修现场拆解",
        timestamp: "",
        otherInfo: "",
        processState: 11,
        isActive: false,
    },
    {
        content: "返厂检修厂内拆解",
        timestamp: "",
        otherInfo: "",
        isActive: false,
        processState: 12,
    },
    {
        content: "厂内生产",
        timestamp: "",
        otherInfo: "",
        isActive: false,
        processState: 13,
    },
    {
        content: "试验",
        timestamp: "",
        otherInfo: "",
        isActive: false,
        processState: 14,
    },
        // {
        //     content: "检修报告",
        //     timestamp: "",
        //     otherInfo: "",
        //     isShowLine: false,
        //     processState: 15,
        //     isActive: false,
        // }
    ]
}
const WORK_ORDER_STATUS = {}
Object.values(WORK_ORDER_MAP).forEach(item => (WORK_ORDER_STATUS[item.value] = { text: item.text, tagType: item.tagType })); //处理状态数据
//设备清单列表
const DEVICE_COLUMNS = [
    { type: "selection", width: 50, align: "center" },
    {
        prop: "deviceName",
        label: "设备名称",
        align: "center",
    },
    {
        prop: "deviceModelName",
        label: "设备类型",
        align: "center",
    },
    {
        prop: "deviceNumber",
        label: "设备编号",
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
        width: 280,
        fixed: "right"
    },
]
//外层tab 配置项  其中 name修改时需要注意与config.js中的TAB_LIST_MAP的 key对应
const TAB_LIST_OUT = [
    {
        label: "现场勘查",
        name: "surveyItem",
        workClazzType: "survey", //班组字段
        sceneType: "SURVEY_SCENE",//场景值对应后端参数
        hiddenAssign: true,
        menuCode: "2005_tab_surveyItem"
    },
    {
        label: "现场检修",
        name: "siteOverhaul",
        hiddenAssign: false,
        sceneType: "OVER_HAUL_ON_THE_SPOT_SCENE",
        workClazzType: "overhaulGroup",
        menuCode: "2005_tab_siteOverhaul"
    },
    {
        label: "返厂检修-现场拆解",
        name: "siteDismantle",
        hiddenAssign: false,
        sceneType: "OVER_HAUL_BACK_CHAI_JIE_SCENE",
        workClazzType: "overhaulGroup",
        menuCode: "2005_tab_siteDismantle"
    },
    {
        label: "返厂检修-厂内拆解",
        name: "factoryDismantle",
        workClazzType: "assembleGroup",
        sceneType: "OVER_HAUL_BACK_INNER_CHAI_JIE_SCENE",
        hiddenAssign: false,
        menuCode: "2005_tab_factoryDismantle"
    },
    {
        label: "返厂检修-厂内生产",
        name: "factoryCreate",
        workClazzType: "prodDeptGroup",
        sceneType: "OVER_HAUL_BACK_INNER_PRODUCTION_SCENE",
        hiddenAssign: false,
        menuCode: "2005_tab_factoryCreate"
    },
    {
        label: "返厂检修-试验",
        name: "experiment",
        workClazzType: "experimentalGroup",
        sceneType: "OVER_HAUL_BACK_EXPERIMENT_SCENE",
        hiddenAssign: false,
        menuCode: "2005_experiment_appoint"
    },
    // {
    //     label: "返厂检修-检修报告",
    //     name: "finishReport",
    //     hiddenAssign: true,
    // },
]
//每个流程对应的tab项
const TAB_LIST_MAP = {
    //试验
    experiment:
        [{ label: "工序信息", name: "processInfo", components: "ProcessInfo", menuCode: "2005_experiment_processInfo" },
        { label: "工序问题查看", name: "issueTable", components: "IssueTable", menuCode: "2005_experiment_issue" },
        {
            label: "试验作业指导书",
            name: "experimentInstruction",
            components: "TemplateReport",
            workType: 12,
            menuCode: "2005_report_view_12"
        },
        {
            label: "试验报告 ",
            name: "experimentReport",
            components: "TemplateReport",
            workType: 13,
            menuCode: "2005_report_view_13"
        },
        { label: "录像标记", name: "videoAndImg", components: "videoMark", menuCode: "2005_experiment_videoMarker" },
        { label: "标记记录", name: "markRecord", components: "MarkerRecord", menuCode: "2005_experiment_markerList_view" }
        ],
    //厂内生产
    factoryCreate: [
        { label: "工序信息", name: "processInfo", components: "ProcessInfo", menuCode: "2005_factoryCreate_processInfo" },
        { label: "工序问题查看", name: "issueTable", components: "IssueTable", menuCode: "2005_factoryCreate_issue" },
        {
            label: "厂内作业BOM",
            name: "BomVue",
            components: "BomVue",
            menuCode: "2005_factoryCreate_bom_view"
        },
        {
            label: "生产作业指导书",
            name: "createInstruction",
            components: "TemplateReport",
            workType: 10,
            menuCode: "2005_report_view_10"
        },

        {
            label: "生产作业执行报告",
            name: "createReport",
            components: "TemplateReport",
            workType: 11,
            menuCode: "2005_report_view_11"
        },
        { label: "录像标记", name: "videoAndImg", components: "videoMark", menuCode: "2005_factoryCreate_videoMarker" },
        {
            label: "标记记录", name: "markRecord", components: "MarkerRecord",
            menuCode: "2005_factoryCreate_markerList_view"
        }
    ],
    //厂内拆解
    factoryDismantle: [
        { label: "工序信息", name: "processInfo", components: "ProcessInfo", menuCode: "2005_factoryDismantle_processInfo" },
        { label: "工序问题查看", name: "issueTable", components: "IssueTable", menuCode: "2005_factoryDismantle_issue" },
        // {
        //     label: "施工方案",
        //     name: "constructionScheme",
        //     components: "TemplateReport",
        // },
        {
            label: "厂内拆解作业指导书",
            name: "returnInstruction",
            components: "TemplateReport",
            workType: 8,
            menuCode: "2005_report_view_8"
        },
        {
            label: "厂内拆解BOM",
            name: "BomVue",
            components: "BomVue",
            menuCode: "2005_factoryDismantle_bom_view"
        },
        {
            label: "解体分析报告",
            name: "BreakdownReport",
            components: "TemplateReport",
            workType: 9,
            menuCode: "2005_report_view_9"
        },
        { label: "录像标记", name: "videoAndImg", components: "videoMark", menuCode: "2005_factoryDismantle_videoMarker" },
        { label: "标记记录", name: "markRecord", components: "MarkerRecord", menuCode: "2005_factoryDismantle_markerList_view" }
    ],
    //现场拆解
    siteDismantle: [
        { label: "工序信息", name: "processInfo", components: "ProcessInfo", menuCode: "2005_siteDismantle_processInfo" },
        { label: "工序问题查看", name: "issueTable", components: "IssueTable", menuCode: "2005_siteDismantle_issue" },
        {
            label: "施工方案",
            name: "constructionScheme",
            components: "TemplateReport",
            workType: 6,
            menuCode: "2005_report_view_6"
        },
        {
            label: "装运拆解作业指导书",
            name: "operationInstruction",
            components: "TemplateReport",
            workType: 7,
            menuCode: "2005_report_view_7"
        },
        {
            label: "大件设备清单",
            name: "bigComponents",
            components: "BigComponents",
            menuCode: "2005_siteDismantle_big_view"
        },
        {
            label: "材料清单",
            name: "materials",
            components: "materials",
            menuCode: "2005_siteDismantle_materials_view"
        },
        {
            label: "工器具清单",
            name: "instrument",
            components: "instrument",
            menuCode: "2005_siteDismantle_instrument_view"
        },

        {
            label: "拆解BOM",
            name: "BomVue",
            components: "BomVue",
            menuCode: "2005_siteDismantle_bom_view"
        },
        {
            label: "返厂清单",
            name: "returnList",
            components: "ReturnList",
            menuCode: "2005_siteDismantle_returnList_view"
        },
        {
            label: "现场拆解报告",
            name: "siteDisassemblyReport",
            components: "TemplateReport",
            workType: 15,
            menuCode: "2005_report_view_15"
        },
        { label: "录像标记", name: "videoAndImg", components: "videoMark", menuCode: "2005_siteDismantle_videoMarker" },
        { label: "标记记录", name: "markRecord", components: "MarkerRecord", menuCode: "2005_siteDismantle_markerList_view" }
    ],
    //现场检修，
    siteOverhaul: [
        { label: "工序信息", name: "processInfo", components: "ProcessInfo",menuCode: "2005_siteOverhaul_processInfo" },
        { label: "工序问题查看", name: "issueTable", components: "IssueTable",menuCode: "2005_siteOverhaul_issue" },
        {
            label: "施工方案",
            name: "constructionScheme",
            components: "TemplateReport",
            workType: 2,
            menuCode: "2005_report_view_2"
        },
        {
            label: "现场检修作业指导书",
            name: "operationInstruction",
            components: "TemplateReport",
            workType: 3,
            menuCode: "2005_report_view_3"
        },
        {
            label: "大件设备清单",
            name: "bigComponents",
            components: "BigComponents",
            menuCode: "2005_siteOverhaul_big_view"
        },
        {
            label: "材料清单",
            name: "materials",
            components: "materials",
            menuCode: "2005_siteOverhaul_materials_view"
        },
        {
            label: "工器具清单",
            name: "instrument",
            components: "instrument",
            menuCode: "2005_siteOverhaul_instrument_edit"
        },
        {
            label: "现场检修试验报告",
            name: "testInstruction",
            components: "TemplateReport",
            workType: 4,
            menuCode: "2005_report_view_4"
        },
        {
            label: "现场检修竣工报告",
            name: "finishReport",
            components: "TemplateReport",
            workType: 5,
            menuCode: "2005_report_view_5"
        },
        { label: "录像标记", name: "videoAndImg", components: "videoMark",menuCode: "2005_siteOverhaul_videoMarker" },
        { label: "标记记录", name: "markRecord", components: "MarkerRecord",menuCode: "2005_siteOverhaul_markerList_view" }
    ],
    //现场勘探
    surveyItem: [
        { label: "工序信息", name: "processInfo", components: "ProcessInfo" },
        { label: "工序问题查看", name: "issueTable", components: "IssueTable" },
        { label: "勘查报告", name: "report", components: "TemplateReport", workType: 1, },
        // { label: "录像标记", name: "videoAndImg", components: "VideoMark" },
        // { label: "标记记录", name: "markRecord", components: "MarkerRecord" },
    ],
    //返厂检修-检修报告
    finishReport: [
        { label: "检修报告", name: "factoryFinishReport", components: "TemplateReport", workType: 14, },
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
// 工器具表格项
const INSTRUMENT_COLUMNS = [
    {
        prop: "id",
        label: "序号",
        align: "center",
        width: 50
    },
    {
        prop: "toolName",
        label: "工器具名称",
        align: "center",
    },
    {
        prop: "procedureLevel",
        label: "工序组织",
        align: "center",
    },
    {
        prop: "toolNum",
        label: "数量",
        align: "center",
    },
    {
        prop: "operation",
        label: "操作",
        align: "center",
        width: 150,
    },
]
// 材料表格项
const MATERIALS_COLUMNS = [
    {
        prop: "id",
        label: "序号",
        align: "center",
        width: 50
    },
    {
        prop: "productNumber",
        label: "材料名称",
        align: "center",
    },
    {
        prop: "materialName",
        label: "材料类型",
        align: "center",
    },
    {
        prop: "materialName",
        label: "工序组织",
        align: "center",
    },
    {
        prop: "num",
        label: "数量",
        align: "center",
    },
    {
        prop: "operation",
        label: "操作",
        align: "center",
        width: 150,
    },
]

//大件设备表格项
const BIG_COMPONENTS_COLUMNS = [
    {
        prop: "id",
        label: "序号",
        align: "center",
        width: 50
    },
    {
        prop: "equipmentType",
        label: "大件设备类别",
        align: "center",
    },
    {
        prop: "equipmentModel",
        label: "设备类型",
        align: "center",
    },
    {
        prop: "equipmentNumber",
        label: "设备编号",
        align: "center",
    },
    {
        prop: "organization",
        label: "工序组织",
        align: "center",
    },

    {
        prop: "receivePerson",
        label: "领用人",
        align: "center",
    },
    {
        prop: "receiveDate",
        label: "领用时间",
        align: "center",
    },
    {
        prop: "status",
        label: "设备空闲状态",
        align: "center",
    }
]
/**
 * BOM复核状态
 */
const BOM_STATUS = {
    1: "未复核",
    2: "已复核",
    3: "复核不通过"
}

export {
    WORK_ORDER_MAP,
    WORK_ORDER_STATUS,
    DEVICE_COLUMNS,
    ORDER_COLUMNS,
    TAB_LIST_MAP, //工序的tab相关枚举
    RETURN_COLUMNS,
    BOM_STATUS,
    TIME_LINE,
    TAB_LIST_OUT,
    MATERIALS_COLUMNS,
    INSTRUMENT_COLUMNS,
    BIG_COMPONENTS_COLUMNS
};