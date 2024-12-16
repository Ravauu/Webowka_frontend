import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegiserView.vue';
import UpdateUserView from '../views/UpdateUserView.vue';
import TheWelcome from '../components/TheWelcome.vue';
import { useAuthStore } from '../stores/authStore';
import OrderView from "@/views/OrderView.vue";
import AdminPanelView from "@/views/AdminPanelView.vue"; // Import Admin Panel View

// Import the CategoryView and CartView
const CategoryView = () => import('../views/CategoryView.vue');
const CartView = () => import('../views/CartView.vue');

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
    {
        path: '/category/:category',
        name: 'category',
        component: CategoryView,
    },
    {
        path: '/cart',
        name: 'cart',
        component: CartView,
        meta: { requiresAuth: true }
    },
    {
        path: '/orders',
        name: 'orders',
        component: OrderView,
        meta: { requiresAuth: true }
    },
    {
        path: '/admin',
        name: 'admin',
        component: AdminPanelView,
        meta: { requiresAuth: true, requiresAdmin: true } // Meta dla admina
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
            if (to.meta.requiresAdmin && !authStore.isAdmin) {
                return next({ name: 'home' }); // Brak dostępu, przekierowanie
            }
            return next(); // Użytkownik ma dostęp
        } else if (refreshToken) {
            try {
                await authStore.refreshToken();
                if (to.meta.requiresAdmin && !authStore.isAdmin) {
                    return next({ name: 'home' }); // Brak dostępu po odświeżeniu tokena
                }
                return next(); // Sukces
            } catch (error) {
                console.error('Token refresh failed, redirecting to login:', error);
                return next({ name: 'login' });
            }
        } else {
            return next({ name: 'login' }); // Brak tokena, przekierowanie do logowania
        }
    } else {
        if (accessToken && (to.name === 'login' || to.name === 'register')) {
            return next({ name: 'home' });
        }
        return next();
    }
});

export default router;