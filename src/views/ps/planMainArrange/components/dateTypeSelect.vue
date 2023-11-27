<template>
  <el-dropdown style="margin-right: 12px;" size="small" trigger="click" @command="(command) => handleChangeDateType(command)">
    <span class="el-dropdown-link dropdown-link">
      {{dateTypeDesc}}
      <el-icon class="el-icon--right" style="margin-left: 0;">
        <arrow-down/>
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu slot="dropdown" class="xui-legend_wrapper">
        <el-dropdown-item :command="item"
                          v-for="(item, index) in dateList" :key="index">
          <div class="xui-legend__item">
            <div class="xui-legend__text">{{ item.desc }}</div>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import {defineComponent, computed, onMounted, ref, reactive, defineEmits, toRef, watch, nextTick} from "vue";
import { ArrowDown } from '@element-plus/icons-vue'

const emits = defineEmits(["changeDateType"])
const dateList = reactive([{
  value: 'day',
  desc: '天',
  locationDesc: '今天'
},{
  value: 'week',
  desc: '周',
  locationDesc: '本周'
}]);

const dateTypeDesc = ref(dateList[0].desc);

const handleChangeDateType = item=>{
  dateTypeDesc.value = item.desc;
  emits('changeDateType', item);
}

</script>

<style scoped lang="scss">
.dropdown-link {
  color: #409eff;
  font-size: 13px;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
}

.xui-legend__item {
  display: flex;
  align-items: center;
  justify-content: center;

  .xui-legend__block {
    width: 40px;
    height: 20px;
    border-radius: 4px;
    border: 1px solid #dfe6ec;
  }

  .xui-legend__text {
    margin-left: 6px;
    color: #000;
    width: 44px;
  }
}

</style>
