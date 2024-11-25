import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/pages/Home.vue')
        },
        {
            path: '/chess',
            name: 'chess',
            component: () => import('@/components/Chess/Index.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/pages/Login.vue')
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('@/pages/Signup.vue')
        },
        {
            path: '/training',
            name: 'training',
            component: () => import('@/components/Chess/Index.vue')
        },
        {
            path: '/learning',
            name: 'learning',
            component: () => import('@/components/Chess/Index.vue')
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('@/components/Chess/Index.vue')
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            };
        }
        return { top: 0 };
    }
})

export default router
