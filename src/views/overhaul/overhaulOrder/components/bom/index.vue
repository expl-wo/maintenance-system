<template>
  <div class="bom-box">
    <template v-if="isShowTemplate">
      <span class="mrl10">设备清单模板:</span>
      <select-page
        v-model="templateChoose"
        :defaultSelectVal="defaultSelectVal"
        :getOptions="getTemplateOptions"
        :clearable="false"
        @change="handleTemplateChange"
      />
    </template>

    <div class="bom-content" v-if="templateChoose">
      <div class="bom-content-left">
        <div class="bom-content-left-title">BOM结构</div>
        <div class="bom-tree">
          <bom-tree
            :treeData="treeData"
            @nodeClick="handleNodeClick"
            @addNode="addNode"
            @updateNode="updateNode"
            @removeNode="removeNode"
          ></bom-tree>
        </div>
      </div>
      <div class="bom-content-right">
        <div class="operate-wrap">
          {{ currentSelectNode.treeName }}
        </div>
        <el-descriptions
          title="基础信息"
          :column="1"
          :style="{ width: '500px' }"
        >
          <template #extra>
            <el-button type="primary" @click="openModal('showPrint')"
              >打印二维码</el-button
            >
          </template>
          <el-descriptions-item label="利旧状态">利旧</el-descriptions-item>
          <el-descriptions-item label="流水码"
            >18100000000</el-descriptions-item
          >
          <el-descriptions-item label="工位码"
            >18100000000</el-descriptions-item
          >
          <el-descriptions-item label="待入库状态"
            >18100000000</el-descriptions-item
          >
          <el-descriptions-item label="拆解照片">
            <div>
              <el-upload
                class="upload-demo"
                action="#"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                :http-request="uploadFile"
                :accept="acceptType"
                list-type="picture"
                :on-exceed="onExceed"
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
              <file-list :fileList="fileList" @onDelete="deletePic"></file-list>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <add-bom
      v-if="showAdd"
      :operateType="operateType"
      :operateRow="operateRow"
      modalName="showAdd"
      @closeModal="closeModal"
    ></add-bom>
    <print-modal
      v-if="showPrint"
      modalName="showPrint"
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
import { getBomTemplate, findBomTemplateById } from "@/api/overhaul/bomApi.js";
import { uploadFile } from "@/api/overhaul/fileUploadApi.js";
import QRCode from "qrcodejs2";
import { MAX_IMG_SIZE } from "@/views/overhaul/constants.js";
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
      defaultSelectVal: {}, //默认选中的模板 用于回显
      MAX_IMG_NUM: 3,
      MAX_IMG_SIZE,
      templateChoose: undefined,
      oldTemplateChoose: undefined,
      showAdd: false,
      showPrint: false,
      acceptType: "image/*",
      fileList: [],
      treeData: [],
      //当前选中的节点
      currentNodeKey: [],
      currentSelectNode: {},
      //派工配置属性
      operateRow: null,
      operateType: "add",
      printWin: null, //打印二维码窗口
    };
  },
  created() {
    //默认模板回显
    this.defaultSelectVal = {
      label: this.workOrderInfo.bomTemplateName,
      value: this.workOrderInfo.bomTemplateId,
    };
    this.templateChoose = this.workOrderInfo.bomTemplateId;
    this.getTreeData();
  },
  computed: {
    //只有现场检修时会进行模板选择，后续流程均时同步
    isShowTemplate() {
      return ["siteDismantle-BomVue"].includes(this.onlyTabName);
    },
  },
  methods: {
    //图片限制
    onExceed() {
      this.$message.error(`最多上传${MAX_IMG_NUM}个附件 `);
    },
    // 上传图片
    uploadFile(file) {
      const formData = new FormData();
      formData.append("file", file.file);
      uploadFile(formData).then(({ data }) => {
        this.fileList.push({
          fileName: data.fileName,
          fileUrl: data.url,
          uid: file.uid,
        });
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
        const {
          data: { bomTreeList },
        } = await findBomTemplateById(this.templateChoose);
        this.treeData = bomTreeList || [];
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
    addNode(node) {
      this.operateRow = node;
      this.operateType = "add";
      this.openModal("showAdd");
    },
    updateNode(node) {
      this.operateRow = node;
      this.operateType = "update";
      this.openModal("showAdd");
    },
    //删除
    removeNode(node, data) {
      this.$confirm(
        `此操作将永久删除该${data.treeName}节点, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          type: "error",
        }
      )
        .then(() => {
          this.$message.success("操作成功");
        })
        .catch(() => {
          this.$message.info("操作已取消!");
        });
    },
    /**
     * 上传
     */
    beforeUpload(file) {
      if (file.size / 1024 / 1024 > MAX_IMG_SIZE) {
        this.$message.error(`图片大小请勿超过${MAX_IMG_SIZE}M`);
        return false;
      }
    },
    /**处理图片 */
    handleRemove(file, fileList) {
      console.log(file, fileList, this.fileList);
    },
    handlePreview(file) {
      console.log(file);
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
    openModal(modalName) {
      this[modalName] = true;
    },
    /**
     * 树节点选中时操作
     */
    handleNodeClick(data) {
      this.currentSelectNode = data;
    },
    //二维码打印
    printQrCode(targetValue) {
      this.showPrint = false;
      let dom = ""; // 拼接的字符串
      targetValue.forEach((item, i) => {
        dom += `<div style='page-break-after:always'>
        <table align='center' style='border: 1px solid black'> <tr style='border: 1px solid black'> <th style='border: 1px solid black' colspan='2'>${item}</th>
        <td rowspan='3' colspan='3'><div id='${item}' style='text-align: center'></div></td>
        </tr>
        <tr style='border: 1px solid black'> <td colspan='2' style='border: 1px solid black;text-align: center'>${item}</td></tr>
        <tr style='border: 1px solid black'> <td colspan='1' style='border: 1px solid black;text-align: center'>${item}</td></tr>
        </table>
        </div>
        `;
      });
      this.printWin = window.open(""); // 新打开一个空窗口

      this.printWin.document.write(dom);
      setTimeout(() => {
        this.printWin.document.title = "衡变MES管理端";
        targetValue.forEach((item) => {
          new QRCode(this.printWin.document.getElementById(item), {
            width: 80,
            height: 80,
            text: item,
            colorDark: "#000000", // 前景色
            colorLight: "#ffffff", // 背景色
            correctLevel: QRCode.CorrectLevel.M, // 降低容错级别
          });
        });
        this.printWin.addEventListener("afterprint", this.backWin);
        this.printWin.print();
      }, 100);
    },
    backWin() {
      if (this.printWin) {
        this.printWin.close();
        this.printWin.removeEventListener("afterprint", this.backWin);
        this.printWin = null;
      }
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
