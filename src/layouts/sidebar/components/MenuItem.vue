<template>
  <el-menu-item :index="generatorPath()" @click="handleClick">
    <el-icon :size="16">
      <component
        :is="
          showRoute.iconName
        "
      />
    </el-icon>
    <template #title>
      <span>{{ showRoute.pName }}</span>
      <MenuItemTip
        :value="''"
        :is-dot="false"
      />
    </template>
  </el-menu-item>
</template>

<script lang="ts">
import { isExternal } from "../../utils";
import path from "path";
import { defineComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Operation as OperationIcon } from "@element-plus/icons-vue";
export default defineComponent({
  name: "MenuItem",
  props: {
    fullPath: {
      type: String,
      default: "",
    },
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    showRoute: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    function generatorPath() {
      if (isExternal(props.showRoute.path)) {
        return props.showRoute.path;
      }
      return props.showRoute.pUrl;
    }
    function handleClick() {
      debugger
      if (isExternal(props.showRoute.pUrl)) {
        window.open(props.showRoute.pUrl);
      }else if (
        route.path !== props.showRoute.pUrl
      ) {
        router.push({
          path:  props.showRoute.pUrl
        });
      }
    }
    return {
      generatorPath,
      handleClick,
      OperationIcon,
    };
  },
});
</script>
