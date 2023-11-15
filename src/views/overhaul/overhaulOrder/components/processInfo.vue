<template>
  <div class="process-box">
    <div class="process-content">
      <div class="process-content-left">
        <div class="process-content-left-title">工序结构</div>
        <div class="process-content-left-search">
          <el-input
            size="small"
            placeholder="输入关键字进行过滤"
            v-model="filterText"
          >
          </el-input>
        </div>
        <div class="process-tree" v-loading="treeLoading">
          <el-tree
            ref="treeRef"
            default-expand-all
            show-checkbox
            :check-strictly="true"
            :expand-on-click-node="false"
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            node-key="uniqueCode"
            @node-click="handleNodeClick"
            @check-change="handleCheckClick"
          ></el-tree>
        </div>
      </div>
      <div class="process-content-right" v-loading="tableListLoading">
        <div class="operate-wrap">
          <el-button
            type="primary"
            size="small"
            @click="openModal('', 'distributeModalFlag')"
          >
            <el-icon class="el-icon--left"><Setting /></el-icon>
            工序配置
          </el-button>
        </div>

        <el-table :data="tableData" stripe size="small" style="width: 100%">
          <template v-for="item in columns">
            <el-table-column
              :key="item.prop"
              v-bind="item"
              v-if="item.prop === 'operation'"
            >
              <template #default="{ row }">
                <el-button
                  size="small"
                  type="primary"
                  title="添加问题"
                  @click="openModal(row, 'issueModal')"
                > <el-icon><DocumentAdd /></el-icon>
                </el-button>
                <!-- 只有叶子节点有复核 -->
                <el-button
                  size="small"
                  type="primary"
                  v-if="currentSelectNode.procedureType === 3"
                  title="复核"
                > <el-icon><Stamp /></el-icon>
                </el-button>
                <!-- <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-tickets"
                  title="执行记录"
                >
                </el-button> -->
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
        <!-- 派工配置 -->
        <distribute-modal
          v-if="distributeModalFlag"
          :operateRow="operateRow"
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
import { PROCESS_COLUMNS_MAP } from "../config.js";
import { Setting, Stamp, DocumentAdd } from "@element-plus/icons-vue";
import { getWorkTree } from "@/api/overhaul/workOrderApi.js"
const testTreeData = [
  {
    procedureCode: "",
    procedureName: "根节点",
    disabled: true,
    procedureType: "0",
    uniqueCode: "0",
    childNodeList: [
      {
        procedureCode: "4",
        procedureName: "测试_标准工序_1",
        procedureType: "1",
        uniqueCode: "1_4",
        childNodeList: [
          {
            procedureCode: "4",
            procedureName: "工序头_4",
            procedureType: "2",
            uniqueCode: "2_4",
            childNodeList: [
              {
                procedureCode: "4",
                procedureName: "工序行_4",
                procedureType: "3",
                uniqueCode: "3_4",
                childNodeList: [
                  {
                    procedureCode: "4",
                    procedureName: "内容工序_4",
                    procedureType: "4",
                    uniqueCode: "4_4",
                    childNodeList: null,
                  },
                ],
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
            procedureName: "工序头_5",
            procedureType: "2",
            uniqueCode: "2_5",
            childNodeList: [
              {
                procedureCode: "5",
                procedureName: "工序行_5",
                procedureType: "3",
                uniqueCode: "3_5",
                childNodeList: [
                  {
                    procedureCode: "5",
                    procedureName: "内容工序_5",
                    procedureType: "4",
                    uniqueCode: "4_5",
                    childNodeList: null,
                  },
                ],
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
            procedureName: "工序头_6",
            procedureType: "2",
            uniqueCode: "2_6",
            childNodeList: [
              {
                procedureCode: "6",
                procedureName: "工序行_6",
                procedureType: "3",
                uniqueCode: "3_6",
                childNodeList: [
                  {
                    procedureCode: "6",
                    procedureName: "内容工序_6",
                    procedureType: "4",
                    uniqueCode: "4_6",
                    childNodeList: null,
                  },
                ],
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
            procedureName: "工序头_7",
            procedureType: "2",
            uniqueCode: "2_7",
            childNodeList: [
              {
                procedureCode: "7",
                procedureName: "工序行_7",
                procedureType: "3",
                uniqueCode: "3_7",
                childNodeList: [
                  {
                    procedureCode: "7",
                    procedureName: "内容工序_7",
                    procedureType: "4",
                    uniqueCode: "4_7",
                    childNodeList: null,
                  },
                ],
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
  components: {
    DistributeModal,
    AddIssue,
     Setting, Stamp, DocumentAdd
  },
  data() {
    return {
      tableListLoading: false,
      treeLoading: false,
      treeData: [],
      defaultProps: {
        children: "childNodeList",
        label: "procedureName",
      },
      //当前选中的节点
      currentNodeKey: [],
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
  computed: {
    //表格渲染列表
    columns() {
      return PROCESS_COLUMNS_MAP[this.currentSelectNode.type || 1];
    },
  },
  mounted() {
    this.getTreeData(); //获取工序树
  },
  methods: {
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
      this.tableListLoading = false;
      this.tableData = testTableData;
    },
    /**
     * 关闭弹窗
     */
    closeModal(modeName, isSearch = false) {
      this[modeName] = false;
      isSearch && this.getList();
    },
    /**
     *  打开弹窗
     */
    openModal(row = "", modalName) {
      if (!this.currentNodeKey.length && "distributeModalFlag" === modalName) {
        this.$message({
          message: "请先选择工序再进行派发操作！",
          type: "warning",
        });
        return;
      }
      this[modalName] = true;
    },
    /**
     * 树节点选中时操作
     */
    handleNodeClick(data) {
      if (data.type) {
        this.currentSelectNode = data;
      }
    },
    /**
     * 树节点checked时回调
     */
    handleCheckClick(data) {
      this.currentNodeKey = this.$refs["treeRef"].getCheckedKeys();
    },
    /**
     * 获取树的 数据
     */
    getTreeData() {
      // getWorkTree({templateCode:1,standardProcedureCodeList:[]})
      this.treeLoading = false;
      this.treeData = testTreeData;
      this.$nextTick(() => {
        this.$refs["treeRef"].setCurrentKey("001");
        this.getList();
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
