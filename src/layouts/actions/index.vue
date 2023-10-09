<template>
  <div class="action-items-wrapper">
    <el-popover
      v-if="state.actionItem.showMessage"
      trigger="click"
      :width="300"
    >
      <template #reference>
        <el-badge
          :value="''"
          class="badge-action-item"
        >
          <span>
            <el-icon :size="18">
              <bell />
            </el-icon>
          </span>
        </el-badge>
      </template>
      <PopoverMessageContent />
    </el-popover>
  </div>
</template>

<script lang="ts">
import store from "../store";
import { defineComponent, ref } from "vue";
import {
  Bell,
} from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import useEmit from "@/hooks/Emit";

export default defineComponent({
  name: "ActionItems",
  components: {
    Bell,
  },
  setup() {
    // const searchContentRef = ref();
    const showSearchContent = ref(false);
    const searchContent = ref("");
    const state = store.state;
    const router = useRouter();
    const route = useRoute();
    const emit = useEmit();

    function onShowSearch() {
      showSearchContent.value = !showSearchContent.value;
      searchContent.value = "";
      // if (showSearchContent.value) {
      //   searchContentRef.value?.focus();
      // } else {
      //   searchContentRef.value?.blur();
      // }
    }
    function onChange(content: string) {
      if (!content) {
        return;
      }
      window.open("https://www.baidu.com/s?wd=" + content);
    }
    function onRefrehRoute() {
      router.replace({ path: "/redirect" + route.path });
    }
    function onShowSetting() {
      emit?.emit("show_setting");
    }
    return {
      // searchContentRef,
      showSearchContent,
      searchContent,
      state,
      onShowSearch,
      onShowSetting,
      onRefrehRoute,
      onChange,
    };
  },
});
</script>

<style lang="scss" scoped>
.action-items-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  color: currentColor;
  z-index: 9999;
  .action-item {
    min-width: 40px;
  }
  .action-item:hover {
    color: var(--el-color-primary);
  }
  .badge-action-item {
    margin-right: 30px;
  }
  .input-wrapper {
    position: absolute;
    top: 6px;
    bottom: 3px;
    left: 0;
    width: 0;
    z-index: -1;
    transform: translateX(0);
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    &.is-active {
      width: 100%;
      transform: translateX(-100%);
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
  }
}
</style>
<style lang="scss" scoped>
:deep(.el-input) {
  border: none;
  border-bottom: 1px solid currentColor;
}
:deep(.el-input__inner) {
  border: none !important;
  height: 35px;
  line-height: 35px;
  color: currentColor !important;
  background-color: transparent !important;
}
</style>
