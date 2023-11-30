<template>
  <div id="tags-view-container" class="vaw-tab-bar-container tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <router-link
          v-for="tag in state.visitedView"
          ref="tag"
          :key="tag.path"
          :class="isActive(tag)?'active':''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="span"
          class="tags-view-item"
          @click.middle="!isAffix(tag)?removeTab(tag):''"
          @contextmenu.prevent="onContextMenu(tag,$event)"
      >
        {{ tag.title }}
        <span class="tags-icon" v-if="!isAffix(tag)" @click.prevent.stop="removeTab(tag)" >
           <el-icon :size="12">
            </el-icon>
        </span>
      </router-link>
    </scroll-pane>

    <!--<el-tabs
        id="tagViewTab"
        v-model="currentTab"
        type="card"
        @tab-click="clickTab"
        @tab-remove="removeTab"
        @contextmenu.prevent="onContextMenu(currentTab, $event)"
    >
      <el-tab-pane
          v-for="item of state.visitedView"
          :key="item.name"
          :label="item.meta ? item.meta.title : item.name"
          :name="item.name"
          :closable="!isAffix(item)"
      />
    </el-tabs>-->
    <ul
        v-show="showContextMenu"
        class="contex-menu-wrapper"
        :style="contextMenuStyle"
    >
      <li :disabled="showLeftMenu">
        <el-button
            :disabled="showLeftMenu"
            icon="BackIcon"
            text
            @click="closeLeft"
        >关闭左侧
        </el-button>
      </li>
      <li :disabled="showRightMenu">
        <el-button
            :disabled="showRightMenu"
            icon="RightIcon"
            text
            @click="closeRight"
        >关闭右侧
        </el-button>
      </li>
      <li>
        <el-button
            icon="CircleCloseIcon"
            text
            @click="closeAll"
        >关闭所有
        </el-button>
      </li>
    </ul>
  </div>
</template>

<script>
import {reactive} from 'vue'
import ScrollPane from './ScrollPane'
import store from "../store";
import path from "path";
import qs from "qs";
import {deepClone} from "@/utils";

export default {
  name: "TabBar",
  components: { ScrollPane },
  data() {
    return {
      contextMenuStyle: {
        left: 0,
        top: 0,
      },
      showContextMenu: false,
      selectRoute: null,
      showLeftMenu: true,
      showRightMenu: true,
      state: store.state,
    };
  },
  watch: {
    $route(newVal) {
      if ([ "500", "403", "not-found", "login"].includes(newVal.name)) {
        return;
      }
      if (newVal.path.startsWith("/redirect")) {
        return;
      }
      if (newVal.meta.noShowTabbar) {
        return;
      }
      try{
        if(newVal.matched.length === 0){
          return;
        }
        this.addVisitedView(newVal);
      }catch(e){
        console.error(e);
      }
    },
    showContextMenu(val) {
      if (val) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
  },
  mounted() {
    this.initRoute();
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    initRoute() {
      const affixedRoutes = this.findAffixedRoutes(
          this.state.permissionRoutes,
          "/"
      );
      affixedRoutes.forEach((it) => {
        this.addVisitedView(it);
      });
      if (
          ["404", "500", "403", "not-found", "Login"].includes(this.$route.name)
      ) {
        return;
      }
      if (this.$route.meta.noShowTabbar) {
        return;
      }
      this.addVisitedView(this.$route);
    },
    addVisitedView(route) {
      // let data = deepClone(route);
      route.title = route.meta.title;
      store.addVisitedView(reactive(route));
    },
    findAffixedRoutes(routes, basePath) {
      const temp = [];
      routes.forEach((it) => {
        if (!it.hidden && it.meta && it.meta.affix) {
          temp.push({
            name: it.name,
            path: path.resolve(basePath, it.path),
            // path: it.path,
            meta: it.meta,
          });
        }
        if (it.children && it.children.length > 0) {
          temp.push(
              ...this.findAffixedRoutes(
                  it.children,
                  path.resolve(basePath, it.path)
              )
          );
        }
      });
      return temp;
    },
    isAffix(route) {
      return route.meta && route.meta.affix;
    },
    removeTab(tag) {
      const findItem = this.state.visitedView.find(
          (it) => it.path === tag.path
      );
      if (findItem) {
        store.removeVisitedView(findItem).then((_) => {
          if (this.isActive(tag)) {
            let view =
                this.state.visitedView[
                this.state.visitedView.length - 1
                    ];
            this.$router.push(view.path);
          }
        });
      }
    },
    // context menu actions
    isLeftLast(tempRoute) {
      return this.state.visitedView.indexOf(tempRoute) === 0;
    },
    isRightLast(tempRoute) {
      return (
          this.state.visitedView.indexOf(tempRoute) ===
          this.state.visitedView.length - 1
      );
    },
    closeLeft() {
      store.closeLeftVisitedView(this.selectRoute).then((_) => {
        if (this.$route.name !== this.selectRoute.name) {
          this.$router.push(
              this.state.visitedView[this.state.visitedView.length - 1].path
          );
        }
      });
    },
    closeRight() {
      store.closeRightVisitedView(this.selectRoute).then((_) => {
        if (this.$route.name !== this.selectRoute.name) {
          this.$router.push(
              this.state.visitedView[this.state.visitedView.length - 1].path
          );
        }
      });
    },
    closeAll() {
      store.closeAllVisitedView(this.selectRoute).then((_) => {
        this.$router.push(
            this.state.visitedView[this.state.visitedView.length - 1].path
        );
      });
    },
    closeMenu() {
      this.showContextMenu = false;
    },
    handleScroll() {
      this.closeMenu()
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
@import "../../styles/xui/_public/var.scss";

.vaw-tab-bar-container {
  position: relative;
  height: $tabHeight;
  line-height: $tabHeight;
  box-sizing: border-box;
  white-space: nowrap;
  background-color: var(--el-color-white);
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .contex-menu-wrapper {
    position: absolute;
    width: 130px;
    z-index: 999;
    list-style: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    background-color: white;
    padding-left: 0;

    & > li {
      width: 100%;
      line-height: 40px;
      padding-left: 15px;
      box-sizing: border-box;
    }

    & > li:hover {
      background-color: #f5f5f5;
    }
  }

  .humburger-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;

    :deep(.fold-wrapper) {
        margin-top: calc(50% - 10px);
    }
  }

  .tab-humburger-wrapper {
    margin-left: 40px;
    transition: margin-left $transitionTime;
  }

  .tab-no-humburger-wrapper {
    margin-left: 0;
    transition: margin-left $transitionTime;
  }
}

:deep(.el-tabs--card > .el-tabs__header) {
    border: none;
    margin: 0;
    padding: 0 10px;

    .el-tabs__nav {
      border: none !important;
    }

    .el-tabs__item {
      height: calc(#{$tabHeight} - 8px);
      line-height: calc(#{$tabHeight} - 10px);
      border-radius: 2px;
      font-size: $xui-common-font-size;
      border: 1px solid var(--el-border-color-light);
      background-color: var(--el-color-white);
      padding: 0 10px !important;
      font-weight: normal;
    }

    .el-tabs__item.is-active {
      color: var(--el-color-white);
      border: 1px solid var(--el-color-primary) !important;
      background-color: var(--el-color-primary);
    }

    // .el-tabs__item.is-active::before {
    //   content: "";
    //   width: 7px;
    //   height: 7px;
    //   display: inline-block;
    //   background-color: var(--el-color-white);
    //   border: 1px solid var(--el-color-primary-light-6);
    //   border-radius: 50%;
    //   margin-right: 5px;
    // }
    .el-tabs__item:hover {
      border: 1px solid var(--el-color-primary) !important;
  }

  .el-tabs__item + .el-tabs__item {
    margin-left: 10px;
  }
}
</style>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      .tags-icon{
        margin-left: 3px;
        padding-top: 5px;
      }
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #1890ff;
        color: #fff;
        border-color: #1890ff;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 4px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
