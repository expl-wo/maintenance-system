<template>
  <div class="date" ref="ganttDateRef">
    <div class="allDaysArray"
         :style="{ width: (allDetailDates.length * detailIntervalWidth + 10) + 'px' }">
      <div>
        <div class="allMonths" style="display:flex;">
          <div class="years" v-for="(item, parentIndex) in allMonths" :key="item.month">
            <div
                class="month"
                :key="item.month + 'month'"
                :style="{ width: item.width + 'px' }">
              <div class="month-top" :class="{'month-end': allMonths.length === (parentIndex + 1)}">{{
                  item.month
                }}
              </div>
            </div>
          </div>
        </div>
        <div class="alldays">
          <div
              v-for="(subItem, subIndex) in allDetailDates"
              class="day"
              :title="subItem.tooltip"
              :style="{ width: subItem.width + 'px' }"
          >
                  <span
                      class="dateNum"
                      :class="{
                  isHover:
                    (
                     (subItem.left < currentLineDay.start &&
                     (subItem.left + detailIntervalWidth)  > currentLineDay.start) ||
                     (subItem.left < currentLineDay.end &&
                     (subItem.left + detailIntervalWidth)  >= currentLineDay.end) ||
                     (subItem.left >= currentLineDay.start &&
                     (subItem.left + detailIntervalWidth)  <= currentLineDay.end)
                    ),
                  nodBorder:
                     (
                     (subItem.left < currentLineDay.start &&
                     (subItem.left + detailIntervalWidth)  > currentLineDay.start) ||
                     (subItem.left < currentLineDay.end &&
                     (subItem.left + detailIntervalWidth)  >= currentLineDay.end) ||
                     (subItem.left >= currentLineDay.start &&
                     (subItem.left + detailIntervalWidth)  <= currentLineDay.end)
                    ),
                    todayDateNum: subItem.isToday
                }"
                  >
                <div
                    style="width:100%;height:100%;"
                    :style="{
                    borderLeft: (subIndex === 0 ) ? 'none' : '1px solid #d7d7d7',
                    borderRight:   subIndex === (allDetailDates - 1) ? '1px solid #d7d7d7': 'none'
                  }"
                >
                  {{ subItem.simpleDate }}
                </div>
              </span>
          </div>
        </div>
      </div>
      <div class="lineBG" @scroll="handleBGScroll" ref="lineBGRef" style="overflow-y: auto;" @mousedown="
                lineBGMousedown">
        <template v-for="(item, index) in computedList">
          <div v-if="item.isShow" class="line-wrapper"
               :class="{'deepColorBg': index%2===1}">
            <div
                v-show="item.display"
                @click.stop="handleClickItem(item)"
                class="line"
                :class="item.bgClz"
                :style="{
                      left: item.left + 'px',
                      width: item.widthMe + 'px',
                      top: item.top + 'px'
                    }"
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
              <div class="line-label">{{ item.productOrNodeName }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <product-arrange-dialog ref="productArrangeDialogRef" @refresh="handleRefresh"></product-arrange-dialog>
  </div>
  <tip-panel ref="tipPanelRef" :isShowMsg="isShowMsg" :currentProjectMsg="currentProjectMsg"></tip-panel>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import {defineComponent, computed, onMounted, ref, reactive, defineEmits, toRef, watch, nextTick} from "vue";
import {dateFilter} from '@/utils/dateUtil'
import slider from './slider.vue'
import productArrangeDialog from './productArrangeDialog.vue'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import constants from "@/utils/constants";
import {getGantClzByStatus} from '../util/config'
import {deepClone} from "@/utils";
import tipPanel from './tipPanel.vue'
import store from "@/layouts/store";

const state = store.state;


dayjs.extend(weekOfYear);

const configParams = reactive({
  //按天做甘特图时，每天的宽度
  dayWidth: 25,
  //按周做甘特图时，每天的宽度
  weekWidth: 16
})

const emits = defineEmits(["handleBGScroll", "setCurrentRow", "handleRefresh"]);
//计算后的值
const computedList = ref([]) as any;
//所有的月份
const allMonths = ref([]);
const allDetailDates = ref([]);
const nowDayObj = reactive({}) as any;
const isShowMsg = ref(false);
const isHover = ref(false);
const listRefs = ref({}) as any;
const currentRow = ref({}) as any;
const ganttDateRef = ref();
const lineBGRef = ref();
const tipPanelRef = ref();
const BGScrollTop = ref(0);
const productArrangeDialogRef = ref();

const dateType = ref('day');
const dateTypeDesc = computed(() => {
  if (dateType.value === 'day') {
    return "今天"
  } else {
    return "本周"
  }
})
const detailIntervalWidth = computed(() => {
  if (dateType.value === 'day') {
    return configParams.dayWidth
  } else {
    return configParams.weekWidth * 7
  }
});

//初始化数据备份
const datesBak = ref([]);
const listBak = ref([]);

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


const initWeekDate = dates => {
  let intervalMonth = dayjs(dates[1]).diff(dates[0], 'month') + 1;
  //今天是那一年的第几周
  let tempMonths = [];
  for (let i = 0; i < intervalMonth; i++) {
    let monthStartDate = dayjs(dates[0]).add(i, 'month');
    let monthEndDate = dayjs(monthStartDate).endOf('month');
    //完整一周
    let monthStartDateWeeks = monthStartDate.clone();
    let monthEndDateWeeks = monthEndDate.clone();
    if (i === 0) {
      //第一天是星期几
      let firstDayWeeks = dayjs(monthStartDateWeeks).day();
      monthStartDateWeeks = monthStartDateWeeks.subtract(firstDayWeeks, 'day');
    }
    if (i === (intervalMonth - 1)) {
      //最后一天是星期几
      let lastDayWeeks = 6 - dayjs(monthEndDateWeeks).day();
      monthEndDateWeeks = monthEndDateWeeks.add(lastDayWeeks, 'day');
    }
    let dayInterval = monthEndDateWeeks.diff(monthStartDateWeeks, 'day') + 1;
    let monthObj = {
      startDate: monthStartDateWeeks.format('YYYY-MM-DD'),
      endDate: monthEndDateWeeks.format("YYYY-MM-DD"),
      width: dayInterval * configParams.weekWidth,
      month: monthStartDate.format('YYYY-MM'),
    }
    tempMonths.push(monthObj);
  }
  allMonths.value = tempMonths;

  //计算周
  let startDayWeeks = dayjs(dates[0]).day();
  //第一周的第一天
  let startDate = dayjs(dates[0]).subtract(startDayWeeks, 'day');
  let endDayWeeks = dayjs(dates[1]).day();
  //最后一周的第一天
  let endDate = dayjs(dates[1]).add(endDayWeeks, 'day');
  let j = 0;
  let tempWeeks = [], nowDateStr = dayjs().format('YYYY-MM-DD');
  while (endDate.diff(startDate) >= 0) {
    let weekObj = {
      date: startDate.format('YYYY-MM-DD'),//本周第一天
      width: configParams.weekWidth * 7,
      left: j * configParams.weekWidth * 7
    } as any;
    let startDateYms = startDate.format('YYYY-MM-DD');
    let endDateYms = startDate.clone().add(6, 'day').format('YYYY-MM-DD');
    weekObj.tooltip = startDateYms + '--' + endDateYms;
    weekObj.dateArr = [startDateYms, endDateYms];
    weekObj.startDate = startDateYms;
    weekObj.endDate = endDateYms;
    if (nowDateStr >= startDateYms && nowDateStr <= endDateYms) {
      weekObj.simpleDate = dateTypeDesc.value;
      weekObj.isToday = true;
    } else {
      weekObj.simpleDate = startDate.format('YYYY') + '年' + startDate.week() + '周';
      weekObj.isToday = false;
    }
    if (weekObj.isToday) {
      //用于定位今天
      Object.assign(nowDayObj, weekObj);
    }
    tempWeeks.push(weekObj);
    //增加7天
    startDate = startDate.add(7, 'day');
    j++;
  }
  allDetailDates.value = tempWeeks;
}

//初始化列表数据
const initDayDate = dates => {
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
        simpleDate = dateTypeDesc.value;
      }
      let dayObj = {
        startDate: dateStr,
        endDate: dateStr,
        isToday,
        width: configParams.dayWidth,
        left: dayLeftWidth,
        simpleDate: simpleDate,
        tooltip: dateStr
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
  allDetailDates.value = tempDays;
  allMonths.value = tempMonths;
}

const getDivRef = (el, item) => {
  listRefs.value[`line${item.id}`] = el
}

/**
 * @param  {String} dom ref
 * @param  {Object} events $event
 * @param  {Number} id id
 * @param  {Number} parentId parentId
 * @param  {Number} index index
 */
//鼠标悬停展示上部日期
const lineMouseover = (domId, e, id, parentId, index, item) => {
  currentLineDay.start = item.left;
  currentLineDay.end = item.widthMe + item.left
  isHover.value = true;
  handlerSelect(computedList.value[index]);
  lineMouseenter(domId, e, id, parentId, index, item);
}

/**
 * @param  {String} dom ref
 * @param  {Object} events $event
 * @param  {Number} id id
 * @param  {Number} parentId parentId
 * @param  {Number} index index
 */
//鼠标进入显示当前项目的基本信息框
const lineMouseenter = (domId, e, id, parentId, index, item) => {
  let top = e.y - 120;
  if ((top + 300) > window.innerHeight) {
    top = e.y + 120;
  }
  let left = 0;
  if (state.isCollapse) {
    left = e.x + 280 >= window.innerWidth
        ? e.x - 65 - 240
        : e.x - 65 + 20;
  } else {
    left = e.x + 280 >= window.innerWidth
        ? e.x - 210 - 240
        : e.x - 210 + 20;
  }

  Object.assign(currentProjectMsg, {
    ...item,
    //名称
    name: item.productNo,
    //持续时间
    allTime: '',
    per: computedList.value[index].per,
    left,
    top
  });
  isShowMsg.value = true;
}

//根据数据重置top高度
const resetTop = () => {
  let index = 0;
  computedList.value.forEach(item => {
    if (item.isShow) {
      item.top = 5 + 40 * index;
      index++;
    }
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
      if ((ganttDateRef.value.scrollLeft - newWidth) > allDetailDates.value.length * detailIntervalWidth.value) {
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
  handlerSelect(null);
}

const handleBGScroll = (e) => {
  BGScrollTop.value = e.srcElement.scrollTop;
  emits("handleBGScroll", BGScrollTop.value);
}

const handlerSelect = (row: null) => {
  emits("setCurrentRow", row)
}

//滑动进度条事件
const thunkMousemove = () => {
  isShowMsg.value = false;
}

//滑动进度条事件
const thunkMousedown = () => {
  isShowMsg.value = false;
}

//定位到今天
const handleGoToday = () => {
  if (nowDayObj && nowDayObj.left) {
    ganttDateRef.value.scrollTo({
      left: nowDayObj.left - ganttDateRef.value.clientWidth / 2,
      behavior: "smooth"
    });
  }
}

const findItemById = id => {
  return computedList.value.find(item => {
    return item.id === id;
  })
}

const handlerRowClick = (row) => {
  let selectedItem = findItemById(row.id);
  if (!selectedItem) {
    return;
  }
  Object.assign(currentRow, selectedItem);
  let rightSpace = 160;
  let chartDateWidth = ganttDateRef.value.clientWidth;
  let rowRightContent = selectedItem.left + selectedItem.widthMe;
  let moveLeft = 0;
  if (rowRightContent > (chartDateWidth - rightSpace)) {
    moveLeft = rowRightContent - (chartDateWidth - rightSpace);
  } else {
    moveLeft = 0
  }
  ganttDateRef.value.scrollTo({
    left: moveLeft,
    behavior: "smooth"
  });
}

const handleToggleExpandAll = expand => {
  computedList.value.forEach(item => {
    if (item.dataType === constants.productOrGx.product) {
      _handleExpand(item, expand);
    }
  })
  resetTop();
}

const handleExpand = (row, expand) => {
  _handleExpand(row, expand);
  resetTop();
}

const _handleExpand = (row, expand) => {
  let selectedRow = computedList.value.find(item => {
    return item.id == row.id;
  });
  if (selectedRow.dataType === constants.productOrGx.product) {
    selectedRow.expand = expand;
    if (selectedRow.children && selectedRow.children.length > 0) {
      _handleExpandByMainId(selectedRow.children, expand);
    }
  }
}

const _handleExpandByMainId = (childrenList, expand) => {
  computedList.value.forEach(item => {
    childrenList.forEach(subItem => {
      if (item.id === subItem.id) {
        item.isShow = expand;
      }
    })
  })
}

//点击行
const handleClickItem = item => {
  productArrangeDialogRef.value.init(item);
}


const setComputedList = (dataList) => {
  let tempList = [];
  dataList.forEach(item => {
    tempList.push(item);
    if (item.children && item.children.length > 0) {
      tempList = tempList.concat(item.children);
    }
  })
  tempList.forEach((item, index) => {
    item.top = 5 + 40 * index;
  })
  computedList.value = tempList;
}

//触发刷新
const handleRefresh = () => {
  emits("handleRefresh", {});
  //会触发主页面的数据刷新机制
}

//设置颜色
const setItemClz = item => {
  let status = item.status;
  let clz = getGantClzByStatus(status);
  if (item.per == 0) {
    item.bgClz = clz;
    item.sliderClz = '';
  } else {
    item.bgClz = '';
    item.sliderClz = clz;
  }
}

//对查询出的数据进行递归初始化
const formatDataList = (list, dataType = constants.productOrGx.product) => {
  let dataList = [];
  for (const item of list) {
    item.planStartDate = dateFilter(item.planStartDate);
    item.planEndDate = dateFilter(item.planEndDate);
    let startTime = item.planStartDate;
    item.dataType = dataType;
    let endTime = item.planEndDate;
    item.expand = true;
    item.isShow = true;
    //是否隐藏
    item.display = true;
    //设置颜色
    setItemClz(item);
    let gantStartDate = allDetailDates.value[0].startDate;
    let gantEndDate = allDetailDates.value[allDetailDates.value.length - 1].endDate;
    if (startTime && endTime) {
      if (item.processStatus === null || item.processStatus === undefined) {
        item.processStatus = 'normal';
      }
      if (startTime > endTime) {
        let temp = endTime;
        endTime = startTime;
        startTime = temp;
        item.planStartDate = startTime;
        item.planEndDate = endTime;
      }
      if (startTime < gantStartDate) {
        startTime = gantStartDate;
      }
      if (endTime > gantEndDate) {
        endTime = gantEndDate;
      }

      if (startTime && endTime) {
        item.type = 1;
        let intervalWidth = configParams.dayWidth;
        if (dateType.value === 'week') {
          intervalWidth = configParams.weekWidth;
        }
        item.widthMe = (dayjs(endTime).diff(dayjs(startTime), 'day') + 1) * intervalWidth;
        item.left = dayjs(startTime).diff(dayjs(gantStartDate), 'day') * intervalWidth;
      }
      //如果不在区间，条纹隐藏
      if (startTime >= gantEndDate || endTime <= gantStartDate) {
        item.display = false;
      }
      //递归设置children值
      if (item.children && item.children.length > 0) {
        item.children = formatDataList(item.children, constants.productOrGx.gx);
      }
      dataList.push(item);
    }
  }
  return dataList;
}


//切换甘特图绘制日期类型
const handleChangeDateType = dateTypeItem => {
  dateType.value = dateTypeItem.value;
  initInner();
}

const init = (list, dates) => {
  listBak.value = list;
  datesBak.value = dates;
  initInner();
}

const initInner = () => {
  if (dateType.value === 'day') {
    initDayDate(deepClone(datesBak.value));
  } else {
    initWeekDate(deepClone(datesBak.value));
  }
  let tempList = formatDataList(deepClone(listBak.value));
  setComputedList(tempList);
}

const handlerExpandRow = (row, expand) => {
  handleExpand(row, expand);
}

const tableScrollTop = scrollTop => {
  lineBGRef.value.scrollTop = scrollTop;
}

defineExpose({
  init,
  handleToggleExpandAll,
  handlerRowClick,
  handlerExpandRow,
  tableScrollTop,
  handleGoToday,
  handleChangeDateType
})
</script>

<style scoped lang="scss">

</style>
