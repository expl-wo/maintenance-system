import moment from 'moment'
import planWeek from '@/api/plan/planWeek'
import planWeekHttp from '@/api/plan/planWeek'
import testData from '@/views/ps/planFurnace/testData'
import scss from '@/styles/variables.scss'
import legendConfig from '@/views/ps/planWeek/components/legendConfig'

export default {
  data() {
    return {
      INTERVAL_X: 26,
      MARGIN_INTERVAL: 2
    }
  },
  methods: {
    handleSelectNode(subItem){
      if(this.gantSelectedNode === subItem){
        this.gantSelectedNode = null;
      }else{
        this.gantSelectedNode = subItem;
      }
    },
    addEndLine(list, endDate){
      list.push({
        label: endDate.format('YYYY-MM-DD'),
        width: 0
      })
    },
    getTimeLineList(){
      let dataList = [];
      let startDate = moment();
      let endDate = moment().add(1, 'months');
      let diffDays = this.getIntervalDate(startDate, endDate);
      while(startDate < endDate){
        let diffDays = this.getIntervalDate(startDate, endDate);
        if(diffDays < 7){
          dataList.push({
            label: startDate.format('YYYY-MM-DD'),
            width: this.INTERVAL_X * (diffDays + 1)
          });
          this.addEndLine(dataList, endDate);
          break;
        }else{
          dataList.push({
            label: startDate.format('YYYY-MM-DD'),
            width: this.INTERVAL_X * 5
          });
          startDate = startDate.add('5', 'days');
        }
      }
      this.timeLineList = dataList;
    },
    getFormattedData(formattedGantList, id){
      return formattedGantList.find(item=>{
        return item.id == id;
      })
    },
    formatGantList(list){
      let resultData = [];
      list.forEach(item=>{
        resultData.push({
          id: item.id,
          tableName: item[this.nodeNameAttr],
          children: []
        })
      })
      return resultData;
    },
    //格式化翻转台数据
    formatData(formattedGantList, dataList){
      dataList.forEach(item=>{
        let obj = this.getFormattedData(formattedGantList, item[this.gantNameAttr].id)
        item.products.forEach(subItem=>{
          obj.children.push(subItem)
        })
      })
      this.formattedChartData(formattedGantList);
    },
    //生成最终的甘特数据
    formattedChartData(gantList){
      let startDate = moment().format('YYYY-MM-DD');
      let endDate = moment().add(1, 'months').format('YYYY-MM-DD');
      gantList.forEach(item=>{
        let children = item.children;
        let timeList = [];
        children = this.controlTimeRange(children, startDate, endDate);
        children = this.sortChildren(children);
        children.forEach(subItem=>{
          this.insertTimeList(subItem, timeList);
        })
        this.sortTimeList(timeList);
        let chartDataList = this.getResult(timeList, startDate, endDate);
        chartDataList.forEach(chartData=>{
          chartData.tableId = item.id;
        })
        item.chartDataList = chartDataList;
      })
      this.gantList = gantList;
    },
    //开始计划时间和结束时间
    controlTimeRange(dataList, startDate, endDate){
      let newList = [];
      dataList.forEach(item=> {
        if (item.startDate >= endDate && item.nodeDate > endDate) {
            //如果item开始时间大于等于总的结束时间，并且item结束时间大于总的结束时间，跳过
        } else if (item.nodeDate <= startDate && item.startDate < startDate) {
          //如果item结束时间大于等于总的开始时间，并且item开始时间大于总的开始时间，跳过
        } else {
          if(item.startDate < startDate){
            item.startDate = startDate;
          }
          if(item.nodeDate > endDate){
            item.nodeDate = endDate;
          }
          newList.push(item);
        }
      })
      return newList;
    },
    sortChildren(dataList){
      let resultData = [];
      dataList.forEach(item=>{
        let hasObj = resultData.find(subItem=>{
          return subItem.startDate === item.startDate;
        })
        if(!hasObj){
          hasObj = {
            startDate: item.startDate,
            children: []
          }
          resultData.push(hasObj);
        }
        hasObj.children.push(item)
      })

      let endResult = [];
      resultData.forEach(item=>{
        let childrenList = item.children;
        this.sortEndTimeList(childrenList);
        endResult = endResult.concat(childrenList)
      })
      return endResult;
    },
    addOneDay(str){
      return moment(str).add('1', 'days').format('YYYY-MM-DD');
    },
    getResult(timeList, startDate, nodeDate){
      let newResult = [], nextStartDate = startDate;
      if(timeList.length === 0){
        newResult.push({
          startDate,
          nodeDate,
          children: []
        })
      }else{
        timeList.forEach(item=>{
          if(item.startDate >= nextStartDate){
            if(item.startDate > nextStartDate){
              newResult.push({
                startDate: nextStartDate,
                nodeDate: this.subDates(item.startDate, 1),
                children: []
              })
            }
            let obj = {
              startDate: item.startDate,
              nodeDate: item.nodeDate,
              children: item.children,
            }
            newResult.push(obj);
            nextStartDate = this.addOneDay(item.nodeDate);
          }
        })
        if(nextStartDate <= nodeDate){
          newResult.push({
            startDate: nextStartDate,
            nodeDate: nodeDate,
            children: [],
          })
        }
      }
      let len = newResult.length;
      newResult.forEach((item,index)=>{
        let intervalDays = this.getIntervalDate(item.startDate, item.nodeDate);
        intervalDays++;
        item.intervalDays = intervalDays;
        if(len === 1){
          item.xLong =  intervalDays * this.INTERVAL_X
        }else{
          if(index === 0){
            item.xLong =  intervalDays * this.INTERVAL_X - this.MARGIN_INTERVAL + 1;
          }else if(index === (len - 1)){
            item.xLong =  intervalDays * this.INTERVAL_X - this.MARGIN_INTERVAL;
          }else{
            item.xLong =  intervalDays * this.INTERVAL_X - this.MARGIN_INTERVAL * 2;
          }
        }
        item.realLong = intervalDays * this.INTERVAL_X;
        let products = [];
        if(item.children && item.children.length > 0){
          let len = item.children.length;
          item.children.forEach((subItem, index)=>{
            if(index < (len - 1)){
              products.push({
                productNo: subItem.productNo + ',',
                clz: this.getFontClz(subItem)
              });
            }else{
              products.push({
                productNo: subItem.productNo,
                clz: this.getFontClz(subItem)
              });
            }
          })
        }
        item.productNames = products.map(item=>{
          return item.productNo
        }).join('');
        item.productList = products;
        item.isEmpty = (products.length === 0);
        this.setMiniClass(item);
        item.simpleStartDate = this.formatSimpleDateToMd(item.startDate);
        item.simpleNodeDate = this.formatSimpleDateToMd(item.nodeDate);
      })
      return newResult;
    },
    getFontClz(data){
      let clz = 'defaultColor';
      let progressStatus = data.progressStatus;
      legendConfig.getSimpleProgressData().some(subItem=>{
        if(subItem.progressStatus === progressStatus){
          clz = subItem.clz;
          return true;
        }else{
          return false;
        }
      })
      return clz;
    },
    setMiniClass(item){
      let classNames = [];
      if(item.intervalDays <= 4){
        classNames.push('mini');
      }else if(item.intervalDays <= 6 && item.productList.length >= 4 ){
        classNames.push('mini');
      }
      item.classNames = classNames.join(' ');
    },
    //把生产单加入到时间段中
    insertTimeList(data, timeList){
      if(timeList.length === 0){
        timeList.push({
          startDate: data.startDate,
          nodeDate: data.nodeDate,
          children: [data]
        })
        return;
      }
      let notInAnyDate = true;
      timeList.some((item, index)=>{
        if(item.startDate <= data.startDate && item.nodeDate>= data.nodeDate){ //如果在这个时间范围内
          item.children.push(data);
          notInAnyDate = false;
          return true;
        }else{
          //如果只有开始时间在区域内为非法数据
          if(item.startDate <= data.startDate && item.nodeDate > data.startDate  && item.nodeDate < data.nodeDate){
            notInAnyDate = false;
            return true;//结束
          }else{
            return false;
          }
        }
      })
      if(notInAnyDate){
        timeList.push({
          startDate: data.startDate,
          nodeDate: data.nodeDate,
          children: [data]
        })
      }
    },
    formatSimpleDateToMd(str){
      if(typeof(str)=='string'){
        if(str){
          return moment(str).format('M.D')
        }
      }
      return str;
    },
    sortEndTimeList(timeList){
      timeList.sort((item1, item2)=>{
        if(item1.nodeDate > item2.nodeDate){
          return -1;
        }else if(item1.nodeDate < item2.nodeDate){
          return 1
        }else{
          return 0
        }
      })
    },
    sortTimeList(timeList){
      timeList.sort((item1, item2)=>{
        if(item1.startDate > item2.startDate){
          return 1;
        }else if(item1.startDate < item2.startDate){
          return -1
        }else{
          return 0
        }
      })
    },
    getIntervalDate(startDate, endDate){
      return moment(endDate).diff(moment(startDate), 'days')
    },
    subDates(date, interval){
      return moment(date).subtract(interval, 'days').format('YYYY-MM-DD')
    },
    addDates(date, interval){
      return moment(date).add(interval, 'days').format('YYYY-MM-DD')
    },
    //加入
    async _handleAddGant(selectedData){
      let response = await planWeek.preCheck({
        pl14Id: [selectedData.pl14Id],
        nodeId: this.nodeType
      })
      let dataList = response.data.checkVos;
      if(dataList.length === 0){
        return;
      }
      let pl14Data = dataList[0];
      if(pl14Data.haveGyjh == 0){
        this.$message.error('要处理的生产号没有工艺计划');
        return;
      }
      if(this.gantSelectedNode.isEmpty && selectedData.startDate >= this.gantSelectedNode.startDate
        && selectedData.nodeDate <= this.gantSelectedNode.nodeDate){//空的
        this.commitData(pl14Data, this.gantSelectedNode.tableId)
      }else{
        if(selectedData.startDate !== this.gantSelectedNode.startDate || selectedData.nodeDate !== this.gantSelectedNode.nodeDate){
          this.$confirm(`生产单的计划开始时间与结束时间与选中${this.nodeTypeDesc}时间段不一致，是否要修改成一致?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            let response = await planWeek.updatePlanDate({
              pl14Id: pl14Data.pl14Id,
              nodeId: this.nodeType,
              startDate: this.gantSelectedNode.startDate,
              finishDate:  this.gantSelectedNode.nodeDate
            })
            if(response.err_code === this.$constants.statusCode.success){
              this.commitData(pl14Data, this.gantSelectedNode.tableId)
            }
          });
        }else{
          this.commitData(pl14Data, this.gantSelectedNode.tableId)
        }
      }
    },
    commitData(obj, tableId) {
      let data = {
        nodeId:this.nodeType,
        condition: []
      }
      let itemObj = {
        pl14Id: obj.pl14Id,
        relativeBom: obj.relativeBom,
        bomInfo: obj.bomInfo,
        haveGyjh: obj.haveGyjh,
        gx: obj.gx,
        usedEquipment: tableId
      }
      data.condition.push(itemObj)
      planWeek.addWeekPlan(data).then(response => {
        if (response.err_code === this.$constants.status.success) {
          this.$message.success('数据保存成功')
          this.dialogVisible = false
          this.handleSearch();
        } else {
          this.$message.error(response.err_msg)
        }
      })
    },
    handleDeleteProduct(){
      if(!this.gantSelectedNode){
        this.$message.error(`请先在左侧选择要处理的生产号`);
        return;
      }
      if(!this.gantSelectedNode.children || this.gantSelectedNode.children.length === 0){
        this.$message.error(`请选择有生产号的甘特时间段`);
        return;
      }
      if(this.gantSelectedNode.children.length === 1){
        let product = this.gantSelectedNode.children[0];
        this.$confirm(`请是否确定删除生产号为${product.productNo}的${this.menuDesc}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          planWeekHttp.delPlan({
            ids: [product.planNodeId],
            planType: 'furance'
          }).then(response=>{
            if(response.err_code === this.$constants.statusCode.success){
              this.$message.success('删除成功');
              this.handleSearch();
            }else{
              this.$message.error(response.err_msg);
            }
          })
        })
      }else{
        this.$refs.deleteGantPlanDialogRef.init(this.gantSelectedNode.children, this.menuDesc, this.nodeType);
      }
    }
  }
}
