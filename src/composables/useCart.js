import { ref } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import CartService from '@/services/cartService';

export function useCart() {
    const cartStore = useCartStore();
    const items = ref(cartStore.items);

    const addItem = (product, quantity = 1) => {
        cartStore.addItem(product, quantity);
        items.value = cartStore.items;
    };

    const removeItem = (productId) => {
        cartStore.items = CartService.removeItem(cartStore.items, productId);
        items.value = cartStore.items;
    };

    const updateItemQuantity = (productId, quantity) => {
        cartStore.items = CartService.updateItemQuantity(cartStore.items, productId, quantity);
        items.value = cartStore.items;
    };

    const clearCart = () => {
        cartStore.items = CartService.clearCart();
        items.value = cartStore.items;
    };

    const getCart = () => {
        cartStore.items = CartService.getCart();
        items.value = cartStore.items;
    };

    return {
        items,
        totalPrice: cartStore.totalPrice,
        itemCount: cartStore.uniqueItemCount,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        getCart,
    };
}
