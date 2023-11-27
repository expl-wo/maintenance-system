<template>
  <div class="mark-box">
    <div class="mark-warp">
      <el-form :inline="true">
        <el-form-item label="标记时间">
          <el-date-picker
            v-model="queryParams.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="isPause || !checkList.length"
            @click="handleDelete('', true)"
          >
            <el-icon class="el-icon--left"><Delete /></el-icon>删除
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选
          </el-checkbox>
        </el-form-item>
      </el-form>
    </div>
    <div class="mark-list">
      <div class="card-list" v-for="(item, index) in markList" :key="index">
        <div class="image">
          <img :src="item.markImg" @click="openImgViewer([item.markImg])" />
          <el-image-viewer
            v-if="showImgViewer"
            :url-list="imgViewerList"
            @close="showImgViewer = false"
          ></el-image-viewer>
        </div>

        <div class="card-list-content">
          <div
            class="card-list-content-title card-list-content-item"
            :title="item.markName"
          >
            {{ item.markName }}
          </div>
          <div class="card-list-content-item" :title="item.captureTime">
            标记时间:{{ item.captureTime }}
          </div>
          <div class="card-list-content-item" :title="item.process">
            关联工序:{{ item.process }}
          </div>
          <div class="card-list-content-item" :title="item.channelList">
            所属通道:{{ item.channelList }}
          </div>
          <div class="card-list-content-item" :title="item.demo">
            备注:{{ item.demo }}
          </div>
        </div>
        <div class="card-list-footer">
          <el-checkbox
            :model-value="checkList.includes(item.id)"
            @change="checkBoxChange($event, item.id)"
          ></el-checkbox>
          <div class="footer-warp" v-if="!isPause">
            <el-icon
              class="el-icon--left"
              title="编辑"
              @click.stop="editRecord(item)"
              ><Edit
            /></el-icon>
            <el-icon
              class="el-icon--left"
              title="删除"
              @click.stop="handleDelete(item)"
              ><Delete
            /></el-icon>
          </div>
        </div>
      </div>
    </div>
    <pagination
      v-show="pageOptions.total"
      :total="pageOptions.total"
      :page="pageOptions.pageNum"
      :limit="pageOptions.pageSize"
      @pagination="pageChange"
    />
    <!-- 编辑编辑记录 -->
    <edit-marker-modal
      v-if="editRecordFlag"
      :operateRow="operateRow"
      modalName="editRecordFlag"
      @closeModal="closeModal"
    ></edit-marker-modal>
  </div>
</template>
<script>
import { Delete, Edit } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import EditMarkerModal from "./editMarkerRecord.vue";
import Pagination from "@/components/Pagination"; // 分页
export default {
  components: {
    EditMarkerModal,
    Pagination,
    Delete,
    Edit,
  },
  props: {
    //当前工单的详情
    workOrderInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    //工单类型
    workOrderType: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {
      showImgViewer: false,
      testImg:
        "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
      imgViewerList: [], //图片预览列表
      //分页参数
      pageOptions: {
        total: 1,
        pageNum: 1,
        pageSize: 20,
      },
      //查询参数
      queryParams: {
        time: [
          dayjs().startOf().format("YYYY-MM-DD HH:mm:ss"),
          dayjs().endOf().format("YYYY-MM-DD HH:mm:ss"),
        ],
      },
      //全选相关数据
      checkAll: false,
      isIndeterminate: false,
      markList: [],
      //选择项
      checkList: [],
      //日期选择框
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      operateRow: null,
      editRecordFlag: false,
    };
  },
  watch: {
    checkList(val) {
      console.log(val);
    },
  },
  computed: {
    //暂停
    isPause() {
      return this.workOrderInfo.orderStatus === 17;
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    //打开图片预览
    openImgViewer(urlList) {
      this.imgViewerList = urlList;
      this.showImgViewer = true;
    },
    //分页发生改变时
    pageChange({ limit, page }) {
      this.pageOptions.pageNum = page;
      if (limit) {
        this.pageOptions.pageSize = limit;
      }
      this.getList();
    },
    /**
     * 获取分页列表
     */
    getList() {
      this.markList = [
        {
          id: 1,
          markName: "测试标记名称1",
          process: "子工序1",
          demo: "这是配置",
          channelList: "视频通道1",
          captureTime: "2023-11-17 10:22:23",
          markImg: this.testImg,
        },
        {
          id: 2,
          markName: "测试标记名称1",
          markImg: this.testImg,
          process: "子工序1",
          demo: "这是配置",
          channelList: "视频通道1",
          captureTime: "2023-11-17 10:22:23",
        },
        {
          id: 3,
          markName: "测试标记名称1",
          process: "子工序1",
          markImg: this.testImg,
          demo: "这是配置",
          channelList: "视频通道1",
          captureTime: "2023-11-17 10:22:23",
        },
        {
          id: 4,
          markName: "测试标记名称1",
          process: "子工序1",
          markImg: this.testImg,
          demo: "这是配置",
          channelList: "视频通道1",
          captureTime: "2023-11-17 10:22:23",
        },
        {
          id: 5,
          markName: "测试标记名称1",
          process: "子工序1",
          markImg: this.testImg,
          demo: "这是配置",
          channelList: "视频通道1",
          captureTime: "2023-11-17 10:22:23",
        },
        {
          id: 6,
          markName: "测试标记名称1",
          process: "子工序1",
          markImg: this.testImg,
          demo: "这是配置",
          channelList: "视频通道1",
          captureTime: "2023-11-17 10:22:23",
        },
      ];
    },
    /**
     * 关闭弹窗
     */
    closeModal(modeName, isSearch = false) {
      this[modeName] = false;
      isSearch && this.getList();
    },
    /**
     * 编辑标记记录
     */
    editRecord(row) {
      this.operateRow = row;
      this.editRecordFlag = true;
    },
    //删除操作
    handleDelete(row, isBatch = false) {
      let params = [];
      if (isBatch) {
        if (!this.checkList.length) {
          this.$message({
            message: "所选数据不能为空，请选中后删除！",
            type: "warning",
          });
          return;
        }
        params = this.checkList;
      } else {
        params = [row.id];
      }
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          console.log(params);
          //请求接口
        })
        .catch(() => {
          console.log("已取消");
        });
    },
    /**
     * checkbox 发生改变时
     */
    checkBoxChange(event, id) {
      let targetIndex = this.checkList.findIndex((item) => item === id);
      if (targetIndex > -1) {
        this.checkList.splice(targetIndex, 1);
      } else {
        this.checkList.push(id);
      }
      this.checkAll = this.markList.length === this.checkList.length;
      this.isIndeterminate =
        this.checkList.length > 0 &&
        this.checkList.length < this.markList.length;
    },
    /**
     * 全选按钮操作
     */
    handleCheckAllChange(val) {
      this.checkList = val ? this.markList.map((item) => item.id) : [];
      this.isIndeterminate = false;
    },
  },
};
</script>

<style lang="scss" scoped>
$card-width: 364px;
$warp-height: 40px;
$card-height: 428px;
$card-img-height: 220px;
$card-footer-height: 40px;
::v-deep(.pagination-container) {
  padding: 0;
}
::v-deep(.el-image-viewer__mask) {
  background-color: #00000047;
}
.mark-box {
  height: 100%;
  width: 100%;
  .mark-warp {
    height: $warp-height;
  }
  .mark-list {
    overflow-y: auto;
    display: flex;
    justify-content: flex-start;
    height: 600px;
    flex-flow: wrap;
    .card-list {
      width: $card-width;
      height: $card-height;
      margin-right: 20px;
      margin-top: 20px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      border: 1px solid #ebeef5;
      overflow: hidden;
      color: #303133;
      transition: 0.3s;
      .image {
        width: 100%;
        height: $card-img-height;
        padding: 16px 16px 0 16px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
          transition: all 0.2s linear;
          &:hover {
            cursor: pointer;
            transform: scale(1.1, 1.3);
            filter: contrast(130%);
          }
        }
      }
      &-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        height: calc(100% - #{$card-img-height} - #{$card-footer-height});
        padding: 8px 16px 0 16px;
        font-size: 14px;
        &-title {
          font-weight: 700;
        }
        &-item {
          flex: 1;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: keep-all;
        }
      }
      &-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: $card-footer-height;
        padding: 0 16px;
        background-color: hsla(212, 17%, 81%, 0.2);
        .footer-warp {
          width: 40px;
          display: flex;
          justify-content: space-between;
          i:hover {
            cursor: pointer;
            color: #5cb6ff;
          }
        }
      }
    }
  }
}
</style>