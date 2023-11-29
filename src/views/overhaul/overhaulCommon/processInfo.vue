<template>
  <div class="process-box">
    模板选择：
    <select-page
      v-model="templateChoose"
      :clearable="false"
      :disabled="isRoleContorl.isDisabled"
      :getOptions="getProcedureTemplateOptions"
      @change="handleTemplateChange"
    />
    <div class="process-content" v-if="isRoleContorl.isCanShowTree">
      <div class="process-content-left" v-loading="treeLoading">
        <div class="process-content-left-title">工序结构</div>
        <div class="process-content-left-search">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>
        </div>

        <div class="process-tree">
          <el-tree
            ref="treeRef"
            default-expand-all
            show-checkbox
            :expand-on-click-node="false"
            :data="treeData"
            :props="defaultProps"
            highlight-current
            :filter-node-method="filterNode"
            node-key="uniqueCode"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
      </div>
      <div class="process-content-right" v-loading="tableListLoading">
        <div class="operate-wrap" v-if="workTreeStatus === 2">
          <el-button
            v-if="btnRoleList.includes('setBtn')"
            type="primary"
            :disabled="isPause"
            @click="openModal(1, 'distributeModalFlag')"
          >
            <el-icon class="el-icon--left"><Setting /></el-icon>
            视频绑定
          </el-button>
          <el-button
            v-if="btnRoleList.includes('setBtn')"
            type="primary"
            :disabled="isPause"
            @click="openModal(2, 'distributeModalFlag')"
          >
            <el-icon class="el-icon--left"><UserFilled /></el-icon>
            复核人员
          </el-button>
          <el-button
            v-if="btnRoleList.includes('setBtn')"
            type="primary"
            :disabled="isPause"
            @click="openModal(3, 'distributeModalFlag')"
          >
            <el-icon class="el-icon--left"><Pointer /></el-icon>
            派工
          </el-button>
          <el-button
            v-if="btnRoleList.includes('setBtn')"
            type="primary"
            :disabled="isPause"
            @click="openModal(4, 'distributeModalFlag')"
          >
            <el-icon class="el-icon--left"><Tools /></el-icon>
            大件设备
          </el-button>
        </div>
        <div class="operate-wrap" v-else>
          <el-button
            type="primary"
            :disabled="isPause"
            title="保存"
            @click="workTreeSave"
          >
            <el-icon class="el-icon--left"><SuccessFilled /></el-icon>保存
          </el-button>
          <el-button
            type="primary"
            :disabled="isPause"
            title="发起审核"
            @click="workTreeCheck"
          >
            <el-icon class="el-icon--left"><Stamp /></el-icon>发起审核
          </el-button>
          <el-tag
            :key="WORK_TREE_CHECK_STATUS[workTreeStatus].label"
            :type="WORK_TREE_CHECK_STATUS[workTreeStatus].type"
            effect="plain"
            class="mgl12"
            round
          >
            {{ WORK_TREE_CHECK_STATUS[workTreeStatus].label }}
          </el-tag>
        </div>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          show-overflow-tooltip
          v-if="columns"
        >
          <template v-for="item in columns">
            <el-table-column
              :key="item.prop"
              v-bind="item"
              v-if="item.prop === 'operation'"
            >
              <template #default="{ row }">
                <el-button
                  v-if="btnRoleList.includes('addBtn')"
                  type="primary"
                  title="添加问题"
                  :disabled="isPause"
                  @click="openModal(row, 'issueModal')"
                >
                  <el-icon><DocumentAdd /></el-icon>
                </el-button>
                <!-- 只有叶子节点有复核 -->
                <el-button
                  type="primary"
                  :disabled="isPause"
                  v-if="
                    btnRoleList.includes('checkBtn') &&
                    currentSelectNode.type === PROCESS_NODE_ENUM.MIDDLE
                  "
                  title="复核"
                  @click="check"
                >
                  <el-icon><Stamp /></el-icon>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              :key="item.prop"
              v-bind="item"
              v-else-if="item.prop === 'process'"
            >
              <template #default="{ row }">
                <el-progress
                  :text-inside="true"
                  :stroke-width="20"
                  :percentage="70"
                ></el-progress>
              </template>
            </el-table-column>
            <el-table-column
              :key="item.prop"
              v-bind="item"
              v-else
            ></el-table-column>
          </template>
        </el-table>
        <!-- 执行项操作 -->
        <work-step-content
          :workOrderInfo="workOrderInfo"
          :onlyTabName="onlyTabName"
          v-else
        />
        <!-- 派工配置 -->
        <distribute-modal
          v-if="distributeModalFlag"
          :operateRow="operateRow"
          :workOrderInfo="workOrderInfo"
          :onlyTabName="onlyTabName"
          modalName="distributeModalFlag"
          @closeModal="closeModal"
        ></distribute-modal>
        <!-- 问题添加 -->
        <add-issue
          v-if="issueModal"
          :operateRow="operateRow"
          modalName="issueModal"
          @closeModal="closeModal"
        ></add-issue>
      </div>
    </div>
  </div>
</template>

<script>
import AddIssue from "@/views/overhaul/workIssueCommon/addIssue.vue";
import DistributeModal from "./distributeModal.vue"; //派工配置弹窗
import SelectPage from "@/components/SelectPage/selectPage.vue";
import WorkStepContent from "./workStepContent/index.vue"; //执行项
import {
  COMMON_PROCESS_COLUMNS_MAP,
  COMMOM_WORK_ORDER_MAP,
  WORK_TREE_CHECK_STATUS,
  PROCESS_NODE_ENUM,
} from "@/views/overhaul/constants.js";
import {
  Setting,
  Stamp,
  DocumentAdd,
  Pointer,
  UserFilled,
  SuccessFilled,
  Tools,
} from "@element-plus/icons-vue";
import { ElMessageBox } from "element-plus";
import {
  getProcedureTemplate,
  getWorkTree,
} from "@/api/overhaul/workOrderApi.js";
const testTreeData = [
  {
    procedureCode: "",
    procedureName: "根节点",
    procedureType: "0",
    disabled: true,
    uniqueCode: "0",
    childNodeList: [
      {
        procedureCode: "4",
        procedureName: "测试_标准工序_1",
        procedureType: "1",
        uniqueCode: "1_4",
        ifChoice: true,
        childNodeList: [
          {
            procedureCode: "4",
            procedureName: "中工序_4",
            procedureType: "2",
            uniqueCode: "2_4",
            childNodeList: [
              {
                procedureCode: "4",
                procedureName: "工步_4",
                procedureType: "3",
                uniqueCode: "3_4",
                childNodeList: [],
              },
            ],
          },
        ],
      },
      {
        procedureCode: "5",
        procedureName: "测试_标准工序_2",
        procedureType: "1",
        uniqueCode: "1_5",
        childNodeList: [
          {
            procedureCode: "5",
            procedureName: "中工序_5",
            procedureType: "2",
            uniqueCode: "2_5",
            childNodeList: [
              {
                procedureCode: "5",
                procedureName: "工步_5",
                procedureType: "3",
                uniqueCode: "3_5",
                childNodeList: [],
              },
            ],
          },
        ],
      },
      {
        procedureCode: "6",
        procedureName: "测试_标准工序_3",
        procedureType: "1",
        uniqueCode: "1_6",
        childNodeList: [
          {
            procedureCode: "6",
            procedureName: "中工序_6",
            procedureType: "2",
            uniqueCode: "2_6",
            childNodeList: [
              {
                procedureCode: "6",
                procedureName: "工步_6",
                procedureType: "3",
                uniqueCode: "3_6",
                childNodeList: [],
              },
            ],
          },
        ],
      },
      {
        procedureCode: "7",
        procedureName: "测试_标准工序_4",
        procedureType: "1",
        uniqueCode: "1_7",
        childNodeList: [
          {
            procedureCode: "7",
            procedureName: "中工序_7",
            procedureType: "2",
            uniqueCode: "2_7",
            childNodeList: [
              {
                procedureCode: "7",
                procedureName: "工步_7",
                procedureType: "3",
                uniqueCode: "3_7",
                childNodeList: [],
              },
            ],
          },
        ],
      },
    ],
  },
];
const testTableData = [
  {
    measureName: "2016-05-02",
    measureCode: "王小虎",
    measure: "上海市普陀区金沙江路 1518 弄",
    groupLeader: "张学友",
    assistantGroupLeader: "陈奕迅",
    members: "刘德华",
    finishStatus: "已完成",
    approvalStatus: "已复核",
    startTime: "2016-05-02",
    endTime: "2016-05-02",
  },
];
export default {
  name: "ProcessInfo",
  props: {
    //当前工单的详情
    workOrderInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    onlyTabName: {
      type: String,
      default: "",
    },
  },
  components: {
    DistributeModal,
    WorkStepContent,
    Pointer,
    UserFilled,
    AddIssue,
    SuccessFilled,
    SelectPage,
    Setting,
    Stamp,
    DocumentAdd,
    Tools,
  },
  data() {
    return {
      WORK_TREE_CHECK_STATUS,
      COMMOM_WORK_ORDER_MAP,
      PROCESS_NODE_ENUM,
      //工序审核树状态
      workTreeStatus: 0,
      //表格loading效果
      tableListLoading: false,
      //tree的loading效果
      treeLoading: false,
      templateChoose: undefined,
      oldTemplateChoose: undefined,
      templateOptions: [
        { label: "模板1", value: 1 },
        { label: "模板2", value: 2 },
      ],
      treeData: [],
      defaultProps: {
        children: "childNodeList",
        label: "procedureName",
      },
      currentSelectNode: {},
      //表格
      tableData: [],
      filterText: "",
      //派工配置属性
      distributeModalFlag: false,
      issueModal: false,
      operateRow: null,
    };
  },
  watch: {
    filterText(val) {
      this.$refs["treeRef"].filter(val);
    },
  },
  mounted() {
    // this.getTreeData();
  },
  computed: {
    isPause() {
      return (
        this.workOrderInfo.orderStatus === COMMOM_WORK_ORDER_MAP["pause"].value
      );
    },
    //有权限的按钮
    btnRoleList() {
      //再检修工单中带出勘查工单的内容
      if (this.onlyTabName === "surveyItem-processInfo") return [];
      return ["setBtn", "addBtn", "checkBtn"];
    },
    //来控制下拉框和工序的显影
    isRoleContorl() {
      let isCanShowTree, isDisabled;
      if (+this.workOrderInfo.workOrderType === 1) {
        isDisabled = ![COMMOM_WORK_ORDER_MAP["pointManager"].value].includes(
          this.workOrderInfo.orderStatus
        );
        isCanShowTree =
          ![COMMOM_WORK_ORDER_MAP["pointManager"].value].includes(
            this.workOrderInfo.orderStatus
          ) || this.templateChoose;
      } else if (this.onlyTabName === "surveyItem-processInfo") {
        //在检修中查看勘查
        isDisabled = true;
        isCanShowTree = true;
      } else {
        isDisabled = false; //目前暂时置为显示状态 保存成功之后为false
        isCanShowTree = true;
      }
      //审核之后均为置灰
      // if (this.workTreeStatus === 2) {
      //   isDisabled = true;
      // }
      return {
        isDisabled,
        isCanShowTree,
      };
    },
    //表格渲染列表
    columns() {
      return COMMON_PROCESS_COLUMNS_MAP[
        this.currentSelectNode.type || PROCESS_NODE_ENUM.ROOT
      ];
    },
  },
  methods: {
    //获取模板列表
    async getProcedureTemplateOptions(pageOptions) {
      const { pageNum, pageSize, searchKey } = pageOptions;
      let queryParms = {
        pageNum,
        pageSize,
        searchKey,
      };
      return new Promise((resolve, reject) => {
        getProcedureTemplate(queryParms).then((res) => {
          resolve({
            options: res.data.pageList.map((item) => ({
              label: item.procedureTempName,
              value: item.procedureTempCode,
            })),
            totalPage: res.data.allPageNum,
          });
        });
      });
    },
    //复核
    check() {
      ElMessageBox.confirm("是否确认复核?", "复核", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {})
        .catch(() => {});
    },
    //切换时二次确认
    changeConfirm() {
      this.$confirm(`切换模板会替换当前已有数据, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "error",
      })
        .then(() => {
          this.getTreeData();
        })
        .catch(() => {
          this.$message.info("操作已取消!");
          this.templateChoose = this.oldTemplateChoose;
        });
    },
    /**
     * 模板选择发生改变时
     */
    handleTemplateChange(val) {
      //如果已经选中了则需要进行二次确认
      if (this.oldTemplateChoose) {
        this.changeConfirm();
        return;
      }
      this.getTreeData(); //获取工序树
    },
    /**
     * 树节点过滤
     */
    filterNode(value, data) {
      if (!value) return true;
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
    /**
     * 得到所有
     */
    getList() {
      this.tableListLoading = true;
      this.tableData = testTableData;
      setTimeout(() => {
        this.tableListLoading = false;
      }, 1000);
    },
    /**
     * 关闭弹窗
     */
    closeModal(modeName, isSearch = false) {
      this[modeName] = false;
      isSearch && this.getList();
    },
    //工序树保存
    workTreeSave() {
      const currentNodeKey = this.$refs["treeRef"].getCheckedKeys();
      if (currentNodeKey && currentNodeKey.length) {
        console.log("@!@!2");
        //回填check的节点
        const tempTree = this.setChoiceTree(currentNodeKey, this.treeData);
        let parmas = tempTree[0];

        debugger;
      } else {
        this.$message({
          message: "请先选择工序节点再进行保存操作！",
          type: "warning",
        });
      }
    },
    //工序树审核
    workTreeCheck() {
      //发起审核接口
    },
    /**
     *  打开弹窗
     */
    openModal(row = "", modalName) {
      const currentNodeKey = this.$refs["treeRef"].getCheckedKeys();
      if (!currentNodeKey.length && modalName === "distributeModalFlag") {
        this.$message({
          message: "请先选择工序再进行派发操作！",
          type: "warning",
        });
        return;
      }
      this.operateRow = row;
      this[modalName] = true;
    },
    /**
     * 树节点选中时操作
     */
    handleNodeClick(data) {
      if (data.procedureType) {
        this.currentSelectNode = { ...data, type: +data.procedureType };
      }
    },
    //获取后端返回的树结构的ifchoice为true的节点key
    getChoiceKeys(treeData) {
      let chioceKeys = [];
      if (!treeData || !treeData.length) return [];
      for (const item of treeData) {
        if (item.ifChoice) {
          chioceKeys.push(item.uniqueCode);
        }
        if (item.childNodeList && item.childNodeList.length) {
          chioceKeys = chioceKeys.concat(
            this.getChoiceKeys(item.childNodeList)
          );
        }
      }
      return chioceKeys;
    },
    //将选中的节点回显到树上
    setChoiceTree(checkList = [], treeData = []) {
      if (!treeData || !treeData.length) return [];
      for (const item of treeData) {
        item.ifChoice = checkList.includes(item.uniqueCode);
        item.childNodeList = this.setChoiceTree(checkList, item.childNodeList);
      }
      return treeData;
    },
    /**
     * 获取树的 数据
     */
    getTreeData() {
      this.oldTemplateChoose = this.templateChoose;
      this.treeData = testTreeData;
      if (!this.templateChoose) return;
      this.treeLoading = true;
      getWorkTree({
        templateCode: this.templateChoose,
        procedureTypeList: [
          PROCESS_NODE_ENUM.NORM,
          PROCESS_NODE_ENUM.MIDDLE,
          PROCESS_NODE_ENUM.STEP,
        ],
      })
        .then(({ data: { oaExamineStatus, treeNode } }) => {
          this.treeData = testTreeData;
          this.workTreeStatus = oaExamineStatus || 0;
          const currentKeysList = this.getChoiceKeys(this.treeData);
          this.$nextTick(() => {
            if (this.$refs["treeRef"]) {
              this.$refs["treeRef"].setCurrentKey(
                this.treeData[0].uniqueCode || "root"
              );
              this.$refs["treeRef"].setCheckedKeys(currentKeysList);
            }
            this.getList();
          });
        })
        .finally(() => {
          this.treeLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
$left-title-height: 36px;
$left-search-height: 36px;
$left-width: 255px;
.process-box {
  width: 100%;
  height: 100%;
}
.mgl12 {
  margin-left: 12px;
}
.process-content {
  display: flex;
  width: 100%;
  margin-top: 15px;
  height: 610px;
  border: 1px solid #e9ebee;
  &-left {
    width: $left-width;
    height: calc(100% - 15px);
    border-right: 1px solid #e9ebee;
    &-search {
      height: $left-search-height;
      line-height: $left-search-height;
      padding: 0 20px;
    }
    &-title {
      width: 100%;
      height: $left-title-height;
      line-height: $left-title-height;
      padding: 0 15px 0 20px;
      border-bottom: 1px solid #e9ebee;
      text-align: left;
      font-weight: 600;
    }
    .process-tree {
      overflow: auto;
      height: calc(100% - #{$left-title-height} - #{$left-search-height});
      margin: 10px;
    }
  }
  &-right {
    width: calc(100% - #{$left-width});
    height: calc(100% - 15px);
    padding-left: 20px;
    .operate-wrap {
      height: 36px;
      line-height: 36px;
    }
  }
}
</style>
