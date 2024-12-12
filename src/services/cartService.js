class CartService {
    // Pobierz stan koszyka z localStorage
    getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    // Zaktualizuj stan koszyka w localStorage
    updateCart(cartItems) {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    // Dodaj produkt do koszyka
    addItem(cartItems, product) {
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity++;
                existingItem.totalPrice = existingItem.quantity * existingItem.price;
            } else {
                console.warn(`Nie można dodać więcej produktów. Dostępne: ${product.stock}`);
            }
        } else {
            cartItems.push({
                ...product,
                quantity: 1,
                totalPrice: product.price,
            });
        }
        this.updateCart(cartItems);
        return cartItems;
    }

    // Usuń produkt z koszyka
    removeItem(cartItems, productId) {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        this.updateCart(updatedCart);
        return updatedCart;
    }

    // Zaktualizuj ilość produktu w koszyku
    updateItemQuantity(cartItems, productId, quantity) {
        const item = cartItems.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                return this.removeItem(cartItems, productId);
            } else if (quantity <= item.stock) {
                item.quantity = quantity;
                item.totalPrice = item.quantity * item.price;
                this.updateCart(cartItems);
            } else {
                console.warn(`Nie można ustawić ilości powyżej dostępnego stanu magazynowego: ${item.stock}`);
            }
        }
        return cartItems;
    }

    // Wyczyść koszyk
    clearCart() {
        this.updateCart([]);
        return [];
    }
}

export default new CartService();
