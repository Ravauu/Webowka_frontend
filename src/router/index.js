import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegiserView.vue';
import UpdateUserView from '../views/UpdateUserView.vue';
import TheWelcome from '../components/TheWelcome.vue';
import { useAuthStore } from '../stores/authStore';
import OrderView from "@/views/OrderView.vue";

// Import the CategoryView and CartView
const CategoryView = () => import('../views/CategoryView.vue');
const CartView = () => import('../views/CartView.vue');  // Import CartView

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
    // New route for categories
    {
        path: '/category/:category',
        name: 'category',
        component: CategoryView,
    },
    // Protected route for CartView
    {
        path: '/cart',
        name: 'cart',
        component: CartView,
        meta: { requiresAuth: true }  // Add protection for CartView
    },
    {
        path: '/orders',
        name: 'orders',
        component: OrderView,
        meta: {requiresAuth: true}
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
            next();  // User is authenticated, allow access
        } else if (refreshToken) {
            try {
                await authStore.refreshToken();
                next();  // Successfully refreshed, proceed
            } catch (error) {
                console.error('Token refresh failed, redirecting to login:', error);
                next({ name: 'login' });  // Redirect to login if token refresh fails
            }
        } else {
            next({ name: 'login' });  // No token, redirect to login
        }
    } else {
        // If not a protected route, check if user is logged in and redirect accordingly
        if (accessToken && (to.name === 'login' || to.name === 'register')) {
            next({ name: 'home' });  // Redirect to home if already logged in
        } else {
            next();  // Proceed to route
        }
    }
});

export default router;
