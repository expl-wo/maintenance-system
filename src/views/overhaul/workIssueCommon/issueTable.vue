<template>
  <div class="app-container order-list-box">
    <el-form :inline="true">
      <el-form-item label="上报时间">
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
      <el-form-item label="问题类别">
        <el-select v-model="queryParams.issue" placeholder="请选择" clearable>
          <el-option
            v-for="item in issueOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="问题所属/提交人">
        <el-input v-model="queryParams.searchKey" @keyup.enter="handleFilter" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">
          <el-icon class="el-icon--left"><Search /></el-icon> 查询
        </el-button></el-form-item
      >
    </el-form>

    <el-table
      :data="tableData"
      v-loading="listLoading"
      stripe
      style="width: 100%"
      height="550"
      show-overflow-tooltip
    >
      <template v-for="item in ISSUE_COLUMNS" :key="item.prop">
        <el-table-column
          :key="item.prop"
          v-bind="item"
          v-if="item.prop === 'operation'"
        >
          <template #default="{ row }">
            <el-button-group>
              <el-button
                type="primary"
                title="图片"
                @click="openModal(row, 'imgModal')"
              >
                <el-icon><PictureFilled /></el-icon>
              </el-button>
              <el-button
                type="primary"
                title="视频"
                @click="openModal(row, 'videoModal')"
              >
                <el-icon><VideoCameraFilled /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
        <el-table-column v-else v-bind="item"></el-table-column>
      </template>
    </el-table>
    <el-image-viewer
      v-if="imgModal"
      :url-list="imgViewerList"
      @close="imgModal = false"
    ></el-image-viewer>
    <!-- 视频预览 -->
    <el-dialog draggable
      title="视频预览"
      :model-value="videoModal"
      :destroy-on-close="true"
    >
      <div>
        <video
          style="width: 100%"
          height="500"
          controls="controls"
          :src="videoUrl"
        ></video>
      </div>
    </el-dialog>
    <pagination
      v-show="pageOptions.total"
      :total="pageOptions.total"
      :page="pageOptions.pageNum"
      :limit="pageOptions.pageSize"
      @pagination="pageChange"
    />
  </div>
</template>

<script>
import dayjs from "dayjs";
import Pagination from "@/components/Pagination"; // 分页
import { ISSUE_COLUMNS } from "./config.js";
import {
  Search,
  PictureFilled,
  VideoCameraFilled,
} from "@element-plus/icons-vue";
export default {
  name: "IssueTable",
  components: { Pagination, Search, PictureFilled, VideoCameraFilled },

  data() {
    return {
      imgModal: false,
      imgViewerList: [], //预览图片url
      videoModal: false,
      videoUrl: "",
      ISSUE_COLUMNS: Object.freeze(ISSUE_COLUMNS),
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
      issueOptions: [{ label: "运输问题", value: "1" }],
      listLoading: true,
      tableData: [],
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
        searchKey: "",
        issue: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //打开弹窗
    openModal(row, modalName) {
      this[modalName] = true;
      if (modalName === "imgModal") {
        this.imgViewerList = [
          "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
          "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
          "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
          "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg",
          "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg",
          "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg",
          "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg",
        ];
      } else {
        this.videoUrl = "http://10.16.9.128:9000/hb-digital/d3c79996b92f43b7bc07a03367baaa1f_2023_11_25_09_09_59_394.mp4";
      }
    },
    //分页发生改变时
    pageChange({ limit, page }) {
      this.pageOptions.pageNum = page;
      if (limit) {
        this.pageOptions.pageSize = limit;
      }
      this.getList();
    },
    // handleFilter() {},
    getList() {
      this.listLoading = false;
      new Array(10).fill(1).forEach((item, index) => {
        this.tableData.push({
          id: index,
          ownership: "这是问题所属",
          issue: "问题分类",
          exceptionItem: "套管",
          issueDescription: "哈哈哈哈哈哈",
          submitter: "文罗江",
          useTime: "2023-10-23 12:00:00",
          notifier: "螺纹将",
          issueStatus: "测试",
        });
      });
      this.pageOptions.total = 1;
    },
  },
};
</script>
<style scoped lang="scss">
:deep(.pagination-container) {
  padding: 0;
}
.mrb15 {
  margin-bottom: 15px;
}
.mrl25 {
  margin-left: 25px;
}
.mrl10 {
  margin-left: 10px;
}
.operate-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
.order-list-box {
  position: relative;
  .order-info {
    position: absolute;
    inset: 0;
    width: 100%;
    height: fit-content;
    padding: 0;
    z-index: 999;
  }
}
</style>
