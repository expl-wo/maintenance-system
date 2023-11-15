<template>
  <el-select
    clearable
    :popper-class="selectSetting.popverClass"
    v-select-load-more="selectSetting"
    v-model="childSelectedValue"
    class="filter-item"
    :filter-method="selectSearch"
    filterable
    placeholder="请选择"
    v-bind="$attrs"
    @change="handelChange"
  >
    <el-option
      v-for="item in selectOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
import debounce from "lodash/debounce";
const seed = function () {
  let rnd = function () {
    return Math.round(Math.random() * 4294967295).toString(36);
  };
  let now = new Date().getTime();
  return "s" + now.toString(36) + rnd() + rnd() + rnd();
};
export default {
  directives: {
    "select-load-more": {
      inserted(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          `.${binding.value.popverClass} .el-select-dropdown__wrap`
        );
        SELECTWRAP_DOM.addEventListener(
          "scroll",
          function () {
            const condition =
              this.scrollHeight - this.scrollTop <= this.clientHeight;
            if (condition) {
              binding.value.getList(binding.value.popverClass);
            }
          },
          { signal: binding.value.controller.signal }
        );
      },
      unbind(el, binding) {
        binding.value.controller.abort();
      },
    },
  },
  props: {
    //传值，v-model所绑定的值
    selectVal: {
      type: [String, Number, Array, Boolean, Object],
      default: undefined,
    },
    //唯一类名
    popverClass: {
      type: String,
      default: seed(),
    },
    //必须数组和对象需要将label和value同时返回 如果多选就传数组如果单选就传对象
    defaultSelectVal: {
      type: [Array, Object],
      default() {
        return [];
      },
    },
    /**
     * 必须是promise函数，默认select组件会将分页相关的参数传递进来，里面逻辑外层组件处理，需返回格式{options:[],totalPage:10}
     */
    getOptions: {
      type: Function,
      default: () => {
        return Function;
      },
    },
  },
  model: {
    prop: "selectVal",
    event: "input",
  },
  data() {
    return {
      pageParams: {
        totalPage: 1, //总页数
        searchKey: "", //
        pageSize: 50,
        pageNum: 1,
      },
      selectSetting: {
        popverClass: this.popverClass, //下拉弹出框的类名
        getList: this.loadMore, //获取options的方法
        controller: new AbortController(), //用于终止addeventlistener的事件
      },
      selectOptions: [],
    };
  },
  computed: {
    childSelectedValue: {
      get() {
        return this.selectVal || undefined;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  mounted() {
    this.loadMore();
  },
  methods: {
    //筛选方法
    selectSearch: debounce(function (val) {
      this.selectOptions = [];
      this.pageParams = {
        totalPage: 1, //总页数
        searchKey: val, //
        pageSize: 50,
        pageNum: 1,
      };
      if (Array.isArray(this.defaultSelectVal)) {
        this.selectOptions = [...this.defaultSelectVal];
      } else if (Object.keys(this.defaultSelectVal).length) {
        this.selectOptions = [this.defaultSelectVal];
      }
      this.loadMore();
    }, 500),
    async loadMore() {
      if (this.pageParams.pageNum > this.pageParams.totalPage) return;
      const { options, totalPage } = await this.getOptions(this.pageParams);
      const filterOptions = (options || []).filter((item) => {
        if (Array.isArray(this.defaultSelectVal)) {
          return !this.defaultSelectVal.includes(item.value);
        } else if (Object.keys(this.defaultSelectVal).length) {
          return this.defaultSelectVal.value !== item.value;
        }
      });
      this.selectOptions = [...this.selectOptions, ...filterOptions];
      if (this.pageParams.totalPage < totalPage) {
        this.pageParams.pageNum++;
      }
    },
    /**
     * 选择框改变时
     */
    handelChange(val) {
      // this.$emit("change", val);
      if (!val) {
        this.selectSearch("");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>