<template>
  <el-sub-menu
    :index="generatorPath(item.pUrl)"
    teleported
  >
    <template #title>
      <el-icon>
        <component :is="item.meta ? item.meta.icon || MenuIcon : MenuIcon" />
      </el-icon>
      <span>{{ item.pName }}</span>
    </template>
    <slot></slot>
  </el-sub-menu>
</template>

<script lang="ts">
import { isExternal } from "../../utils";
import path from "path";
import store from "../../store";
import { defineComponent } from "vue";
import { Operation as MenuIcon } from "@element-plus/icons-vue";
export default defineComponent({
  name: "SubMenuItem",
  components: { MenuIcon },
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
  },
  setup(props) {
    function generatorPath(childPath: string) {
      if (isExternal(props.fullPath)) {
        return props.fullPath;
      }
      if (isExternal(childPath)) {
        return childPath;
      }
      return path.resolve(props.fullPath, props.item.pUrl);
    }
    return {
      state: store.state,
      generatorPath,
      MenuIcon,
    };
  },
});
</script>
