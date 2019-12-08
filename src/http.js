import Vue from 'vue'
import axios from 'axios'
import store from './store'
import router from './router'
axios.defaults.timeout = 5000
axios.defaults.baseURL = 'http://localhost:5000/api'

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    
    const token = window.localStorage.getItem('madblog-token')
    console.log('request ok..'+token)
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }, function (error) {
      console.log('request error...')
    // Do something with request error
    return Promise.reject(error)
  })

axios.interceptors.response.use(function(response){
    console.log('response ok...')
    return response
},function(error){
    console.log('response error...'+error.response.status)
    switch (error.response.status){
        case 401:
            store.logoutAction()
            Vue.toasted.error('401:Authorization error')
            if (router.currentRoute.path !=='/login'){
                
                router.replace({
                    path:'/login',
                    query:{redirect: router.currentRoute.path}
                })
            }
            break;
        case 404:
            Vue.toasted.error('404:NOT FOUND')
            router.back()
            break;
    }
    return Promise.reject(error)
})

export default axios