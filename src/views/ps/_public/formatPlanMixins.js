import planWeekHttp from '@/api/plan/planWeek'
import { transformDictDetail } from '@/components/xui/dictionary'
import headerSortConfig from '@/views/ps/_public/headerSortConfig'
import columnConfig from '@/views/ps/_public/columnConfig'

export default {
  data(){
    return {
      showTable: false,
      //是否可显示列配置按钮
      showColumnConfigBtn: false,
      moreColumnList: [],
      //所有的列配置
      allColumnList: [],
      moreHeaders: [],
      dataList: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      borderHighlightClassName: 'xui-table__highlight-lr'
    }
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      await this.initColumnList();
      await this.getHeaderParams()
      this.showTable = false;
      this.$nextTick(()=>{
        this.setIntervalClass();
        this.showTable = true;
      })
    },
    async getHeaderParams(nodeId=null) { //如果nodeId存在，就把此工序排在最前面
      return new Promise((resolve, reject) => {
        planWeekHttp.findByType({
          type: this.processType
        }).then(response => {
          if (response.err_code === this.$constants.statusCode.success) {
            let header = response.data
            console.log('表头1:',header)
            this.moreHeaders = this.formatHeader(header, nodeId);
            console.log('表头2:',this.moreHeaders)
            this.initAllColumnList(this.moreHeaders);
            resolve()
          }
        }).catch(() => {
          this.moreHeaders = []
          resolve()
        })
      })
    },
    //初始化所有的列
    initAllColumnList(tempMoreHeaders){
      let normalColumnList = columnConfig.getNormalColumnList();
      let otherColumnList = [];
      let productColumnList = {
        label: '生产',
        property: '_product',
        children: []
      };
      tempMoreHeaders.forEach((item, index) =>{
        otherColumnList.push(item)
        // if(index === 0 || index === 1){
        //   otherColumnList.push(item)
        // }else{
        //   productColumnList.children.push(item);
        // }
      })
      normalColumnList = normalColumnList.concat(otherColumnList);
      // normalColumnList.push(productColumnList);
      this.showColumnConfigBtn = true;
      console.log('normalColumnList',normalColumnList);
      this.allColumnList = normalColumnList;
    },
    //生成更多内容的表头
    formatHeader(headerData, nodeId) {
      try{
        let tableHeader = []
        let designHeader = {
          opType: this.$constants.opType.design,
          property: '_design',
          label: transformDictDetail('opType', this.$constants.opType.design),
          children: []
        }
        console.log('opType:',this.$constants.opType.design)
        console.log('label:',transformDictDetail('opType', this.$constants.opType.design))
        let purchaseHeader = {
          opType: this.$constants.opType.purchase,
          property: '_purchase',
          label: transformDictDetail('opType', this.$constants.opType.purchase),
          children: []
        }
        let productHeader = {
          opType: this.$constants.opType.product,
          property: '_product',
          label: transformDictDetail('opType', this.$constants.opType.product),
          children: []
        }
        let productTypeList = []
        headerData.forEach(item => {
          if (item.type === this.$constants.opType.design) {
            this.addSignHeader(item, designHeader, this.$constants.opType.design)
          } else if (item.type === this.$constants.opType.purchase) {
            this.addSignHeader(item, purchaseHeader, this.$constants.opType.purchase)
          } else  if (item.type === this.$constants.opType.product) {
            // productTypeList.push(item)
            this.addSignHeader(item, productHeader, this.$constants.opType.product)
          }
        })
        if (designHeader.children.length > 0) {
          tableHeader.push(designHeader)
        }
        if (purchaseHeader.children.length > 0) {
          tableHeader.push(purchaseHeader)
        }
        if (productHeader.children.length > 0) {
          tableHeader.push(productHeader)
        }
        // if (productTypeList.length > 0) {
        //   tableHeader.push(purchaseHeader)
          // let productHeaders = this.formatProductHeader(productTypeList, nodeId)
          // if (productHeaders.length > 0) {
          //   tableHeader = tableHeader.concat(productHeaders)
          // }
        // }
        /*tableHeader.forEach(firstItem=>{
          this.setNeedIntervalClass(firstItem);
        })*/
        console.log('表头:',tableHeader)
        return tableHeader
      }catch (e){
        console.error(e);
        return [];
      }
    },
/*    setNeedIntervalClass(data){
      data.className = this.borderHighlightClassName;
      let childrenLen = data.children.length;
      data.children[childrenLen-1].className = this.borderHighlightClassName;
      let  subChildren = data.children[childrenLen-1].children;
      if(subChildren && subChildren.length > 0){
        subChildren[subChildren.length - 1].className = this.borderHighlightClassName;
      }
    },*/
    setIntervalClass(){
      this.moreHeaders.forEach(data=>{
        data.className = this.borderHighlightClassName;
        let subLastData = null;
        data.children.forEach(subData=>{
          subData.className = '';
          subData.children && subData.children.forEach(littleKid=>{
            littleKid.className = '';
          })
          let needShow = this.isNeedShow(subData.property);
          if(needShow){
            subLastData = subData;
          }
        })
        if(subLastData){
          subLastData.className = this.borderHighlightClassName;
          let subLastDataChildren = subLastData.children;
          if(subLastDataChildren && subLastDataChildren.length > 0){
            subLastDataChildren.forEach(subItem=>{
              subItem.className = '';
            })
            subLastDataChildren[subLastDataChildren.length - 1].className = this.borderHighlightClassName;
          }
        }
      })
    },
    //格式化头
    formatProductHeader(typeList, nodeId) {
      if(this.$constants.isNotEmpty(nodeId)){
        typeList = this.sortTypeList(typeList, nodeId);
      }
      let productTypeList = []
      typeList.forEach(item => {
        let selectedItem = productTypeList.find(secondItem => {
          return secondItem.label === item.workshopName
        })
        if (!selectedItem) {
          selectedItem = {
            opType: this.$constants.opType.product,
            label: item.workshopName,
            workshopId: item.workshopId,
            children: []
          }
          productTypeList.push(selectedItem)
        }
        selectedItem.children.push(item)
      })
      //对productTypeList排序
      productTypeList = this.sortProductTypeList(productTypeList, nodeId, typeList);
      let headers = []
      productTypeList.forEach(item => {
        let obj = {
          opType: this.$constants.opType.product,
          property: '_product_' + item.workshopId,
          label: item.label,
          children: []
        }
        item.children.forEach(secondItem => {
          this.addSignHeader(secondItem, obj, this.$constants.opType.product)
        })
        headers.push(obj)
      })
      return headers
    },
    sortProductTypeList(productTypeList, nodeId, typeList){
      let sortConfig = headerSortConfig.getSort();
      //对子节点进行排序
      productTypeList.forEach(item=>{
        let label = item.label ? item.label : item.name;
        let configItem = sortConfig.find(configItem=>{
          return configItem.name === label;
        })
        if(configItem){
          this.sortChildren(item.children, configItem.children, nodeId)
        }
      })
      if(this.haveNodeIdType(typeList, nodeId)){
        //如果存在节点
        let remainDataList = productTypeList.slice(1);
        remainDataList.sort((item1, item2)=>{
          let item1Index = this.getFirstLevelIndex(item1, sortConfig);
          let item2Index = this.getFirstLevelIndex(item2, sortConfig);
          return item1Index - item2Index;
        })
        remainDataList.unshift(productTypeList[0]);
        productTypeList = remainDataList;
      }else{
        productTypeList.sort((item1, item2)=>{
          let item1Index = this.getFirstLevelIndex(item1, sortConfig);
          let item2Index = this.getFirstLevelIndex(item2, sortConfig);
          return item1Index - item2Index;
        })
      }
      return productTypeList;
    },
    sortChildren(dataList, configItem, nodeId){
      dataList.sort((item1, item2)=>{
        if(item1.id == nodeId){
          return -1;
        }else if(item2.id == nodeId){
          return 1;
        }
        let item1Index = this.getIndex(item1, configItem);
        let item2Index = this.getIndex(item2, configItem);
        return item1Index - item2Index;
      })
    },
    getFirstLevelIndex(item, sortConfig){
      let len = sortConfig.length;
      for(let i=0; i< len; i++){
        if(item.label === sortConfig[i].name){
          return i;
        }
      }
    },
    getIndex(item, configItem){
      let len = configItem.length;
      for(let i=0; i< len; i++){
        if(item.name === configItem[i]){
          return i;
        }
      }
      return 100;
    },
    //顺序排序，把nodeId排在最前面
    sortTypeList(typeList, nodeId){
      let newTypeList = [];
      typeList.forEach(item=>{
        if(item.id == nodeId){
          newTypeList.unshift(item);
        }else{
          newTypeList.push(item);
        }
      })
      return newTypeList;
    },
    //顺序排序，把nodeId排在最前面
    haveNodeIdType(typeList, nodeId){
      let returnFlag = false;
      typeList.some(item=>{
        if(item.id == nodeId){
          returnFlag = true;
       return true;
        }else{
          return false;
        }
      })
      return returnFlag;
    },
    addSignHeader(item, header, nodeType) {
      header.children.push({
        property: item.id,
        nodeType: nodeType,
        label: item.label ? item.label : item.name,
        children: [{
          nodeType: nodeType + '',
          label: (nodeType===0||nodeType===1)?'需求时间':'计划完工',
          property: '_' +  item.id + '_' + 'startDate',
          propertyId: '_' + item.id
        }, {
          nodeType: nodeType + '',
          label: '实际进度',
          property: '_' + item.id + '_' + 'status',
          progressProperty:  '_' + item.id + '_' + 'progressStatus',
          propertyId:  '_' + item.id
        }]
      })
    },

  }
}
