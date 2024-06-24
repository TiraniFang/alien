import { createRouter, createWebHashHistory  } from 'vue-router'
// import Header from '../components/header.vue'

const routes = [
      {
        path: '/',
        name: 'login',
        redirect: '/login',
        component: () => import(/* webpackChunkName: "/" */ '../views/login/index.vue'),
        // beforeRouteEnter: (to, from, next) => {
        //   console.log(to)
        //     if (localStorage.getItem('loginStatus')) {
        //       next()
        //     } else {
        //       next({path: '/login'})
        //     }
        //   }
      },
      {
        path: '/home',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '../views/home/index.vue'),
        meta: {
          keepalive: true
        },
        beforeRouteEnter: (to, from, next) => {
          console.log(to)
            if (localStorage.getItem('loginStatus')) {
              next()
            } else {
              next({path: '/login'})
            }
        }
      },
      {
        path: '/gift',
        name: 'Gift',
        meta: {
          keepalive: true
        },
        component: () => import(/* webpackChunkName: "gift" */ '../views/gift/index.vue')
      },{
        path: '/match',
        name: 'Match',
        meta: {
          keepalive: true
        },
        component: () => import(/* webpackChunkName: "match" */ '../views/match/index.vue')
      },{
        path: '/shop',
        name: 'Shop',
        meta: {
          keepalive: true
        },
        component: () => import(/* webpackChunkName: "shop" */ '../views/shop/index.vue')
      },{
        path: '/user',
        name: 'User',
        meta: {
          keepalive: true
        },
        component: () => import(/* webpackChunkName: "user" */ '../views/user/index.vue')
      },

  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '../views/login/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})



export default router
