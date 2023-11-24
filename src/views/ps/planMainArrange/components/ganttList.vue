<template>
  <div class="date" ref="ganttDateRef">
    <div class="allDaysArray">
      <div class="alldays">
        <div class="years" v-for="(item, parentIndex) in allMonths" :key="item.month">
          <div
              class="month"
              :key="item.month + 'month'"
              :style="{ width: item.width + 'px' }">
            <div class="month-top">{{ item.month }}</div>
          </div>
        </div>
        <template v-for="item in allMonths" :key="item.month">
          <div
              v-for="(subItem, index) in item.days"
              class="day"
              :style="{ width: subItem.dayWidth + 'px' }"
          >
                  <span
                      class="dateNum"
                      :class="{
                  isHover:
                    subItem.width >= currentLineDay.start &&
                    (subItem.width - 42)  < currentLineDay.end,
                  nodBorder:
                    subItem.width >= currentLineDay.start &&
                    ((subItem.width - 42) < currentLineDay.end ),
                    todayDateNum: j.isToday
                }"
                  >
                <div
                    style="width:100%;height:100%;"
                    :style="{
                    borderLeft: index == 0 ? 'none' : '1px solid #d7d7d7'
                  }"
                >
                  {{ subItem.isToday ? '今天' : subItem.simpleDate }}
                </div>
              </span>
          </div>
        </template>
      </div>
      <div class="lineBG" @scroll="handlerBGScroll" ref="lineBGRef" style="overflow-y: auto;"
           @mousedown="lineBGMousedown">
        <template v-for="(item, index) in computedList">
          <div class="line-wrapper" :class="{'deepColorBg': index%2===1}">
            <div
                class="line"
                :style="{
                      left: item.left + 'px',
                      width: item.widthMe + 'px',
                      top: item.top + 'px'
                    }"
                v-show="item.isShow"
                :ref="(el)=>getDivRef(el, item)"
                :key="item.id + index + 'ccc'"
                @mouseover="
                lineMouseover(
                  `line${item.id}`,
                  $event,
                  item.id,
                  item.parentId,
                  index,
                  item
                )
              "
                @mouseleave="lineMouseleave"
            >
              <slider
                  :min="0"
                  :max="100"
                  :item="item"
                  v-model="item.per"
                  @thunkMousedown="thunkMousedown"
                  @thunkMousemove="thunkMousemove"
              ></slider>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="toolTip">
      <el-button type="primary" @click="handleGoToday" style="margin-right: 10px;">定位本周</el-button>
      <preview-legend></preview-legend>
    </div>
    <!--  <tip-panel ref="tipPanelRef"></tip-panel>-->
  </div>
</template>

<script lang="ts" setup>
import {defineComponent, computed, onMounted, ref, reactive, defineEmits, toRef, watch, nextTick} from "vue";
import {dateFilter} from '@/utils/dateUtil'
import slider from './slider.vue'

// import tipPanel from './tipPanel.vue'
// const tipPanelRef = ref();
//计算后的值
const computedList = ref([]);
//所有的月份
const allMonths = ref([]);
const days = ref([]);
const nowDayObj = reactive({});
const isShowMsg = ref(false);
const isHover = ref(false);
const listRefs = ref({}) as any;
const ganttDateRef = ref();
const lineBGRef = ref();

const configParams = {
  dayWidth: 40
}

const currentLineDay = reactive({
  start: -1,
  end: -1
})

const currentProjectMsg = reactive({
  name: "",
  allTime: 0,
  per: 0,
  startTime: 0,
  endTime: 0,
  left: 0,
  top: 0
});

//初始化列表数据
const initMonthDate = dates => {
  let intervalMonth = dayjs(dates[1]).diff(dates[0], 'month') + 1;
  let todayStr = dayjs().format('YYYY-MM-DD');
  let tempMonths = [], tempDays = [], dayLeftWidth = 0;
  for (let i = 0; i < intervalMonth; i++) {
    let month = dayjs(dates[0]).add(i, 'month');
    let monthEndDate = dayjs(month).endOf('month');
    let dayInterval = monthEndDate.diff(month, 'day') + 1;
    let monthObj = {
      width: dayInterval * configParams.dayWidth,
      month: month.format('YYYY-MM'),
      days: []
    }
    for (let j = 0; j < dayInterval; j++) {
      let dayTime = dayjs(month).add(j, 'day');
      let dateStr = dayTime.format('YYYY-MM-DD'), simpleDate = dayTime.format('D');
      let isToday = false;
      if (dateStr === todayStr) {
        isToday = true;
        simpleDate = '今天';
      }
      let dayObj = {
        date: dateStr,
        isToday,
        width: configParams.dayWidth,
        left: dayLeftWidth,
        simpleDate: simpleDate,
      }
      if (isToday) {
        //用于定位今天
        Object.assign(nowDayObj, dayObj);
      }
      //为以后每一个设置left属性，用于定位今天
      dayLeftWidth += configParams.dayWidth;
      monthObj.days.push(dayObj);
      tempDays.push(dayObj);
    }
    tempMonths.push(monthObj);
  }
  days.value = tempDays;
  allMonths.value = tempMonths;
}

const getDivRef = (el, item) => {
  listRefs.value[`line${item.id}`] = e
}

/**
 * @param  {String} dom ref
 * @param  {Object} events $event
 * @param  {Number} id id
 * @param  {Number} parentId parentId
 * @param  {Number} index index
 */
//鼠标悬停展示上部日期
const lineMouseover = (dom, e, id, parentId, index, item) => {
  currentLineDay.start = item.left;
  currentLineDay.end = item.widthChild + item.left
  isHover.value = true;
  handlerSelect(computedList.value[index]);
  lineMouseenter(dom, e, id, parentId, index, item);
}

/**
 * @param  {String} dom ref
 * @param  {Object} events $event
 * @param  {Number} id id
 * @param  {Number} parentId parentId
 * @param  {Number} index index
 */
//鼠标进入显示当前项目的基本信息框
const lineMouseenter = (dom, e, id, parentId, index, item) => {
  let start =
      Math.round(
          parseInt(listRefs.value[dom][0].style.left) / configParams.dayWidth.value
      ) * configParams.dayWidth.value;
  let end =
      parseInt(listRefs.value[0].style.left) +
      parseInt(listRefs.value[0].style.width);
  end =
      Math.round(end / configParams.dayWidth.value) *
      configParams.dayWidth.value -
      configParams.dayWidth.value;
  let top = e.y + 20;
  if ((top + 300) > window.innerHeight) {
    top = e.y - 220;
  }
  Object.assign(currentProjectMsg, {
    ...item,
    //名称
    name: item.productNo,
    //持续时间
    allTime: item.widthChild > 0 ? item.widthChild / 6 : '',
    per: computedList.value[index].per,
    left:
        e.x + 280 >= window.innerWidth
            ? e.x - 210 - 240
            : e.x - 210 + 20,
    top
  });
  isShowMsg.value = true;
}
//鼠标离开信息消失，时间显示消失
/**
 * @param  {Object} e $event
 * @param  {Boolean} move 是否移动状态
 */
const lineMouseleave = (e, move) => {
  if (move) {
    isShowMsg.value = false;
    Object.assign(currentProjectMsg, {
      name: "",
      allTime: 0,
      per: 0,
      startTime: 0,
      endTime: 0,
      left: 0,
      top: 0
    })
    return;
  }
  Object.assign(currentLineDay, {
    start: -1,
    end: -1
  });
  isHover.value = false;
  isShowMsg.value = false;
  Object.assign(currentProjectMsg, {
    name: "",
    allTime: 0,
    per: 0,
    startTime: 0,
    endTime: 0,
    left: 0,
    top: 0
  })
  handlerSelect();
}

const handlerSelect = () => {

}

//滑动进度条事件
const thunkMousemove = () => {
  this.isShowMsg = false;
}

//滑动进度条事件
const thunkMousedown = () => {
  this.isShowMsg = false;
}

const handleGoToday = () => {
  if (nowDayObj && nowDayObj.value.left) {
    ganttDateRef.value.scrollTo({
      left: nowDayObj.value.left - ganttDateRef.value.clientWidth / 2,
      behavior: "smooth"
    });
  }
}

const handlerExpand = (row, expand) => {
  let rowIndex = computedList.value.findIndex(item => {
    return item.id == row.id;
  });
  computedList.value[rowIndex].expand = expand;
  if (
      computedList.value[rowIndex].children &&
      computedList.value[rowIndex].children.length > 0
  ) {
    computedList.value[rowIndex].children.forEach(k => {
      k.isShow = expand;
    });
  }
  // this.resetTop(rowIndex, !expand, true);
}

const handleToggleExpandAll = expand => {
  computedList.value.forEach(item => {
    handlerExpand(item, expand);
  })
}

const lineBGMousedown = (e) => {
  lineBGRef.value.style.cursor = 'grabbing';
  let cp = e.pageX;
  let result;
  let z = 0;
  let left;
  let beforeScrollLeft = ganttDateRef.value.scrollLeft;
  document.onmousemove = event => {
    nextTick(() => {
      let newWidth = event.pageX - cp;
      let scrollLeft = 0;
      if ((ganttDateRef.value.scrollLeft - newWidth) > days.value.length * configParams.dayWidth) {
      } else if ((ganttDateRef.value.scrollLeft - newWidth) <= 0) {
        scrollLeft = 0;
      } else {
        scrollLeft = beforeScrollLeft - newWidth;
      }
      ganttDateRef.value.scrollTo({
        // top: 0,
        left: scrollLeft,
        behavior: "smooth"
      });

    });
  };
  document.onmouseup = events => {
    lineBGRef.value.style.cursor = 'grab';
    document.onmousemove = document.onmouseup = null;
  };
}

const setComputedList = (dataList) => {
  let tempList = [];
  dataList.forEach(item => {
    tempList.push(item);
    if (item.children && item.children.length > 0) {
      tempList = tempList.concat(item.children);
    }
  })
  computedList.value = tempList;
}

const formatDataList = list => {
  let dataList = [];
  list.forEach((item, index) => {
    item.planStartDate = dateFilter(item.planStartDate);
    item.dateEnd = dateFilter(item.dateEnd);
    let startTime = item.planStartDate;
    item.per = 50;
    let endTime = item.dateEnd;
    item.expand = true;
    item.isShow = true;
    if (startTime && endTime) {
      if (item.processStatus === null || item.processStatus === undefined) {
        item.processStatus = 'normal';
      }
      if (startTime > endTime) {
        let temp = endTime;
        endTime = startTime;
        startTime = temp;
        item.planStartDate = startTime;
        item.dateEnd = endTime;
      }
      if (startTime < days.value[0].date) {
        startTime = days.value[0].date;
      }
      if (endTime > days.value[days.value.length - 1].date) {
        endTime = days.value[days.value.length - 1].date;
      }
      item.top = 5 + 40 * index;
      if (startTime && endTime) {
        item.type = 1;
        item.widthChild = day(endTime).diff(day(startTime), 'day') * configParams.dayWidth;
        item.widthMe = item.widthChild;
        item.left = day(startTime).diff(day(days.value[0].date), 'day') * configParams.dayWidth;
      }
      //递归设置children值
      if (item.children && item.children.length > 0) {
        item.children = formatDataList(item.children);
      }
      dataList.push(item);
    }
  })
  return dataList;
}

const init = (list, dates) => {
  initMonthDate(dates);
  let tempList = formatDataList(list);
  setComputedList(tempList);
}
defineExpose({
  init,
  handleToggleExpandAll
})

</script>

<style scoped lang="scss">

</style>
