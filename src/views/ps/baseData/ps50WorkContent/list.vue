<template>
  <div class="app-container app-containerC">
    <el-row >
      <el-col >
        <el-card shadow="hover" class="height-50">
          <index ref="indexRef" @updateChild="handleUpdateChild"></index>
        </el-card>
      </el-col>
      <el-col >
        <el-card shadow="hover" class="height-50">
          <check-item ref="checkItemRef"></check-item>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/jsx">

import Index from "@/views/ps/baseData/ps50WorkContent/index";
import checkItem from "@/views/ps/baseData/ps50WorkContent/checkItem";

export default {
  components: {
    checkItem,
    Index,

  },
  mounted() {
    this.onload()
  },
  methods: {
    handleUpdateChild(params) {
      this.$refs.checkItemRef && this.$refs.checkItemRef.initData(params)
    },
    onload(){
      this.$refs.checkItemRef.initData()
    }
  }

}
</script>
