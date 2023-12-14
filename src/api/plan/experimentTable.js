import request from '@/utils/request'

const flipOrder = ['试验一站', '试验二站', '试验三站']

function getExperimentIndex(tableName){
  let index = -1;
  flipOrder.some((item, itemIndex)=>{
    if( tableName.indexOf(item) >=0 ){
      index = itemIndex;
      return true;
    }else{
      return false;
    }
  })
  return index;
}

const url = {
  //试验计划-获取试验站列表 GET
  findAllTrialShop: '/plan/proplan/findAllTrialShop',
}
export default {
  findAllTrialShop(params){
    return new Promise((resolve, reject)=>{
      request({
        url: url.findAllFlipTable,
        method: 'get',
        params
      }).then(response=>{
        let data  = response.data;
        data.sort((item1, item2)=>{
          let item1Index = getExperimentIndex(item1.tableName);
          let item2Index = getExperimentIndex(item2.tableName);
          if(item1Index >= 0 && item2Index >= 0){
            return item1Index - item2Index;
          }else if(item1Index >= 0 && item2Index < 0){
            return -1;
          }else{
            return 1;
          }
        })
        resolve(response);
      }).catch(reason=>{
        reject(reason)
      })
    })
  },
}
