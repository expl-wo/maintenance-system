<template>
  <div class="mark-box" v-loading="loading">
    <div class="mark-warp">
      <el-form :inline="true">
        <el-form-item label="标记时间">
          <el-date-picker
            v-model="queryParams.time"
            type="datetimerange"
            :disabled-date="disabledDate"
            :default-time="defaultTime"
            :value-format="COMMON_FORMAT"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">
            <el-icon class="el-icon--left"><Search /></el-icon> 查询
          </el-button>
          <el-button
            v-if="$isAuth(this.editAuth)"
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
    <div class="mark-list" v-show="markList.length">
      <div class="card-list" v-for="(item, index) in markList" :key="index">
        <div class="image">
          <video
            v-if="item.markType === 2"
            style="width: 100%"
            height="220"
            controls="controls"
            :src="dealUrl(item.videoPath)"
          />
          <img
            v-else
            :src="dealUrl(item.imagePath)"
            @click="openImgViewer([dealUrl(item.imagePath)])"
          />
        </div>

        <div class="card-list-content">
          <div
            class="card-list-content-title card-list-content-item"
            :title="item.markName"
          >
            {{ item.markName }}
          </div>
          <div class="card-list-content-item" :title="item.capTime">
            标记时间:{{ item.capTime }}
          </div>
          <div class="card-list-content-item" :title="item.workProcedureName">
            关联工序:{{ item.workProcedureName }}
          </div>
          <div class="card-list-content-item" :title="item.channelName">
            所属通道:{{ item.channelName }}
          </div>
          <div class="card-list-content-item" :title="item.memo">
            备注:{{ item.memo }}
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
              v-if="$isAuth(this.editAuth)"
              @click.stop="editRecord(item)"
              ><Edit
            /></el-icon>
            <el-icon
              class="el-icon--left"
              title="删除"
              v-if="$isAuth(this.editAuth)"
              @click.stop="handleDelete(item)"
              ><Delete
            /></el-icon>
          </div>
        </div>
      </div>
    </div>
    <el-empty v-show="!pageOptions.total" description="暂无标记记录！" />
    <el-image-viewer
      v-if="showImgViewer"
      :url-list="imgViewerList"
      @close="showImgViewer = false"
    ></el-image-viewer>
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
import dayjs from "dayjs";
import EditMarkerModal from "./editMarkerRecord.vue";
import Pagination from "@/components/Pagination"; // 分页
import { COMMON_FORMAT, MENU_CODE } from "@/views/overhaul/constants.js";
import { pageVideoMarker, deleteVideoMarker } from "@/api/overhaul/videoApi.js";
export default {
  components: {
    EditMarkerModal,
    Pagination,
  },
  props: {
    //当前工单的详情
    workOrderInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    onlyTabName: {
      type: String,
      default: "",
    },
    //工单类型
    workOrderType: {
      type: String,
      default: "1",
    },
    sceneType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      showImgViewer: false,
      COMMON_FORMAT,
      defaultTime: [new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)], //默认时间
      imgViewerList: [], //图片预览列表
      //分页参数
      pageOptions: {
        total: 0,
        pageNum: 1,
        pageSize: 20,
      },
      //查询参数
      queryParams: {
        time: [
          dayjs().startOf("day").format(COMMON_FORMAT),
          dayjs().endOf("day").format(COMMON_FORMAT),
        ],
      },
      //全选相关数据
      checkAll: false,
      isIndeterminate: false,
      markList: [],
      //选择项
      checkList: [],
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
    editAuth() {
      return `${MENU_CODE[+this.workOrderType]}_${this.onlyTabName.split("-")[0]}_markerList_edit`;
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    //禁用时间主要用于禁止开始时间早于结束时间
    disabledDate(Date) {
      return dayjs(Date).isAfter(dayjs());
    },
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
      const { pageSize, pageNum } = this.pageOptions;
      let params = {
        pageNum,
        pageSize,
        sceneType: this.sceneType,
        workId: this.workOrderInfo.id,
        associateType: -1,
        startTime: this.queryParams.time ? this.queryParams.time[0] : undefined,
        endTime: this.queryParams.time ? this.queryParams.time[1] : undefined,
      };
      this.loading = true;
      pageVideoMarker(params)
        .then((res) => {
          const { total, pageList } = res.data;
          this.markList = pageList || [];
          this.pageOptions.total = total;
        })
        .finally(() => {
          this.loading = false;
        });
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
          //请求接口
          deleteVideoMarker({ ids: params }).then((res) => {
            if (res.code !== "0") {
              this.$message.error(res.errMsg);
              return;
            }
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          });
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
    dealUrl(url) {
      if (!url) return "";
      if (url.indexOf("minioServer") < 0) {
        url = "minioServer/" + url;
      }
      return url;
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
:deep(.pagination-container) {
  padding: 0;
}
:deep(.el-image-viewer__mask) {
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