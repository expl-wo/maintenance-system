<template>
  <div
      @click="handleClick"
    class="logo-wrapper"
    :style="{
      'border-bottom':
        state.layoutMode === 'ttb'
          ? 'none'
          : '1px dashed var(--el-border-color-light)',
    }"
  >
    <img v-if="showLogo && !state.isCollapse" class="logo-img" :src="require('@/_public/assets/logo.png')" />
    <img v-if="showLogo && state.isCollapse" class="logo-img mini" :src="require('@/_public/assets/logo_mini.png')" />
  </div>
</template>

<script lang="ts">
import store from "../store";
import { defineComponent, ref, watch } from "vue";
import {useRouter} from "vue-router";
import { useSetting } from "@/_public/hooks";
export default defineComponent({
  name: "Logo",
  props: {
    showTitle: {
      type: Boolean,
      default: true,
    },
    showLogo: {
      type: Boolean,
      default: true,
    },
    alwaysShow: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const setting = useSetting();
    const state = store.state;
    const bgColor = ref(
      state.theme === "light" ? "var(--el-color-white)" : "#001428"
    );
    const textColor = ref(
      state.theme === "light" ? "#001428" : "var(--el-color-white)"
    );
    const router = useRouter();
    const handleClick = ()=>{
      router.push({
        path: '/'
      })
    }

    watch(
      () => state.theme,
      (newVal) => {
        bgColor.value =
          newVal === "light" ? "var(--el-color-white)" : "#001428";
        textColor.value =
          state.theme === "light" ? "#001428" : "var(--el-color-white)";
      }
    );
    return {
      state,
      setting,
      bgColor,
      textColor,
      //event
      handleClick
    };
  },
});
</script>
<style lang="scss" scoped>
@import "../styles/variables.scss";
.logo-wrapper {
  cursor: pointer;
  height: $logoHeight;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: v-bind(bgColor);
  color: v-bind(textColor);
  .logo-img {
    width: 160px;
    &.mini{
      width: 56px;
    }
  }
  .logo-title {
    font-weight: bold;
  }
}
</style>
