import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/login.vue';
import RegisterView from '../views/register.vue';
import UpdateUserView from '../views/updateUser.vue';
import TheWelcome from '../components/TheWelcome.vue';
import { useAuthStore } from '../stores/authStore';
//endpointy sklepu zamówień trzeba zroutować!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const routes = [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/home', name: 'home', component: TheWelcome },
    {
        path: '/update-profile',
        name: 'update-profile',
        component: UpdateUserView,
        meta: { requiresAuth: true }
    },
    { path: '/:pathMatch(.*)*', redirect: '/home' }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (to.meta.requiresAuth) {
        if (accessToken) {
            next();
        } else if (refreshToken) {
            try {
                await authStore.refreshToken();
                next();
            } catch (error) {
                console.error('Token refresh failed, redirecting to login:', error);
                next({ name: 'login' });
            }
        } else {
            next({ name: 'login' });
        }
    }  else {
        next();
    }
});

export default router;