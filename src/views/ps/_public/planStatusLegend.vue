<template>
  <el-dropdown style="margin-right: 6px;"  trigger="click">
      <span class="dropdown-link">
        图例<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
    <template #dropdown>
    <el-dropdown-menu class="xui-legend_wrapper">
      <el-dropdown-item v-for="(item, index) in legendList" :key="index">
        <div class="xui-legend__item">
          <div class="xui-legend__block" :class="item.className"></div>
          <div class="xui-legend__text">{{item.desc}}</div>
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
export default {
  name: 'planStatusLegend',
  data(){
    return {
      legendList: [{
        className: 'confirmStatusPlaning',
        desc: '预排'
      },{
        className: 'confirmStatusReject',
        desc: '驳回'
      },{
        className: 'confirmStatusWaitApproval',
        desc: '待审批'
      },{
        className: 'confirmStatusOther',
        desc: '其它'
      }]
    }
  }
}
</script>

<style scoped lang="scss">
.dropdown-link{
  color: #409eff;
  font-size: 13px;
  &:hover{
    cursor: pointer;
  }
  &:focus{
    outline: none;
  }
}

.xui-legend__item{
  display: flex;
  align-items: center;
  justify-content: center;
  .xui-legend__block{
    width: 40px;
    height: 20px;
    border-radius: 4px;
    border: 1px solid #dfe6ec;
  }

  .xui-legend__text{
    margin-left: 6px;
    color: #000;
    width: 44px;
  }
}

</style>
