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
            ><template #default="{ node, data }">
              <el-icon v-if="data.isDev" style="margin-right: 4px"
                ><VideoCameraFilled
              /></el-icon>
              {{ node.label }}</template
            >
          </el-tree>
        </div>
        <div class="video-form">
          <el-select
            v-model="videoForm.channelCode"
            class="filter-item"
            disabled
            placeholder="请选择工序树节点"
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
              <el-icon class="el-icon--left"><Search /></el-icon>查询
            </el-button>
            <el-button type="info" @click="reset">
              <el-icon class="el-icon--left"><RefreshLeft /></el-icon> 重置
            </el-button>
            <el-button
              type="primary"
              :loading="aimLoading"
              :disabled="!videoForm.channelCode"
              @click="addMarker"
            >
              <el-icon class="el-icon--left"><Aim /></el-icon> 标记
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
import { addVideoMarker } from "@/api/overhaul/videoApi.js";
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
      aimLoading: false,
      standardProcedureCodeList: [], //检修工单模板编号
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
        const {
          procedureTemplateName,
          procedureTemplateCode,
          standardProcedureCodeList,
        } = this.workOrderInfo;
        this.templateChoose = procedureTemplateCode || undefined;
        this.templateName = procedureTemplateName || "";
        if (+this.workOrderInfo.workOrderType === 2) {
          this.standardProcedureCodeList = standardProcedureCodeList;
          this.templateChoose = standardProcedureCodeList
            ? standardProcedureCodeList.join(",")
            : "";
          this.templateName = standardProcedureCodeList
            ? standardProcedureCodeList.join(",")
            : "";
        }
        if (this.templateChoose && this.templateName) {
          this.getTreeData();
        }
      },
      immediate: true,
    },
  },
  beforeUnmount() {
    this.disConnect();
  },
  methods: {
    //进行标记
    addMarker() {
      this.player && this.player.snapshot(0);
    },
    //标记
    picCap(imgInfo, info) {
      let target = this.channelCodesOptions.find(
        (item) => item.value === this.videoForm.channelCode
      );
      if (!target) {
        this.$message.error("通道不存在!");
        return;
      }
      this.aimLoading = true;
      let baseInfo = {
        channelCode: target.label,
        channelName: target.value,
        workProcedureId: this.currentSelectNode.procedureCode,
        workProcedureName: this.currentSelectNode.parentProcedureName,
        capTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      };
      let params = {
        workId: this.workOrderInfo.id,
        sceneType: this.sceneType,
        markType: 1,
        base64: imgInfo.base64Url,
        ...baseInfo,
      };
      addVideoMarker(params).then((res) => {
        if (res.code !== "0") {
          this.$message.error(res.errMsg);
          return;
        }
        this.aimLoading = false;
      });
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
        this.player.destroy();
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
    //将树和通道组装
    dealRanderTree(treeData) {
      if (!this.channelCodesOptions.length || !treeData.length) return [];
      let result = [];
      treeData.forEach((item) => {
        if (item.childNodeList && item.childNodeList.length) {
          item.childNodeList = this.dealRanderTree(item.childNodeList);
        }
        let temp = this.channelCodesOptions.find((a) => {
          return a.procedureCodeList.includes(item.procedureCode);
        });
        if (temp) {
          item.childNodeList.push({
            ...temp,
            procedureName: temp.label,
            procedureCode: item.uniqueCode,
            uniqueCode: `${item.uniqueCode}_${temp.channelCode}`,
            isDev: true,
            parentProcedureName: item.procedureName,
          });
        }
        result.push(item);
      });
      return result;
    },
    //获取通道list
    getChannelList() {
      getBindDev({
        workCode: this.workOrderInfo.id,
        workOrderSceneType: this.sceneType,
        procedureCode: "",
        procedureType: "0",
        ifShowChild: true,
      }).then((res) => {
        const { channelInfoList } = res.data;
        this.channelCodesOptions = (channelInfoList || []).map((item) => ({
          label: item.channelName,
          value: item.channelCode,
          procedureCodeList: item.channelWorkProcedureDTOList.map((item) =>
            item.workProcedureId.split("_").slice(1).join("_")
          ),
        }));
        if (this.channelCodesOptions.length) {
          this.treeData = this.dealRanderTree(this.treeData);
        }
      });
    },
    /**
     * 树节点选中时操作
     */
    handleNodeClick(data) {
      if (data.isDev) {
        this.currentSelectNode = data;
        this.videoForm.channelCode = data.value;
      } else {
        // this.videoForm.channelCode=undefined
        this.$message.warning("请选择通道节点！");
      }
      // this.getChannelList();
    },

    /**
     * 获取树的 数据
     */
    getTreeData() {
      if (!this.templateChoose) return;
      this.treeLoading = true;
      let params = { templateCode: this.templateChoose };
      if (+this.workOrderInfo.workOrderType === 2) {
        delete params.templateCode;
        params.standardProcedureCodeList = this.standardProcedureCodeList;
      }
      getWorkTree({
        workCode: this.workOrderInfo.id,
        ...params,
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
$left-search-time: 150px;
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
  height: 650px;
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
