//通用变量
const isEmptyObj = function (obj) {
    if (obj === null || obj === undefined) {
        return true
    }
    for (const key in obj) {
        return false
    }
    return true
}


const mainPlanStatus = {
    cancel: '-100', //已取消
    frozen: '-50', //冻结
    back: '-5',//返工
    waitScheduled: '0',//待排产
    dismantlingPlan: '5',//仅拆解计划
    preScheduling: '10',//预排节点计划
    issuePlan: '15',//已下发计划
    start: '20',//已开工
    finish: '25',//已完工
}

export default {
    respCode: {
        success: 200 //成功
    },
    statusCode: {
        success: 10000
    },
    //字典类型
    dictType: {
        biz: 'biz',
        sys: 'sys'
    },
    processStatus: {
        runningEnd: ['running', 'end'],
        running: 'running',
        end: 'end',
        abandon: 'abandon'
    },
    flag: {
        y: 'y',
        n: 'n'
    },
    flag01: {
        y: '1',
        n: '0'
    },
    isApprove: {
        yes: 1,
        no: 0
    },
    productOrGx: {
        product: 'product',
        gx: 'gx'
    },
    pageEntryCount: 1000,
    defaultMainPath: '/main',
    fileType: {
        video: 'video',
        photo: 'photo',
        word: 'word',
        other: 'other'
    },
    mainPlanStatus,
    //生产主计划编制和审批界面，生产状态的筛选只展示预排节点计划、已下发计划、已开工三个状态
    planApprovalStatus: [mainPlanStatus.preScheduling, mainPlanStatus.issuePlan, mainPlanStatus.start],
    //图片文件格式
    photoType: ['jpg', 'gif', 'png', 'jpeg', 'webp', 'bmp'],
    //视频文件格式
    videoType: ['mp4'],
    First_Menu: '根菜单',
    First_Menu_value: 'root',
    saveSuccess: '数据保存成功',

    hasChildren: {
        yes: 1,
        no: 0
    },
    //主计划审批状态
    approvalStatus: {
        Reject: '-1',//驳回
        Normal: '1',//待排
        Beforehand: '1',//预排
        Apply: '2',//待审批
        Pass: '3',//通过
    },
    authType: {
        btn: 'btn',
        menu: 'menu'
    },
    menuType: {
        pc: 'pc',
        app: 'app'
    },
    department: {
        rootId: '21'
    },
    opType: {
        //0:设计 1：采购 2：生产
        design: 0,
        purchase: 1,
        product: 2
    },
    confirmStatus: {
        //Reject(-1,"驳回"),Normal(0,"待排"),Beforehand(1,"预排"),Apply(2,"待审批"),Pass(3,"通过");
        reject: -1,
        normal: 0,
        beforehand: 1,
        apply: 2,
        pass: 3,

        suspended: 4, //暂停
        canAdd: ['-1', '0'], //是否能加入处理
        canAddDesc: '驳回或待排',
        canApproval: ['1'], //是否可预排
        canApprovalDesc: '预排',
        waitApproval: ['2'], //是否可待审批处理
        waitApprovalDesc: '待审批',
        freeze: ['0', '1', '2', '3', '10'],
        canFreezeDesc: '待排产，粗排，已下发，生成工序计划或已开工',
        unfreeze: ['-2'],
        canUnFreezeDesc: '冻结',
        canSelect: ['-1', '0', '1', '2'], //是否可选中
        planPageSelected: ['-1', '0', '1', '2'],//周计划预排选择框默认选中内容
        conStatus: ['3'],
        approvalPageSelected: ['2'],//周计划审批选择框默认选中内容
        completionTime: ['0', '1', '2', '3', '10', '-2', '-1'],
        canCompletionTime: '非完工',
        previewStatus: [],
        overOaStatus: []
    },

    //是否通过，0：驳回，1：通过
    isPass: {
        yes: 1,
        no: 0
    },
    nodeType: {
        flipTable: '4', //叠片
        flipTableName: '叠片',
        furnace: '20',
        furnaceDesc: '干燥罐'
    },

    // 0:设计 1：采购 2：生产 为空则查询所有分类的节点
    processType: {
        design: 0,
        purchase: 1,
        product: 2
    },
    pageAll: 10000,
    pageMaxAll: 1000000,
    filePreviewUrl: 'fileServer/',
    //删除提示信息
    deleteTip: '此操作将永久删除该条信息, 是否继续?',


    allDepart: {
        departmentNumber: '_all',
        name: '全部'
    },
    fileModule: {
        portal_material: 'portal_material'
    },
    //是否为空对象
    isEmptyObj,
    //是否为空对象
    isNotEmptyObj(obj) {
        return !isEmptyObj(obj);
    },
    toString(data) {
        if (this.isEmpty(data)) {
            return ''
        } else {
            return data + ''
        }
    },
    //是否为空字符串
    isNotEmpty(content) {
        if (content === null || content === undefined || content === '') {
            return false
        } else {
            return true
        }
    },
    //判断是否为数组
    isArray(arr) {
        return Array.isArray(arr);
    },
    //是否为空字符串
    isEmpty(content) {
        if (content === null || content === undefined || content === '') {
            return true
        } else {
            return false
        }
    },


}

