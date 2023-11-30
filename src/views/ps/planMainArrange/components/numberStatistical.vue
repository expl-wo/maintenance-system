<template>
  <div class="numberStatistical">
    <div class="plan">
      <span>计划：</span>
      <span style="margin-right: 5px;">不含税产值：{{ noTaxMoney }}万元 </span>
      <span>产量：{{ weekProductCount }}万kVA</span>
    </div>
    <div class="actual">
      <span>实际：</span>
      <span style="margin-right: 5px;">不含税产值：{{ actualNoTaxMoney }}万元 </span>
      <span>产量：{{ actualWeekProductCount }}万kVA</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'numberStatistical',
  props: {
    dataList: Array
  },
  data(){
    return {
      noTaxMoney: '',
      weekProductCount: '',
      actualNoTaxMoney: '',
      actualWeekProductCount: ''
    }
  },
  watch: {
    dataList(val){
      this.calc();
    }
  },
  methods: {
    calc(){
      let noTaxMoney= 0.0,  weekProductCount= 0.0, actualNoTaxMoney =0.0, actualWeekProductCount = 0.0;
      this.dataList.forEach(item=>{
        noTaxMoney += parseFloat(item.noTaxAmount)
        weekProductCount += parseFloat(item.outPut)
        if(item.schedulingStatus === 4){
          actualNoTaxMoney += parseFloat(item.noTaxAmount)
          actualWeekProductCount += parseFloat(item.outPut);
        }
      })
      this.noTaxMoney = parseFloat(noTaxMoney.toFixed(4));
      this.weekProductCount = parseFloat(weekProductCount.toFixed(4));
      this.actualNoTaxMoney = parseFloat(actualNoTaxMoney.toFixed(4));
      this.actualWeekProductCount = parseFloat(actualWeekProductCount.toFixed(4));
    }
  }
}
</script>

<style scoped>
.numberStatistical{
  display: inline-flex;
  margin-left: 9px;
}
.actual{
  color: #00cc00;
  margin-left: 8px;
}
.plan, .actual{
  font-size: 13px;
  line-height: 1.3;
}
</style>
