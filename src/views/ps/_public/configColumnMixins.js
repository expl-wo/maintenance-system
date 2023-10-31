import pageset from '@/api/sys/pageset'

export default {
  data(){
    return {
      hasConfigColumn: false,
      columnProperty: []
    }
  },
  methods: {
    needControlColumnConfig(){
      return !!this.pageId;
    },
    async initColumnList(){
      if(!this.needControlColumnConfig()){
        return;
      }
      let response = await pageset.my({
        pageId: this.pageId
      })
      if(response.data && response.data.length > 0){
        let data = response.data[0];
        let obj = JSON.parse(data.columnProperty);
        if(obj.baseCheckedKey !== undefined && obj.baseCheckedKey !== null){
          this.hasConfigColumn = true;
          this.columnProperty = obj.baseCheckedKey.concat(obj.moreCheckedKey).concat(obj.moreHalfCheckedKey);
        }
      }
    },
    handleConfigColumn(){
      let params = {
        pageId: this.pageId,
        columnList: this.allColumnList
      }
      this.$refs.configColumnDialogRef && this.$refs.configColumnDialogRef.init(params);
    },
    isNeedShow(columnProperty){
      if(!this.hasConfigColumn){
        return true;
      }
      let flag = false;
      this.columnProperty.some(item=>{
        if(item == columnProperty){
          flag = true;
          return true;
        }else{
          return false;
        }
      })
      return flag;
    },
    isNeedShowByChild(childList){
      if(!this.hasConfigColumn){
        return true;
      }
      let flag = false;
      childList.some(item=>{
        let childNeedShow = this.isNeedShow(item.property);
        if(childNeedShow){
          flag = true;
          return true;
        }else{
          return false;
        }
      })
      return flag;
    },
    handleConfigColumnSuccess(columnList){
      this.hasConfigColumn = true;
      this.columnProperty = columnList;
      this.showTable = false;
      this.setIntervalClass();
      this.$nextTick(()=>{
        this.setIntervalClass();
        this.showTable = true;
      })
    }
  }
}
