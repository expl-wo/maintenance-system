<template>
  <div class="legend-list">
    <div class="legend-item" v-for="(item,index) in showData" :key="index">
      <div class="legend-block" :class="item.clz">
      </div>
      <div class="legend-text ">
        {{item.label}}
      </div>
    </div>
    <div class="legend-item" v-if="showSelected">
      <div class="legend-block selected">
      </div>
      <div class="legend-text ">
        选中
      </div>
    </div>
    <!--    <div class="legend-item">
          <el-dropdown>
          <span class="el-dropdown-link">
            更多图例<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div class="legend-dropdown-item"  v-for="(item,index) in hiddenData" :key="index">
                  <div class="legend-block" :class="item.clz">
                  </div>
                  <div class="legend-text ">
                    {{item.label}}
                  </div>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>-->

  </div>
</template>

<script>
import legendConfig from '@/views/ps/planWeek/components/legendConfig'
export default {
  name: 'simpleGantLegend',
  props: {
    showSelected: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      showData: [],
      hiddenData: []
    }
  },
  mounted(){
    this.showData = legendConfig.getSimpleProgressData();
  }
}
</script>

<style scoped lang="scss">
.legend-list .el-dropdown-link {
  cursor: pointer;
  font-size: 12px;
  color: #409eff;
}
</style>
