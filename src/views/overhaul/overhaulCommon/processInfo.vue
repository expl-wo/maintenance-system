<template>
  <div class="process-box">
    模板选择：
    <select-page
      v-model="templateChoose"
      :clearable="false"
      ref="selectRef"
      :disabled="isRoleContorl.isDisabled"
      :defaultSelectVal="defaultSelectVal"
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
        <template v-if="columns">
          <div class="operate-wrap" v-if="workTreeStatus === 2">
            <el-button
              v-if="$isAuth(roleBtnEnum['videoBind'])"
              type="primary"
              :disabled="isPauseOrFinish"
              @click="openModal(1, 'distributeModalFlag')"
            >
              <el-icon class="el-icon--left"><Setting /></el-icon>
              视频绑定
            </el-button>
            <el-button
              v-if="$isAuth(roleBtnEnum['orderCheck'])"
              type="primary"
              :disabled="isPauseOrFinish"
              @click="openModal(2, 'distributeModalFlag')"
            >
              <el-icon class="el-icon--left"><UserFilled /></el-icon>
              复核人员
            </el-button>
            <el-button
              v-if="$isAuth(roleBtnEnum['infoAppoint'])"
              type="primary"
              :disabled="isPauseOrFinish"
              @click="openModal(3, 'distributeModalFlag')"
            >
              <el-icon class="el-icon--left"><Pointer /></el-icon>
              派工
            </el-button>
            <el-button
              v-if="$isAuth(roleBtnEnum['bigComponent'])"
              type="primary"
              :disabled="isPauseOrFinish"
              @click="openModal(4, 'distributeModalFlag')"
            >
              <el-icon class="el-icon--left"><Tools /></el-icon>
              大件设备
            </el-button>
          </div>
          <div class="operate-wrap" v-else>
            <el-button
              v-if="$isAuth(roleBtnEnum['workInfo_check'])"
              type="primary"
              :disabled="isPauseOrFinish || [1, 2].includes(workTreeStatus)"
              title="保存"
              @click="workTreeSave"
            >
              <el-icon class="el-icon--left"><SuccessFilled /></el-icon>保存
            </el-button>
            <el-button
              v-if="$isAuth(roleBtnEnum['workInfo_check'])"
              type="primary"
              :disabled="isPauseOrFinish || [1, 2].includes(workTreeStatus)"
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
        </template>
        <template v-if="workTreeStatus === 2">
          <template v-if="columns">
            <el-table
              :data="tableData"
              stripe
              style="width: 100%"
              show-overflow-tooltip
              height="500px"
            >
              <template v-for="item in columns">
                <el-table-column
                  :key="item.prop"
                  v-bind="item"
                  v-if="item.prop === 'operation'"
                >
                  <template #default="{ row }">
                    <el-button
                      v-if="$isAuth(roleBtnEnum['addIssue'])"
                      type="primary"
                      title="添加问题"
                      :disabled="isPauseOrFinish"
                      @click="openModal(row, 'issueModal')"
                    >
                      <el-icon><DocumentAdd /></el-icon>
                    </el-button>
                    <!-- 只有叶子节点有复核 -->
                    <el-button
                      type="primary"
                      :disabled="isPauseOrFinish"
                      v-if="
                        currentSelectNode.type === PROCESS_NODE_ENUM.MIDDLE &&
                        $isAuth(roleBtnEnum['review'])
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
                  v-else-if="item.prop === 'progress'"
                >
                  <template #default="{ row }">
                    <el-progress
                      :text-inside="true"
                      :stroke-width="20"
                      striped
                      striped-flow
                      :percentage="row.progress || 0"
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
            <pagination
              v-if="pageOptions.total"
              :total="pageOptions.total"
              :page="pageOptions.pageNum"
              :limit="pageOptions.pageSize"
              @pagination="pageChange"
            />
          </template>
          <!-- 执行项操作 -->
          <work-step-content
            :workOrderInfo="workOrderInfo"
            :onlyTabName="onlyTabName"
            :currentNode="currentNode"
            v-else
          />
        </template>
        <el-empty v-else description="请先配置工序，并审核通过！" />
        <!-- 派工配置 -->
        <distribute-modal
          v-if="distributeModalFlag"
          :operateRow="operateRow"
          :sceneType="sceneType"
          :appointInfo="appointInfo"
          :currentNode="currentNode"
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
import Pagination from "@/components/Pagination"; // 分页
import {
  COMMON_PROCESS_COLUMNS_MAP,
  COMMOM_WORK_ORDER_MAP,
  WORK_TREE_CHECK_STATUS,
  PROCESS_NODE_ENUM,
  MENU_CODE,
  WORK_STATUS_ENUM,
  REVIEW_STATUS_ENUM,
} from "@/views/overhaul/constants.js";
import { ElMessageBox } from "element-plus";
import {
  getProcedureTemplate,
  getWorkTree,
  saveTreeInfo,
  bindTreeTemplate,
  getWorkInfoPage,
  oAExamine,
} from "@/api/overhaul/workOrderApi.js";
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
const sceneType_map = {
  SURVEY_SCENE: 10,
  OVER_HAUL_ON_THE_SPOT_SCENE: 5,
  OVER_HAUL_BACK_CHAI_JIE_SCENE: 23,
  OVER_HAUL_BACK_INNER_CHAI_JIE_SCENE: 33,
  OVER_HAUL_BACK_INNER_PRODUCTION_SCENE: 42,
  OVER_HAUL_BACK_EXPERIMENT_SCENE: 51,
};
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
    //指派人员信息
    appointInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    onlyTabName: {
      type: String,
      default: "",
    },
    sceneType: {
      type: String,
      default: "",
    },
  },
  components: {
    DistributeModal,
    WorkStepContent,
    AddIssue,
    SelectPage,
    Pagination,
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
      defaultSelectVal: {}, //用于回显
      templateName: "", //模板name
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
      currentNode: [], //选中的节点
      issueModal: false,
      operateRow: null,
      isSurvey: this.onlyTabName === "surveyItem-processInfo", //是否是勘查工单
      //分页相关数据
      pageOptions: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs["treeRef"].filter(val);
    },
    workOrderInfo(val) {
      const { procedureTemplateName, procedureTemplateCode } =
        this.workOrderInfo;
      this.templateChoose = procedureTemplateCode || undefined;
      this.templateName = procedureTemplateName || "";
      if (this.templateChoose && this.templateName) {
        this.defaultSelectVal = {
          label: this.templateName,
          value: this.templateChoose,
        };
        this.getTreeData();
      }
    },
  },
  computed: {
    //按钮权限枚举对应菜单code
    roleBtnEnum() {
      const prefix = MENU_CODE[this.workOrderInfo.workOrderType];
      let middle;
      if (this.workOrderInfo.workOrderType === 1) {
        middle = "survey";
      } else {
        middle = this.onlyTabName.split("-")[0];
      }
      return {
        workInfo_check: `${prefix}_${middle}_workInfo_check`, //工序树的审核保存
        review: `${prefix}_${middle}_review`, //工序复核
        addIssue: `${prefix}_${middle}_addIssue`, //工序问题添加
        infoAppoint: `${prefix}_${middle}_infoAppoint`, //工序派工
        videoBind: `${prefix}_${middle}_videoBind`, //视频绑定
        orderCheck: `${prefix}_${middle}_orderCheck`, //复核人员配置按钮
        bigComponent: `${prefix}_${middle}_bigComponent`,
      };
    },
    isPauseOrFinish() {
      return [
        COMMOM_WORK_ORDER_MAP["pause"].value,
        COMMOM_WORK_ORDER_MAP["finish"].value,
      ].includes(this.workOrderInfo.orderStatus);
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
      } else if (this.isSurvey) {
        //在检修中查看勘查
        isDisabled = true;
        isCanShowTree = true;
      } else {
        isDisabled = [1, 2].includes(this.workTreeStatus); //待审核和审核之后均为置灰
        isCanShowTree = true;
      }
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
              value: item.procedureTempId,
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
    /**
     * 模板选择发生改变时
     */
    handleTemplateChange(val) {
      //如果已经选中了则需要进行二次确认
      if (!val) {
        this.templateName = "";
        return;
      }
      const options = this.$refs.selectRef.selectOptions;
      const target = options.find((item) => item.value === val);
      if (target) {
        this.templateName = target.label;
      } else {
        this.templateName = "";
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
      if (this.workTreeStatus !== 2) return; //只有审核通过之后才可以查
      if (+this.currentSelectNode.type !== 3) {
        this.tableListLoading = true;
        this.tableData = testTableData;
        let parmas = {
          pageNum: this.pageOptions.pageNum,
          pageSize: this.pageOptions.pageSize,
          workCode: this.workOrderInfo.id,
          templateCode: this.templateChoose,
          workProcedureType: +this.currentSelectNode.type,
          workProcedureCode: +this.currentSelectNode.procedureCode,
        };
        getWorkInfoPage(parmas)
          .then((res) => {
            const { pageList, total } = res.data;
            this.pageOptions.total = total;
            this.tableData = (pageList || []).map((item) => ({
              ...item,
              reviewStatus: REVIEW_STATUS_ENUM[item.reviewStatus || 0],
              workStatus: WORK_STATUS_ENUM[item.workStatus || 0],
            }));
          })
          .finally(() => {
            this.tableListLoading = false;
          });
      }
    },
    /**
     * 关闭弹窗
     */
    closeModal(modeName, isSearch = false) {
      this[modeName] = false;
      isSearch && this.getList();
    },
    //工序树保存
    async workTreeSave() {
      const currentNodeKey = this.$refs["treeRef"].getCheckedKeys();
      const halfCheckedList = this.$refs["treeRef"].getHalfCheckedKeys();
      if (currentNodeKey && currentNodeKey.length) {
        console.log(currentNodeKey, halfCheckedList);
        //回填check的节点
        const tempTree = this.setChoiceTree(
          [...currentNodeKey, ...halfCheckedList],
          this.treeData
        );
        let parmas = tempTree[0];
        if (+this.workOrderInfo.workOrderType === 1) {
          await bindTreeTemplate({
            workCode: this.workOrderInfo.id,
            workOrderSceneType: this.sceneType,
            templateCode: this.templateChoose,
            templateName: this.templateName,
          });
        }
        saveTreeInfo({
          workCode: this.workOrderInfo.id,
          workOrderSceneType: this.sceneType,
          treeNode: parmas,
        }).then((res) => {
          this.$message.success("保存成功");
        });
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
      oAExamine({
        workCode: this.workOrderInfo.id,
        docType: sceneType_map[this.sceneType],
      }).then((res) => {
        this.$message.success("操作成功");
        this.getTreeData();
      });
    },
    /**
     *  打开弹窗
     */
    openModal(row = "", modalName) {
      const currentNodeKey = this.$refs["treeRef"].getCheckedKeys();
      this.currentNode = this.$refs["treeRef"].getCheckedNodes();
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
      if (+data.procedureType !== this.currentSelectNode.type) {
        //重置分页
        this.pageOptions = {
          total: 0,
          pageNum: 1,
          pageSize: 20,
        };
      }
      if (data.procedureType) {
        this.currentSelectNode = { ...data, type: +data.procedureType };
        this.getList();
      }
    },
    //获取后端返回的树结构的ifchoice为true的节点key
    getChoiceKeys(treeData) {
      let chioceKeys = [];
      if (!treeData || !treeData.length) return [];
      for (const item of treeData) {
        if (item.childNodeList && item.childNodeList.length) {
          chioceKeys = chioceKeys.concat(
            this.getChoiceKeys(item.childNodeList)
          );
        } else {
          //仅叶子节点进行选中，然后通过树的级联勾选
          if (item.ifChoice) {
            chioceKeys.push(item.uniqueCode);
          }
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
      if (!this.templateChoose) return;
      this.treeLoading = true;
      getWorkTree({
        workCode: this.workOrderInfo.id,
        templateCode: this.templateChoose,
        procedureTypeList: [
          PROCESS_NODE_ENUM.NORM,
          PROCESS_NODE_ENUM.MIDDLE,
          PROCESS_NODE_ENUM.STEP,
        ],
        workOrderSceneType: this.sceneType,
      })
        .then(({ data: { oaExamineStatus, treeNode } }) => {
          if (!treeNode) return;
          this.treeData = [treeNode];
          this.workTreeStatus = +oaExamineStatus || 0;
          const currentKeysList = this.getChoiceKeys(this.treeData);
          this.$nextTick(() => {
            if (this.$refs["treeRef"]) {
              this.$refs["treeRef"].setCurrentKey(
                this.treeData[0].uniqueCode || "root"
              );
              this.$refs["treeRef"].setCheckedKeys(currentKeysList);
            }
            this.currentSelectNode = { type: +this.treeData[0].procedureType };
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
