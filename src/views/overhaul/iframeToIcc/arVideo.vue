<template>
  <iframe :src="url" id="ar-iframe" height="100%" width="100%" class="mes-iframe"> </iframe>
</template>

<script>
export default {
  data() {
    return {
      url: "",
    };
  },
  methods: {
    iframeMessage(event) {
      if (event.data && event.data.method === "getWarpPos") {
        let arIframe = document.getElementById("ar-iframe");
        if (!arIframe) return;
        let outContent = arIframe.getBoundingClientRect();
        let posData = {
          method: "getWarpPosResult",
          windowWidth: window.top.innerWidth,
          windowHeight: window.top.innerHeight,
          outLeft: outContent.left,
          outTop: outContent.top,
        };
        arIframe.contentWindow.postMessage(posData, "*");
      }
    },
  },
  beforeUnmount() {
    window.removeEventListener("message", this.iframeMessage);
  },
  mounted() {
    window.addEventListener("message", this.iframeMessage);
    const userInfo = JSON.parse(localStorage.getItem("digital_web_userInfo"));
    this.url = `https://ims.cloud-hb.com/#/thirdOAuth?username=${
      userInfo.username
    }&password=${userInfo.password}&redirect=${encodeURIComponent(
      "https://ims.cloud-hb.com/Evo-web-logis/#/webHome/logistics"
    )}`;
  },
};
</script>

<style lang="scss">
.mes-iframe {
  border: 0;
}
</style>