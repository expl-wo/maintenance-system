<template>
  <div class="app-container order-list-box">
    <el-form :inline="true">
      <el-form-item label="上报时间">
        <el-date-picker
          v-model="queryParams.time"
          type="datetimerange"
          :value-format="COMMON_FORMAT"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :disabled-date="disabledDate"
          :default-time="defaultTime"
          align="right"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="问题类别">
        <el-select
          v-model="queryParams.issue"
          placeholder="请选择"
          clearable
          @change="getList"
        >
          <el-option
            v-for="item in issueOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="问题所属/提交人">
        <el-input
          v-model="queryParams.searchKey"
          clearable
        />
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
                v-if="row.pictureUrl"
                title="图片"
                @click="openModal(row, 'imgModal')"
              >
                <el-icon><PictureFilled /></el-icon>
              </el-button>
              <el-button
                v-if="row.videoUrl"
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
    <el-dialog
      draggable
      title="视频预览"
      v-model="videoModal"
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
import { COMMON_FORMAT } from "@/views/overhaul/constants.js";
import dayjs from "dayjs";
import Pagination from "@/components/Pagination"; // 分页
import {
  getAndonIssuePage,
  getAndonType,
} from "@/api/overhaul/andonIssueApi.js";
import { ISSUE_COLUMNS } from "./config.js";
export default {
  name: "IssueTable",
  components: { Pagination },
  props: {
    //当前工单的详情
    workOrderInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    sceneType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      COMMON_FORMAT,
      defaultTime: [new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)], //默认时间
      imgModal: false,
      imgViewerList: [], //预览图片url
      videoModal: false,
      videoUrl: "",
      ISSUE_COLUMNS: Object.freeze(ISSUE_COLUMNS),
      issueOptions: [],
      listLoading: true,
      tableData: [],
      //分页参数
      pageOptions: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
      },
      //查询参数
      queryParams: {
        time: [
          dayjs().startOf("day").subtract(7, 'day').format(COMMON_FORMAT),
          dayjs().endOf("day").format(COMMON_FORMAT),
        ],
        searchKey: "",
        issue: undefined,
      },
    };
  },
  created() {
    this.getAndonTypeList();
    this.getList();
  },
  methods: {
    dealUrl(url) {
      if (!url) return "";
      if (url.indexOf("minioServer") < 0) {
        url = "minioServer/" + url;
      }
      return url;
    },
    //禁用时间主要用于禁止开始时间早于结束时间
    disabledDate(Date) {
      return dayjs(Date).isAfter(dayjs());
    },
    getAndonTypeList() {
      getAndonType().then((res) => {
        if(res.code!=='0'){
          this.$message.error(res.errMsg)
          return
        }
        this.issueOptions = (res.data.value || []).map((item) => ({
          label: item.cateName,
          value: item.id,
        }));
      });
    },
    //打开弹窗
    openModal(row, modalName) {
      if (modalName === "imgModal") {
        this.imgViewerList = row.pictureUrl
          .split("|")
          .map((item) => this.dealUrl(item));
      } else {
        this.videoUrl = this.dealUrl(row.videoUrl);
      }
      this[modalName] = true;
    },
    //分页发生改变时
    pageChange({ limit, page }) {
      this.pageOptions.pageNum = page;
      if (limit) {
        this.pageOptions.pageSize = limit;
      }
      this.getList();
    },
    getList() {
      this.listLoading = true;
      let params = {
        workCode: this.workOrderInfo.id,
        workScene: this.sceneType,
        pageNum: this.pageOptions.pageNum,
        pageSize: this.pageOptions.pageSize,
        searchKey: this.queryParams.searchKey,
        cateId: this.queryParams.issue,
        startTime: this.queryParams.time ? this.queryParams.time[0] : undefined,
        endTime: this.queryParams.time ? this.queryParams.time[1] : undefined,
      };
      getAndonIssuePage(params)
        .then((res) => {
          const { total, pageList } = res.data;
          this.tableData =
            (pageList || []).map((item, index) => ({ ...item, id: index })) ||
            [];
          this.pageOptions.total = total;
        })
        .finally(() => {
          this.listLoading = false;
        });
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
