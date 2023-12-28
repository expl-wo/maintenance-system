<template>
  <div class="bom-box">
    <template v-if="isShowTemplate && isEditAuth">
      <span class="mrl10">bom模板:</span>
      <select-page
        v-model="templateChoose"
        :defaultSelectVal="defaultSelectVal"
        :getOptions="getTemplateOptions"
        :clearable="false"
        @change="handleTemplateChange"
      />
    </template>
    <el-button v-if="isEditAuth" type="primary" class="mrl10" title="同步PLM" @click="syncPLM"
      ><el-icon class="el-icon--left"><Refresh /></el-icon>同步PLM</el-button
    >
    <el-button v-if="isEditAuth" type="primary" @click="openModal('showPrint')"
      ><el-icon class="el-icon--left"><Printer /></el-icon>打印二维码</el-button
    >
    <div class="bom-content" v-if="bomTreeId">
      <div class="bom-content-left">
        <div class="bom-content-left-title">BOM结构</div>
        <div class="bom-tree">
          <bom-tree
            ref="bomTreeRef"
            labelWidth="150px"
            :treeData="treeData"
            :isCanEditAuth="isEditAuth"
            :defaultProps="defaultProps"
            :changeDataEmit="true"
            @nodeClick="handleNodeClick"
            @addNode="addNode"
            @updateNode="updateNode"
            @removeNode="removeNode"
          ></bom-tree>
        </div>
      </div>
      <div class="bom-content-right" v-if="operateRow">
        <div class="operate-wrap">
          {{ operateRow.bomName }}
        </div>
        <el-descriptions
          title="基础信息"
          :column="1"
          :style="{ width: '500px' }"
        >
          <el-descriptions-item label="利旧状态">{{
            utilizeStatusMap[operateRow.utilize] || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="BOM类型">{{
            bomNodeTypeMap[operateRow.bomType]
          }}</el-descriptions-item>
          <el-descriptions-item label="流水码">{{
            operateRow.serialCode || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="工位码">{{
            operateRow.stationCode || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="待入库状态">{{
            operateRow.bomStatus === null
              ? "-"
              : operateRow.bomStatus
              ? "待入库"
              : "已入库"
          }}</el-descriptions-item>
          <el-descriptions-item label="备注">{{
            operateRow.memo || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="拆解照片">
            <div>
              <el-upload
                v-if="operateRow.ptreeId && isEditAuth"
                class="upload-demo"
                action="#"
                :before-upload="beforeUpload"
                :http-request="uploadFile"
                :accept="acceptType"
                list-type="picture"
                :show-file-list="false"
              >
                <el-button type="primary">点击上传</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    只能上传图片，且不超过{{ MAX_IMG_SIZE }}M/最多上传{{
                      MAX_IMG_NUM
                    }}张
                  </div>
                </template>
              </el-upload>
              <file-list :fileList="fileList" :isCanDelete="isEditAuth" @onDelete="deletePic"></file-list>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <add-bom
      v-if="showAdd"
      :operateType="operateType"
      :operateRow="operateRow"
      :workOrderInfo="workOrderInfo"
      modalName="showAdd"
      @closeModal="closeModal"
    ></add-bom>
    <print-modal
      v-if="showPrint"
      modalName="showPrint"
      :workOrderInfo="workOrderInfo"
      @closeModal="closeModal"
      @printQrCode="printQrCode"
    ></print-modal>
  </div>
</template>

<script>
import SelectPage from "@/components/SelectPage/selectPage.vue";
import AddBom from "./addBom.vue";
import PrintModal from "./printModal.vue";
import BomTree from "@/components/BomTree/index.vue";
import {
  getBomTemplate,
  getBomByWorkOrderId,
  addBomTree,
  syncBom,
  updateBomImgNode,
  delBomTreeNode,
} from "@/api/overhaul/bomApi.js";
import { uploadFile } from "@/api/overhaul/fileUploadApi.js";
import QRCode from "qrcodejs2";
import {
  MAX_IMG_SIZE,
  COMMOM_WORK_ORDER_MAP,
} from "@/views/overhaul/constants.js";
import FileList from "@/views/overhaul/overhaulCommon/fileList.vue";
export default {
  name: "Bom",
  props: {
    onlyTabName: {
      type: String,
      default: "",
    },
    //当前工单的详情
    workOrderInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    FileList,
    BomTree,
    AddBom,
    SelectPage,
    PrintModal,
  },
  data() {
    return {
      COMMOM_WORK_ORDER_MAP,
      defaultSelectVal: {}, //默认选中的模板 用于回显
      MAX_IMG_NUM: 3,
      MAX_IMG_SIZE,
      templateChoose: undefined,
      oldTemplateChoose: undefined,
      showAdd: false,
      showPrint: false,
      acceptType: ".jpg,.png,.jpeg",
      fileList: [],
      treeData: [],
      operateRow: {},
      defaultProps: {
        children: "children",
        label: "bomName",
      },
      //派工配置属性
      operateType: "add",
      printWin: null, //打印二维码窗口
      bomTreeId: "",
      utilizeStatusMap: { 1: "废弃", 2: "利旧", 3: "维修" },
      bomNodeTypeMap: { 1: "大部件", 2: "物料类别" },
    };
  },
  created() {
    //默认模板回显
    if (this.workOrderInfo.bomTemplateId) {
      this.defaultSelectVal = {
        label: this.workOrderInfo.bomTemplateName,
        value: this.workOrderInfo.bomTemplateId,
      };
      this.templateChoose = this.workOrderInfo.bomTemplateId;
      this.oldTemplateChoose = this.workOrderInfo.bomTemplateId;
    }
    //获取当前工单绑定的bom
    this.getBomTree();
  },
  computed: {
    //编辑权限
    isEditAuth(){
      return this.$isAuth(`2005_${this.onlyTabName.split('-')[0]}_bom_edit`)
    },
    imgType() {
      let map_type = {
        "siteDismantle-BomVue": 1,
        "factoryDismantle-BomVue": 1,
        "factoryCreate-BomVue": 2,
      };
      return map_type[this.onlyTabName];
    },
    //只有现场检修时会进行模板选择，后续流程均时同步
    isShowTemplate() {
      return ["siteDismantle-BomVue"].includes(this.onlyTabName);
    },
  },
  methods: {
    //同步PLM
    syncPLM() {
      syncBom(this.workOrderInfo.id).then((res) => {
        if (res.code !== "0") {
          this.$message.error(res.errMsg);
        } else {
          this.$message.success("同步成功！");
        }
      });
    },
    getBomTree() {
      getBomByWorkOrderId({ workId: this.workOrderInfo.id }).then((res) => {
        if (res.code !== "0") {
          this.$message.error(res.errMsg);
          return;
        }
        const { id } = res.data;
        this.bomTreeId = id;
        if (id) {
          this.treeData = [res.data];
          // this.oldTemplateChoose = id;
        } else {
          this.treeData = [];
        }
      });
    },
    // 上传图片
    uploadFile(file) {
      const formData = new FormData();
      formData.append("file", file.file);
      uploadFile(formData).then(({ data }) => {
        this.fileList.push({
          fileName: data.fileName,
          fileUrl: data.filePath,
          imgType: this.imgType,
          uid: file.uid,
        });
        this.updateBomImgList();
      });
    },
    updateBomImgList() {
      if (!this.operateRow) {
        return;
      }
      let params = {
        bomId: this.operateRow.id,
        workId: this.workOrderInfo.id,
        imgList: this.fileList.map((item) => ({
          imgPath: item.fileUrl,
          imgName: item.fileName,
          imgType: item.imgType,
        })),
      };
      updateBomImgNode(params).then((res) => {
        this.getBomTree();
      });
    },
    //删除图片
    deletePic(target) {
      this.$confirm(`确认删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        type: "warning",
      })
        .then(() => {
          let index = this.fileList.findIndex(
            (item) => item.fileUrl === item.fileUrl
          );
          if (index >= 0) {
            this.fileList.splice(index, 1);
          }
          this.updateBomImgList();
        })
        .catch(() => {
          this.$message.info("操作已取消!");
        });
    },
    //切换时二次确认
    changeConfirm() {
      this.$confirm(`切换模板会永久替换当前已有数据, 是否继续?`, "提示", {
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
    async getTreeData() {
      this.oldTemplateChoose = this.templateChoose;
      if (!this.templateChoose) {
        this.treeData = [];
        return;
      }
      try {
        addBomTree({
          workId: this.workOrderInfo.id,
          bomTemplateId: this.templateChoose,
        }).then((res) => {
          if (res.code !== "0") {
            this.$message.error(res.errMsg);
            return;
          }
          this.$message.success("拆解bom树已生成！");
          this.getBomTree();
        });
      } catch (error) {
        this.treeData = [];
      }
    },
    /**
     * 模板选择
     */
    async handleTemplateChange() {
      //如果已经选中了则需要进行二次确认
      if (
        this.oldTemplateChoose &&
        this.oldTemplateChoose !== this.templateChoose
      ) {
        this.changeConfirm();
        return;
      }
      this.getTreeData();
    },
    /**
     * 获取BOM树模板
     */
    getTemplateOptions(params) {
      return new Promise((resolve, reject) => {
        const { pageNum, pageSize, searchKey } = params;
        let queryParms = {
          pageNum,
          pageSize,
          workOrderType: 2,
          templateName: searchKey,
        };
        getBomTemplate(queryParms).then((res) => {
          let options = (res.data.pageList || []).map((item) => ({
            label: item.templateName,
            value: item.id,
          }));
          resolve({
            options: options,
            totalPage: res.data.allPageNum,
          });
        });
      });
    },
    /**树节点操作 */
    addNode(node, data) {
      this.operateRow = data;
      this.operateType = "add";
      this.openModal("showAdd");
    },
    updateNode(node, data) {
      this.operateRow = data;
      this.operateType = "update";
      this.openModal("showAdd");
    },
    //删除
    removeNode(node, data) {
      this.$confirm(
        `此操作将永久删除该${data.bomName}节点, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "error",
        }
      )
        .then(() => {
          delBomTreeNode({
            workId: this.workOrderInfo.id,
            bomId: data.id,
          }).then((res) => {
            if (res.code !== "0") {
              this.$message.error(res.errMsg);
              return;
            }
            this.$message.success("操作成功");
            this.getBomTree();
          });
        })
        .catch(() => {
          this.$message.info("操作已取消!");
        });
    },
    /**
     * 上传
     */
    beforeUpload(file) {
      if (this.fileList.length >= this.MAX_IMG_NUM) {
        this.$message.error(`最多上传${this.MAX_IMG_NUM}张图片`);
        return false;
      }
      const fileFix = file.name.split(".").pop().toLowerCase();
      if (this.acceptType.indexOf(fileFix) === -1) {
        this.$message.error(`上传格式不支持,仅支持${this.acceptType}`);
        return false;
      }
      if (file.size / 1024 / 1024 > MAX_IMG_SIZE) {
        this.$message.error(`图片大小请勿超过${MAX_IMG_SIZE}M`);
        return false;
      }
    },
    /**
     * 关闭弹窗
     */
    closeModal(modeName, isSearch = false) {
      this[modeName] = false;
      isSearch && this.getBomTree();
    },
    /**
     *  打开弹窗
     */
    openModal(modalName) {
      this[modalName] = true;
    },
    /**
     * 树节点选中时操作
     */
    handleNodeClick(data) {
      this.operateRow = data;
      this.fileList = (data.imgList || [])
        .filter((item) => this.imgType === item.imgType)
        .map((item) => ({
          fileName: item.imgName,
          fileUrl: item.imgPath,
          imgType: item.imgType,
        }));
    },
    //二维码打印
    printQrCode(targetValue) {
      this.showPrint = false;
      let dom = ""; // 拼接的字符串
      targetValue.forEach((item, i) => {
        dom += `<div style='page-break-after:always'>
        <table align='center' style='border: 1px solid black'> <tr style='border: 1px solid black'> <th style='border: 1px solid black;min-width:120px' colspan='2'>${
          item.prodNumber || ""
        }</th>
        <td rowspan='3' colspan='3'><div id='${
          item.serialCode
        }' style='text-align: center'></div></td>
        </tr>
        </table>
        </div>
        `;
      });
      this.printWin = window.open(""); // 新打开一个空窗口

      this.printWin.document.write(dom);
      setTimeout(() => {
        this.printWin.document.title = "衡变MES管理端";
        targetValue.forEach((item) => {
          new QRCode(this.printWin.document.getElementById(item.serialCode), {
            width: 100,
            height: 100,
            text: JSON.stringify(item),
            colorDark: "#000000", // 前景色
            colorLight: "#ffffff", // 背景色
            correctLevel: QRCode.CorrectLevel.H, // 降低容错级别
          });
        });
        this.printWin.addEventListener("afterprint", () => {
            if (this.printWin) {
              this.printWin.close();
              this.printWin = null;
            }
          },
          { once: true });
        this.printWin.print();
      }, 100);
    },
  },
};
</script>

<style lang="scss" scoped>
$left-title-height: 50px;
$left-width: 330px;
:deep(.el-input) {
  width: 100%;
}
:deep(.el-tree) {
  width: fit-content;
}
.mrl10 {
  margin-left: 10px;
}
.bom-box {
  width: 100%;
  height: 100%;
}
.uploadOperator {
  max-height: 100px;
  overflow-y: auto;
}
.uploadOperatorItem {
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .deleteBtn {
    margin-right: 10px;
    margin-left: 4px;
    margin-top: -2px;
  }
}
.bom-content {
  display: flex;
  width: 100%;
  margin-top: 15px;
  height: 580px;
  border: 1px solid #e9ebee;
  :deep(.el-input--small .el-input__inner) {
    width: inherit;
  }
  &-left {
    width: $left-width;
    height: calc(100% - 15px);
    border-right: 1px solid #e9ebee;
    &-title {
      width: 100%;
      height: $left-title-height;
      line-height: $left-title-height;
      padding: 0 15px 0 20px;
      border-bottom: 1px solid #e9ebee;
      text-align: left;
      font-weight: 600;
    }
    .bom-tree {
      overflow: auto;
      height: calc(100% - #{$left-title-height});
      margin: 10px;
    }
  }
  &-right {
    width: calc(100% - #{$left-width});
    height: calc(100% - 15px);
    padding-left: 40px;
    .operate-wrap {
      text-align: center;
      font-size: 24px;
      font-weight: 700;
      height: 60px;
      line-height: 60px;
    }
  }
}
</style>
