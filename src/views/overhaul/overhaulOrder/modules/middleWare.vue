<template>
  <div class="work-tab-box">
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane
        v-for="(item,index) in authTabList"
        :label="item.label"
        :key="index"
        :name="item.name"
        lazy
      >
        <component
          :ref="item.name"
          :is="item.components"
          :key="`${name}_${item.name}`"
          :activeLabel="item.label"
          :onlyTabName="onlyTabName"
          :workType="item.workType"
          v-bind="$attrs"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VideoMark from "@/views/overhaul/overhaulCommon/videoMark.vue";
import TemplateReport from "@/views/overhaul/overhaulCommon/templateReport.vue"; //报告相关的内容
import MarkerRecord from "@/views/overhaul/overhaulCommon/markerRecord.vue"; //标记记录
import ProcessInfo from "@/views/overhaul/overhaulCommon/processInfo.vue"; //工序信息
import BomVue from "../components/bom/index.vue"; //bom
// import DeviceList from "../components/deviceList/index.vue"; //设备清单
import BigComponents from "../components/bigComponents.vue"; //设备
import instrument from "../components/instrument.vue"; //工装工具
import materials from "../components/materials.vue"; //材料
import ReturnList from "../components/returnList.vue"; //返厂清单
import IssueTable from "@/views/overhaul/workIssueCommon/issueTable";
export default {
  props: {
    //取的tabName 对应TAB_LIST_MAP的key
    tabList: {
      type: Array,
      default: () => [],
    },
    //父级的name
    name: {
      type: String,
      default: "",
    },
  },
  components: {
    BigComponents,
    instrument,
    materials,
    ProcessInfo,
    MarkerRecord,
    VideoMark,
    TemplateReport,
    BomVue,
    // DeviceList,
    ReturnList,
    IssueTable,
  },
  data() {
    return {
      activeName: "processInfo",
      authTabList: [],
    };
  },
  computed: {
    onlyTabName() {
      return `${this.name}-${this.activeName}`;
    },
  },
  created() {
    //获取不需要权限和有权限的tab
    this.authTabList = this.tabList.filter((item) => {
      return !item.menuCode || this.$isAuth(item.menuCode);
    });
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