//通用变量
const isEmptyObj = function(obj){
  if (obj === null || obj === undefined) {
    return true
  }
  for (const key in obj) {
    return false
  }
  return true
}

export default {
  respCode: {
    success: 10000 //成功
  },
  //字典类型
  dictType: {
    biz: 'biz',
    sys: 'sys'
  },
  processStatus: {
    runningEnd: ['running', 'end'],
    running: 'running',
    end: 'end',
    abandon: 'abandon'
  },
  flag: {
    y: 'y',
    n: 'n'
  },
  flag01: {
    y: '1',
    n: '0'
  },
  defaultMainPath: '/main',
  fileType: {
    video: 'video',
    photo: 'photo',
    word: 'word',
    other: 'other'
  },
  //图片文件格式
  photoType: ['jpg', 'gif','png', 'jpeg', 'webp', 'bmp'],
  //视频文件格式
  videoType: ['mp4'],
  First_Menu: '根菜单',
  First_Menu_value: 'root',
  saveSuccess: '数据保存成功',

  hasChildren: {
    yes: 1,
    no: 0
  },
  authType: {
    btn: 'btn',
    menu: 'menu'
  },
  menuType: {
    pc: 'pc',
    app: 'app'
  },
  department: {
    rootId: '21'
  },
  pageAll: 10000,
  pageMaxAll: 1000000,
  filePreviewUrl: 'fileServer/',
  //删除提示信息
  deleteTip: '此操作将永久删除该条信息, 是否继续?',


  allDepart: {
    departmentNumber: '_all',
    name: '全部'
  },
  fileModule: {
    portal_material: 'portal_material'
  },
  //是否为空对象
  isEmptyObj,
  //是否为空对象
  isNotEmptyObj(obj) {
    return !isEmptyObj(obj);
  },
  toString(data){
    if(this.isEmpty(data)){
      return ''
    }else{
      return data+''
    }
  },
  //是否为空字符串
  isNotEmpty(content) {
    if (content === null || content === undefined || content === '') {
      return false
    } else {
      return true
    }
  },
  //判断是否为数组
  isArray(arr){
    return Array.isArray(arr);
  },
  //是否为空字符串
  isEmpty(content) {
    if (content === null || content === undefined || content === '') {
      return true
    } else {
      return false
    }
  },


}

