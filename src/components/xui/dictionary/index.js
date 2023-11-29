/**
 * Created by fp on 2018/9/4.
 */
/**
 * Created by fp on 2018/8/30.
 */
import {syncAjax} from "../ajax/syncAjax";
import {compArrToStr, isNotEmptyArray, splitStrToArr} from "@/utils";

const cacheMap = {};
window.cacheMap = cacheMap;

const formatTreeToList = (dictList, result) => {
    dictList.forEach(item => {
        result.push({
            code: item.code,
            name: item.name,
            remark: item.remark,
            remark2: item.remark2
        })
        if (isNotEmptyArray(item.children)) {
            formatTreeToList(item.children, result)
        }
    })
}

// 翻译，根据key itemCode 翻译得到itemName  如 把 y 翻译成是
export const transformDictDetail = function (key, value, attr = 'name') {
    if (value === undefined || value === null) {
        return ''
    }
    value = value.toString();
    let retValue = value;
    let dictList = getDictListByKey(key);
    if (!dictList) {
        return retValue;
    }
    let list = []
    formatTreeToList(dictList, list);
    let valueArr = splitStrToArr(value);
    let resultArr = [];
    valueArr.forEach(item => {
        let subItemResult = list.find(subItem => {
            return item == subItem.code
        })
        if (subItemResult) {
            resultArr.push(subItemResult[attr])
        }
    })
    if (resultArr.length > 0) {
        retValue = compArrToStr(resultArr);
    }
    return retValue;
};

/**
 *
 * @param key
 * @param childCode 下级code
 * @returns {*|*[]}
 */
export const getDictListByKey = function (key, childCode = null) {
    if (!cacheMap[key]) {
        cacheMap[key] = getDict(key)
    }
    if (childCode === null || childCode === undefined || childCode === '') {
        return cacheMap[key] ? cacheMap[key] : []
    } else {
        //根据childCode获取明细的子节点列表
        return findChildNode(cacheMap[key], childCode);
    }
}

function findChildNode(data, childCode) {
    let list = []
    data.forEach(item => {
        list.push(item);
    })
    let result = [];
    while (list.length > 0) {
        let item = list.shift();
        if (item.code == childCode) {
            result = item.children;
            break;
        } else {
            if (Array.isArray(item.children)) {
                item.children.forEach(item => {
                    list.push(item);
                })
            }
        }
    }
    return result;
}

export const deleteDictItem = function (itemCode) {
    delete cacheMap[itemCode];
};

function getDict(key, value) {
    let data = []
    const url = '/api/pbpermissions/dict/get-detail'
    syncAjax({
        url: url,
        type: 'post',
        data: {
            itemCode: key
        },
        async: false,
        xhrFields: {
            withCredentials: true
        },
        dataType: 'json',
        success: function (response) {
            data = response.data
        }
    })
    return data
}


