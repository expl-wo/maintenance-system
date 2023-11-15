<template>
  <div class="bom-box">
    <el-button type="primary" size="small">
      <el-icon class="el-icon--left"><Stamp /></el-icon>审核
    </el-button>
    <div class="bom-content">
      <div class="bom-content-left">
        <div class="bom-content-left-title">BOM结构</div>
        <div class="bom-tree">
          <bom-tree
            :defaultProps="defaultProps"
            :treeData="treeData"
            nodeKey="uniqueCode"
            @nodeClick="handleNodeClick"
            @addNode="addNode"
            @updateNode="updateNode"
            @removeNode="removeNode"
          ></bom-tree>
        </div>
      </div>
      <div class="bom-content-right">
        <div class="operate-wrap">
          {{ currentSelectNode.procedureName }}
        </div>
        <el-descriptions
          title="基础信息"
          :column="1"
          :style="{ width: '500px' }"
        >
          <template #extra>
            <el-button size="small" type="primary" @click="printQrCode"
              >打印二维码</el-button
            >
          </template>
          <el-descriptions-item label="利旧情况"
            >kooriookami</el-descriptions-item
          >
          <el-descriptions-item label="流水码"
            >18100000000</el-descriptions-item
          >
          <el-descriptions-item label="拆解照片">
            <div>
              <el-upload
                class="upload-demo"
                action="#"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                v-model:file-list="fileList"
                :before-upload="beforeUpload"
                :accept="acceptType"
                list-type="picture"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <template #tip>
                  <div class="el-upload__tip">只能上传图片，且不超过10M</div>
                </template>
              </el-upload>
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
  </div>
</template>

<script>
import { PROCESS_COLUMNS_MAP } from "../../config.js";
import { Stamp } from "@element-plus/icons-vue";
import AddBom from "./addBom.vue";
import BomTree from "@/components/BomTree/index.vue";
const testTreeData = [
  {
    procedureCode: "",
    procedureName: "根节点",
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
const MAX_IMG_SIZE = 10 * 1024 * 1024;
export default {
  name: "Bom",
  components: {
    BomTree,
    Stamp,
    AddBom,
  },
  data() {
    return {
      showAdd: false,
      acceptType: "image/*",
      fileList: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
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

      //派工配置属性
      distributeModalFlag: false,
      issueModal: false,
      operateRow: null,
      operateType: "add",
      printWin: null, //打印二维码窗口
    };
  },

  computed: {
    //表格渲染列表
    columns() {
      return PROCESS_COLUMNS_MAP[this.currentSelectNode.type || 1];
    },
  },
  created() {
    this.getTreeData(); //获取工序树
  },
  methods: {
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
        `此操作将永久删除该${data.procedureName}节点, 是否继续?`,
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
      if (file.size > MAX_IMG_SIZE) {
        this.$message.error("图片大小请勿超过10M");
        return false;
      }
      console.log(file);
      debugger;
    },
    /**处理图片 */
    handleRemove(file, fileList) {
      console.log(file, fileList, this.fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    /**
     * 得到所有
     */
    getList() {
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
    printQrCode() {
      console.log(this.currentSelectNode);
      this.printWin = window.open(""); // 新打开一个空窗口
      this.printWin.document.title = "打印二维码";
      this.printWin.addEventListener("afterprint", this.backWin);
      this.printWin.print();
    },
    backWin() {
      if (this.printWin) {
        this.printWin.close();
        this.printWin.removeEventListener("afterprint", this.backWin);
        this.printWin = null;
      }
    },
    /**
     * 获取树的 数据
     */
    getTreeData() {
      this.treeData = testTreeData;
    },
  },
};
</script>

<style lang="scss" scoped>
$left-title-height: 50px;
$left-width: 330px;

.bom-box {
  width: 100%;
  height: 100%;
}
.bom-content {
  display: flex;
  width: 100%;
  margin-top: 15px;
  height: 580px;
  border: 1px solid #e9ebee;
  ::v-deep(.el-input--small .el-input__inner) {
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
