<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-transform" mode="out-in" appear>
      <keep-alive :include="includeList">
        <component :is="Component" :key="routeKey"/>
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts">
import {computed, defineComponent, ref, reactive, watch, toRefs} from "vue";
import {useRoute} from "vue-router";
import store from "./store";

export default defineComponent({
  name: "Main",
  setup() {
    const state = store.state;
    const route = useRoute();
    const routeKey = ref(route.fullPath);
    const cachedViews = computed(() => {
      return state.cachedView.map((it) => it);
    });
    const includeState = reactive({
      includeList: []
    })
    watch(
        () => route.fullPath,
        () => {
          routeKey.value = route.fullPath;
        }
    );
    watch(() => route,(newVal)=>{
      if(newVal.meta.keepAlive && includeState.includeList.indexOf(newVal.name) === -1){
        includeState.includeList.push(newVal.name);
      }
    },{deep:true}) // 开启深度监听

    return {
      state,
      route,
      cachedViews,
      routeKey,
      ...toRefs(includeState)
    };
  },
});
</script>
