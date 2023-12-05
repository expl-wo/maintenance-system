<template>
  <el-empty description="暂无工作内容数据！" v-if="dataList.length" />
  <div class="work-content-box" v-else v-loading="loading">
    <!-- <div class="content-wrap">
     
    </div> -->
    <el-descriptions title="基础信息" :column="4" :style="{ width: '800px' }">
      <template #extra>
        <el-button type="primary" title="开工">开工</el-button>
        <el-button type="primary" title="完工">完工</el-button>
        <el-button type="primary" title="复核">复核</el-button>
        <el-tag
          :key="WORK_TREE_CHECK_STATUS[workTreeStatus].label"
          :type="WORK_TREE_CHECK_STATUS[workTreeStatus].type"
          effect="plain"
          class="mgl12"
          round
        >
          {{ WORK_TREE_CHECK_STATUS[workTreeStatus].label }}
        </el-tag>
      </template>
      <el-descriptions-item label="工作内容名称名称"
        >工作内容1</el-descriptions-item
      >
      <el-descriptions-item label="组长">张山</el-descriptions-item>
      <el-descriptions-item label="副组长">里斯</el-descriptions-item>
      <el-descriptions-item label="成员">王麻子</el-descriptions-item>
    </el-descriptions>
    <div
      class="el-descriptions__title"
      style="font-size: 14px; margin-bottom: 12px"
    >
      执行项
    </div>
    <el-form :model="form" label-width="120px" class="work-centent-body">
      <template v-for="(item, index) in contentList" :key="index">
        <content-item
          :ref="`contentItemRef${item.id}`"
          :contentType="item.contentType"
          :contentLabel="item.contentLabel"
        ></content-item>
      </template>
    </el-form>
    <div class="operate-wrap">
      <el-button type="primary" title="保存" @click="save"> 保存 </el-button>
      <el-button title="取消" @click="cancel"> 取消 </el-button>
      <!-- <el-button type="primary" title="上一项" @click="prev">
        <el-icon class="el-icon--left"><ArrowLeftBold /></el-icon>上一项
      </el-button>
      <el-button type="primary" title="下一项" @click="next">
        <el-icon class="el-icon--left"><ArrowRightBold /></el-icon>下一项
      </el-button>
      <span class="mgl12">当前第 {{ activeIndex }} 项，共 {{ total }} 项</span> -->
    </div>
  </div>
</template>
<script>
import { WORK_TREE_CHECK_STATUS } from "@/views/overhaul/constants.js";
import ContentItem from "./content.vue";
import { getWorkInfoPage } from "@/api/overhaul/workOrderApi.js";
export default {
  components: {
    ContentItem,
  },
  props: {
    currentSelectNode: {
      type: Object,
      default() {
        return {};
      },
    },
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
    templateChoose: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      WORK_TREE_CHECK_STATUS,
      workTreeStatus: 2,
      dataList: [],
      activeIndex: 0,
      loading: false,
      contentList: [
        { id: 1, contentType: 1, contentLabel: "1.测试文本框！" },
        { id: 2, contentType: 2, contentLabel: "2.测试数字框" },
        { id: 3, contentType: 3, contentLabel: "3.测试时间框" },
        { id: 4, contentType: 4, contentLabel: "5.测试单选按钮" },
        { id: 5, contentType: 5, contentLabel: "6.测试多选按钮" },
        { id: 6, contentType: 6, contentLabel: "7.测试文本域" },
      ],
    };
  },
  watch: {
    currentSelectNode: {
      handler(val) {
        if (+val.type === 3) {
          this.getList();
        }
      },
      immediate: true,
    },
  },
  methods: {
    //获取列表
    getList() {
      this.loading = true;
      let parmas = {
        pageNum: 1,
        pageSize: 9999,
        workCode: this.workOrderInfo.id,
        templateCode: this.templateChoose,
        workProcedureType: +this.currentSelectNode.type,
        workProcedureCode: this.currentSelectNode.procedureCode,
      };
      getWorkInfoPage(parmas)
        .then((res) => {
          const { pageList, total } = res.data;
          this.dataList = pageList || [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //收集工作内容
    save() {
      let result = [];
      this.contentList.forEach((item) => {
        let form = this.$refs[`contentItemRef${item.id}`][0].form;
        result.push(form);
      });
      debugger;
    },
  },
};
</script>

<style lang="scss" scoped>
.content-wrap {
  margin-bottom: 12px;
}
.mgl12 {
  margin-left: 12px;
}
.marb {
  margin-bottom: 20px;
}

.work-centent-body {
  height: 440px;
  overflow-y: auto;
}
.work-content-box {
  padding: 20px;
  height: 100%;
  position: relative;
  .operate-wrap {
    position: absolute;
    bottom: 0;
    left: 20px;
    height: 36px;
    line-height: 36px;
  }
}
</style>