<template>
  <div>
    <el-container :style="printStyle">
      <el-scrollbar style="width: 100%">
        <el-card>
          <el-row>
            <el-button
              type="primary"
              size="mini"
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
                  <span>设备编码：</span> <span>{{ item.id }}</span>
                  <br />
                  <span>设备名称：</span> <span>{{ item.name }}</span>
                  <br />
                  <span>设备分类：</span> <span>{{ item.clazzName }}</span>
                </div>
                <div
                  style="
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 60px;
                    height: 60px;
                    margin-top: 7px;
                    margin-right: 4px;
                  "
                >
                  <vue-qr
                    :text="item.id"
                    :size="60"
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
  name: "equipPrint",
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
  mounted() {
  },
  destroyed() {
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
  height: 80px;
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
    overflow: hidden;
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
