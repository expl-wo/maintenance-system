<template>
  <div class="app-container">
    <div class="app-containerR wp mainHeight">
      <div class="otherRCon p-10 mainHeightDiv">
        <div class="wp hp">
          <el-card shadow="hover" class="hp animation-scale-up">
<!--            <img src="@/assets/p1.png" class="wp hp" />-->
            <div style="height: 12%"></div>
            <div class="mess-float" style="margin-bottom: 0">
              <span class="mess-font">未读消息列表</span>
            </div>
            <el-table highlight-current-row
              :data='messageData'
              height="88%"
              stripe>
                <el-table-column
                  type="index"
                  label="序号"
                  align="center"
                  width="50">
                </el-table-column>
              <el-table-column
                prop="createDt"
                label="时间"
                sortable
                align="center"
                width="200">
              </el-table-column>
              <el-table-column
                prop="title"
                label="消息标题"
                align="center">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="light" :content="scope.row.cont" placement="top">
                    <span v-if="scope.row.toWebLink==null">{{scope.row.title}}</span>
                    <router-link v-if="scope.row.toWebLink!=null" :to="scope.row.toWebLink" @click.native="onMessageRead(scope.row.id)">
                      {{scope.row.title}}
                    </router-link>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                label="跳转"
                align="center"
                width="70">
                <template slot-scope="scope">
                <router-link v-if="scope.row.toWebLink!=null" :to="scope.row.toWebLink" @click.native="onMessageRead(scope.row.id)">
                  <a class="el-icon-link" style="color: blue;font-size: 23px"></a>
                </router-link>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </div>
      <div class="otherRCon p-10 mainHeightDiv">
        <div class="wp hp">
          <el-card shadow="hover" class="hp animation-scale-up">
<!--            <div class="floatTopLeft">-->
<!--              <el-date-picker-->
<!--                size="mini"-->
<!--                v-model="lineQuery.groupYearMonth"-->
<!--                type="monthrange"-->
<!--                range-separator="至"-->
<!--                start-placeholder="开始年月"-->
<!--                end-placeholder="结束年月"-->
<!--                value-format="yyyy-MM"-->
<!--                @change="getLineByQuery">-->
<!--              </el-date-picker>-->
<!--            </div>-->
<!--            <img src="@/assets/p2.png" class="wp hp" />-->
            <div id="line" class="wp hp"></div>
          </el-card>
        </div>
      </div>
    </div>

    <div class="app-containerR wp mainHeight">
      <div class="otherRCon p-10 mainHeightDiv">
        <div class="wp hp">
          <el-card shadow="hover" class="hp animation-scale-up">
<!--            <div class="floatTopRight">-->
<!--              <el-date-picker-->
<!--                size="mini"-->
<!--                v-model="barMonth"-->
<!--                type="month"-->
<!--                placeholder="选择月"-->
<!--                value-format="yyyy-MM"-->
<!--                @change="getBarByQuery">-->
<!--              </el-date-picker>-->
<!--            </div>-->
<!--            <img src="@/assets/p3.png" class="wp hp" />-->
            <div id="bar" class="wp hp"></div>
          </el-card>
        </div>
      </div>
      <div class="otherRCon p-10 mainHeightDiv">
        <div class="wp hp">
          <el-card shadow="hover" class="hp animation-scale-up">
<!--            <div class="floatTopLeft">-->
<!--              <el-date-picker-->
<!--                size="mini"-->
<!--                v-model="pieMonth"-->
<!--                type="month"-->
<!--                placeholder="选择月"-->
<!--                value-format="yyyy-MM"-->
<!--                @change="getPieByQuery">-->
<!--              </el-date-picker>-->
<!--            </div>-->
<!--            <img src="@/assets/p4.png" class="wp hp" />-->
            <div id="pie" class="wp hp"></div>
          </el-card>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import echarts from 'echarts'
import { getMyMessage,postMessRead } from '@/api/my.js'
import { getLine,getBar,getPie } from '@/api/m4index.js'
export default {
  name: 'Dashboard',
  computed: {
  },
  data() {
    return {
      messageQuery: { // 查询条件
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 2000, // 查询第几页数据，默认第一页 pg_pagesize
        status: '0'//是否已读，0：未读；1：已读
      },
      messageData: [],
      lineQuery:{
        startYearMonth:'',
        endYearMonth:'',
        groupYearMonth:null
      },
      barMonth:'',
      pieMonth:'',
      showEcartsObj:{
        line:null,
        bar:null,
        pie:null
      }
    }
  },
  mounted() {
    this.onLoad();
    this.getMessage();
    // this.testEcharts();
    window.onresize=()=>{
      if (this.showEcartsObj.line!=null){
        this.showEcartsObj.line.resize();
      }
      if (this.showEcartsObj.bar!=null){
        this.showEcartsObj.bar.resize();
      }
      if (this.showEcartsObj.pie!=null){
        this.showEcartsObj.pie.resize();
      }
    };
  },
  methods: {
    //数据测试方法
    testEcharts(){
      const data={title:'TestTiele',
                  label: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                  value: [100,200,300,400,500,600,700,800,900,1000,1100,1200]
      };
      this.createPie(data);
      this.createLine(data);
      this.createBar(data);
    },
    onLoad(){
      const self=this;
      getLine(this.lineQuery).then(res=>{
        self.createLine(res.data);
      });
      getBar(this.barMonth).then(res=>{
        self.createBar(res.data);
      });
      getPie(this.pieMonth).then(res=>{
        self.createPie(res.data);
      });
    },
    getLineByQuery(){
      const self=this;
      if (this.lineQuery.groupYearMonth!=null){
        this.lineQuery.startYearMonth=this.lineQuery.groupYearMonth[0];
        this.lineQuery.endYearMonth=this.lineQuery.groupYearMonth[1];
      }
      getLine(this.lineQuery).then(res=>{
        self.createLine(res.data);
      });
    },
    getBarByQuery(){
      const self=this;
      getBar(this.barMonth).then(res=>{
        self.createBar(res.data);
      });
    },
    getPieByQuery(){
      const self=this;
      getPie(this.pieMonth).then(res=>{
        self.createPie(res.data);
      });
    },
    getMessage(){
      getMyMessage(this.messageQuery).then(response => {
        this.messageData = response.data
      })
    },
    createLine(res){
      let myChart = echarts.init(document.getElementById('line'));
      let option = {
        title: {
          text: '连续月产值曲线',
          subtext:res.title,
          // left: 'center'
          left: 'right'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: {
          name:'年-月',
          type: 'category',
          data: res.label,
          axisLabel:{
            interval:0,
            rotate:45
          }
        },
        yAxis: {
          name:'产值（万元）',
          type: 'value'
        },
        series: [{
          itemStyle : {
            normal : {
              color:'#003a8f',
              lineStyle:{
                color:'#003a8f',
                width: 3
              }
            }
          },
          name:'产值',
          data: res.value,
          type: 'line'//,
          // markLine:{
          //   data: [
          //     {type: 'average', name: '平均值'}
          //   ]
          // }
        }]
      };
      myChart.setOption(option);
      this.showEcartsObj.line=myChart;
    },
    createBar(res){
      if(this.$store.getters.user.gsbmId == '36') this.createBarSinge(res)
      else this.createBarCommon(res)
    },
    createBarCommon(res){
      res.workTime = []
      res.reWorkTime = []
      res.total = []
      res.value.forEach(item=>{
        res.workTime.push(item[0])
        res.reWorkTime.push(item[1])
        res.total.push(item[0]+item[1])
      })
      const leftsize = res.value.length < 3 ? '40px' : '3%' ;
      let myChart = echarts.init(document.getElementById('bar')) ;
      let option = {
        title: {
          text: '当月班组工时统计',
          subtext: res.title,
          left: 'left'
        },
        color: ['#003a8f'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: leftsize,
          top: '35%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            name:'班组',
            type: 'category',
            data: res.label,
            axisLabel:{
              interval: 0,
              rotate: 55
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: '时间(小时)',
            type: 'value'
          }
        ],
        series: [
          {
            name: '总工时',
            type: 'bar',
            barWidth: '60%',
            label: {
              show: true,
              position: 'inside'
            },
            data: res.total
          },
          {
            name: '报工工时',
            type: 'bar',
            barWidth: '0',
            label: {
              show: false,
              position: 'inside'
            },
            data: res.workTime
          },
          {
            name: '返工工时',
            type: 'bar',
            barWidth: '',
            label: {
              show: false,
              position: 'inside'
            },
            data: res.reWorkTime
          },
        ]
      };
      myChart.setOption(option);
      this.showEcartsObj.bar=myChart;
    },
    createPie(res){
      let values=[];
      res.label.forEach((item,i)=>{
        values.push({name:item,value:res.value[i]})
      })
      let myChart = echarts.init(document.getElementById('pie'));
      let option = {
        title: {
          text: 'Andon异常次数统计',
          subtext: res.title,
          left: 'right'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          top: 'middle',
          // bottom: 10,
          left: '10',
          data: res.label
        },
        series: [
          {
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            selectedMode: 'single',
            label: {
              // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  '
              formatter: '{b}：{c}（{d}%）'
            },
            data: values,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      myChart.setOption(option);
      this.showEcartsObj.pie=myChart;
    },
    onMessageRead(strId){
      const self=this;
      postMessRead({'ids':[strId]}).then(d=>{
        self.getMessage()
      });
    },
    //油箱车间单独展示
    createBarSinge(res){
      res.weight = []
      res.value.forEach(item=>{
        res.weight.push(item[0])
      })
      const leftsize = res.value.length < 3 ? '40px' : '3%' ;
      let myChart = echarts.init(document.getElementById('bar')) ;
      let option = {
        title: {
          text: '当月班组工时统计',
          subtext: res.title,
          left: 'left'
        },
        color: ['#003a8f'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: leftsize,
          top: '35%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            name:'班组',
            type: 'category',
            data: res.label,
            axisLabel:{
              interval: 0,
              rotate: 55
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: '报工总数(次)',
            type: 'value'
          }
        ],
        series: [
          {
            name: '报工总数',
            type: 'bar',
            barWidth: '60%',
            label: {
              show: true,
              position: 'inside'
            },
            data: res.weight
          }
        ]
      };
      myChart.setOption(option);
      this.showEcartsObj.bar=myChart;
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.font-size-title{
  font-size: 12px;
}
.font-size-icon{
  font-size: 60px;
}
.mainHeight{
  height:360px;
}
.mainHeight .mainHeightDiv{
  padding:15px;
}
.mess-float{
  position: absolute;
  left: 20px;
  top: 20px;
}
.mess-font{
  font-size: 18px;
  color: #333;
  fontFamily:'sans-serif';
  font-weight: bold;
}
.floatTopLeft{
  z-index:9999999999;
  position: absolute;
  left: 10px;
  top: 10px;
}
.floatTopRight{
  z-index:9999999999;
  position: absolute;
  right: 10px;
  top: 10px;
}
// @media only screen and (min-width: 1300px){
//   .card-width{
//     width:250px;
//   }
// }
// @media only screen and (min-width: 940px) and (max-width: 1299px){
//   .card-width{
//     width:180px;
//   }
// }
// @media only screen and (min-width: 830px) and (max-width: 939px){
//   .card-width{
//     width:150px;
//   }
// }
// @media (max-width: 830px){
//     .card-width{
//       width:100px;
//     }
// }
// .el-card{
//   border-radius: 10px;
//   border: 1px solid transparent;
//   box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.3);
// }
</style>
