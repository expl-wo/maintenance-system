export default {
  setBomInfoDesc(item){
    let bomInfoData = [];
    if(item.bomInfo && item.bomInfo.length > 0){
      let len = item.bomInfo.length;
      item.bomInfo.forEach((subItem, index) =>{
        if(index < (len - 1)){
          bomInfoData.push(`${subItem.name}/数量为${subItem.amount}，`);
        }else{
          bomInfoData.push(`${subItem.name}/数量为${subItem.amount}`);
        }
      })
      item._bomInfo = bomInfoData;
    }else{
      item._bomInfo  = [];
    }
  }
}
