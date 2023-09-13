<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="表名:" prop="fileName">
          <el-input size="small" @keyup.enter="handleFilter" style="width: 200px;margin-right:10px" class="filter-item"
                    v-model="listQuery.fileName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="primary" icon="upload" @click="handleUpload">上传</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :key="tableKey" :data="list" v-loading.body="listLoading" size="small" stripe highlight-current-row border
              style="width: 100%">
      <el-table-column width="140" align="center" type="index" label="序号"></el-table-column>
      <el-table-column min-width="300" align="center" label="文件名">
        <template #default="scope">
          <span>{{ scope.row.fileName }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="500" align="center" label="文件地址">
        <template #default="scope">
          <span>{{ scope.row.filePath }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="300" align="center" label="操作">
        <template #default="scope">
          <el-button-group>
            <el-button type="primary" icon="Edit" @click="handleDownload(scope.row)">
              下载
            </el-button>
          <!--  <el-button icon="View" v-if="canPreview(scope.row.fileType)" @click="handlePreview(scope.row)">
              预览
            </el-button>-->
            <el-button type="danger" icon="Delete" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <upload-file-dialog ref="uploadFileDialogRef" @refresh="getList"></upload-file-dialog>
  </div>
</template>

<script>
import {list} from '@/tool/api/file'
import UploadFileDialog from "@/tool/views/file/uploadFileDialog";
import {downloadClick, addDownloadFilePrev} from "@/_public/utils";

export default {
  name: 'tableManager',
  components: {UploadFileDialog},
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        fileName: ''
      },
      tables: [],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        const data = response.data;
        data.list.forEach(item=>{
          item.filePath = addDownloadFilePrev(item.filePath);
        })
        this.list = data.list
        this.total = parseInt(data.totalCount)
        this.listLoading = false
      })
    },

    handleFilter() {
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleUpload() {
      this.$refs.uploadFileDialogRef.init();
    },
    handleDownload(row){
      downloadClick(row.filePath, row.fileName);
    },
    handleDelete(row){
      //TODO
    }
  }
}
</script>
