<template>
  <iframe :src="url" height="100%" width="100%" class="mes-iframe"> </iframe>
</template>

<script>
import { getUserToIcc } from "@/api/overhaul/videoApi.js";
export default {
  data() {
    return {
      url: "",
    };
  },
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem("digital_web_userInfo"));
    this.url = `https://ims.cloud-hb.com/?username=${
      userInfo.username
    }&password=${userInfo.password}&redirect=${encodeURIComponent(
      "https://ims.cloud-hb.com/ec/#/eventQuery"
    )}#/thirdOAuth`;
  },
};
</script>

<style lang="scss" scoped>
.mes-iframe {
  border: 0;
  iframe {
    border: 0;
  }
}
</style>