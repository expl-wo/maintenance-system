<template>
  <div class = "app-container app-containerC">
    <div class = "filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class = "demo-form-inline demo-form-zdy">
        <el-form-item label="计划完工时间:" size="mini" prop="dateCount">
          <el-date-picker v-model="listQuery.dateGroup" type="daterange" range-separator="至" style="width: 240px;" start-placeholder="开始日期" end-placeholder="结束日期"/>
        </el-form-item>
        <el-form-item label="关键字" size="mini">
          <el-input v-model="listQuery.search" placeholder="项目名、生产号、图号"
                    style="width:170px;" class="filter-item" clearable/>
        </el-form-item>
        <el-form-item label="产品类型：" size="mini">
          <el-select v-model="listQuery.productTypeParam" clearable style="width: 120px;"  placeholder="选择类型">
            <el-option label="换流变" value="0" />
            <el-option label="变压器" value="1" />
            <el-option label="电抗器" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="电压等级：" size="mini">
          <el-select multiple collapse-tags v-model="listQuery.voltage" clearable style="width: 130px;"  placeholder="选择电压">
            <el-option label="110" value="110" />
            <el-option label="220" value="220" />
            <el-option label="500" value="500" />
            <el-option label="750" value="750" />
            <el-option label="1000" value="1000" />
          </el-select>
        </el-form-item>
        <el-form-item label="工序：" size="mini" v-if="!isMainPlanPage">
          <el-select v-model="listQuery.op" clearable="" style="width: 120px;"  placeholder="选择工序" @change="handleChangeOp">
            <el-option
              v-for="item in opList"
              :key="item.k"
              :label="item.v"
              :value="item.k"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工序状态：" size="mini" v-if="!isMainPlanPage">
          <el-select v-model="listQuery.opStatus" style="width: 120px;" clearable  placeholder="选择工序状态">
            <el-option
              v-for="(item,index) in statusOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" size="mini" v-if="isMainPlanPage">
          <xui-dict-select multiple item-code="mainPlanStatus" size="mini" includeAll v-model="listQuery.status"
                           class="filter-item" clearable
          ></xui-dict-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getDictListByKey } from '@/components/xui/dictionary'
export default {
  data() {
    return {
      isMainPlanPage: true,
      pageId: 'ps_031_main',
      listQuery: {
        dateGroup: [],
        search: '',
        productTypeParam: '',//产品类型
        voltage: '',//电压等级
        op: '',//工序
        opStatus: '',//工序状态
        status: [],
      },
      statusOptions: [{
        value: [0,3,5],
        label: '未开工'
      },
        {
          value: [-1,10,15],
          label: '开工中'
        },
        {
          value: [20],
          label: '完工'
        },
        {
          value: [4],
          label: '暂停'
        }],
      opList: [],
    }
  },
  created(){
    debugger
    let path = this.$route.fullPath;
    console.log('路径:',path)
    if(path && path === '/ps/ps_032_workOrder'){
      //说明此页面为车间在制工单
      this.isMainPlanPage = false;
      this.pageId = 'ps_032_workOrder';
    }
    if(this.isMainPlanPage){
      let dictList = getDictListByKey('mainPlanStatus');
      let dictArr = [];
      dictList.forEach(item=>{
        if(item.code != 4){
          dictArr.push(item.code);
        }
      })
      // this.listQuery.status = dictArr;
      console.log('主计划状态字典:',this.listQuery.status)
    }else{
      //状态为冻结和已开工 已下发
      // this.listQuery.status = [-2, 2, 10];
    }
    // this.initDate()
  },
}
</script>
<style scoped>
.tableCase {
  min-height: 100px;
  height: calc(100vh - 290px);
  overflow: auto;
}
.cell-content {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
}

.item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
