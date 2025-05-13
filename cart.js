document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    renderCartItems();
    
    // Render cart items
    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const totalPriceElement = document.getElementById('total-price');
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center py-5">
                    <p class="text-muted">Ваш кошик порожній</p>
                    <a href="more-products.html" class="btn btn-primary">Продовжити покупки</a>
                </div>
            `;
            totalPriceElement.textContent = '0';
            return;
        }
        
        let totalPrice = 0;
        let itemsHTML = '';
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            itemsHTML += `
                <div class="cart-item row align-items-center">
                    <div class="col-3 col-md-2">
                        <img src="${item.image}" alt="${item.title}" class="img-fluid rounded">
                    </div>
                    <div class="col-5 col-md-6">
                        <h5>${item.title}</h5>
                        <p class="mb-0">${item.price} ₴</p>
                    </div>
                    <div class="col-2">
                        <input type="number" min="1" value="${item.quantity}" 
                               class="form-control quantity-input" data-id="${item.id}">
                    </div>
                    <div class="col-2 text-end">
                        <span class="item-total">${itemTotal.toFixed(2)} ₴</span>
                        <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = itemsHTML;
        totalPriceElement.textContent = totalPrice.toFixed(2);
        
        // Add event listeners for quantity changes
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const productId = this.getAttribute('data-id');
                const newQuantity = parseInt(this.value);
                
                if (newQuantity > 0) {
                    const item = cart.find(item => item.id === productId);
                    if (item) {
                        item.quantity = newQuantity;
                        localStorage.setItem('cart', JSON.stringify(cart));
                        renderCartItems();
                    }
                } else {
                    this.value = 1;
                }
            });
        });
        
        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                cart = cart.filter(item => item.id !== productId);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartItems();
                updateCartCount();
            });
        });
    }
    
    // Update cart count in navbar
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('#cart-count').forEach(el => {
            el.textContent = count;
        });
    }
    
    // Form submission
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (cart.length === 0) {
                alert('Ваш кошик порожній!');
                return;
            }
            
            // Here you would typically send the order to your server
            alert('Замовлення успішно оформлено! Дякуємо за покупку!');
            
            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
            updateCartCount();
            
            // Reset form
            this.reset();
        });
    }
});