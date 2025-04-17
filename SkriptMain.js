document.querySelector('.menu-toggle').addEventListener('click', function() {
  const menu = document.querySelector('.menu');
  menu.classList.toggle('active');
});


document.addEventListener('DOMContentLoaded', function() {
  const carouselInner = document.querySelector('.carousel-inner');
  const images = document.querySelectorAll('.carousel-inner img');
  const prevBtn = document.querySelector('.carousel .prev');
  const nextBtn = document.querySelector('.carousel .next');
  
  let currentIndex = 0;
  const totalImages = images.length;
  let intervalId;
  const intervalTime = 5000; // 3 секунди
  
  // Функція для переміщення каруселі
  function moveToIndex(index) {
      if (index >= totalImages) {
          currentIndex = 0;
      } else if (index < 0) {
          currentIndex = totalImages - 1;
      } else {
          currentIndex = index;
      }
      
      carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
  }
  
  // Функція для автоматичної прокрутки
  function startAutoScroll() {
      intervalId = setInterval(() => {
          moveToIndex(currentIndex + 1);
      }, intervalTime);
  }
  
  // Запускаємо автоматичну прокрутку
  startAutoScroll();
  
  // Обробники кнопок
  nextBtn.addEventListener('click', () => {
      clearInterval(intervalId);
      moveToIndex(currentIndex + 1);
      startAutoScroll();
  });
  
  prevBtn.addEventListener('click', () => {
      clearInterval(intervalId);
      moveToIndex(currentIndex - 1);
      startAutoScroll();
  });
  
  // Пауза при наведенні
  carouselInner.addEventListener('mouseenter', () => {
      clearInterval(intervalId);
  });
  
  // Продовження при відведенні курсору
  carouselInner.addEventListener('mouseleave', startAutoScroll);
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
          
      });
  });

  
  updateCartCount();
});

