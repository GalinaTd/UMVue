import Vue from 'vue'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from './App.vue'
import vmodal from 'vue-js-modal'
import router from './router'

Vue.use(vmodal)

Vue.config.productionTip = false

new Vue({
  router, 
  render: h => h(App),
}).$mount('#app')
