document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items');
    const orderForm = document.getElementById('order-form');

   
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">₴${item.price}</div>
                </div>
                <button class="remove-item" data-index="${index}">Видалити</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(button.getAttribute('data-index'));
                cart.splice(index, 1); 
                localStorage.setItem('cart', JSON.stringify(cart)); 
                renderCartItems(); 
            });
        });
    }

    
    orderForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;

        if (cart.length === 0) {
            alert('Кошик порожній! Додайте товари перед оформленням замовлення.');
            return;
        }

        
        const orderData = {
            items: cart,
            customer: { name, phone, email, address },
        };

        console.log('Замовлення оформлено:', orderData);
        alert('Замовлення успішно оформлено! Дякуємо за покупку.');

       
        cart = [];
        localStorage.removeItem('cart');
        renderCartItems();
        orderForm.reset();
    });

   
    renderCartItems();
});

document.addEventListener('DOMContentLoaded', function () {
    const cartCount = document.getElementById('cart-count');

    // Отримання кошика з localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Оновлення лічильника товарів у кошику
    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    // Викликаємо функцію для оновлення лічильника при завантаженні сторінки
    updateCartCount();
});