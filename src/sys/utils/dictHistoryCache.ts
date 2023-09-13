import constants from "@/_public/utils/constants";
import {uuid} from "@/_public/utils";
import dayjs from "dayjs";

const KEY = 'ltcDict_';
const maxCacheCount = 5;

export const addDictToCache = (dictKey, value) => {
    let data = localStorage.getItem(KEY + dictKey);
    try {
        let list = [];
        if (constants.isNotEmpty(data)) {
            list = JSON.parse(data);
        }
        if (list.length >= maxCacheCount) {
            let left = maxCacheCount - 1;
            list.splice(left, list.length - left);
        }
        list.unshift({
            id: uuid(),
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            value
        });
        localStorage.setItem(KEY + dictKey, JSON.stringify(list));
    } catch {
    }
}

export const getDictFromCache = (dictKey) => {
    let data = localStorage.getItem(KEY + dictKey);
    try {
        return JSON.parse(data);
    } catch {
        return []
    }
}

export const deleteDictFromCache = (dictKey, id) => {
    let data = localStorage.getItem(KEY + dictKey);
    try {
        let list = [];
        if (constants.isNotEmpty(data)) {
            list = JSON.parse(data);
        }
        list.some((item,index)=>{
            if(item.id === id){
                list.splice(index, 1);
                return true;
            }else{
                return false;
            }
        })
        localStorage.setItem(KEY + dictKey, JSON.stringify(list));
        return list;
    } catch {
        return [];
    }
}