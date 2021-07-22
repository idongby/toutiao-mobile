import Vue from 'vue'
// 初始化 dayjs 相关配置
import dayjs from 'dayjs'

// 配置使用中文语言包
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间
dayjs.extend(relativeTime)


// 把处理相对时间的代码包装为全局过滤器
// 然后就可以再任何组件的模块中使用了
// 所谓的过滤器其实就是一个可以再模板中调用的函数而已。
// 在组件的模板中使用过滤器：{{xxx | relativeTime}}
// 管道符前面的内容会作为参数传递给过滤器函数
// 过滤器的返回值会渲染到使用过滤器的模板中
Vue.filter('relativeTime',value=>{
    return dayjs(value).from(dayjs())
})

// 例如日期格式化
dayjs().format('YYYY-MM-DD')