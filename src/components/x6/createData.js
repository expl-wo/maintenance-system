import Constants from '@/utils/constants'
import planWeek from '@/api/plan/planWeek'
import { ElMessage } from 'element-plus'

class CreateData {
   constructor(data, sourceDataList, id) {
     this.data = data;
     //该生产单对应的节点信息
     this.sourceDataList = sourceDataList;
     //pl14Id
     this.id = id;
     //坐标1-1 节点的坐标
     this.firstNode = { "x": -580, "y": -610 };
     //X轴相邻2个节点X坐标的距离
     this.intervalX = 156;
     //Y轴相邻2个节点Y坐标距离
     this.intervalY = 70;

     //点集合
     this.nodeList = [];
     //边界集合
     this.edgeList = [];

     this.nodePublicInfo = {
       "size": { "width": 116, "height": 55 },
       "view": "vue-shape-view",
       "shape": "my-component",
     };
     this.edgePublicInfo = {
       "shape": "edge",
       "attrs": { "line": { "stroke": "#333" } },
       "zIndex": 0,
     };

     this.showLungNode = false;
     this.lungNodeDetail = null;
   }


  /**
   * 获取结果
   * @returns {{node: [], edge: []}}
   */
  async getResult() {
    await this.init();
    console.log(this.edgeList.concat(this.nodeList))
    return this.edgeList.concat(this.nodeList)
  }

  //初始化数据
  async init() {
    //获取肺叶节点信息
    await this.initLungParams();
    this.createNode();
    this.createEdge();
  }

  async initLungParams(){
    return new Promise((resolve, reject)=>{
      planWeek.isMagnetic({
        planId: this.id
      }).then(response=>{
        if(response.err_code === Constants.statusCode.success){
          let data = response.data;
          if(data.isMagnetic === 1){ //有磁屏蔽
            this.showLungNode  = true;
            this.lungNodeDetail = data.opPlanList;
          }else{
            this.showLungNode = false;
          }
        }else{
          this.showLungNode = false;
        }
        resolve()
      })
    })
  }

  //如果节点的2个坐标都有数据才为有效点
  isValidNode(node){
   return  ((node.coordinateX !== '' && node.coordinateX != null) && (node.coordinateX !== '' && node.coordinateX != null) && node.coordinateX < 20)
  }

  //构造节点数据
  createNode() {
    debugger
    let nodeList = [];
    this.data.forEach((item, index) => {
      if(this.isValidNode(item)){
        //必须为有效节点
        let statusAndTime = this.getNodeStatusAndTime(item);
        let node = {
          id: item.id,
          name: item.name,
          x: this.firstNode.x + this.intervalX * (item.coordinateX - 1),
          y: this.firstNode.y + this.intervalY * (item.coordinateY - 1),
          ...this.nodePublicInfo,
          ...this.addPortInfo(item),
          "data": {"text": item.name, ...statusAndTime, "selected": false},
          "zIndex": index+ 1
        }
        nodeList.push(node);
      }
    })

    this.nodeList = nodeList;
    if(this.showLungNode){
      let lundLobeNode = this.getLungLobeNode();
      this.nodeList.push(lundLobeNode);
    }
  }

  //增加一个查看肺叶磁屏蔽节点
  getLungLobeNode(){
    let item = {
      id: 'lung',
      name: '肺叶磁屏蔽',
      type: Constants.processType.product
    }
    let statusAndTime = {
      timeStatus : 'forward',
      typeStatus : 'product',
      startDate: '', //计划开始日期
      nodeDate: '', //计划结束日期
      actualStartDate: '',//actualStartDate
      finishDate: '',//finishDate
      difDay: '',
      planNodeId: item.id,
      type: item.type
    }
    let node = {
      id: item.id,
      name: item.name,
      x: this.firstNode.x + this.intervalX * (7.5 - 1),
      y: this.firstNode.y + this.intervalY * (2 - 1),
      ...this.nodePublicInfo,
      ...this.addPortInfo(item),
      "data": {"text": item.name, ...statusAndTime, opPlanList: this.lungNodeDetail, "selected": false},
      "zIndex": 5
    }
    return node;
  }


  getLungLobeEdge(){
    let preNode = {
      id: 'lung',
      coordinateX: 7,
    }
    let node = {
      id: '16',
      coordinateX: 6,
    }
   return this.getEdge(preNode, node, 0);
  }


  subTime(time){
    if(typeof(time) === 'string'){
      if(time && time.length >= 10){
        return time.substr(5, 5)
      }else{
        return time;
      }
    }
  }

  formatTime(node){
    return {
      startDate: this.subTime(node.startDate), //计划开始日期
      nodeDate: this.subTime(node.nodeDate), //计划结束日期
      actualStartDate: this.subTime(node.actualStartDate),//actualStartDate
      finishDate: this.subTime(node.finishDate),//finishDate
      difDay: node.difDay,
      planNodeId: node.id,
      type: node.type
    }
  }


  //获取节点状态，包括提前、滞后、暂停  原材料、电抗  不是所有
  getNodeStatusAndTime(node){
    debugger
    let sourceNode = this.sourceDataList.find(item=>{
      return node.id == item.nodeId;
    })
    //如果不存在代表不存在此节点
    if(!sourceNode) {
      return {
        notHave: true,
      }
    }
    let timeStatus = 'forward', typeStatus = '';
    if(sourceNode.pnType == Constants.processType.product) {
      typeStatus = 'product';
    }else if(sourceNode.pnType == Constants.processType.design){
      // typeStatus = 'design'
    }else if(sourceNode.pnType == Constants.processType.purchase){
      typeStatus = 'purchase'
    }

    //status  状态：-1：超期；0：正常；1：提前
    //progressStatus进度状态：4：暂停
    if(sourceNode.progressStatus == 4) {
      timeStatus = 'pause'
    }else {
      if(sourceNode.status ==  1) {
        timeStatus = 'forward'
      }else if(sourceNode.status == -1) {
        timeStatus = 'delay'
      }
    }
    return {
      timeStatus,
      typeStatus,
      ...this.formatTime(sourceNode)
    }
  }

  //构造创建连线数据
  createEdge() {
    this.data.forEach((item) => {
      if(this.isValidNode(item)){
        this.constructorEdge(item)
      }
    })
    if(this.showLungNode){
      let lundLobeEdge = this.getLungLobeEdge();
      this.edgeList.push(lundLobeEdge)
    }
  }

  //构造连接线
  constructorEdge(node) {
    node.preNodeBasic && node.preNodeBasic.forEach((item, index) =>{
      let preNode = this.getPreNode(item.k);
      if(preNode){
        this.edgeList.push(this.getEdge(preNode, node, index));
      }
    })
  }

  //获取连接线另一头节点
  getPreNode(nodeId) {
    let preNode = this.data.find(item => {
      return item.id === nodeId
    })
    if(!preNode) {
      return null;
    }
    if(!this.isValidNode(preNode)){
      return null;
    }else{
      return preNode;
    }
  }

  //设置edge的连接桩信息
  getEdge(preNode, item, index){
    let id = preNode.id + '_' + item.id + '_' +  index;

    let source = {
      cell: preNode.id
    }
    let isExist = this.hasPortInDirectlyBelow(preNode);
    if(isExist){
      if(parseInt(preNode.coordinateX) < parseInt(item.coordinateX)){
        //如果前置节点的X轴坐标大于后置节点X轴坐标，后置节点的连接桩应该在左侧
        source.port = item.id + '_' + 'left';
      }else if(parseInt(preNode.coordinateX) > parseInt(item.coordinateX)){
        //如果前置节点的X轴坐标等于后置节点X轴坐标，后置节点的连接桩应该在上部的顶部
        source.port = item.id + '_' + 'right';
      }else{
        source.port = preNode.id + '_' + 'bottom'
      }
    }else{
      source.port = preNode.id + '_' + 'bottom'
    }

    let target = {
      cell: item.id,
    }
    if(parseInt(preNode.coordinateX) < parseInt(item.coordinateX)){
      //如果前置节点的X轴坐标大于后置节点X轴坐标，后置节点的连接桩应该在左侧
      target.port = item.id + '_' + 'left';
    }else if(parseInt(preNode.coordinateX) === parseInt(item.coordinateX)){
      //如果前置节点的X轴坐标等于后置节点X轴坐标，后置节点的连接桩应该在上部的顶部
      target.port = item.id + '_' + 'top';
    }else{
      target.port = item.id + '_' + 'right';
    }
    return {
      id,
      source,
      target,
      ...this.edgePublicInfo
    }
  }

  /**
   * 检验正下方是否有节点
   * @param preNode
   * @returns {*}
   */
  hasPortInDirectlyBelow(preNode){
   return this.data.find(item=>{
      if(!this.isValidNode(item)){
        return false;
      }
      if(item.id !== preNode.id){
        let preY = parseInt(preNode.coordinateY);
        let itemY = parseInt(item.coordinateY);
        if(item.coordinateX === preNode.coordinateX && ((preY + 1) === itemY)){
          return true;
        }
      }
      return false;
    })
  }

  //获取节点的连接桩信息
  addPortInfo(node) {
    return {
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": { "visibility": "hidden" }
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": { "visibility": "hidden" }
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": { "visibility": "hidden" }
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": { "visibility": "hidden" }
              }
            }
          }
        },
        "items": [{ "group": "top", "id": node.id + '_' + 'top' }, {
          "group": "right",
          "id": node.id + '_' + 'right'
        }, { "group": "bottom", id: node.id + '_' + 'bottom' }, {
          "group": "left",
          "id": node.id + '_' + 'left'
        }]
      }
    }
  }
}

export default CreateData;
