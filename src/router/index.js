import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../views/login'
// const Login = () => import('@/views/login')

Vue.use(VueRouter)

// 路由表
const routes = [
    {
        path:'/login',
        name:'login',
        component: () => import('@/views/login/')
    },
    {
        path:'/',
        component: () => import('@/views/layout/'),
        children:[
            {
                path:'', //默认子路由
                name:'home',
                component: () => import('@/views/home/')
            },
            {
                path:'/qa', 
                name:'qa',
                component: () => import('@/views/qa/')
            },
            {
                path:'/video', 
                name:'video',
                component: () => import('@/views/video/')
            },
            {
                path:'/my', 
                name:'my',
                component: () => import('@/views/my/')
            },
        ]
    },
    {
        path:'/search',
        name:'search',
        component: () => import('@/views/search')
    },
    {
        path:'/article/:articleId',
        name:'article',
        component: () => import('@/views/acticle'),
        // 将动态路由参数映射到组件的props中，
        // 无论是访问还是维护都很方便
        props:true
    }
]

const router = new VueRouter({
    routes
})

export default router