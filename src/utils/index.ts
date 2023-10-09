import Constants from "@/utils/constants";
import {ElMessage} from "element-plus";
import constants from "@/utils/constants";
import dayjs from 'dayjs';
import {cloneDeep} from 'lodash'

export function uuid() {
    const s: Array<any> = []
    const hexDigits = '0123456789abcdef'
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'
    const uuid = s.join('')
    return uuid
}

export function fileSuffix(fileName) {
    if (constants.isEmpty(fileName)) {
        return '';
    }
    let lastDot = fileName.lastIndexOf('.');
    if (lastDot >= 0) {
        return fileName.substr(lastDot + 1).toLowerCase();
    } else {
        return ''
    }
}

export const imgSuffix = ['jpg', 'png', 'gif', 'jpeg', 'bmp'];
const pdfSuffix = ['pdf']

export function isImg(fileName) {
    let suffix = fileSuffix(fileName);
    if (constants.isEmpty(suffix)) {
        return false;
    }
    return imgSuffix.indexOf(suffix) >= 0;
}



export function isPdf(fileName) {
    let suffix = fileSuffix(fileName);
    if (constants.isEmpty(suffix)) {
        return false;
    }
    return pdfSuffix.indexOf(suffix) >= 0;
}

export function openFigureFileName(fileUrl, fileName) {
    const pdfJsPrev = `/static/pdfjs/web/viewer.html?file=${fileUrl}&fileName=${fileName}`;
    const url = `${window.location.origin}${pdfJsPrev}`
    window.open(url);
}


export function randomString(length: number) {
    const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = length; i > 0; --i) {
        result += str[Math.floor(Math.random() * str.length)]
    }
    return result
}

export declare const NOOP: () => void;

/**
 * 中划线字符驼峰
 * @param {*} str 要转换的字符串
 * @returns 返回值
 */
export function toHump(str: string) {
    if (!str) return str
    return str.replace(/-(\w)/g, function (all, letter) {
        return letter.toUpperCase()
    }).replace(/(\s|^)[a-z]/g, function (char) {
        return char.toUpperCase()
    })
}

export function currentDate() {
    const d = new Date()
    let str = ''
    str += d.getFullYear() + '-' // 获取当前年份
    const month = d.getMonth() + 1
    str += month < 10 ? '0' + month + '-' : month + '-' // 获取当前月份（0——11）
    str += d.getDate() + ' '
    const hours = d.getHours()
    str += hours < 10 ? '0' + hours : hours + ':'
    str += d.getMinutes() + ':'
    str += d.getSeconds()
    return str
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
    return cloneDeep(source);
}

//将string用逗号隔开，返回数组
export function splitStrToArr(str) {
    if (constants.isNotEmpty(str)) {
        return str.toString().split(',')
    } else {
        return []
    }
}


//判断是否为数组且长度大于0
export function isNotEmptyArray(arr) {
    return Array.isArray(arr) && arr.length > 0;
}


//将数组合并成字符串
export function compArrToStr(arr) {
    if (Array.isArray(arr)) {
        return arr.join(',')
    } else {
        return '';
    }
}

export function cloneProps(target, source) {
    for (const key in source) {
        if (target.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
}

/**
 * 将数组转换成逗号隔开的字符串
 * @param params
 * @param attr
 * @param defaultValue
 */
export function transformArrayToStr(params, attr, defaultValue = '') {
    if (params[attr] && Constants.isArray(params[attr]) && params[attr].length > 0) {
        params[attr] = params[attr].join(',');
    } else {
        params[attr] = defaultValue;
    }
}

/**
 * 将逗号隔开的字符串转换成数组
 * @param params
 * @param attr
 * @param resultObj
 */
export function transformStrToArray(params, attr, resultObj) {
    if (constants.isNotEmpty(params[attr])) {
        resultObj[attr] = params[attr].split(',');

    } else {
        resultObj[attr] = [];
    }
}

export function transformStrToArrayInt(params, attr, resultObj) {
    if (constants.isNotEmpty(params[attr])) {
        let d = params[attr].split(',');
        if(d.length > 0){
            resultObj[attr] = d.map(item=>{
                return parseInt(item)
            });
        }else{
            resultObj[attr] = [];
        }
    } else {
        resultObj[attr] = [];
    }
}

export function formatTimeYMD(source, result, attr) {
    if (source[attr]) {
        try {
            result[attr] = dayjs(source[attr]).format('YYYY-MM-DD');
        } catch (e) {
            result[attr] = '';
        }
    } else {
        result[attr] = '';
    }
}


/**
 * 从select中找到value对应的值
 * @param dataList
 * @param attrKey
 * @param attrLabel
 * @param value
 */
export function getLabelFromSelect(dataList, attrKey, attrLabel, value) {
    if (Array.isArray(dataList) && dataList.length > 0) {
        const selectedItem = dataList.find(item => {
            return item[attrKey] === value;
        })
        if (selectedItem) {
            return selectedItem[attrLabel];
        } else {
            return ''
        }
    } else {
        return ''
    }
}

/**
 * @param {Number} len uuid的长度
 * @param {Boolean} firstU 将返回的首字母置为"u"
 * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
 */
export function guid(len = 32, firstU = true, radix = null) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const uuid = []
    radix = radix || chars.length

    if (len) {
        // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
        for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
    } else {
        let r
        // rfc4122标准要求返回的uuid中,某些位为固定的字符
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
            }
        }
    }
    // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
    if (firstU) {
        uuid.shift()
        return `u${uuid.join('')}`
    }
    return uuid.join('')
}

export function hasDepartPrivilege(belongDepart, departmentNumber) {
    if (Constants.isEmpty(belongDepart)) {
        return true;
    } else if (belongDepart.indexOf(Constants.allDepart.departmentNumber) >= 0) {
        return true;
    } else {
        const departs = belongDepart.split(',');
        const flag = departs.find(item => {
            return item == departmentNumber
        })
        return !!flag;
    }
}


//是否为空字符串
export function isNotBlank(content) {
    if (content === null || content === undefined || content === '' || (typeof content==='string' && content.trim() === '')) {
        return false
    } else {
        return true
    }
}



//检查是否为图片
export function isPhotoUrl(path) {
    if (path) {
        const lastDot = path.lastIndexOf('.');
        if (lastDot >= 0) {
            let suffix = path.substr(lastDot + 1);
            if (suffix) {
                suffix = suffix.toLocaleLowerCase();
                return imgSuffix.indexOf(suffix) >= 0
            }
        }

        return false;
    }

}

export const downloadClick = function (url, downloadName) {
    if (!url) {
        return
    }
    const downloadElement = document.createElement('a')
    downloadElement.href = url
    downloadElement.target = '_blank'
    downloadElement.download = downloadName //下载后文件名
    document.body.appendChild(downloadElement)
    downloadElement.click() //点击下载
    document.body.removeChild(downloadElement) //下载完成移除元素
}


//获取文件类型 video photo other
export const getFileType = function (fileName) {
    if (!fileName) {
        return Constants.fileType.other;
    }
    const len = fileName.lastIndexOf('.');
    if (len <= 0) {
        return Constants.fileType.other;
    }
    const fileSuffix = fileName.substr(len + 1).toLowerCase();
    if (Constants.photoType.indexOf(fileSuffix) >= 0) {
        return Constants.fileType.photo;
    } else if (Constants.videoType.indexOf(fileSuffix) >= 0) {
        return Constants.fileType.video;
    } else {
        return Constants.fileType.other;
    }
}

export const addFilePrev = function (url) {
    let newUrl = '';
    if (url.indexOf('/') === 0) {
        newUrl = 'minioServer' + url;
    } else {
        newUrl = 'minioServer/' + url;
    }
    return newUrl;
}

export const addDownloadFilePrev = function (url) {
    const newUrl = addFilePrev(url);
    return window.location.origin + '/' + newUrl;
}

export function exportData(res, name) {
    const content = res
    const blob = new Blob([content], {type: 'application/ms-excel'})
    const fileName = name
    if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
    }
}
export const extend = function (...args) {
    const len = args.length;
    if (len == 0) {
        return null;
    }
    const This = args[0];
    if (len == 1) {
        return This;
    }
    for (let i = 1; i < len; i++) {
        const obj = args[i];

        for (const name in obj) {
            This[name] = obj[name];
        }
    }
    return This;
};

export function loadJsResource(arr = [], baseUrl = '') {
    return new Promise((resolve) => {
        let index = 0;
        arr.map(path => {
            const $script = document.createElement('script');
            $script.src = baseUrl + path;
            document.body.appendChild($script);
            $script.onload = () => {
                if (index == (arr.length - 1)) {
                    resolve('');
                }
                index++;
            }
        })
    })
};


//从树结构中获取路由信息
export function getMenuFromPath(path, menuTree) {
    let treeData = [].concat(menuTree);
    while (treeData.length > 0) {
        const item = treeData.pop();
        if (item.path === path) {
            return item;
        }
        if (item.rankVOList && item.rankVOList.length > 0) {
            treeData = treeData.concat(item.rankVOList);
        }
    }
    return null;
}

export function notNullUndefined(data) {
    return data !== null && data !== undefined;
}

/**
 * 从list转换成tree，
 * @param list
 * @param key 主键属性
 * @param parentKey 父键属性
 */
export function transformList2Tree(list, key, parentKey) {
    const rootList = list.map(item => {
        return item;
    });
    list.forEach(item => {
        list.forEach(subItem => {
            const itemKey = item[key];
            if (notNullUndefined(itemKey) && itemKey == subItem[parentKey]) {
                if (Constants.isEmpty(item.children)) {
                    item.children = [];
                }
                item.children.push(subItem);
                const subItemIndex = rootList.indexOf(subItem);
                if (subItemIndex >= 0) {
                    rootList.splice(subItemIndex, 1);
                }
            }
        })
    })
    return rootList;
}

export function justTableIsSelectOne(multipleTable) {
    let selectedRows = multipleTable.value.getSelectionRows();
    if (selectedRows.length === 0) {
        ElMessage.warning('请选择一条记录后，再操作');
        return null;
    } else if (selectedRows.length > 1) {
        ElMessage.warning('只能勾选一条记录');
        return null;
    }
    return selectedRows[0];
}
