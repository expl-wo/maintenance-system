<template>
  <div class="component-wrapper">
    <div class="table-top">
      <div class="operate-wrapper">
        <el-form :inline="true">
          <el-form-item label="设备名称/编号/IP">
            <el-input placeholder="设备名称/编号/IP" v-model="searchKey" @keyun.enter="onSearch" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch"
              ><el-icon class="el-icon--left"><Search /></el-icon
              >查询</el-button
            >
            <!-- <el-button type="primary" @click="synchronize"
              ><el-icon class="el-icon--left"><Refresh /></el-icon
              >同步</el-button
            > -->
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="table-wrapper">
      <el-table
        ref="deviceTable"
        v-loading="loading"
        :data="tableData"
        border
        @sort-change="sortChange"
        @filter-change="filterChange"
      >
        <template v-for="item in columns">
          <el-table-column
            v-if="!item.needSlot"
            :key="item.key"
            :prop="item.prop"
            :label="item.label"
            :type="item.type"
            :sortable="item.sortable"
            :width="item.width"
            :min-width="item.minWidth"
            :filters="item.filters"
            :filter-multiple="item.filterMultiple"
            :column-key="item.columnKey"
          >
          </el-table-column>
          <el-table-column
            v-else
            :key="item.key"
            :prop="item.prop"
            :label="item.label"
            :type="item.type"
            :sortable="item.sortable"
            :width="item.width"
            :min-width="item.minWidth"
            :filters="item.filters"
            :filter-multiple="item.filterMultiple"
            :column-key="item.columnKey"
          >
            <template  #default="scope">
              <div v-if="scope.column.columnKey === 'deviceType'">
                <span>{{ deviceType[scope.row.deviceType] }}</span>
              </div>
              <div v-if="scope.column.columnKey === 'isOnline'">
                <span
                  class="status-dot"
                  :class="[scope.row.isOnline === 0 ? 'bg-offline' : 'bg-online']"
                ></span>
                <span>{{ scope.row.isOnline === 0 ? "离线" : "在线" }}</span>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <div class="pagination-wrapper" v-if="total">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        background
        :current-page="pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        :total="total"
        @size-change="sizeChange"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>

import { getDeviceList } from "@/api/overhaul//deviceListApi";

const devStatusOptions = [
  {
    text: "在线",
    value: 1,
  },
  {
    text: "离线",
    value: 0,
  },
];
// 目前只展示类型为2和9的设备
const deviceType = {
  2: 'IPC',
  9: 'MPT'
}
export default {
  name: "DeviceTable",

  data() {
    return {
      searchKey: "",
      columns: [
        {
          prop: "deviceCode",
          key: "deviceCode",
          label: "设备编号",
          minWidth: "160px",
          sortable: "custom",
        },
        {
          prop: "deviceName",
          key: "deviceName",
          label: "设备名称",
          minWidth: "160px"
        },
        {
          prop: "deviceIp",
          key: "deviceIp",
          label: "IP地址",
          minWidth: "160px",
          sortable: "custom"
        },
        {
          prop: "devicePort",
          key: "devicePort",
          label: "端口",
          minWidth: "160px",
          sortable: "custom",
        },
        {
          prop: "deviceType",
          key: "deviceType",
          columnKey: "deviceType",
          label: "设备类型",
          minWidth: "160px",
          sortable: "custom"
        },
        {
          prop: "ownerOrgName",
          key: "ownerOrgName",
          label: "所属组织",
          minWidth: "160px"
        },
        {
          prop: "isOnline",
          key: "isOnline",
          label: "状态",
          minWidth: "100px",
          columnKey: "isOnline",
          filters: devStatusOptions,
          needSlot: true,
        },
      ],
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      pageSizeOptions: ["10", "20", "40", "50"],
      selectedNode: { ownerCode: "001" },
      sortInfo: {},
      filterInfo: {},
      loading: false,
      deviceType: Object.freeze(deviceType)
    };
  },
  // mounted() {
  //   this.getData();
  // },
  methods: {
    // 获取表格数据
    getData() {
      this.loading = true;
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchKey: this.searchKey,
        types: ['1_2', '1_9'],
        ...this.sortInfo,
        ...this.filterInfo
      };
      getDeviceList(params)
        .then((res) => {
          if (res.success && res.data) {
            this.tableData = res.data.pageData || [];
            this.total = res.data.totalRows || 0;
          }
        })
        .catch((err) => {
          this.tableData = [];
          this.total = 0;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 搜索
    onSearch() {
      this.pageNum = 1;
      this.getData();
    },
    // // 同步
    // synchronize() {
    //   this.sortInfo = {};
    //   this.filterInfo = {};
    //   this.$refs.deviceTable.clearSort();
    //   this.$refs.deviceTable.clearFilter();
    //   this.pageNum = 1;
    //   this.getData();
    // },
    // 列表排序
    sortChange({ column, prop, order }) {
      this.sortInfo = null;
      if (order && prop) {
        this.sortInfo = {
          sort: prop,
          sortType: order === "ascending" ? "ASC" : "DESC",
        };
      }
      this.pageNum = 1;
      this.getData();
    },
    // 列表筛选
    filterChange(filters) {
      let objKey = Object.keys(filters)[0];
      this.filterInfo[`${objKey}List`] = filters[objKey];
      this.pageNum = 1;
      this.getData();
    },
    // 每页条数发生变化
    sizeChange(size) {
      this.pageSize = size;
      this.pageNum = 1;
      this.getData();
    },
    // 页码发生变化
    pageChange(page) {
      this.pageNum = page;
      this.getData();
    },
  },
};
</script>
<style lang="scss" scoped>
.component-wrapper {
  width: 100%;
  height: 100%;
  .table-top {
    display: flex;
    height: 40px;
    width: 100%;
    .operate-wrapper {
      height: 40px;
      line-height: 40px;
    }
  }
  .table-wrapper {
    height: calc(100% - 94px);
    margin-top: 12px;
  }
  :deep(.el-table) {
    overflow: auto;
    width: 100%;
    height: 100%;
  }
  :deep(.el-table__header-wrapper) {
    position: sticky;
    top: 0;
    z-index: 10;
  }
  :deep(.el-table__body-wrapper) {
    height: calc(100% - 56px);
    width: 100%;
    overflow-y: auto;
  }
}
.mr0 {
  margin-right: 0;
}
.status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 8px;
  border-radius: 50%;
}
.bg-offline {
  background-color: #c9c9c9;
}
.bg-online {
  background-color: #52c41a;
}
</style>
