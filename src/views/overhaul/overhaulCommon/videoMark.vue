<template>
  <div class="video-box">
    <div class="video-content">
      <div class="video-content-left" v-loading="treeLoading">
        <div class="video-content-left-title">工序结构</div>
        <div class="video-content-left-search">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>
        </div>

        <div class="video-tree">
          <el-tree
            ref="treeRef"
            default-expand-all
            :expand-on-click-node="false"
            :data="treeData"
            :props="defaultProps"
            highlight-current
            :filter-node-method="filterNode"
            node-key="uniqueCode"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
        <div class="video-form">
          <el-select
            v-model="videoForm.channelCode"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in channelCodesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-date-picker
            v-model="videoForm.videoStartTime"
            type="datetime"
            :clearable="false"
            placeholder="选择开始日期"
            @change="videoStartTimeChange"
          >
          </el-date-picker>
          <el-date-picker
            :disabled="!videoForm.videoStartTime"
            v-model="videoForm.videoEndTime"
            type="datetime"
            :clearable="false"
            placeholder="选择结束日期"
            :disabled-date="disabledDate"
          >
          </el-date-picker>
          <div class="video-form-operate">
            <el-button type="primary" @click="search">
              <el-icon><Search /></el-icon>查询录像
            </el-button>
            <el-button type="info" @click="reset">
              <el-icon><RefreshLeft /></el-icon> 重置
            </el-button>
          </div>
        </div>
      </div>
      <div class="video-content-right">
        <DHPlayer
          @createSuccess="createSuccess"
          :shieldClass="['affix-anchor', 'affix-anchor-box']"
          videoId="survey-video-mark"
          :windowType="3"
          ref="dhPlayerRef"
          @picCap="picCap"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DHPlayer from "@/components/DHPlayer/index";
import dayjs from "dayjs";
import { PROCESS_NODE_ENUM } from "@/views/overhaul/constants.js";
import { getBindDev, getWorkTree } from "@/api/overhaul/workOrderApi.js";
import {
  addVideoMarker
} from "@/api/overhaul/videoApi.js";
export default {
  name: "VideoMark",
  components: {
    DHPlayer,
  },
  props: {
    //当前工单的详情
    workOrderInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    //指派人员信息
    appointInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    onlyTabName: {
      type: String,
      default: "",
    },
    sceneType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      player: null,
      treeData: [],
      defaultProps: {
        children: "childNodeList",
        label: "procedureName",
      },
      //当前选中的节点
      currentSelectNode: {},
      filterText: "",
      treeLoading: false,
      channelCodesOptions: [],
      templateChoose: "",
      templateName: "",
      workTreeStatus: "",
      videoForm: {
        channelCode: undefined,
        videoStartTime: dayjs().startOf("day"),
        videoEndTime: dayjs().endOf("day"),
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs["treeRef"].filter(val);
    },
    workOrderInfo: {
      handler(val) {
        const { procedureTemplateName, procedureTemplateCode } =
          this.workOrderInfo;
        this.templateChoose = procedureTemplateCode || undefined;
        this.templateName = procedureTemplateName || "";
        if (this.templateChoose && this.templateName) {
          this.getTreeData();
        }
      },
      immediate: true,
    },
  },
  destory() {
    this.disConnect();
  },
  methods: {
    //标记
    picCap(imgInfo, info) {
      const { base64Url } = imgInfo;
      let params ={
        workId:this.workOrderInfo.id,
        sceneType:this.sceneType,
        markType:1,
        base64:base64Url,
        capTime:'',
        channelcode:'',
        channelName:'',
        workProcedureId:'',
        workProcedureName:''
      }
      addVideoMarker().then(res=>{
        debugger
      })
      debugger;
    },
    createSuccess() {
      if (!this.player) {
        this.player = this.$refs.dhPlayerRef;
      }
    },
    disConnect() {
      if (this.player) {
        this.player.hideWindow();
        this.player.closeVideo();
        this.player.destory();
        this.player = null;
      }
    },
    reset() {
      this.videoForm = {
        channelCode: undefined,
        videoStartTime: dayjs().startOf("day"),
        videoEndTime: dayjs().endOf("day"),
      };
    },
    search() {
      if (
        this.videoForm.channelCode &&
        this.videoForm.videoStartTime &&
        this.videoForm.videoEndTime
      ) {
        let target = this.channelCodesOptions.find(
          (item) => item.value === this.videoForm.channelCode
        );
        if (!target) {
          this.$message.error("通道不存在！");
          return;
        }
        this.player &&
          this.player.startPlayback([
            {
              channelId: target.value,
              channelName: target.label,
              startTime: this.videoForm.videoStartTime,
              endTime: this.videoForm.videoEndTime,
              recordSource: 2,
              snum: 0,
            },
          ]);
      } else {
        this.$message.error("请完善查询条件！");
      }
    },
    videoStartTimeChange(val) {
      if (dayjs(val).isAfter(dayjs(this.videoForm.videoEndTime))) {
        this.videoForm.videoEndTime = dayjs(val).endOf("day");
      }
    },
    //禁用时间主要用于禁止开始时间早于结束时间
    disabledDate(Date) {
      return dayjs(Date).isBefore(dayjs(this.videoForm.videoStartTime));
    },
    /**
     * 树节点过滤
     */
    filterNode(value, data) {
      if (!value) return true;
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
    //获取通道list
    getChannelList() {
      getBindDev({
        workCode: this.workOrderInfo.id,
        workOrderSceneType: this.sceneType,
        procedureCode: this.currentSelectNode.procedureCode,
        procedureType: this.currentSelectNode.procedureType,
        ifShowChild: true,
      }).then((res) => {
        const { channelInfoList } = res.data;
        this.channelCodesOptions = (channelInfoList || []).map((item) => ({
          label: item.channelName,
          value: item.channelCode,
        }));
      });
    },
    /**
     * 树节点选中时操作
     */
    handleNodeClick(data) {
      this.currentSelectNode = data;
      this.getChannelList();
    },

    /**
     * 获取树的 数据
     */
    getTreeData() {
      if (!this.templateChoose) return;
      this.treeLoading = true;
      getWorkTree({
        workCode: this.workOrderInfo.id,
        templateCode: this.templateChoose,
        procedureTypeList: [
          PROCESS_NODE_ENUM.NORM,
          PROCESS_NODE_ENUM.MIDDLE,
          PROCESS_NODE_ENUM.STEP,
        ],
        workOrderSceneType: this.sceneType,
      })
        .then(({ data: { oaExamineStatus, treeNode } }) => {
          if (!treeNode) return;
          this.treeData = [treeNode];
          this.workTreeStatus = +oaExamineStatus || 0;
          this.$nextTick(() => {
            if (this.$refs["treeRef"]) {
              this.$refs["treeRef"].setCurrentKey(
                this.treeData[0].uniqueCode || "root"
              );
            }
            this.currentSelectNode = this.$refs["treeRef"].getCurrentNode();
            this.getChannelList();
          });
        })
        .finally(() => {
          this.treeLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
$left-title-height: 36px;
$left-search-height: 36px;
$left-width: 255px;
$left-search-time: 200px;
:deep(.el-input) {
  width: 220px;
}
.video-box {
  width: 100%;
  height: 100%;
}
.video-content {
  display: flex;
  width: 100%;
  margin-top: 15px;
  height: 610px;
  border: 1px solid #e9ebee;
  &-left {
    width: $left-width;
    height: calc(100% - 15px);
    border-right: 1px solid #e9ebee;
    &-search {
      height: $left-search-height;
      line-height: $left-search-height;
      padding: 0 20px;
    }
    &-title {
      width: 100%;
      height: $left-title-height;
      line-height: $left-title-height;
      padding: 0 15px 0 20px;
      border-bottom: 1px solid #e9ebee;
      text-align: left;
      font-weight: 600;
    }
    .video-tree {
      overflow: auto;
      height: calc(
        100% - #{$left-title-height} - #{$left-search-height} - #{$left-search-time}
      );
      margin: 10px;
    }
    .video-form {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: column;
      height: $left-search-time;
      width: 100%;
    }
  }
  &-right {
    width: calc(100% - #{$left-width});
    height: calc(100% - 15px);
    padding-left: 20px;
  }
}
</style>
