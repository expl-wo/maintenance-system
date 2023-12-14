/**共用常量 */
const COMMON_FORMAT = "YYYY-MM-DD HH:mm:ss" //统一时间格式
const MAX_IMG_SIZE = 20 //图片最大20M
const MAX_FILE_SIZE = 100 // 附件做大100M
const MAX_VIDEO_SZIE = 200 //视频最大 200M
//公共的工单状态
const COMMOM_WORK_ORDER_MAP = {
    'pointManager': {
        value: 3,
        text: '指派项目经理',
        tagType: 'warning'
    },
    'pointMembers': {
        value: 4,
        text: '指派组员',
        tagType: 'warning'
    },
    'finish': {
        value: 16,
        text: '结束',
        tagType: 'info'
    },
    'pause': {
        value: 17,
        text: '暂停',
        tagType: 'danger'
    },
}
//工序树节点的枚举
const PROCESS_NODE_ENUM = {
    ROOT: 0,//根节点
    NORM: 1, //标准工序
    MIDDLE: 2, //中工序
    STEP: 3, //工步
    CONTENT: 4 //工作内容
}

// 工序指派时的列表项
const COMMON_PROCESS_COLUMNS_MAP = {
    //工序
    [PROCESS_NODE_ENUM.ROOT]: [
        // { type: "selection", width: 30, "show-overflow-tooltip": false },
        {
            prop: "workProcedureName",
            label: "标准工序名称",
        },
        {
            prop: "workProcedureCode",
            label: "标准工序编号",
        },
        // {
        //     prop: "measure",
        //     label: "标准要求",
        // },
        {
            prop: "reviewStatus",
            label: "复核状态",
        },
        {
            prop: "progress",
            label: "工序进度",
        },
        {
            prop: "operation",
            label: "操作",
            width: 150,
        },
    ],
    //中工序
    [PROCESS_NODE_ENUM.NORM]: [
        // { type: "selection", width: 30, "show-overflow-tooltip": false },
        {
            prop: "workProcedureName",
            label: "中工序名称",
        },
        {
            prop: "progress",
            label: "工步完成度",
        },
        {
            prop: "reviewStatus",
            label: "复核状态",
        },
        {
            prop: "operation",
            label: "操作",
            width: 150,
        },
    ],
    //工步
    [PROCESS_NODE_ENUM.MIDDLE]: [
        // { type: "selection", width: 30, "show-overflow-tooltip": false },
        {
            prop: "workProcedureName",
            label: "工步名称",
        },
        {
            prop: "leaderName",
            label: "组长",
        },
        {
            prop: "deputyLeaderName",
            label: "副组长",
        },
        {
            prop: "memberName",
            label: "成员",
        },
        // {
        //     prop: "checkType",
        //     label: "频次",
        // },
        {
            prop: "workStatus",
            label: "当前状态",
        },
        {
            prop: "reviewStatus",
            label: "复核状态",
        },
        {
            prop: "workBeginDate",
            label: "开工时间",
        },
        {
            prop: "workFinishDate",
            label: "完工时间",
        },
        {
            prop: "operation",
            label: "操作",
            width: 150,
        },
    ]
}
//报告审核状态
const REPORT_CHECK_STATUS = {
    0: { label: '待发起审核', type: '' },
    1: { label: '待审核', type: 'warning' },
    2: { label: '审核通过', type: 'success' },
    3: { label: '审核不通过', type: 'danger' }
}
//工序树OA状态
const WORK_TREE_CHECK_STATUS = {
    0: { label: '待发起审核', type: '' },
    1: { label: '待审核', type: 'warning' },
    2: { label: '审核通过', type: 'success' },
    5: { label: '审核不通过', type: 'danger' }
}
//厂内和场外选择班组时的枚举，对应业务配置的班组
const INPLAN_OR_OUT = {
    //厂内
    IN: 'productionGroup',
    //场外
    OUT: 'transportationGroup',
}
//菜单编码
const MENU_CODE = {
    1: 2004, //勘查工单对应的权限code前缀
    2: 2005 //检修工单
}
//工序状态
const WORK_STATUS_ENUM = {
    0: "未派工",
    1: "已开工",
    2: "未开工",
    3: "已完工"
}
//复核状态
const REVIEW_STATUS_ENUM = {
    0: "未复核",
    1: "已复核",
}
const BOM_STATUS = {
    0: "未复核",
    1: "已复核",
    2: "复核不通过",

}
export {
    COMMON_FORMAT,
    PROCESS_NODE_ENUM,
    MAX_IMG_SIZE,
    MAX_VIDEO_SZIE,
    MAX_FILE_SIZE,
    COMMOM_WORK_ORDER_MAP,
    COMMON_PROCESS_COLUMNS_MAP,
    REPORT_CHECK_STATUS,
    WORK_TREE_CHECK_STATUS,
    INPLAN_OR_OUT,
    MENU_CODE,
    WORK_STATUS_ENUM,
    REVIEW_STATUS_ENUM,
    BOM_STATUS
}