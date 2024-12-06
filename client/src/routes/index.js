import { createRouter, createWebHistory } from 'vue-router'
import { checkProtectedRoute } from '@/utils/auth.js'

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
            children: [
                {
                    path: 'pvp',
                    name: 'pvpchess',
                    component: () => import('@/components/Chess/PVP.vue')
                },
                {
                    path: 'pve',
                    name: 'pvechess',
                    component: () => import('@/components/Chess/Index.vue')
                }
            ]
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
            component: () => import('@/components/Chess/Training.vue')
        },
        {
            path: '/learning',
            name: 'learning',
            component: () => import('@/components/Chess/TrainSetup.vue')
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('@/pages/Profile.vue')
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
    },
})

router.beforeEach(async (to, from, next) => {
    const isProtected = await checkProtectedRoute('http://localhost:3000');

    if (isProtected || to.path === '/login' || to.path === '/signup' || to.path === '/') {
        next();
    } else {
        next({ name: 'login', query: { message: 'Hãy đăng nhập để sử dụng chức năng này!', target: to.path } });
    }
});

export default router
