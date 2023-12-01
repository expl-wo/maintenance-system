<template>
  <el-dialog draggable :close-on-click-modal="false" title="请选择检修人员"  v-model="dialogVisible" class="roleDialog800">
    <el-form label-position="right" label-width="90px" :model="listPeopleQuery" :inline="true" class="demo-form-inline demo-form-zdy">
      <el-form-item label="" prop="name"  size="small">
        <el-input v-model="listPeopleQuery.name" placeholder="用户姓名" @keyup.enter="onPeopleQuery" clearable style="width: 180px;" class="filter-item" />
      </el-form-item>
      <el-form-item label="" prop="intro"  size="small">
        <el-input v-model="listPeopleQuery.userid" placeholder="员工编号" @keyup.enter="onPeopleQuery" clearable  style="width: 180px;" class="filter-item" />
      </el-form-item>
      <el-form-item label="" prop="intro"  size="small">
        <el-input v-model="listPeopleQuery.gsbmName" placeholder="归属部门名称" @keyup.enter="onPeopleQuery" clearable style="width: 180px;" class="filter-item" />
      </el-form-item>
      <el-form-item  size="small">
        <el-button type="primary" icon="el-icon-search" @click="onPeopleQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="tag-container">
      <el-tag v-for="item in selectedUser" :key="item.userid" v-show="selectedUser.length > 0" closable @close="tagClose(item)">{{ item.name }}</el-tag>
    </div>
    <div class="app-container">
      <el-table stripe  ref="tableRef" height="360" highlight-current-row border :data="dataList"
                style="font-size: 0.7rem"
                @select="handleSelect"
                @select-all="handleSelectAll"
      >
        <el-table-column type="selection" width="60"  align="center">
        </el-table-column>
        <el-table-column label="序号" width="50" align="center">
          <template  #default="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="员工姓名" align="center"></el-table-column>
        <el-table-column prop="userid" label="员工编号" align="center"></el-table-column>
        <el-table-column prop="mobile_no" label="员工电话" align="center"></el-table-column>
        <el-table-column prop="gsbmName" label="归属部门名称" align="center"></el-table-column>
      </el-table>
      <xui-pagination :total="total" :page="listPeopleQuery.pageNum" :limit="listPeopleQuery.pg_pagesize" @pagination="handlePagination" class="searchCon wp"/>
    </div>
    <div   class="dialog-footer">
      <el-button  size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary"  size="small" @click="savePeopleData()">
        保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getUser } from '@/api/user'

  export default {
    name: 'emMaintenance_005_selectName',
    data(){
      return {
        dialogVisible: false,
        initListPeopleQuery: { // 查询条件
          pg_pagenum: 1, // 每页显示多少条数据，默认为10条
          pg_pagesize: 10, // 查询第几页数据，默认第一页
          name: '', // 模糊匹配，用户姓名
          userid: '', // 模糊匹配，员工编号
          gsbmName: '' // 模糊匹配，归属部门名称
        },
        listPeopleQuery: {},
        selectedUser: [],
        dataList: [],
        total: 0
      }
    },
    methods: {
      init(){
        this.selectedUser = [];
        this.total = 0;
        this.dataList = [];
        this.listPeopleQuery = {
          ...this.initListPeopleQuery,
        }
        this.onPeopleQuery();
        this.dialogVisible = true;
      },

      onPeopleQuery(){
        this.listPeopleQuery.pg_pagenum = 1;
        this.getDataList();
      },
      handlePagination({ page, limit }) {
        this.listPeopleQuery.pg_pagenum = page;
        this.listPeopleQuery.pg_pagesize = limit;
        this.getDataList()
      },
      getDataList(){
        getUser(this.listPeopleQuery).then(response => {
          this.dataList = response.data
          this.total = response.total_count
          this.$nextTick(()=>{
            this.setTableSelected()
          })
        })
      },
      handleSelect(selection, row){
        if(selection.indexOf(row)>=0){
          //是被选中
          let isHave = this.selectedUser.find(item=>{
            return item === row;
          })
          if(!isHave){
            this.selectedUser.push(row);
          }
        }else{
          this.selectedUser.some((item, index)=>{
            if(item === row){
              this.selectedUser.splice(index, 1);
              return true;
            }else{
              return false;
            }
          })
        }
      },
      handleSelectAll(selection){
        this.dataList.forEach(row=>{
          this.handleSelect(selection, row);
        })
      },
      setTableSelected(){
        this.dataList.forEach(item=>{
          this.selectedUser.some(subItem=>{
            if(item.id === subItem.id){
              this.$refs.tableRef.toggleRowSelection(item, true)
              return true;
            }else{
              return false;
            }
          })
        })
      },
      tagClose(item){
        let selectedUser = this.selectedUser.filter((user)=>{
          return item !== user
        })
        this.$refs.tableForm && this.$refs.tableForm.toggleRowSelection(selectedUser);
        this.selectedUser = selectedUser;
      },
      savePeopleData(){
        if(this.selectedUser.length === 0){
          this.$message.warning('请至少选择一个检查人');
          return;
        }else if (this.selectedUser.length>1){
          this.$message.warning('最多选择一个');
          return;
        }
        this.$emit('selectName', this.selectedUser[0])
        this.dialogVisible = false;
      }
    }
  }
</script>

<style scoped>

</style>