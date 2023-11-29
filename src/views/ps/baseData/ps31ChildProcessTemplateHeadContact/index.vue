<template>
  <div class="app-container app-containerC">
    <el-row :gutter="12" class="otherCon">
      <el-col :span="12" class="hp p-lf">
        <el-card shadow="hover" class="hp">
          <ps31-child-head-rule ref="ps31ChildHeadRuleRef" @updateChild="handleUpdateChild"></ps31-child-head-rule>
        </el-card>
      </el-col>
      <el-col :span="12" class="hp p-rf">
        <el-card shadow="hover" class="hp">
          <ps31-child-head-rule-item ref="ps31ChildHeadRuleItemRef"></ps31-child-head-rule-item>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/jsx">
import ps31ChildHeadRule from "@/views/ps/baseData/ps31ChildProcessTemplateHeadContact/ps31ChildHeadRule";
import ps31ChildHeadRuleItem from "@/views/ps/baseData/ps31ChildProcessTemplateHeadContact/ps31ChildHeadRuleItem";

export default {
  components: {
    ps31ChildHeadRuleItem,ps31ChildHeadRule,
  },
  mounted() {
    this.onload()
  },
  methods: {
    handleUpdateChild(params) {
      this.$refs.ps31ChildHeadRuleItemRef && this.$refs.ps31ChildHeadRuleItemRef.initData(params)
    },
    onload(){
      this.$refs.ps31ChildHeadRuleItemRef.initData()
    }
  }
}
</script>
