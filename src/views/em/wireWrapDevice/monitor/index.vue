<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="绕线模设备" size="mini">
          <el-select v-model="listQuery.code" @change="handleSelectDevice" size="mini" style="width: 180px;" filterable default-first-option>
            <el-option v-for="items in deviceList" :key="items.code" :label="items.name" :value="items.code" />
          </el-select>
        </el-form-item>
        <el-form-item size="mini">
          <el-button type="primary" icon="el-icon-search" @click="onBtnQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topWrapper">
        <el-card shadow="hover" class="hp">
          <div slot="header" class="clearfix">
            <span>设备管理</span>
          </div>
          <div class="wp hp app-containerC">
            <device-detail ref="deviceDetailRef" @updateWorkOrder="handleShowChart"></device-detail>
          </div>
        </el-card>
    </div>
    <div class="downWrapper">
        <el-card shadow="hover" class="hp">
          <div slot="header" class="clearfix">
            <span>运行数据展示</span>
          </div>
          <div class="wp hp app-containerC" ref="chartRef">
          </div>
        </el-card>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import echarts from "echarts";
import wireWrapInfoHttp from '@/api/em/wireWrapInfo'
import wireWrapDataHttp from "@/api/em/wireWrapData";
import {getThemeDefault} from '@/components/xui/chart/theme/theme'
import deviceDetail from "@/views/em/wireWrapDevice/monitor/deviceDetail";
// import chart from "@/views/ps/planWeek/chart";
import {deepClone} from "@/utils";

export default {
  name: "index",
  components: {deviceDetail},
  data(){
    return {
      listQuery: {
        code: ''
      },
      deviceItem: {},
      deviceList: [],
      runningWorkOrder: {},
      timer: null,
      echartsInstance: null
    }
  },
  mounted(){
    this.getDeviceList();
    this.echartsInstance = echarts.init(this.$refs.chartRef, getThemeDefault(echarts));
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    getDeviceList(){
      wireWrapInfoHttp.list({
        pageNum: 1,
        pageSize: this.$constants.pageEntryCount
      }).then(response=>{
        this.deviceList = response.data;
        this.deviceItem = this.deviceList[0];
        this.listQuery.code = this.deviceItem.code;
        this.initData();
      })
    },
    handleSelectDevice(){
      let deviceItem = this.deviceList.find(item=>{
        return item.code === this.listQuery.code
      })
      if(deviceItem){
        this.deviceItem = deviceItem;
      }
      this.initData();
    },
    onBtnQuery(){
      this.initData();
    },
    initData(){
      this.$refs.deviceDetailRef.init(this.deviceItem);
    },
    handleShowChart(runningWorkOrder){
      this.clearTimer();
      this.runningWorkOrder = runningWorkOrder;
      if(this.runningWorkOrder.id){
        //如果工单ID存在，请求此工单时期后面的数据，显示统计图
        this.showChart();
        //定时刷新图表数据，每10分钟刷新一次图表
        this.timer = setInterval(()=>{
          this.showChart();
        }, 10 * 60*1000);
      }else{
        this.emptyChart();
      }
    },
    emptyChart(){
      this.echartsInstance.clear();
      this.echartsInstance.setOption({
        title: {
          text: '暂无数据',
          x: 'center',
          y: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
          }
        }
      })
    },
    async getStatisticData(){
      let response = await wireWrapDataHttp.getDeviceStatus({
        deviceCode: this.runningWorkOrder.deviceCode,
        startDt: this.runningWorkOrder.startDt
      })
      return response.data;
    },
    async showChart(){
      //TODO 需要判断如果有超过0.5的，需要把线条变成红色
      let dataList = await this.getStatisticData();
      let targetValues = [], legend = [],  upValues = [], downloadValues= [], startDate = moment('2023-06-01');
      let upArr = [2000.1, 2000.3, 2000.3, 2000.3, 2000.3];
      let downArr = [1999.8,1999.9,1999.7,1999.7,1999.8];
      let targetArr = [2000, 2000, 2000, 2000, 2000]
      for(let i = 0 ; i < 300; i++){
        let time = moment(startDate).add(10*i, "minute").format('MM-DD HH:mm');
        legend.push(time);
        targetValues.push(targetArr[parseInt(i/60)]);
        upValues.push(upArr[parseInt(i/60)]);
        downloadValues.push(downArr[parseInt(i/60)]);
      }
      let options = {
        animation: false,
        title: {
          text: '直径变化趋势图( 毫米)',
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          right: 40
        },
        legend: {
          data: ['目标值','上模直径', '下模直径' ]
        },
        toolbox: {
          show: false,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: legend
        },
        yAxis: {
          interval: 0.1,
          min: 1999.5,
          max: 2000.5,
          type: 'value',
          axisLabel: {
            formatter: function(value){
              return value + ''
            }
          }
        },
        series: [
          {
            name: '目标值',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: targetValues,
          },
          {
            name: '上模直径',
            type: 'line',
            data: upValues,
            smooth: true,
            symbol: 'none',
          },
          {
            name: '下模直径',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: downloadValues,
          }
        ]
      }
      this.echartsInstance.clear();
      this.echartsInstance.setOption(options);
    },
    clearTimer(){
      if(this.timer){
        window.clearInterval(this.timer);
        this.timer = null;
      }
    }
  }
}
</script>

<style scoped>

</style>
