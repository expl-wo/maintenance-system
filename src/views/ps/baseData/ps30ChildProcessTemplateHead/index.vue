<template>
  <div class="app-container app-containerC">
    <el-row :gutter="12" class="hp">
      <el-col :span="12" class="hp p-lf">
        <el-card shadow="hover" class="hp">
          <ps30-child-rule ref="ps30ChildRuleRef" @updateChild="handleUpdateChild"></ps30-child-rule>
        </el-card>
      </el-col>
        <el-col :span="12" class="hp p-lf">
          <el-card shadow="hover" class="height-50">
            <ps30-child-rule-item ref="ps30ChildRuleItemRef" @updateChild="handleUpdateChild1" ></ps30-child-rule-item>
          </el-card>
          <el-card shadow="hover" class="height-50">
            <crafs-class-index ref="crafsClassIndexRef"></crafs-class-index>
          </el-card>
        </el-col>
      </el-row>
  </div>
</template>

<script type="text/jsx">
import ps30ChildRule from '@/views/ps/baseData/ps30ChildProcessTemplateHead/ps30ChildRule.vue'
import ps30ChildRuleItem from '@/views/ps/baseData/ps30ChildProcessTemplateHead/ps30ChildRuleItem.vue'
import crafsClassIndex from "@/views/ps/baseData/baseDataType/crafsClassIndex";

export default {
  components: {
   crafsClassIndex, ps30ChildRule, ps30ChildRuleItem},
  // mounted() {
  //   this.onload()
  // },
  methods: {
    handleUpdateChild(params) {
      this.$refs.ps30ChildRuleItemRef && this.$refs.ps30ChildRuleItemRef.initData(params)
    },
    handleUpdateChild1(params) {
      this.$refs.crafsClassIndexRef && this.$refs.crafsClassIndexRef.initData(params)
    },
  }
}
</script>
