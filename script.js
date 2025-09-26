// 🛍️ Cart setup
let cartItems = [];
let cartCount = 0;

// 🧾 Example product data
const productData = {
  "1": { name: "Skeleton Hoody", price: 1500 },
  "2": { name: "Designer Jeans", price: 1200 },
  "3": { name: "Baseball Jersey", price: 1200 },
  "4": { name: "Pennywise", price: 1200 },
  "5": { name: "Baseball White", price: 1200 },
  "6": { name: "Baseball Jersey", price: 1200 },
  "7": { name: "Skeleton Hoody", price: 1500 },
  "8": { name: "Jeans", price: 1500 },
  "9": { name: "Cream Cargo", price: 1500 },
  "10": { name: "Cream Cargo", price: 1500 },
  "11": { name: "Cream Cargo", price: 1500 },
  "12": { name: "Cream Cargo", price: 1500 },
  "13": { name: "Cream Cargo", price: 1500 },
};

document.addEventListener('DOMContentLoaded', () => {
  trackUserLocation(); // ✅ Now this will run correctly

  // 🖥️ Fullscreen toggle
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  if (fullscreenBtn) {
    fullscreenBtn.onclick = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    };
  }

  // 🧾 Checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      fetch('http://localhost:8080/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartItems)
      })
      .then(res => res.json())
      .then(data => {
        alert('Order placed successfully!');
        cartItems = [];
        cartCount = 0;
        renderCart();
        updateCartCount();
      })
      .catch(err => alert('Error placing order.'));
    };
  }

  // 🧹 Clear cart button
  const clearCartBtn = document.getElementById('clear-cart-btn');
  if (clearCartBtn) {
    clearCartBtn.onclick = () => {
      cartItems = [];
      cartCount = 0;
      renderCart();
      updateCartCount();
    };
  }

  // 🔥 Ad section button
  const adBtn = document.querySelector('#ad-section .btn');
  if (adBtn) {
    adBtn.onclick = () => {
      alert('🔥 Sale activated! Use code EASTHOOD10 at checkout for 10% OFF.');
      document.querySelector('.products')?.scrollIntoView({ behavior: 'smooth' });
    };
  }

  // 🔐 Modal login/register
  const loginBtn = document.getElementById('login-register-btn');
  const loginModal = document.getElementById('login-modal');
  const closeModalBtn = document.getElementById('close-login-modal');

  if (loginBtn && loginModal) {
    loginBtn.onclick = () => loginModal.style.display = 'flex';
  }
  if (closeModalBtn && loginModal) {
    closeModalBtn.onclick = () => loginModal.style.display = 'none';
  }

  // 📝 Register form submission
  const loginForm = document.querySelector('#login-modal form');
  if (loginForm) {
    loginForm.onsubmit = function(e) {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;
      fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      .then(res => res.json())
      .then(data => {
        alert(data.message || 'Registered!');
        loginModal.style.display = 'none';
      })
      .catch(err => alert('Error registering!'));
    };
  }

  // 🛒 Initialize cart and fetch products
  renderCart();
  updateCartCount();
  getProducts();

  // 📍 Geolocation tracking
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      console.log(`📍 Location: Latitude ${lat}, Longitude ${lon}`);
    }, function(error) {
      console.error('❌ Geolocation error:', error.message);
    });
  }

  // 🌐 Network status
  console.log(navigator.onLine ? '✅ User is online' : '❌ User is offline');
});

// 🧾 Add product to cart
function addToCart(productId, productName) {
  const product = productData[productId] || { name: productName, price: "N/A" };
  cartItems.push({ id: productId, name: product.name, price: product.price });
  cartCount = cartItems.length;
  renderCart();
  updateCartCount();
}

// 🧾 Render cart items
function renderCart() {
  const cartItemsList = document.getElementById('cart-items');
  if (!cartItemsList) return;
  cartItemsList.innerHTML = '';
  let totalPrice = 0;

  cartItems.forEach((item, idx) => {
    const priceText = item.price !== undefined ? ` - <span style="color:#ff4c4c;">Ksh. ${item.price}</span>` : '';
    const itemElement = document.createElement('li');
    itemElement.innerHTML = `
      <span style="font-weight:600;color:#ff4c4c;">${item.name}</span>${priceText}
      <button onclick="removeCartItem(${idx})" style="background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer;padding:0 8px;">&#10005;</button>
    `;
    cartItemsList.appendChild(itemElement);
    if (!isNaN(item.price)) totalPrice += Number(item.price);
  });

  let totalPriceElem = document.getElementById('cart-total-price');
  if (!totalPriceElem) {
    totalPriceElem = document.createElement('div');
    totalPriceElem.id = 'cart-total-price';
    totalPriceElem.style = 'margin-top:12px;font-size:1.1rem;color:#ff4c4c;font-weight:600;text-align:center;';
    cartItemsList.parentNode.appendChild(totalPriceElem);
  }
  totalPriceElem.innerHTML = `Total: Ksh. ${totalPrice}`;
}

// 🧾 Remove item from cart
function removeCartItem(index) {
  cartItems.splice(index, 1);
  cartCount = cartItems.length;
  renderCart();
  updateCartCount();
}

// 🧾 Update cart count display
function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = `Cart (${cartCount})`;
  }
}

// 🛍️ Fetch products from backend
async function getProducts() {
  try {
    const response = await fetch('http://localhost:8080/products');
    const products = await response.json();
    console.log('Fetched products:', products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// 🧾 Order confirmation popup
function showOrderPopup(event) {
  event.preventDefault();
  const productId = event.target.dataset.productId;
  const productName = event.target.dataset.productName;
  const popupHTML = `
    <div id="popup-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:1000;">
      <div style="background-color:#232323;padding:24px 32px;border-radius:16px;box-shadow:0 4px 16px rgba(0,0,0,0.4);color:#222;min-width:260px;">
        <h3 style="color:#ff4c4c;margin-bottom:12px;">Confirm Order</h3>
        <p style="color:#222;font-size:1.1rem;">Order for: <span style="font-weight:600;">${productName}</span></p>
        <div style="margin-top:18px;display:flex;justify-content:space-between;">
          <button onclick="closePopup()" style="padding:8px 22px;border-radius:20px;border:none;background:#bbb;color:#222;font-weight:500;cursor:pointer;">Cancel</button>
          <button onclick="placeOrder('${productId}', '${productName}')" style="padding:8px 22px;border-radius:20px;border:none;background:#ff4c4c;color:#fff;font-weight:500;cursor:pointer;">Confirm</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', popupHTML);
}

// 🧾 Close popup
function closePopup() {
  const overlay = document.getElementById('popup-overlay');
  if (overlay) overlay.remove();
}

// Confirm order and add to cart
function placeOrder(productId, productName) {
  addToCart(productId, productName); // Add item to cart
  closePopup(); // Close the confirmation popup
}

// 🖥️ Fullscreen toggle functions
function activateFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen(); // Make the element go fullscreen
  }
}

function deactivateFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen(); // Exit fullscreen mode
  }
}

// 📍 Geolocation tracking (reusable function)
function trackUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // ✅ Call reverseGeocode with coordinates
      reverseGeocode(lat, lon);
    }, function(error) {
      console.error('Geolocation error:', error.message);
    });
  } else {
    console.log('Geolocation not supported.');
  }
}


// 🌐 Network status check
function checkNetworkStatus() {
  if (navigator.onLine) {
    console.log('✅ User is online');
  } else {
    console.log('❌ User is offline');
  }
}

// 🧪 Example fetch to external API (placeholder)
function fetchExternalData() {
  fetch('http://your-api-endpoint.com/data')
    .then(response => response.json())
    .then(data => {
      console.log('Fetched external data:', data);
      // You can update your UI with this data
    })
    .catch(error => console.error('Error fetching external data:', error));
}

// 🕒 Delayed action (example placeholder)
setTimeout(() => {
  console.log('⏳ Timeout triggered');
}, 3000); // Runs after 3 seconds

// 📍 Reverse geocoding using OpenCage API
function reverseGeocode(lat, lon) {
  const apiKey = '4872381e9f334cc79558b4bb48c43c0e'; // Your real key
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const location = data.results[0]?.formatted || 'Unknown location';

      // ✅ Show on banner
      const banner = document.getElementById('location-banner');
      if (banner) {
        banner.textContent = `📍 Welcome from ${location}`;
      }

      // ✅ Send to Flask backend
      fetch('http://127.0.0.1:8080/log-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: location,
          latitude: lat,
          longitude: lon
        })
      })
      .then(res => res.json())
      .then(data => console.log('📦 Location logged:', data.message))
      .catch(err => console.error('❌ Location log failed:', err));
    })
    .catch(err => console.error('❌ Reverse geocoding failed:', err));
}

// Ensure geolocation tracking runs after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  trackUserLocation();
});

// 🧾 Stripe Checkout integratio
fetch('http://127.0.0.1:5000/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cart: [
      { name: "Skeleton Hoody", price: 1500, quantity: 1 },
      { name: "Cream Cargo", price: 1500, quantity: 2 }
    ]
  })
})
.then(res => res.json())
.then(data => window.location.href = data.url)

//starts here

const cart = [
  { name: "Skeleton Hoody", price: 1500, quantity: 1 },
  { name: "Cream Cargo", price: 1500, quantity: 2 }
];

fetch('http://127.0.0.1:5000/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cart })
})
.then(res => res.json())
.then(data => {
  window.location.href = data.url; // Redirect to Stripe checkout
})
.catch(err => console.error('❌ Stripe session error:', err));


  // Render PayPal button after page loads
  window.onload = function() {
    paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: 'TOTAL_AMOUNT' // Replace with dynamic cart total
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          alert('Payment completed by ' + details.payer.name.given_name);
          // You can redirect or update order status here
        });
      }
    }).render('#paypal-button-container');
  };



