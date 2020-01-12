import Vue from 'vue'
import Router from 'vue-router'

//首页
import Home from '@/components/Home'
//用户认证
import Register from '@/components/Auth/Register'
import Login from '@/components/Auth/Login'
//用户个人主页
import User from '@/components/Profile/User'
import Followers from '@/components/Profile/Followers'
import Following from '@/components/Profile/Following'
import Overview from '@/components/Profile/Overview'
import Posts from '@/components/Profile/Posts'

//用户个人设置
import Settings from '@/components/Settings/Settings'
import Profile from '@/components/Settings/Profile'
import Account from '@/components/Settings/Account'
import Email from '@/components/Settings/Email'
import Notiffication from '@/components/Settings/Notiffication'

//用户资源

//用户通知
import FollowingPosts from '@/components/Notifications/FollowingPosts'
import Likes from '@/components/Notifications/Likes'
import Notifications from '@/components/Notifications/Notifications'
import RecivedComments from '@/components/Notifications/RecivedComments'
import RecivedMessages from '@/components/Notifications/RecivedMessages'

//博客详情页
import PostDetail from '@/components//PostDetail'

//ping
import Ping from '@/components/Ping'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/ping',
      name: 'Ping',
      component: Ping
    },{
      path:'/user/:id',
      children:[
        {path:'',component:Overview},
        {path: 'overview', name: 'UserOverview', component: Overview },
        {path:'followers',name:'UserFollowers',component:Followers},
        {path:'following',name:'UserFollowing',component:Following},
        {path:'posts',name:'Posts',component:Posts}
      ],
      component:User,
      meta:{
        requiresAuth:true
      }
    },{
      path:'/post/:id',
      name:'PostDetail',
      component:PostDetail
    },{
      path:'/settings',
      component:Settings,
      children:[
        {path:'',component:Profile},
        {path:'profile',name:'SettingProfile',component:Profile},
        {path:'account',name:'SettingAccount',component:Account},
        {path:'email',name:'SettingEmail',component:Email},
        {path:'notiffication',name:'SettingNotiffication',component:Notiffication}
      ]
    },{
      path:'/notifications',
      component:Notifications,
      children:[
        {path:'',component:RecivedComments},
        {path:'comments',name:'RecivedComments',component:RecivedComments},
        {path:'messages',name:'RecivedMessages',component:RecivedMessages},
        {path:'follows',name:'Follows',component:Followers},
        { path: 'likes', name: 'Likes', component: Likes },
        { path: 'following-posts', name: 'FollowingPosts', component: FollowingPosts }
      ],
      meta:{
        requiresAuth:true
      }
    }

  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.length===0){
    Vue.toasted.error("未匹配路由...")
    router.back()
    return;
  }
  const token = window.localStorage.getItem('madblog-token')
  //（？）some如何理解？
  //  es6的some方法，有一个true则返回true。相应的every方法，全部true才返回true
  //  这里的record表示matched数组的项
  //  用法详见路由守卫 -> 路由元信息
  //（？）if条件怎么理解？
  //  meta信息定义在路由中：path:'/'
  // 
  //（？）为什么要跳转到一个带查询参数的url？
  //  初步理解是记录登录前的url，登陆之后根据这个url跳转到登录前的界面
  if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (token && to.name == 'Login') {
    // 用户已登录，但又去访问登录页面时不让他过去
    // next({
    //   path: from.fullPath
    // })
    next(false)
  } else {
    //放行
    next()
  }
})

export default router