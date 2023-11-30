<template>
  <div>
    <el-container :style="printStyle">
      <el-scrollbar style="width: 100%">
        <el-card>
          <el-row>
            <el-button
              type="primary"
               size="small"
              v-print="'#printTest'"
              style="margin: 10px 0"
            >打印
            </el-button>
          </el-row>
          <el-row>
            <div class="printList" id="printTest">
              <div
                class="printArea"
                style="font-family: 'heiti'"
                v-for="item in rowData"
                :key="item.id"
              >
                <div style="margin-left: 10px;margin-top: 15px;">
                  <span>物料简称：</span> <span>{{ item.matterShort }}</span><br />
                  <span>生产号：</span> <span>{{ item.productionNo }}</span><br />
                  <span>宽：</span> <span>{{ item.width }}</span><br />
                  <span>米数/重量：</span> <span>{{ item.meters }}</span><br />
                  <span>直径：</span> <span>{{ item.longitudinal }}</span><br />
                  <span>库位：</span> <span>{{ item.warehouseCode }}</span>
                </div>
                <div
                  style="
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 90px;
                    height: 95px;
                    margin-top: 7px;
                    margin-right: 4px;
                  "
                >
                  <vue-qr
                    :text="item.id"
                    :size="90"
                    :margin="0"
                    :dotScale="0.9"
                  ></vue-qr>
                </div>
                <!-- <div style="width: 50%; padding: 10px; position: relative; left: 30%">
            <vue-qr :text="codeText" :size="100" :margin="0"></vue-qr>
          </div> -->
              </div>
            </div>
          </el-row>
        </el-card>
      </el-scrollbar>
    </el-container>
  </div>
</template>

<script>
  import vueQr from "vue-qr";

  export default {
    name: "emReceiptPrint",
    data() {
      return {
        codeText: "",
        rowData: JSON.parse(this.$route.query.row),
        printStyle: {
          height: '100%',
        },
      };
    },
    components: { vueQr },

    unmounted() {
      this.rowData = null;
    },
    methods: {
      handlePrintText() {
        this.$nextTick(() => {
          this.$print(this.$refs.print);
        });
      },
    },
  };
</script>

<style scoped>
  table tr td {
    padding: 2px 5px;
  }
  table,
  table tr td {
    border: 1px solid #000;
    border-collapse: collapse;
  }
  .printArea {
    position: relative;
    padding: 0px 10px;
    font-size: 12px;
    font-family: "heiti";
    width: 400px;
    height: 100px;
    border: 1px solid #000;
    font-weight: 1000;
    float: left;
    margin-right: 10px;
    margin-top: 10px;
  }
  .printList {
    position: relative;
    overflow: hidden;
  }
  @media print {
    .printList {
      position: relative;
      overflow: visible;
    }
    @page {
      margin: 0;
    }
    * {
      box-shadow: none;
    }
    .printArea {
      page-break-after: always;
      zoom: 0.9;
      color: #000;
      border: 1px solid #000;
      width: 380px;
      height: 85px;
      border: none;
      box-shadow: none;
      font-weight: 500;
      overflow: hidden;
    }
  }
  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden !important;
  }
</style>
