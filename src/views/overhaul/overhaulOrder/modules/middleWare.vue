<template>
  <div class="work-tab-box">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane
        v-for="item in tabList"
        :label="item.label"
        :key="item.name"
        :name="item.name"
        lazy
      >
        <component
          :ref="item.name"
          :is="item.components"
          :onlyTabName="onlyTabName"
          v-bind="$attrs"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VideoMark from "../components/videoMark.vue";
import TemplateReport from "../components/templateReport.vue"; //报告相关的内容
import MarkerRecord from "../components/markerRecord.vue"; //标记记录
import ProcessInfo from "../components/processInfo.vue"; //工序信息
import BomVue from "../components/bom/index.vue"; //bom
import DeviceList from "../components/deviceList/index.vue"; //设备清单
import ReturnList from "../components/returnList.vue"; //返厂清单
import IssueTable from "@/views/overhaul/workIssueCommon/issueTable";
export default {
  props: {
    //取的tabName 对应TAB_LIST_MAP的key
    tabList: {
      type: Array,
      default: [],
    },
    //父级的name
    name: {
      type: String,
      default: "",
    },
  },
  components: {
    ProcessInfo,
    MarkerRecord,
    VideoMark,
    TemplateReport,
    BomVue,
    DeviceList,
    ReturnList,
    IssueTable,
  },
  data() {
    return {
      activeName: "processInfo",
    };
  },
  computed: {
    onlyTabName() {
      return `${this.name}-${this.activeName}`;
    },
  },
  created() {
    this.activeName = this.tabList[0].name;
  },
};
</script>
<style lang="scss" scoped>
.work-tab-box {
  height: 100%;
  width: 100%;
}
</style>