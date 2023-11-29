<template>
  <div class="app-container app-containerC">
    <el-row :gutter="12" class="otherCon">
      <el-col :span="12" class="hp p-lf">
        <el-card shadow="hover" class="hp">
          <ps34-process-template-rule ref="ps34ProcessTemplateRuleRef" @updateChild="handleUpdateChild"></ps34-process-template-rule>
        </el-card>
      </el-col>
      <el-col :span="12" class="hp p-rf">
        <el-card shadow="hover" class="hp">
          <ps34-process-template-rule-item ref="ps34ProcessTemplateRuleItemRef"></ps34-process-template-rule-item>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/jsx">
import ps34ProcessTemplateRule from '@/views/ps/baseData/ps34ProcessTemplateHngc/ps34ProcessTemplateRule.vue'
import ps34ProcessTemplateRuleItem from '@/views/ps/baseData/ps34ProcessTemplateHngc/ps34ProcessTemplateRuleItem.vue'

export default {
  components: {
    ps34ProcessTemplateRule,
    ps34ProcessTemplateRuleItem
  },
  mounted() {
    this.onload()
  },
  methods: {
    handleUpdateChild(params) {
      this.$refs.ps34ProcessTemplateRuleItemRef && this.$refs.ps34ProcessTemplateRuleItemRef.initData(params)
    },
    onload(){
      this.$refs.ps34ProcessTemplateRuleItemRef.initData()
    }
  }
}
</script>
