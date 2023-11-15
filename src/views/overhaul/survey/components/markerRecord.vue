<template>
  <div class="mark-box">
    <div class="mark-warp">
      <div>
        <el-button type="primary" size="small" @click="handleDelete('', true)">
          <el-icon class="el-icon--left"><Delete /></el-icon>删除
        </el-button>
        <el-checkbox
          class="choose-all"
          size="small"
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          >全选
        </el-checkbox>
      </div>

      <div>
        标记时间:
        <el-date-picker
          v-model="queryParams.time"
          size="small"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="mark-list">
      <div class="card-list" v-for="(item, index) in markList" :key="index">
        <div class="image">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          />
        </div>

        <div class="card-list-content">
          <div class="card-list-content-title card-list-content-item">
            这是标记名称
          </div>
          <div class="card-list-content-item">标记时间:2022-02-13 19:22:22</div>
          <div class="card-list-content-item">关联工序:子工序头111</div>
          <div class="card-list-content-item">所属通道:通道11</div>
          <div class="card-list-content-item">备注:这是备注</div>
        </div>
        <div class="card-list-footer">
          <el-checkbox
            size="small"
            :value="checkList.includes(item.id)"
            @change="checkBoxChange($event, item.id)"
          ></el-checkbox>
          <div class="footer-warp">
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
      :page.sync="pageOptions.pageNum"
      :limit.sync="pageOptions.pageSize"
      @pagination="getList"
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
import moment from "moment";
import EditMarkerModal from "./editMarkerRecord.vue";
import Pagination from "@/components/Pagination"; // 分页
export default {
  components: {
    EditMarkerModal,
    Pagination,
    Delete,
    Edit,
  },
  data() {
    return {
      //分页参数
      pageOptions: {
        total: 1,
        pageNum: 1,
        pageSize: 20,
      },
      //查询参数
      queryParams: {
        time: [
          moment().startOf().format("YYYY-MM-DD HH:mm:ss"),
          moment().endOf().format("YYYY-MM-DD HH:mm:ss"),
        ],
      },
      //全选相关数据
      checkAll: false,
      isIndeterminate: false,
      markList: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
      ],
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
  methods: {
    /**
     * 获取分页列表
     */
    getList() {
      debugger;
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
      debugger;
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
.choose-all {
  margin-left: 15px;
}
::v-deep(.pagination-container) {
  padding: 0;
}
.mark-box {
  height: 100%;
  width: 100%;
  .mark-warp {
    display: flex;
    height: $warp-height;
    justify-content: space-between;
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
            transform: scale(1.1, 1.1);
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
        padding: 0 16px;
        font-size: 14px;
        &-title {
          font-weight: 700;
        }
        &-item {
          flex: 1;
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