<template>
  <div class="app-container app-containerC">
    <el-row :gutter="12" class="otherCon">
      <el-col :span="10" class="hp p-lf">
        <el-card shadow="hover" class="hp">
          <div slot="header" class="clearfix">
            <span>字典项目</span>
          </div>
          <div class="wp hp app-containerC">
            <dict @updateChild="handleUpdateChild"></dict>
          </div>
        </el-card>
      </el-col>
      <el-col :span="14" class="hp p-rf">
        <el-card shadow="hover" class="hp">
          <div slot="header" class="clearfix">
            <span>字典明细</span>
          </div>
          <div class="wp hp app-containerC">
            <dict-item ref="dictItem"></dict-item>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/jsx">
import dict from './dict.vue'
import dictItem from './dictItem.vue'

export default {
  components: {
    dict,
    dictItem
  },
  methods: {
    handleUpdateChild(params) {
      this.parentId = params.parentId
      this.itemCode = params.itemCode
      this.$refs.dictItem.refresh(params)
    }
  }
}
</script>
