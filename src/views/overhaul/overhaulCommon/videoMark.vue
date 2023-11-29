<template>
  <div class="video-box">
    <div class="video-content">
      <div class="video-content-left">
        <div class="video-content-left-title">工序结构</div>
        <div class="video-content-left-search">
          <el-input
            
            placeholder="输入关键字进行过滤"
            v-model="filterText"
          >
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
            
            v-model="videoForm.channelCodes"
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
          >
          </el-date-picker>
          <el-date-picker
            v-model="videoForm.videoEndTime"
            type="datetime"
            :clearable="false"
            
            placeholder="选择结束日期"
          >
          </el-date-picker>
          <div class="video-form-operate">
            <el-button type="primary" >
              <el-icon><Search /></el-icon>查询
            </el-button>
            <el-button type="info" >
              <el-icon><RefreshLeft /></el-icon> 重置
            </el-button>
          </div>
        </div>
      </div>
      <div class="video-content-right">
        <DHPlayer videoId="survey-video-mark" ref="dhPlayerRef" />
      </div>
    </div>
  </div>
</template>

<script>
import DHPlayer from "@/components/DHPlayer/index";
import { Search, RefreshLeft } from "@element-plus/icons-vue";
import dayjs from "dayjs";
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
export default {
  name: "VideoMark",
  components: {
    DHPlayer,
    Search,
    RefreshLeft,
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: "childNodeList",
        label: "procedureName",
      },
      //当前选中的节点
      currentSelectNode: {},
      filterText: "",
      channelCodesOptions: [{ label: "视频1", value: 1 }],
      videoForm: {
        channelCodes: undefined,
        videoStartTime: dayjs().startOf("day"),
        videoEndTime: dayjs().startOf("day"),
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs["treeRef"].filter(val);
    },
  },
  mounted() {
    this.getTreeData();
  },
  methods: {
    /**
     * 树节点过滤
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.procedureName.indexOf(value) !== -1;
    },

    /**
     * 树节点选中时操作
     */
    handleNodeClick(data) {
      if (data.type) {
        this.currentSelectNode = data;
      }
    },

    /**
     * 获取树的 数据
     */
    getTreeData() {
      this.treeData = testTreeData;
      this.$nextTick(() => {
        // this.$refs["treeRef"].setCurrentKey("001");
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
