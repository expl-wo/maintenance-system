<template>
  <div class="app-container app-containerC">
    <el-row :gutter="12" class="otherCon">
      <el-col :span="8" class="hp p-lf">
        <el-card shadow="hover" class="hp">
          <optionalProduct ref="optionalProduct"></optionalProduct>
        </el-card>
      </el-col>
      <el-col :span="16" class="hp p-lf">
        <el-card shadow="hover" class="hp">
          <planInfo ref="planInfo"></planInfo>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/jsx">
import optionalProduct from './optionalProduct.vue'
import planInfo from './planInfo.vue'
import moment from 'moment/moment'

export default {
  components: {
    optionalProduct,
    planInfo
  },
  mounted() {
    this.getSearchQuery()
  },
  data() {
    let isApprovePage = false , isApprove = this.$constants.isApprove.no;
    let routePath = this.$route.fullPath;
    if(routePath.indexOf('ps_041_mainApproval')>=0){
      isApprovePage = true
      isApprove = this.$constants.isApprove.yes
    }
    return {
      isApprove,
    }
  },
  methods: {
    async getSearchQuery() {
      this.search();
    },
    search(){
      this.$refs.optionalProduct.initData(this.isApprove);
      this.$refs.planInfo.initData(this.isApprove);
    },
  }
}
</script>
