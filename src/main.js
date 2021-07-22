import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

// 加载Vant 组件库
import Vant from 'vant'

// 加载Vant组件库样式
import 'vant/lib/index.css'

// 加载全局样式(最好放在最后，方便覆盖第三方样式)
import './style/index.less'

// 进入 dayjs
import './utils/dayjs'

// 全局注册 Vant 中的组件
Vue.use(Vant)

// 自动设置 REM 基准值（html标签字体大小）
import 'amfe-flexible'

Vue.config.productionTip = false

// 创建Vue根实例，将 router、store配置到根实例中
// 把app跟组件渲染到#app节点
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
