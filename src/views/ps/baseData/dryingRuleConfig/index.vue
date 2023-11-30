<template>
  <div class="app-container app-containerC">
    <el-row :gutter="12" class="otherCon">
      <el-col :span="12" class="hp p-lf">
        <el-card shadow="hover" class="hp">
          <!--<div  class="clearfix">
            <span>字典项目</span>
          </div>-->
          <drying-rule ref="dryingRuleRef" @updateChild="handleUpdateChild"></drying-rule>
        </el-card>
      </el-col>
      <el-col :span="12" class="hp p-rf">
        <el-card shadow="hover" class="hp">
        <!--  <div  class="clearfix">
            <span>字典明细</span>
          </div>-->
          <drying-rule-item ref="dryingRuleItemRef"></drying-rule-item>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/jsx">
import dryingRule from './dryingRule.vue'
import dryingRuleItem from './dryingRuleItem.vue'

export default {
  components: {
    dryingRule,
    dryingRuleItem
  },
  mounted() {
    this.onload()
  },
  methods: {
    handleUpdateChild(params) {
      this.$refs.dryingRuleItemRef && this.$refs.dryingRuleItemRef.initData(params)
    },
    onload(){
      this.$refs.dryingRuleItemRef.initData()
    }
  }
}
</script>
