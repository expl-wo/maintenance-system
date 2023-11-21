<template>
  <el-dialog
    class="bom-dialog"
    :title="modalTitle"
    width="40%"
    :model-value="visible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <div>
      <el-form ref="bomForm" size="small" :model="bomForm" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="模板名称"
              prop="templateName"
              :rules="safeLimit('名称', true)"
            >
              <el-input v-model="bomForm.templateName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="图号"
              prop="drawingNo"
              :rules="safeLimit('图号', true)"
            >
              <el-select
                v-model="bomForm.drawingNo"
                placeholder="请选择"
                :disabled="!isAdd"
              >
                <el-option
                  v-for="item in drawingNoList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="content-wrapper" v-if="!isAdd">
          <div class="tree-wrapper">
            <bom-tree
              ref="bomTree"
              :treeData="treeData"
              @nodeClick="nodeClick"
              @addNode="addNode"
              @updateNode="updateNode"
              @removeNode="removeNode"
            />
          </div>
          <div class="info-wrapper">
            <div v-if="operateType === 1">
              <el-descriptions title="节点信息" :column="1">
                <el-descriptions-item v-if="!isRootNode" label="节点类型">{{
                  nodeInfo.nodeType === 1 ? "大部件" : "物料"
                }}</el-descriptions-item>
                <el-descriptions-item label="节点名称">{{
                  nodeInfo.treeName
                }}</el-descriptions-item>
              </el-descriptions>
            </div>
            <div v-if="operateType === 2 || operateType === 3">
              <div class="title">{{ isAddNode ? "添加" : "修改" }}节点</div>
              <el-form-item
                label="节点类型"
                prop="nodeType"
                :rules="requiredVerify('类型', true)"
              >
                <el-select
                  v-model="bomForm.nodeType"
                  placeholder="请选择"
                  @change="nodeTypeChange"
                >
                  <el-option
                    v-for="item in nodeTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="bomForm.nodeType === 1"
                label="大部件"
                prop="componentId"
                :rules="requiredVerify('大部件类别', true)"
              >
                <el-select
                  v-model="bomForm.componentId"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="bomForm.nodeType === 2"
                label="物料类别"
                prop="componentId"
                :rules="requiredVerify('物料类别', true)"
              >
                <el-select
                  v-model="bomForm.componentId"
                  filterable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in materialList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="mr12"
                  type="primary"
                  size="small"
                  :loading="confirmLoading"
                  @click.stop="confirm"
                  >{{ isAddNode ? "添加" : "修改" }}</el-button
                >
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          @click="handleConfirm"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import BomTree from "@/components/BomTree/index";
import { safeLimit, requiredVerify } from "@/common/js/validator";
import {
  getBomTemplateById,
  getBigParts,
  getMaterial,
  addOrUpdateBomTemplate,
  addBomTreeNode,
  editBomTreeNode,
  deleteBomTreeNode,
} from "@/api/overhaul/templateLib";

const nodeTypeList = [
  { label: "大部件", value: 1 },
  { label: "物料", value: 2 },
];

export default {
  components: {
    BomTree,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      // 1-查看 2-新增 3-更新
      operateType: "",
      nodeInfo: null,
      bomForm: {
        id: "",
        templateName: "",
        name: "",
        drawingNo: "",
        nodeType: "",
        componentId: "",
      },
      confirmLoading: false,
      drawingNoList: [
        { name: "测试图号1", id: 1 },
        { name: "测试图号2", id: 2 },
      ],
      // 大部件可选项
      typeList: [
        { label: "大部件1", value: 1 },
        { label: "大部件2", value: 2 },
      ],
      // 物料类别可选项
      materialList: [
        { label: "物料1", value: 1 },
        { label: "物料2", value: 2 },
        { label: "物料3", value: 3 },
      ],
      // 节点类型
      nodeTypeList: Object.freeze(nodeTypeList),
      treeData: [],
      parentNode: null,
    };
  },
  computed: {
    isAdd() {
      return !this.info;
    },
    modalTitle() {
      return `${this.isAdd ? "新增" : "编辑"}拆解BOM模板`;
    },
    isAddNode() {
      return this.operateType === 2;
    },
    isRootNode() {
      return this.nodeInfo.ptreeId === null;
    },
  },
  watch: {
    visible(newVal) {
      if (newVal && this.info) {
        this.getBomTemplate();
      }
    },
  },
  methods: {
    safeLimit,
    requiredVerify,
    addBomTreeNode,
    editBomTreeNode,
    async getBomTemplate() {
      let res = await getBomTemplateById({ id: this.info.id });
      if (res.success && res.data) {
        let { templateName, drawingNo, id, bomTreeList } = res.data;
        this.bomForm.templateName = templateName;
        this.bomForm.drawingNo = +drawingNo;
        this.bomForm.id = id;
        this.treeData = bomTreeList;
      }
    },
    // 组织树的单击事件
    nodeClick(node) {
      this.operateType = 1;
      this.nodeInfo = node;
    },
    // 添加节点
    addNode(node, data) {
      let resetData = {
        name: "",
        nodeType: "",
        componentId: "",
      };
      this.bomForm = { ...this.bomForm, ...resetData };
      this.parentNode = data;
      this.operateType = 2;
    },
    // 更新节点
    updateNode(node, data) {
      this.bomForm = {
        ...this.bomForm,
        name: data.treeName,
        nodeType: data.nodeType,
        componentId: data.componentId,
      };
      this.nodeInfo = data;
      this.operateType = 3;
    },
    // 删除节点
    removeNode(node, data) {
      this.$confirm("此操作将永久删除所选节点, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteBomTreeNode({ id: data.id }).then((res) => {
          if (res.success) {
            this.getBomTemplate();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        });
      });
    },
    // 节点类型变化
    nodeTypeChange(val) {
      this.bomForm.componentId = "";
    },
    // 添加/修改节点的确认事件
    confirm() {
      // 根据节点类型确定需要校验的字段
      let validateField = ["nodeType", "componentId"];
      Promise.all(
        validateField.map((field) => {
          return new Promise((resolve) => {
            this.$refs.bomForm.validateField(field, (errorMsg) => {
              resolve(errorMsg);
            });
          });
        })
      ).then((errorMessage) => {
        let valid = errorMessage.every((item) => {
          return item == "";
        });
        if (!valid) return;
        this.confirmLoading = true;
        let params = {
          bomTemplateId: this.info.id,
          nodeType: this.bomForm.nodeType,
          componentId: this.bomForm.componentId,
        };
        // 区分
        if (this.isAddNode) {
          params.pTreeId = this.parentNode.treeId;
        } else {
          params.id = this.nodeInfo.id;
        }
        params.treeName = this[
          this.bomForm.nodeType === 1 ? "typeList" : "materialList"
        ].filter((item) => item.value === this.bomForm.componentId)[0].label;
        this[`${this.isAddNode ? "addBomTreeNode" : "editBomTreeNode"}`](params)
          .then((res) => {
            if (res.success) {
              this.getBomTemplate();
              // 编辑状态下更新节点信息
              if (!this.isAddNode) {
                this.nodeInfo = {
                  ...this.nodeInfo,
                  nodeType: params.nodeType,
                  treeName: params.treeName,
                  componentId: params.componentId,
                };
              }
              this.operateType = 1;
            }
          })
          .finally(() => {
            this.confirmLoading = false;
          });
      });
    },
    // 关闭
    handleClose() {
      this.resetForm();
      this.$emit("closeModal", "add", false);
    },
    // 确定
    handleConfirm() {
      let validateField = ["templateName", "drawingNo"];
      Promise.all(
        validateField.map((field) => {
          return new Promise((resolve) => {
            this.$refs.bomForm.validateField(field, (errorMsg) => {
              resolve(errorMsg);
            });
          });
        })
      ).then((errorMessage) => {
        let valid = errorMessage.every((item) => {
          return item == "";
        });
        if (!valid) return;
        this.loading = true;
        let params = {
          drawingNo: this.bomForm.drawingNo,
          templateName: this.bomForm.templateName,
        };
        if (!this.isAdd) {
          params.id = this.bomForm.id;
        }
        addOrUpdateBomTemplate(params)
          .then((res) => {
            if (res.success) {
              this.$message.success("操作成功");
              this.resetForm();
              this.$emit("closeModal", "add", true);
            }
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    // 重置表单
    resetForm() {
      this.$refs.bomForm.resetFields();
      this.bomForm.deviceList = [];
    },
  },
};
</script>
<style lang="scss" scoped>
.center {
  display: flex;
  justify-content: center;
}
.device-wrapper {
  max-height: 600px;
  overflow: auto;
}
.content-wrapper {
  display: flex;
  height: 400px;
  .tree-wrapper {
    width: 300px;
    height: 100%;
    padding: 10px;
    border: 1px solid #ccc;
  }
  .info-wrapper {
    flex: 1;
    height: 100%;
    padding-left: 20px;
    padding-top: 20px;
    border: 1px solid #ccc;
    .title {
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: bold;
      color: #606266;
    }
    ::v-deep(.el-input) {
      width: 220px;
    }
  }
}
.ml20 {
  margin-left: 20px;
}
</style>