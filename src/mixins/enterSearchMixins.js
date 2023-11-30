/**
 * 回车查询的混入组件
 */
export default {
  data(){
    return {
      //是否需要监听回车事件，默认是需要，如果不需要，改成false
      listenKeyDownEvent: true
    }
  },
  methods: {
    //创建监听
    enterLogin() {
      this.cancelEnterLogin();
      window.addEventListener('keydown', this.enterSearch);
    },
    //销毁监听
    cancelEnterLogin(){
      try{
        window.removeEventListener('keydown', this.enterSearch);
      }catch{
      }
    },
    enterSearch(e){
      if(this.listenKeyDownEvent && e.keyCode === 13){
        this.handleSearch();
      }
    },
    handleSearch(){
     this.search();
    },
    search(){
      console.error('混入了回车查询事件的组件必须实现handleSearch或者search方法')
    }
  },
  created() {
    this.enterLogin();
  },
  activated() {
    this.enterLogin();
  },
  deactivated() {
    this.cancelEnterLogin();
  },
  beforeUnmount() {
    this.cancelEnterLogin();
  }
}
