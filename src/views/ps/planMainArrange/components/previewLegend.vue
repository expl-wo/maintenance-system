<template>
  <el-dropdown style="margin-right: 6px;"  trigger="click">
      <span class="dropdown-link">
        图例<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
    <el-dropdown-menu slot="dropdown" class="xui-legend_wrapper">
      <el-dropdown-item v-for="(item, index) in legendList" :key="index">
        <div class="xui-legend__item">
          <div class="xui-legend__block" :class="item.className"></div>
          <div class="xui-legend__text">{{item.desc}}</div>
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'previewLegend',
  data(){
    return {
      legendList: [{
        className: 'normal',
        desc: '正常'
      },{
        className: 'celldelay',
        desc: '超期'
      },{
        className: 'celladvance',
        desc: '提前'
      },{
        className: 'cellsuspend',
        desc: '暂停'
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
