<template>
  <el-dialog draggable
    class="bom-dialog"
    :title="modalTitle"
    width="40%"
    :model-value="visible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <div>
      <el-form ref="bomForm" :model="bomForm" label-width="120px">
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
              label="模板编号"
              prop="templateCode"
              :rules="safeLimit('模板编号', true)"
            >
              <el-input v-model="bomForm.templateCode" :maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="cust-select-wrapper">
            <el-form-item
              label="型号"
              prop="templateModels"
              :rules="requiredVerify('型号', true)"
            >
              <select-page
                ref="modelSelectRef"
                v-model="bomForm.templateModels"
                collapse-tags
                :multiple="true"
                :collapse-tags-tooltip="true"
                :defaultSelectVal="defaultSelectVal"
                :getOptions="getOptions"
              />
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
                v-if="bomForm.nodeType"
                :label="labelStr"
                prop="componentId"
                :rules="requiredVerify(labelStr, true)"
              >
                <select-page
                  ref="componentIdRef"
                  v-model="bomForm.componentId"
                  :defaultSelectVal="defaultComponent"
                  @change="componentChange"
                  :getOptions="getComponentOptions"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  class="mr12"
                  type="primary"

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
        <el-button  @click="handleClose">取 消</el-button>
        <el-button

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
import SelectPage from "@/components/SelectPage/selectPage";
import { safeLimit, requiredVerify } from "@/common/js/validator";
import {
  getModelList,
  getBomTemplateById,
  getBigComponent,
  getMaterial,
  addOrUpdateBomTemplate,
  addBomTreeNode,
  editBomTreeNode,
  deleteBomTreeNode,
  getUsedModelList
} from "@/api/overhaul/templateLib";

const nodeTypeList = [
  { label: "大部件", value: 1 },
  { label: "物料", value: 2 },
];

export default {
  components: {
    BomTree,
    SelectPage
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
      operateType: 1,
      nodeInfo: {},
      bomForm: {
        id: "",
        templateName: "",
        name: "",
        templateCode: "",
        drawingNo: "",
        nodeType: "",
        componentId: "",
        templateModels: []
      },
      confirmLoading: false,
      // 节点类型
      nodeTypeList: Object.freeze(nodeTypeList),
      treeData: [],
      parentNode: null,
      defaultSelectVal: [],
      defaultComponent: {},
      componentName: '',
      usedModelList: []
    };
  },
  computed: {
    isAdd() {
      return !this.info;
    },
    modalTitle() {
      return `${this.isAdd ? "新增" : "编辑"}拆解BOM模板`;
    },
    labelStr() {
      return this.bomForm.nodeType === 1 ? '大部件' : '物料';
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
      
      if (newVal) {
        let params = {bomTemplateId: null};
        if (this.info) {
          params.bomTemplateId = this.info.id;
          this.getBomTemplate();
        }
        this.getUsedModel(params);
      }
    },
    "bomForm.nodeType": {
      handler(val) {
        //切换节点类型时需要重置下拉选择框
        this.$refs.componentIdRef && this.$refs.componentIdRef.selectSearch("");
        this.defaultComponent = {};
      },
    },
  },
  methods: {
    safeLimit,
    requiredVerify,
    addBomTreeNode,
    editBomTreeNode,
    //获取下拉选择项
    getOptions(params) {
      return new Promise((resolve, reject) => {
        const { pageNum, pageSize, searchKey } = params;
        let queryParms = {
          pageNum,
          pageSize,
          searchKey,
          accountId: localStorage.getItem('userId')
        };
        getModelList(queryParms).then((res) => {
          let usedModelList = this.usedModelList.map(item => item.modelName);
          let options = (res.data.pageList || []).map((item) => ({
            label: item.model,
            value: item.model,
            timeLimitId: item.timeLimitId,
            disabled: usedModelList.includes(item.model)
          }));
          resolve({
            options: options,
            totalPage: res.data.total,
          });
        });
      })
    },
    // 获取大部件/物料
    getComponentOptions(params) {
      return new Promise((resolve, reject) => {
        const { pageNum, pageSize, searchKey } = params;
        let queryParms = {
          pageNum,
          pageSize,
          searchKey,
        };
        if (this.bomForm.nodeType === 1) {
          getBigComponent(queryParms).then((res) => {
            let options = (res.data.pageList || []).map((item) => ({
              label: item.featureNo + item.name,
              value: item.name,
              featureNo: item.featureNo
            }));
            resolve({
              options: options,
              totalPage: res.data.total,
            });
          });
        } else {
          getMaterial(queryParms).then((res) => {
            let options = (res.data.pageList || []).map((item) => ({
              label: item.className,
              value: item.classCode,
              classCode: item.className
            }));
            resolve({
              options: options,
              totalPage: res.data.total,
            });
          });
        }
      });
    },
    componentChange(val) {
      let objMap = {
        1: 'featureNo',
        2: 'classCode'
      }
      let options = this.$refs.componentIdRef.selectOptions;
      let tempObj = {};
      options.forEach(el => {
        tempObj[el.value] = el[objMap[this.bomForm.nodeType]];
      })
      this.componentName = tempObj[val];
    },
    async getBomTemplate() {
      let res = await getBomTemplateById({ id: this.info.id });
      if (res.success && res.data) {
        let { templateName, templateCode, id, bomTreeList, templateModels } = res.data;
        this.bomForm.templateName = templateName;
        this.bomForm.templateCode = templateCode;
        this.bomForm.templateModels = (templateModels || []).map(item => item.modelId);
        this.defaultSelectVal = (templateModels || []).map(item => {
          return {
            value: item.modelId
          }
        });
        this.bomForm.id = id;
        this.treeData = bomTreeList;
      }
    },
    async getUsedModel(params) {
      let res = await getUsedModelList(params);
      if (res.success && res.data) {
        this.usedModelList = res.data.value;
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
        componentId: data.treeName,
      };
      this.nodeInfo = data;
      this.parentNode = node.parent.data;
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
          return item;
        });
        if (!valid) return;
        this.confirmLoading = true;
        let params = {
          bomTemplateId: this.info.id,
          nodeType: this.bomForm.nodeType,
          treeName: this.bomForm.componentId,
          pTreeId: this.parentNode.treeId
        };
        // 大部件和物料的componentId和componentName是反着的,主要是因为唯一值对应的不一样
        if (this.bomForm.nodeType === 1) {
          params.treeName = this.bomForm.componentId;
          params.componentId = this.componentName;
        } else {
          params.treeName = this.componentName;
          params.componentId = this.bomForm.componentId;
        }
        // 区分
        if (!this.isAddNode) {
          params.id = this.nodeInfo.id;
        }
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
            } else {
              this.$message.error(res.errMsg);
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
      let validateField = ["templateName", "templateCode", "templateModels"];
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
          return item;
        });
        if (!valid) return;
        this.loading = true;
        let params = {
          templateCode: this.bomForm.templateCode,
          templateName: this.bomForm.templateName,
          templateModels: this.bomForm.templateModels.map((item, index) => {
            return {
              modelId: item
            }
          })
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
            } else {
              this.$message.error(res.errMsg);
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
    :deep(.el-input) {
      width: 220px;
    }
  }
}
.ml20 {
  margin-left: 20px;
}
.cust-select-wrapper ::v-deep(.el-select) {
  width: 100%;
}
</style>
