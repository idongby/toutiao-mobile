import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant';
import store from '@/store/'
// import Login from '../views/login'
// const Login = () => import('@/views/login')

Vue.use(VueRouter)

// 路由表
const routes = [
    {
        path:'/login',
        name:'login',
        component: () => import('@/views/login/'),
        meta:{requiresAuth:false} //添加额外的自定义数据
    },
    {
        path:'/',
        component: () => import('@/views/layout/'),
        children:[
            {
                path:'', //默认子路由
                name:'home',
                component: () => import('@/views/home/'),
                meta:{requiresAuth:false} //添加额外的自定义数据
            },
            {
                path:'/qa', 
                name:'qa',
                component: () => import('@/views/qa/'),
                meta:{requiresAuth:false} //添加额外的自定义数据
            },
            {
                path:'/video', 
                name:'video',
                component: () => import('@/views/video/'),
                meta:{requiresAuth:false} //添加额外的自定义数据
            },
            {
                path:'/my', 
                name:'my',
                component: () => import('@/views/my/'),
                meta:{requiresAuth:false} //添加额外的自定义数据
            },
        ]
    },
    {
        path:'/search',
        name:'search',
        component: () => import('@/views/search'),
        meta:{requiresAuth:false} //添加额外的自定义数据
    },
    {
        path:'/article/:articleId',
        name:'article',
        component: () => import('@/views/acticle'),
        // 将动态路由参数映射到组件的props中，
        // 无论是访问还是维护都很方便
        props:true,
        meta:{requiresAuth:false} //添加额外的自定义数据
    },
    {
        path:'/user/profile',
        name:'user-profile',
        component:() => import('@/views/user-profile'),
        meta:{requiresAuth:false} //添加额外的自定义数据
    },
    {
        path:'/user/chat',
        name:'user-chat',
        component:() => import('@/views/user-chat'),
        meta:{requiresAuth:true} //添加额外的自定义数据
    },
]

const router = new VueRouter({
    routes
})

// to：要访问的页面信息
// from：来自哪个页面的路由信息
// next：放行的标记信息
router.beforeEach((to,from,next) =>{
// 校验登录状态，提示用户
    if(to.meta.requiresAuth){
        if(store.state.user){
            // 如果已经登录，直接通过
            return next()
        }
        // 如果没有登录，提示是否登录
        Dialog.confirm({
            title:'访问提示',
            message:'该功能需要登录才能访问，确定登录嘛？'
        }).then(()=>{ //确定执行这里
            router.replace({
                name:'login',
                query:{
                    redirect:router.currentRoute.fullPath
                }
            })
        }).catch(()=>{//取消执行这里
            // 取消了，中断路由导航
            next(false)
        })
    }else{
        // 不需要登录状态的页面，直接过去
        next()
    }
})
export default router