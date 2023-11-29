<template>
  <div class="app-container">
    <div class="app-containerR wp mainHeight">
      <div class="otherRCon p-10 mainHeightDiv">
        <div class="wp hp">
          <el-card shadow="hover" class="hp animation-scale-up">
            <!--            <img src="@/assets/p1.png" class="wp hp" />-->
            <div style="height: 12%" />
            <div class="mess-float" style="margin-bottom: 0">
              <span class="mess-font">未读消息列表</span>
            </div>
            <el-table highlight-current-row
              :data="messageData"
              height="88%"
              stripe
            >
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50"
              />
              <el-table-column
                prop="createDt"
                label="时间"
                sortable
                align="center"
                width="200"
              />
              <el-table-column
                prop="title"
                label="消息标题"
                align="center"
              >
                <template  #default="scope">
                  <el-tooltip class="item" effect="light" :content="scope.row.cont" placement="top">
                    <span v-if="scope.row.toWebLink==null">{{ scope.row.title }}</span>
                    <router-link v-if="scope.row.toWebLink!=null" :to="scope.row.toWebLink" @click.native="onMessageRead(scope.row.id)">
                      {{ scope.row.title }}
                    </router-link>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                label="跳转"
                align="center"
                width="70"
              >
                <template  #default="scope">
                  <router-link v-if="scope.row.toWebLink!=null" :to="scope.row.toWebLink" @click.native="onMessageRead(scope.row.id)">
                    <a class="el-icon-link" style="color: blue;font-size: 23px" />
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
            <div id="line" class="wp hp" />
          </el-card>
        </div>
      </div>
    </div>

    <div class="app-containerR wp mainHeight">
      <div class="otherRCon p-10 mainHeightDiv">
        <div class="wp hp">
          <el-card shadow="hover" class="hp animation-scale-up">
            <div id="bar" class="wp hp" />
          </el-card>
        </div>
      </div>
      <div class="otherRCon p-10 mainHeightDiv">
        <div class="wp hp">
          <el-card shadow="hover" class="hp animation-scale-up">
            <div id="pie" class="wp hp" />
          </el-card>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import echarts from 'echarts'
import { getMyMessage, postMessRead } from '@/api/my.js'
import { getLineOut, getBarOut, getPieOut } from '@/api/m4index.js'

const outTmpToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJBOTUzMDUyODc5REU1MUU1RjdFNEIyQjM5MTkzMDY5RUVEQTM5RkNCQ0VDNDREQjZDNkI5MTZBOTU5QzBCRjY1IiwibGduVGltZSI6IjIwMjUtMTItMzAgMDA6MDA6MDAiLCJleHAiOjE3ODkzMTkzNjl9.FdqAq-QyEhAqgSbjPG5KOTuEzeQTl-IWump2rqP2j1I'

export default {
  name: 'Showdashboard',
  computed: {
  },
  data() {
    return {
      messageQuery: { // 查询条件
        tmptoken: outTmpToken,
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 2000, // 查询第几页数据，默认第一页 pg_pagesize
        status: '0'// 是否已读，0：未读；1：已读
      },
      messageData: [],
      lineQuery: {
        tmptoken: outTmpToken,
        startYearMonth: '',
        endYearMonth: '',
        groupYearMonth: null
      },
      barMonth: '',
      pieMonth: '',
      showEcartsObj: {
        line: null,
        bar: null,
        pie: null
      }
    }
  },
  mounted() {
    this.onLoad()
    // this.testEcharts();
    window.onresize = () => {
      if (this.showEcartsObj.line != null) {
        this.showEcartsObj.line.resize()
      }
      if (this.showEcartsObj.bar != null) {
        this.showEcartsObj.bar.resize()
      }
      if (this.showEcartsObj.pie != null) {
        this.showEcartsObj.pie.resize()
      }
    }
  },
  methods: {
    // 数据测试方法
    testEcharts() {
      const data = { title: 'TestTiele',
        label: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        value: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200]
      }
      this.createPie(data)
      this.createLine(data)
      this.createBar(data)
    },
    onLoad() {
      const self = this
      getLineOut(this.lineQuery).then(res => {
        self.createLine(res.data)
      })
      getBarOut(this.barMonth).then(res => {
        self.createBar(res.data)
      })
      getPieOut(this.pieMonth).then(res => {
        self.createPie(res.data)
      })
    },
    getLineByQuery() {
      const self = this
      if (this.lineQuery.groupYearMonth != null) {
        this.lineQuery.startYearMonth = this.lineQuery.groupYearMonth[0]
        this.lineQuery.endYearMonth = this.lineQuery.groupYearMonth[1]
      }
      getLineOut(this.lineQuery).then(res => {
        self.createLine(res.data)
      })
    },
    getBarByQuery() {
      const self = this
      getBarOut(this.barMonth).then(res => {
        self.createBar(res.data)
      })
    },
    getPieByQuery() {
      const self = this
      getPieOut(this.pieMonth).then(res => {
        self.createPie(res.data)
      })
    },
    getMessage() {
      getMyMessage(this.messageQuery).then(response => {
        this.messageData = response.data
      })
    },
    createLine(res) {
      const myChart = echarts.init(document.getElementById('line'))
      const option = {
        title: {
          text: '连续月产值曲线',
          subtext: res.title,
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
          name: '年-月',
          type: 'category',
          data: res.label,
          axisLabel: {
            interval: 0,
            rotate: 45
          }
        },
        yAxis: {
          name: '产值（万元）',
          type: 'value'
        },
        series: [{
          itemStyle: {
            normal: {
              color: '#003a8f',
              lineStyle: {
                color: '#003a8f',
                width: 3
              }
            }
          },
          name: '产值',
          data: res.value,
          type: 'line'//,
          // markLine:{
          //   data: [
          //     {type: 'average', name: '平均值'}
          //   ]
          // }
        }]
      }
      myChart.setOption(option)
      this.showEcartsObj.line = myChart
    },
    createBar(res) {
      const myChart = echarts.init(document.getElementById('bar'))
      const option = {
        title: {
          text: '当月班组工时统计',
          subtext: res.title,
          left: 'left'
        },
        color: ['#003a8f'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          top: '35%',
          right: '8%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            name: '班组',
            type: 'category',
            data: res.label,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            name: '时间（分钟）',
            type: 'value'
          }
        ],
        series: [
          {
            name: '工时',
            type: 'bar',
            barWidth: '60%',
            label: {
              show: true,
              position: 'inside'
            },
            data: res.value
          }
        ]
      }
      myChart.setOption(option)
      this.showEcartsObj.bar = myChart
    },
    createPie(res) {
      const values = []
      res.label.forEach((item, i) => {
        values.push({ name: item, value: res.value[i] })
      })
      const myChart = echarts.init(document.getElementById('pie'))
      const option = {
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
      }
      myChart.setOption(option)
      this.showEcartsObj.pie = myChart
    },
    onMessageRead(strId) {
      const self = this
      postMessRead({ 'ids': [strId] }).then(d => {
        self.getMessage()
      })
    }
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
  height:300px;
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
