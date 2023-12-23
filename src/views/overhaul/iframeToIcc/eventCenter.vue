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
    getUserToIcc().then((res) => {
      let { userInfoPd, userInfoId } = res.data;
       this.url = `https://ims.cloud-hb.com/?username=${
      userInfoId
    }&password=${userInfoPd}&redirect=${encodeURIComponent(
      "https://ims.cloud-hb.com/ec/#/eventQuery"
    )}#/thirdOAuth`;
    });
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