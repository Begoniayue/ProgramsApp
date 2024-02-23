import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'taro-ui/dist/style/index.scss'
/*全局样式文件 目前用不到*/
import '@nutui/nutui-taro/dist/style.css'


const App = createApp({
  onShow(options) {
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

App.use(createPinia())

export default App
