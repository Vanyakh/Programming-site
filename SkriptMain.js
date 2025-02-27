document.querySelector('.menu-toggle').addEventListener('click', function() {
  const menu = document.querySelector('.menu');
  menu.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', function () {
  const cartCount = document.getElementById('cart-count');
  const buyButtons = document.querySelectorAll('.buy-button');

  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  
  function updateCartCount() {
      cartCount.textContent = cart.length;
  }

  
  buyButtons.forEach(button => {
      button.addEventListener('click', function (event) {
          event.preventDefault();

          const product = {
              id: button.getAttribute('data-id'),
              title: button.getAttribute('data-title'),
              price: button.getAttribute('data-price'),
              image: button.getAttribute('data-image'),
          };

          
          cart.push(product);
          localStorage.setItem('cart', JSON.stringify(cart));

          
          updateCartCount();
          alert('Товар додано до кошика!');
      });
  });

  
  updateCartCount();
});