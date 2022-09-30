import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },



  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '查找', icon: 'dashboard', keepAlive: true  }
    }]
  },

  {
    path: '/create',
    component: Layout,
    children: [
      {
        path: 'create',
        name: 'create',
        component: () => import('@/views/create/index'),
        meta: { title: '建表', icon: 'el-icon-s-help' },
      }
    ],
  },

  {
    path: '/example',
    component: Layout,
    children: [
      {
        path: 'publish',
        name: 'Example',
        component: () => import('@/views/information/index'),
        meta: { title: '上传', icon: 'el-icon-s-help' },
      }
    ],
    hidden: true
  },

  {
    path: '/auto',
    component: Layout,
    children: [
      {
        path: 'auto',
        name: 'auto',
        component: () => import('@/views/auto/index'),
        meta: { title: '上传', icon: 'el-icon-s-help' },
      }
    ],
    hidden: true
  },

  {
    path: '/mapping',
    component: Layout,
    children: [
      {
        path: 'information',
        name: 'Mapping',
        component: () => import('@/views/mapping/index'),
        meta: { title: '映射', icon: 'el-icon-s-order', keepAlive: true }
      }
    ],
    hidden: true
  },

  {
    path: '/translate',
    component: Layout,
    children: [
      {
        path: 'information',
        name: 'Translate',
        component: () => import('@/views/translate/index'),
        meta: { title: '数据转换', icon: 'el-icon-s-order', keepAlive: true }
      }
    ],
    hidden: true
  },


  {
    path: '/save',
    component: Layout,
    children: [
      {
        path: 'information',
        name: 'Save',
        component: () => import('@/views/save/index'),
        meta: { title: '保存', icon: 'el-icon-s-management' }
      }
    ],
    hidden: true
  },


  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'information',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'el-icon-s-management' }
      }
    ]
  },
  {
    path: '/hosAuthority',
    component: Layout,
    children: [
      {
        path: 'information',
        name: 'HosAuthority',
        component: () => import('@/views/authority/index_hosAdmin'),
        meta: { title: '医院管理员权限管理', icon: 'el-icon-s-management' }
      }
    ]
  },
  {
    path: '/userAuthority',
    component: Layout,
    children: [
      {
        path: 'information',
        name: 'UserAuthority',
        component: () => import('@/views/authority/index_user'),
        meta: { title: '用户权限管理', icon: 'el-icon-s-management' }
      }
    ],
    hidden: true
  },
  {
    path: '/adminAuthority',
    component: Layout,
    children: [
      {
        path: 'information',
        name: 'AdminAuthority',
        component: () => import('@/views/authority/index_admin'),
        meta: { title: '超级管理员权限管理', icon: 'el-icon-s-management' }
      }
    ]
  },
  {
    path: '/userblank',
    component: Layout,
    children: [
      {
        path: 'information',
        name: 'Userblank',
        component: () => import('@/views/user/blank'),
      }
    ]
  },
  {
    path: '/authblank',
    component: Layout,
    children: [
      {
        path: 'information',
        name: 'Authblank',
        component: () => import('@/views/authority/blank'),
      }
    ]
  },


  // {
  //   path: '/replacing',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'information',
  //       name: 'Replacing',
  //       component: () => import('@/views/replacing/index'),
  //       meta: { title: '替换源值', icon: 'el-icon-s-management' }
  //     }
  //   ]
  // },

  // {
  //   path: '/test',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'information',
  //       name: 'Test',
  //       component: () => import('@/views/test/index'),
  //       meta: { title: '测试', icon: 'el-icon-s-management' }
  //     }
  //   ]
  // },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'information',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '个人信息', icon: 'form' }
      }
    ]
  },



  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
