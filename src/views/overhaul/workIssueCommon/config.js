export const ISSUE_COLUMNS = [
    { type: "selection", width: 30, "show-overflow-tooltip": false },
    {
        prop: "id",
        label: "序号",
        align: "center",
        width: 50
    },
    {
        prop: "problemProcedureOwn",
        label: "问题所属",
        align: "center",

    },
    {
        prop: "cateName",
        label: "问题分类",
        align: "center",

    },
    {
        prop: "abnormalName",
        label: "异常项",
        align: "center",

    },
    {
        prop: "problemDesc",
        label: "问题描述",
        align: "center",

    },
    {
        prop: "reporterDate",
        label: "上报时间",
        align: "center",

    },
    {
        prop: "reporterName",
        label: "提交人",
        align: "center",

    }, {
        prop: "notifierName",
        label: "通知人",
        align: "center",

    },
    {
        prop: "operation",
        label: "操作",
        align: "center",
        fixed: "right"
    },
]