import { ElMessage, ElMessageBox } from 'element-plus'
import { getRooturl } from '@/api/endpoint'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

// 时间转换 YYYY-MM-DD
export function timeTranslate(dateValue) {
  var date = dateValue ? new Date(dateValue) : new Date()
  var seperator1 = '-'
  var seperator2 = ':'
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
  // var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
  //     + " " + date.getHours() + seperator2 + date.getMinutes()
  //     + seperator2 + date.getSeconds();
  return currentdate
}
// 时间转换 MM-DD
export function timeTranslateNoY(dateValue) {
  var date = dateValue ? new Date(dateValue) : new Date()
  var seperator1 = '-'
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = month + seperator1 + strDate
  return currentdate
}
// 时间转换 YYYY-MM
export function timeTranslateYM(dateValue) {
  var date = dateValue ? new Date(dateValue) : new Date()
  var seperator1 = '-'
  var seperator2 = ':'
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = date.getFullYear() + seperator1 + month
  return currentdate
}

// 时间转换 YYYY-MM-DD hh:mm
export function timeTranslateHM(dateValue) {
  var date = dateValue ? new Date(dateValue) : new Date()
  var seperator1 = '-'
  var seperator2 = ':'
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  var strMin = date.getMinutes()
  var strHouth = date.getHours()
  if (strHouth === 0 || strHouth <= 9) {
    strHouth = '0' + strHouth
  }
  if (strMin === 0 || strMin <= 9) {
    strMin = '0' + strMin
  }
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        ' ' + strHouth + seperator2 + strMin
  return currentdate
}

// 时间转换 YYYY-MM-DD hh:mm:ss
export function timeTranslateHMS(dateValue) {
  var date = dateValue ? new Date(dateValue) : new Date()
  var seperator1 = '-'
  var seperator2 = ':'
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  var strHour = date.getHours()
  var strMin = date.getMinutes()
  var strSec = date.getSeconds()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  if (strHour >= 0 && strHour <= 9) {
    strHour = '0' + strHour
  }
  if (strMin >= 0 && strMin <= 9) {
    strMin = '0' + strMin
  }
  if (strSec >= 0 && strSec <= 9) {
    strSec = '0' + strSec
  }

  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        ' ' + strHour + seperator2 + strMin +
        seperator2 + strSec
  return currentdate
}

// 确认提示框
export function $confirm(mes, mes2) {
  return new Promise((resolve, reject) => {
    // resolve()
    ElMessageBox.confirm(mes, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      resolve()
    }).catch(() => {
      ElMessage({
        message: mes2,
        type: 'info',
        duration: 3 * 1000
      })
    })
  })
}

// 消息提示
export function $message(mes, type) {
  ElMessage({ message: mes, type: type })
}

// 浏览器获取访问文件的根路径
export function $rooturl() {
  return new Promise((resolve, reject) => {
    getRooturl().then(response => {
      resolve(response)
    })
  })
}
// 随机ID生成器
export function $randomId() {
  var rnd = 'rId'
  for (var i = 0; i < 10; i++) { rnd += Math.floor(Math.random() * 10) }
  return rnd
}

// obj深度复制
function _getClass(o) { // 判断数据类型
  return Object.prototype.toString.call(o).slice(8, -1)
}
export function $deepCopy(obj) {
  let result; const oClass = _getClass(obj)

  if (oClass == 'Object') result = {} // 判断传入的如果是对象，继续遍历
  else if (oClass == 'Array') result = [] // 判断传入的如果是数组，继续遍历
  else return obj // 如果是基本数据类型就直接返回

  for (const i in obj) {
    var copy = obj[i]

    if (_getClass(copy) == 'Object') result[i] = $deepCopy(copy) // 递归方法 ，如果对象继续变量obj[i],下一级还是对象，就obj[i][i]
    else if (_getClass(copy) == 'Array') result[i] = $deepCopy(copy) // 递归方法 ，如果对象继续数组obj[i],下一级还是数组，就obj[i][i]
    else result[i] = copy // 基本数据类型则赋值给属性
  }

  return result
}

export function $exportExcel(tableId, fileName) {
  const xlsxParam = { raw: true } // 转换成excel时，使用原始的格式
  // / generate workbook object from table /;
  /* 从表生成工作簿对象 */
  const wb = XLSX.utils.table_to_book(
    document.querySelector('#' + tableId), // elementui 表格的id
    xlsxParam
  )

  /* 获取二进制字符串作为输出 */
  var wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })
  try {
    FileSaver.saveAs(
      // Blob 对象表示一个不可变、原始数据的类文件对象。
      // Blob 表示的不一定是JavaScript原生格式的数据。
      // File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
      // 返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
      new Blob([wbout], { type: 'application/octet-stream' }),
      // 设置导出文件名称
      fileName + '.xlsx'
    )
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, wbout)
  }
  return wbout
}
