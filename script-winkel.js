// Gereserveerd voor toekomstige winkelinteractie.
// Deze template gebruikt alleen HTML en CSS; er wordt geen JavaScript uitgevoerd.
const buyButton1 = document.getElementById('buy-button1');
const buyButton2 = document.getElementById('buy-button2');
const buyButton3 = document.getElementById('buy-button3');
const buyButton4 = document.getElementById('buy-button4');
const buyButton5 = document.getElementById('buy-button5');
const buyButton6 = document.getElementById('buy-button6');

buyButton1.addEventListener('click', function() {
  const product = {
    name: "Elsa's Shampoo",
    price: '€16.95',
    image: 'images/shampoo.png',
    description: "Elsa's luxe shampoo voor zorgvuldige haarverzorging.",
    id: 1
  }
  sessionStorage.setItem('product', JSON.stringify(product));
  window.location.href = 'index2.html';
});

buyButton2.addEventListener('click', function() {
  const product = {
    name: "Elsa's creme",
    price: '€19.95',
    image: 'images/gezichstcreme.png',
    description: "Een luxe gezichtscreme. Gezond voor huid en haar.",
    id: 2
  }
  sessionStorage.setItem('product', JSON.stringify(product));
  window.location.href = 'index2.html';
});

buyButton3.addEventListener('click', function() {
  const product = {
    name: "Elsa's Styling Gel",
    price: '€15.95',
    image: 'images/stylinggel.png',
    description: "Een krachtige styling gel voor langdurige hold.",
    id: 3
  }
  sessionStorage.setItem('product', JSON.stringify(product));
  window.location.href = 'index2.html';
});

buyButton4.addEventListener('click', function() {
  const product = {
    name: "Haarolie",
    price: '€14.95',
    image: 'images/haarolie.png',
    description: "Voedt en versterkt het haar met natuurlijke oliën.",
    id: 4
  }
  sessionStorage.setItem('product', JSON.stringify(product));
  window.location.href = 'index2.html';
});

buyButton5.addEventListener('click', function() {
  const product = {
    name: "Elsa's Baardolie",
    price: '€16.95',
    image: 'images/baardolie.png',
    description: "Elsa's luxe baardolie voor zorgvuldige baardverzorging.",
    id: 5
  }
  sessionStorage.setItem('product', JSON.stringify(product));
  window.location.href = 'index2.html';
});

buyButton6.addEventListener('click', function() {
  const product = {
    name: "Elsa's Haarlak",
    price: '€17.95',
    image: 'images/haarlak.png',
    description: "Elsa's luxe haarlak voor goed verzorgd haar.",
    id: 6
  }
  sessionStorage.setItem('product', JSON.stringify(product));
  window.location.href = 'index2.html';
});
