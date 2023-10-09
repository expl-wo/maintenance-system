import {watchEffect, ref} from "vue";
import Constants from "@/utils/constants";
import {getDictListByKey} from "@/components/xui/dictionary/index";

/**
 * 根据字典项和字典明细的父节点来获取下属第一层级的字典
 * @param itemCode
 * @param parentCode
 */
export const useDictList = (itemCode, parentCode)=>{
    const dictDataList = ref([]);
    const getDictDataList = () => {
        if(Constants.isEmpty(parentCode.value)){
            dictDataList.value = [];
        }else{
            dictDataList.value = getDictListByKey(itemCode, parentCode.value);
        }
    }
    //监听
    watchEffect(getDictDataList);
    return dictDataList;
}
