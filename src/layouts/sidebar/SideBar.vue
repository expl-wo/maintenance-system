<template>
  <div
      class="vaw-side-bar-wrapper"
      :class="[!state.isCollapse ? 'open-status' : 'close-status']"
  >
    <transition name="logo">
      <Logo v-if="showLogo"/>
    </transition>
    <ScrollerMenu>
      <template #default>
        <SideBarItem
            v-for="item in menuList"
            :key="item.pUrl"
            :full-path="item.pUrl"
            :item="item"
        />
      </template>
    </ScrollerMenu>
    <div class="mobile-shadow"></div>
  </div>
</template>

<script lang="ts">
import store from "../store";
import {defineComponent, computed, onMounted,ref} from "vue";
import {getUserInfo} from "@/utils/auth";
import {useRoute} from "vue-router";
import { hasDepartPrivilege, notNullUndefined } from "@/utils";
import {transformList2Tree} from "@/utils";
import constants from "@/utils/constants";

export default defineComponent({
  name: "SideBar",
  props: {
    showLogo: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const state = store.state;
    const menuList = ref([])
    const transformStruct = (list)=> {
      const haveSub = Array.isArray(list.sub)&&list.sub.length>0;
      return {
          id: list.id,
          pName: list.name,
          pUrl: list.url,
          iconName:list.iconName,
          children: haveSub ? list.sub.map((i) => transformStruct(i)):[],
        };
    };

    const filterPcMenu = () => {
      let result = [];
      let rootList = [];
      // 从sessionStorage得到菜单结构
      let tempMenuList = JSON.parse(sessionStorage.getItem('menuList'));
      //过滤父节点为空的菜单
      tempMenuList = tempMenuList.filter(item=>{
        return constants.isEmpty(item.fid)
      })
      console.log("菜单",tempMenuList)
      rootList = (tempMenuList||[]).map((list)=>transformStruct(list));
      console.log("新菜单",rootList)
      // const rootList2 = transformList2Tree(tempMenuList, 'id', 'fId');
      const menuData = rootList.filter(item=>{
        return constants.isEmpty(item.fId);
      })
      menuList.value = menuData;
    }
    filterPcMenu();
    return {
      state,
      menuList
    };
  },
});
</script>

<style scoped lang="scss">
@import "../styles/variables.scss";

.open-status {
  width: $menuWidth;
  box-shadow: 2px 5px 5px rgba(0, 0, 0, 0.12);
  //transition: all $transitionTime;
}

.close-status {
  width: $minMenuWidth;
  box-shadow: none;
  //transition: all $transitionTime;
}

.vaw-side-bar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  overflow-x: hidden;
  height: 100%;
  box-sizing: border-box;
  z-index: 99;

  .vaw-menu-wrapper {
    overflow-x: hidden;
    color: white;
  }

  .scrollbar {
    height: calc(100% - #{$logoHeight}) !important;
  }
}

.is-mobile {
  .open-status {
    width: $menuWidth;
    transform: translateX(0);
    transition: transform $transitionTime;
  }

  .close-status {
    width: $menuWidth;
    transform: translateX(-$menuWidth);
    transition: transform $transitionTime;
    box-shadow: none;
  }
}
</style>
<style lang="scss">
@import "../styles/variables.scss";

.scrollbar-wrap-class {
  overflow-x: hidden !important;
}

.el-menu {
  --el-menu-hover-text-color: var(--el-color-primary) !important;
  --el-menu-hover-bg-color: var(--el-color-primary-light-8) !important;
  border-right: none !important;
  overflow: hidden;
}

.el-menu-item:hover {
  color: var(--el-menu-active-color);
  background-color: transparent;
}

.el-menu-item.is-active {
  color: var(--el-menu-active-color);
  background-color: var(--el-color-primary-light-8);
}

::deep(.el-menu--collapse .el-sub-menu__title span) {
  display: none !important;
}

::deep(.el-menu--collapse .el-sub-menu__title .el-sub-menu__icon-arrow) {
  display: none !important;
}
</style>
