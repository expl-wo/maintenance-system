/**共用常量 */
const COMMON_FORMAT = "YYYY-MM-DD HH:mm:ss" //统一时间格式
const MAX_IMG_SIZE = 10 * 1024 * 1024 //图片最大10M
const MAX_FILE_SIZE = 100 * 1024 * 1024
//公共的工单状态
const COMMOM_WORK_ORDER_MAP = {
    'pointManager': {
        value: 3,
        text: '指派项目经理',
        tagType: 'waning'
    },
    'pointMembers': {
        value: 4,
        text: '指派组员',
        tagType: 'waning'
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

// 工序指派时的列表项
const COMMON_PROCESS_COLUMNS_MAP = {
    //工序
    0: [
        { type: "selection", width: 30 },
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
    //中工序
    1: [
        { type: "selection", width: 30 },
        {
            prop: "subProcessName",
            label: "中工序名称",
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
            label: "工步完成度",
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
    //工步
    2: [
        { type: "selection", width: 30 },
        {
            prop: "processRowName",
            label: "工步名称",
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
export {
    COMMON_FORMAT,
    MAX_IMG_SIZE,
    MAX_FILE_SIZE,
    COMMOM_WORK_ORDER_MAP,
    COMMON_PROCESS_COLUMNS_MAP
}