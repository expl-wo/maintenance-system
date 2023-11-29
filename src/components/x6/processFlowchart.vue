<template>
  <el-dialog v-draggable  appendToBody :title="this.productNo+'当前工单各阶段状态'"
             v-model="dialogVisible" v-if="dialogVisible" @close="handleClose" modal width="80vw"  top="2vh">
   <!-- <div class="btn-wrapper">
      <div @click="reload" style="color: #000;cursor:pointer;">初始化</div>
      <div @click="loadDataFromCache" style="color: #000;cursor:pointer;">缓存中</div>
      <div @click="exportJson" style="color: #000;cursor:pointer;">导出json</div>
      <div @click="loadDataFromJson" style="color: #000;cursor:pointer;">导入json</div>
      <div @click="clear" style="color: #000;cursor:pointer;">清空</div>
      <div @click="loadDataFromModal" style="color: #000;cursor:pointer;">加载更多数据</div>
    </div>-->
    <div class="container" ref="containerRef"></div>
    <div class="node-legend">
      <div class="xui-flowchart__wrapper">
        <div class="xui-flowchart__header">
          <div class="xui-flowchart__startTime">
            计划开始
          </div>
          <div class="xui-flowchart__endTime">
           计划结束
          </div>
        </div>
        <div class="xui-flowchart__body">
          <div class="xui-flowchart__label">
           关键节点
          </div>
        </div>
        <div class="xui-flowchart__footer">
          <div class="xui-flowchart__startTime">
            实际开始
          </div>
          <div class="xui-flowchart__actualTime">
            提前/滞后
          </div>
          <div class="xui-flowchart__endTime">
            实际结束
          </div>
        </div>
      </div>
    </div>
    <div class="legend">
      <div class="wrapper">
        <div class="legend-item">
          <div class="legend-icon product">
            <div class="name">名称</div>
          </div>
          <div>生产部件</div>
        </div>
        <div class="legend-item">
          <div class="legend-icon purchase">
            <div class="name">名称</div>
          </div>
          <div>采购部件</div>
        </div>
<!--        <div class="legend-item">
          <div class="legend-icon design">
            <div class="name">名称</div>
          </div>
          <div>设计部件</div>
        </div>-->
        <div class="legend-item">
          <div class="legend-icon product"></div>
          <div>无此部件</div>
        </div>
        <div class="legend-item">
          <div class="legend-icon" style="opacity: 0;"></div>
          <div class="forward">进度提前</div>
        </div>
        <div class="legend-item">
          <div class="legend-icon" style="opacity: 0;"></div>
          <div class="delay">进度滞后</div>
        </div>
        <div class="legend-item">
          <div class="legend-icon" style="opacity: 0;"></div>
          <div class="pause">进度暂停</div>
        </div>

      </div>
    </div>
    <op-status-dialog ref="opStatusDialog"></op-status-dialog>
    <op-lung-status-dialog ref="opLungStatusDialog"></op-lung-status-dialog>
  </el-dialog>
</template>

<script type="text/jsx">
import '@antv/x6-vue-shape'
import Components from "./components.vue";
import {Graph, Shape} from '@antv/x6'
import data from './data'
import planWeek from '@/api/plan/planWeek'
import CreateData from '@/components/x6/createData'
import Constants from '@/utils/constants'
import OpStatusDialog from '@/views/ps/planMain/dialog/opStatusDialog.vue'
import OpLungStatusDialog from '@/views/ps/planMain/dialog/opLungStatusDialog.vue'

export default {
  components: { OpLungStatusDialog, OpStatusDialog },
  data() {
    return {
      dialogVisible: false,
      graph: null,
      isEdit: false,
      sourceNodeList: [],
      productNo:'',
      id: ''
    }
  },
  created(){
   /* let params = this.$route.query;
    if(params.edit){
      this.isEdit = true;
    }*/
  },
  methods: {
    init(params){
      this.sourceNodeList = params.nodeList;
      this.productNo = params.productNo;
      this.id = params.id;
      this.dialogVisible = true;
      this.$nextTick(()=>{
        setTimeout(()=>{
          this.reload();
        }, 200)
      })
    },
    handleNodeClick(nodeData){
      console.log(nodeData)
      if(nodeData.type ==this.$constants.processType.product) {
        if(nodeData.planNodeId === 'lung'){
          this.$refs.opLungStatusDialog.init(nodeData.opPlanList)
        }else{
          this.$refs.opStatusDialog.initFromFlowChart({
            planNodeId: nodeData.planNodeId
          })
        }
      }else{
          this.$message.warning('只有生产部件才有报工信息');
      }
    },
    reload() {
      try {
        try {
          this.reg();
        } catch (c) {
          console.error(c);
        }
        this.graph && this.graph.dispose()
        this.initData();
      } catch (e) {
        console.error(e);
      }
    },
    initData() {
      let tools = {};
      if(this.isEdit){
        tools = {
          name: 'button-remove',
          args: { distance: -40 },
        }
      }
      this.graph = new Graph({
        container: this.getContainerEl(),
        grid: false,
        panning: true,
        mousewheel: true,
        connecting: {
          highlight: true,
          router: {
            name: 'manhattan',
            args: {
              padding: 1,
            },
          },
          // connector: {
          //   name: 'rounded',
          //   args: {
          //     radius: 8,
          //   },
          // },
          anchor: 'center',
          connectionPoint: 'anchor',
          allowBlank: false,
          snap: {
            radius: 0,
          },
          createEdge() {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: '#333',
                  strokeWidth: 1,
                  /*targetMarker: {
                    tagName: 'path',
                    fill: 'yellow',  // 使用自定义填充色
                    stroke: 'green', // 使用自定义边框色
                    strokeWidth: 2,
                    d: 'M 20 -10 0 0 20 10 Z',
                  },*/
                },
              },
              tools: tools,
              zIndex: -1,
            })
          },
          validateConnection({targetMagnet}) {
            return !!targetMagnet
          },
        },
        highlighting: {
          magnetAdsorbed: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#5F95FF',
                stroke: '#5F95FF',
              },
            },
          },
        },
        /* resizing: true,
         rotating: true,*/
        selecting: {
          enabled: true,
          multiple: true,
          rubberEdge: true,
          rubberNode: true,
          modifiers: 'shift',
          rubberband: true,
        },
        snapline: true,
        keyboard: true,
        history: true,
        clipboard: true,
        interacting: {
          nodeMovable: false
        }
      });
      // this.initNodes();
      this.initNodesFromAjax();

      // this.initEditEvent();
      this.initSelectedEvent();
    },
    initNodes(){
      this.loadDataFromCache();
      this.graph.centerContent();
    },
    //从后台获取数据
    initNodesFromAjax(){
      planWeek.getNodeCoordinateAndConditions().then(async response=> {
        let createData = new CreateData(response.data, this.sourceNodeList, this.id);
        console.log('后台数据:',createData)
        let data = await createData.getResult();
        console.log(data)
        this._loadDataFromJson(data);
        this.graph.centerContent();
      })
    },
    getContainerEl(){
      let el = this.$refs.containerRef;
      return el;
    },
    initSelectedEvent(){
      this.graph.on('node:click', ({ e, x, y, node, view }) => {
        this.handleNodeClick(node.getData());
        this.reset();
        this.setSelected(node);
      })

      this.graph.on('blank:click', ({ e, x, y, node, view }) => {
        this.reset();
      })
    },
    initEditEvent() {
      const self =this;
      const showPorts = (ports, show) => {
        for (let i = 0, len = ports.length; i < len; i = i + 1) {
          ports[i].style.visibility = show ? 'visible' : 'hidden'
        }
      }
      this.graph.on('node:mouseenter', () => {
        const container = this.getContainerEl();
        const ports = container.querySelectorAll(
          '.x6-port-body',
        )
        showPorts(ports, true)
      })
      this.graph.on('node:mouseleave', () => {
        const container = this.getContainerEl();
        const ports = container.querySelectorAll(
          '.x6-port-body',
        )
        showPorts(ports, false)
      })
      // copy cut paste

      this.graph.on('edge:click', ({ e, x, y, edge, view }) => {
        edge.attr('line/strokeDasharray', 5)
        edge.attr('line/style/animation', 'running-line 30s infinite linear')
      })

      this.graph.bindKey(['meta+y', 'ctrl+y'], () => {
        if (self.graph.history.canRedo()) {
          self.graph.history.redo()
        }
        return false
      })

      this.graph.bindKey(['meta+z', 'ctrl+z'], () => {
        if (self.graph.history.canUndo()) {
          self.graph.history.undo()
        }
        return false
      })

      this.graph.bindKey('delete', () => {
        if(this.selectedNode){
          this.graph.removeNode(this.selectedNode);
          this.selectedNode = null;
        }
      })
      this.graph.bindKey('delete', () => {
        if(this.selectedNode){
          this.graph.removeNode(this.selectedNode);
          this.selectedNode = null;
        }
      })



      this.graph.on('node:click', ({ e, x, y, node, view }) => {
        this.reset();
        this.setSelected(node);
      })

      this.graph.on('blank:click', ({ e, x, y, node, view }) => {
        this.reset();
      })
    },
    setSelected(node){
      this.selectedNode = node;
      node.setData({
        ...node.getData(),
        selected: true
      })
    },
    reg() {
      const ports = {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden',
                },
              },
            },
          },
          right: {
            position: 'right',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden',
                },
              },
            },
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden',
                },
              },
            },
          },
          left: {
            position: 'left',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden',
                },
              },
            },
          },
        },
        items: [
          {
            group: 'top',
          },
          {
            group: 'right',
          },
          {
            group: 'bottom',
          },
          {
            group: 'left',
          },
        ],
      }
      Graph.registerNode("my-component", {
        inherit: "vue-shape",
        width: 96,
        height: 55,
        component: {
          template: `
            <Components/>`,
          components: {
            Components,
          },
        },
        ports: {...ports},
      }, true);

      Graph.registerEdge(
        'dag-edge',
        {
          inherit: 'edge',
          attrs: {
            line: {
              stroke: '#C2C8D5',
              strokeWidth: 1,
              targetMarker: null,
            },
          },
        },
        true,
      )
    },
    handleClose(){
      this.clear();
    },
    loadDataFromCache(){
      if(this.graph){
        let jsonList = data.getCacheData();
        this._loadDataFromJson(jsonList);
      }
      this.fit()
    },
    loadDataFromJson(){
      if(this.graph){
        let jsonString = localStorage.getItem('data')
        this._loadDataFromJson(JSON.parse(jsonString));
      }
      this.fit()
    },
    fit(){
      this.graph && this.graph.scaleContentToFit({
        padding: 20
      }).centerContent();
    },
    _loadDataFromJson(jsonList){
      if(this.graph){
        let nodeData = [];
        let edgeData = [];
        jsonList.forEach(item=>{
          if(item.shape === 'my-component'){
            nodeData.push(item)
          }else{
            edgeData.push(item)
          }
        })
        this.clear();
        nodeData.forEach(item=>{
          this.graph.addNode({
            ...item,
            shape: "my-component",
          });
        })

        edgeData.forEach(item=>{
          if(!this.isEdit){
            delete item.tools
          }
          this.graph.addEdge({
            ...item,
            attrs: {
              line: {
                stroke: '#333',
                strokeWidth: 1,
              },
            }
          });
        })
      }
      this.fit()
    },
    clear(){
      this.graph && this.graph.clearCells();
    },
    loadDataFromModal(){
      this.initNodes();
    },
    exportJson(){
      if(this.graph){
        let json = this.graph.toJSON();
        let data = [];
        json.cells.forEach(item=>{
          if(item.shape === 'my-component'){
            delete item.component;
            delete item.components;
            data.push(item)
          }else{
            data.push(item)
          }
        })
        console.log(JSON.stringify(data));
        localStorage.setItem('data', JSON.stringify(data))
      }
    },
    reset(){
      this.selectedNode = null;
      const nodes = this.graph.getNodes()
      nodes.forEach((node) => {
        let data = node.getData();
        node.setData({
          ...data,
          selected: false
        })
      })
      const edges = this.graph.getEdges();
      edges.forEach((edge) => {
        edge.attr('line/strokeDasharray', '')
        edge.attr('line/style/animation', '')
      })
    }
  }
}
</script>


<style lang="scss" scoped>
.container {
  width: 100%;
  height: 90vh;
}

.btn-wrapper{
  height: 6vh;
  display: flex;
  font-size: 18px;
  color: #000;
  padding: 4px;
  >div{
    padding: 4px;
  }
}

:deep(.el-dialog){
  margin-bottom: 10px;
}

:deep(.el-dialog__body){
  padding: 0 !important;
}

:deep(.el-dialog__header){
  padding-top: 5px;
  padding-bottom: 5px;
}

:deep(.el-dialog__headerbtn) {
  top: 10px;
}
</style>
