document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items');
    const orderForm = document.getElementById('order-form');
    const totalPriceElement = document.getElementById('total-price');
    const cartCount = document.getElementById('cart-count');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartCount() {
        cartCount.textContent = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    }

    function calculateTotal() {
        const total = cart.reduce((sum, item) => {
            return sum + (item.price * (item.weight || 1));
        }, 0);
        totalPriceElement.textContent = total.toFixed(2);
        return total;
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Ваш кошик порожній</p>';
            return;
        }

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.price} ₴/кг</div>
                    <div class="cart-item-weight">
                        <label>Вага (кг):</label>
                        <input type="number" min="0.1" step="0.1" value="${item.weight || 1}" 
                               class="weight-input" data-index="${index}">
                    </div>
                    <div class="cart-item-subtotal">${(item.price * (item.weight || 1)).toFixed(2)} ₴</div>
                </div>
                <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(button.getAttribute('data-index'));
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartItems();
                updateCartCount();
            });
        });

        document.querySelectorAll('.weight-input').forEach(input => {
            input.addEventListener('change', function () {
                const index = parseInt(this.getAttribute('data-index'));
                const newWeight = parseFloat(this.value);
                
                if (newWeight > 0) {
                    cart[index].weight = newWeight;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCartItems();
                    updateCartCount();
                } else {
                    this.value = cart[index].weight || 1;
                }
            });
        });

        calculateTotal();
    }

    orderForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (cart.length === 0) {
            alert('Кошик порожній! Додайте товари перед оформленням замовлення.');
            return;
        }

        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            comments: document.getElementById('comments').value,
            items: cart,
            total: calculateTotal(),
            date: new Date().toISOString(),
            status: 'Нове'
        };

        // Відправка даних на сервер
        fetch('save_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Замовлення успішно оформлено! Номер вашого замовлення: ' + data.order_id);
                
                // Очистка кошика
                cart = [];
                localStorage.removeItem('cart');
                renderCartItems();
                updateCartCount();
                orderForm.reset();
            } else {
                alert('Помилка при оформленні замовлення: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Помилка:', error);
            alert('Сталася помилка при відправці замовлення');
        });
    });

    renderCartItems();
    updateCartCount();
});