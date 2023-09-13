### 按系统划分目录，为后期分系统开发提供更好的结构
如果出现页面跳转nextSibling的异常，这是vue框架出现的问题，暂时没有官方的解决方案
本人的处理方法时加入try-catch逻辑，在
node_modules/_@vue_runtime-core@3.2.37@@vue/runtime-core/dist/runtime-core.esm-bundler.js
中找到performRemove函数，大概在6112行左右，在此方法增加try-catch，可以解决问题。
const performRemove = () => {
    try{
        hostRemove(el);
        if (transition && !transition.persisted && transition.afterLeave) {
            transition.afterLeave();
        }
    }catch (e){
        console.error(e)
    }
};

针对不同的node版本，有不同的运行配置，node版本大于等于17的，需要加上
    "dev": "set NODE_OPTIONS=--openssl-legacy-provider & npm run serve",
    "build": "set NODE_OPTIONS=--openssl-legacy-provider & vue-cli-service build",
    小于17的
    "dev": "npm run serve",
    "build": "vue-cli-service build",