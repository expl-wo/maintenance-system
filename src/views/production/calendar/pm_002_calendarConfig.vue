<template>
  <div class="app-container app-containerR">
    <div class="leftMinRCon hp app-containerC">
      <div class="searchCon wp p-10">
        <!--快速设定-->
        <el-card shadow="hover" class="hp">
          <div slot="header" class="clearfix">
            <span>快速设定</span>
          </div>
          <div class="filter-container">
            <el-form ref="listQuery" :model="listQuery" class="demo-form-inline demo-form-zdy" :rules="submitRules">
              <el-form-item label="选择部门" size="mini" prop="date">
                <el-select v-model="type"  placeholder="请选择部门" style="width: 170px;" default-first-option @change="onCalendarTempQuery()">
                  <el-option v-for="x in typeList" :key="x.id" :label="x.orgName" :value="x.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="选择月份" size="mini" prop="date">
                <el-date-picker v-model="dateCalendar" type="month" style="width: 170px" placeholder="选择月份" @change="onCalendarTempQuery()" />
              </el-form-item>
              <el-form-item label="日历模板" prop="tempId" size="mini">
                <el-select v-model="listQuery.tempId"  placeholder="请选择日历模板" style="width: 170px;">
                  <el-option v-for="item in tableTimeData" :key="item.id" :label="item.tempName" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item size="mini">
                <el-button type="primary" class="wp" @click="onSet('listQuery')">设定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>

      </div>
      <div class="otherCon wp p-10">
        <!--工作时间-->
        <el-card shadow="hover" class="hp">
          <div slot="header" class="clearfix">
            <span>工作时间</span>
          </div>
          <Elslidermin
            v-for="(x,index) in calendartimeHover"
            :key="'index'+index"
            class="wp"
            :min="0"
            :max="24"
            :slider-hover-data="x"
            :slider-data="x"
            :interval-min="x.k | capitalize"
            :interval-max="x.v | capitalize"
            :max-slider="false"
          />
        </el-card>
      </div>
    </div>
    <div class="otherRCon hp p-10">
      <el-card shadow="hover" class="hp">
        <el-calendar v-model="dateCalendar" size="mini" min="0" max="0" class="wp hp">
          <template slot="dateCell" slot-scope="{ date, data }">
            <div class="date-cell hp" :class="data.isSelected ? 'is-selected' : ''" @click="calendarOnClick(data)" @dblclick="calendarOndbClick(data)">
              <div class="calendar-day">
                {{ data.day.split('-').slice(2).join('-') }}
                <span v-for="x in dateCalendarList" :key="x.id" class="deleteCls">
                  <span v-if="x.date == data.day" @click="deleteCalendar(x, data)">×</span>
                </span>
              </div>
              <div style="height:40% ;width:100px;" />
              <div v-for="x in dateCalendarList" :key="x.id" class="tempNamecss">
                <span v-if="x.date == data.day">{{ x.tempName }}</span>
              </div>
            </div>
          </template>
        </el-calendar>
      </el-card>
    </div>

    <!--弹窗月工作模板修改-->
    <el-dialog v-dialogDrag  :close-on-click-modal="false" title="修改工作模板" v-model="dialogFormVisible" class="roleDialog">
      <el-form ref="listUpdate" label-position="right" label-width="150px" :rules="submitRules2" :model="listUpdate">
        <el-form-item label="日期范围:" prop="date" size="mini">
          <el-date-picker v-model="listUpdate.date" type="daterange" placeholder="时间" style="width: 220px;" class="filter-item" @change="changefilter" />
        </el-form-item>
        <el-form-item label="工作模板" prop="tempId" size="mini">
          <el-select v-model="listUpdate.tempId" placeholder="请选择工作模板" style="width: 220px;">
            <el-option v-for="item in tableTimeData" :key="item.id" :label="item.tempName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="saveData('listUpdate')">
          保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { $message, $confirm, timeTranslate, timeTranslateYM } from '@/utils/common.js'
import {getInfo} from '@/api/my.js'
import Elslidermin from '@/components/Elslider/indexmin.vue'
/**
 * 1.日工作模板查询
 * 2.月工作模板快速设定
 * 3.月工作模板查询(没绑定模板的日期不会展示)
 * 4.月工作模板删除
 * 5.月工作模板修改
 */
import { getDailyWorkTempList, getQuickSetCalendarUpdate, getCalendarTempList, deleteCalendarTemp, getCalendarTempUpdate,calendarType } from '@/api/factoryCalendar'

export default {
  name: 'Table',
  components: { Elslidermin },
  filters: {
    capitalize: function(value) {
      if (!value) return ''
      var strArray = value.split(':')
      return parseInt(strArray[0]) + parseInt(strArray[1]) / 60
    }
  },
  data() {
    return {
      typeList: [],
      type: '1', // 生产工作日历类型
      tableTimeData: [], // 日工作模板数据
      dateCalendar: new Date(),
      dateCalendarList: [], // 查询出来的月工作模板
      listQuery: {
        tempId: '', // 模板id
        date: new Date() // 设置的月份，格式:yyyy-MM，其余格式验证不通过
      },
      submitRules: {
        tempId: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        date: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ]
      },
      calendartimeHover: [],
      dialogFormVisible: false,
      dialogStatus: '',
      listUpdate: {
        tempId: '',
        date: '',
        dateCount: ['', '']
      },
      submitRules2: {
        tempId: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        date: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ]
      }
    }
  },
  mounted() {
    this.onQuery() // 查询日工作模板查询
    this.queryType()
    this.userInfo()
    // this.onCalendarTempQuery() // 查询 月工作模板查询(没绑定模板的日期不会展示)
    this.$nextTick(() => {
      // 点击前一个月
      const prevBtn = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:nth-child(1)')
      prevBtn.addEventListener('click', () => {
        this.onCalendarTempChangeQuery(timeTranslateYM(this.dateCalendar))
      })

      // 点击后一个月
      const prevBtn2 = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:last-child')
      prevBtn2.addEventListener('click', () => {
        this.onCalendarTempChangeQuery(timeTranslateYM(this.dateCalendar))
      })

      // 点击今天
      const prevBtn3 = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:nth-child(2)')
      prevBtn3.addEventListener('click', () => {
        this.onCalendarTempChangeQuery(timeTranslateYM(this.dateCalendar))
      })
    })
  },
  methods: {
    // 查询日工作模板查询
    onQuery() {
      this.tableTimeData = []
      getDailyWorkTempList().then(response => {
        this.tableTimeData = response.data
      })
    },
    // 查询 月工作模板查询(没绑定模板的日期不会展示)
    onCalendarTempQuery() {
      const ctype = this.type
      console.log(ctype)
      getCalendarTempList({ date: timeTranslateYM(this.dateCalendar) , type:ctype}).then(response => {
        this.dateCalendarList = response.data
      })
    },
    // 查询 月工作模板查询(没绑定模板的日期不会展示)
    onCalendarTempChangeQuery(dateCalendar) {
      const ctype = this.type
      this.calendartimeHover = []// 将显示的工作时间清空
      // console.log(this.calendartimeHover, 'calendartimeHover');
      getCalendarTempList({ date: dateCalendar , type:ctype}).then(response => {
        this.dateCalendarList = response.data
      })
    },
    // 设定
    onSet(listQuery) {
      this.$refs[listQuery].validate((valid) => {
        const ctype = this.type
        this.listQuery.date = this.dateCalendar
        if (valid) {
          const req = { ...this.listQuery }
          req.date = timeTranslateYM(req.date)
          const dateArr = req.date.split('-')
          req.year = parseInt(dateArr[0])
          req.month = parseInt(dateArr[1])
          req.type = ctype
          // console.log('listQuery',req)
          getQuickSetCalendarUpdate(req).then(response => {
            $message('设定成功', 'success')
            this.onCalendarTempChangeQuery(timeTranslateYM(this.dateCalendar)) // 查询
          })
        } else {
          $message('请填写必填项', 'warning')
          return false
        }
      })
    },
    // 删除日历模板
    deleteCalendar(item, date) {
      $confirm('确定删除月工作模板吗？', '取消删除').then(response => {
        deleteCalendarTemp({ id: item.id }).then(res => {
          this.onCalendarTempChangeQuery(date.day.substring(0, 7))
          $message('删除成功', 'success')
        })
      })
    },
    // 点击日历日期
    calendarOnClick(event) {
      if (this.dateCalendarList) {
        this.calendartimeHover = [] // 清空左侧显示的工作时间
        this.dateCalendarList.forEach(element => {
          if (element.date == event.day) {
            this.calendartimeHover = element.times // 选中的日期
            // console.log(element.date,event.day,this.calendartimeHover,'点击了哪一天');
          }
        })
      }
    },
    changefilter(event) {
      if (event) {
        this.listUpdate.dateCount = [timeTranslate(event[0]), timeTranslate(event[1])]
      }
    },
    // 双击日历日期
    calendarOndbClick(event) {
      this.dialogFormVisible = true
    },
    saveData(listUpdate) {
      this.$refs[listUpdate].validate((valid) => {
        const ctype = this.type
        if (valid) {
          const req = {
            date: {
              k: this.listUpdate.dateCount[0],
              v: this.listUpdate.dateCount[1]
            },
            tempId: this.listUpdate.tempId,
            type: ctype
          }
          getCalendarTempUpdate(req).then(response => {
            // console.log(req, "===修改req===")
            this.dialogFormVisible = false
            this.$message({ message: '修改成功', type: 'success' })
            this.onCalendarTempChangeQuery(timeTranslateYM(this.dateCalendar)) // 查询
          })
        } else {
          $message('请填写必填项', 'warning')
          return false
        }
      })
    },
    queryType(){
      calendarType().then(res=>{
        this.typeList = res.data
      })
    },
    userInfo(){
      getInfo().then(res=>{
        const userGsbm =res.data.user.gsbmId
        this.typeList.forEach(item=>{
          if(item.orgIds.indexOf(userGsbm) !== -1){
            this.type = item.id
            return
          }
        })
        getCalendarTempList({ date: timeTranslateYM(this.dateCalendar) , type:this.type}).then(response => {
          this.dateCalendarList = response.data
        })
      })
    }
  }
}
</script>

<style scoped>
.blockPadd{
  padding: 15px 0 0 0;
}
.deleteCls{
  float: right;
  font-size: 16px;
  color: #c0c3cc;
}
.tempNamecss{
  font-size: 10px;
  color: #c0c3cc;
  text-align: center;
}
</style>
