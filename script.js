let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let appliedPromoCode = null;

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartUI();
});

// Fetch product data
function loadProducts() {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts();
        })
        .catch(error => console.error('Error loading products:', error));
}

// Display products
function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>BDT ${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.product.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
}

// Update Cart UI
function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const discountDisplay = document.getElementById('cart-discount');
    const finalTotalDisplay = document.getElementById('cart-final-total');
    const promoMessage = document.getElementById('promo-message');

    cartItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.product.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <p>${item.product.name} - BDT ${item.product.price} x ${item.quantity}</p>
            <button onclick="updateQuantity(${item.product.id}, 'decrease')">-</button>
            <button onclick="updateQuantity(${item.product.id}, 'increase')">+</button>
            <button onclick="removeFromCart(${item.product.id})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });

    const discount = calculateDiscount(subtotal);
    const finalTotal = subtotal - discount;

    cartTotal.textContent = `Subtotal: BDT ${subtotal}`;
    discountDisplay.textContent = `Discount: BDT ${discount}`;
    finalTotalDisplay.textContent = `Final Total: BDT ${finalTotal}`;

    if (promoMessage) promoMessage.textContent = ''; // Clear promo messages on updates
}

function calculateDiscount(subtotal) {
    if (appliedPromoCode === 'ostad10') return subtotal * 0.10;
    if (appliedPromoCode === 'ostad5') return subtotal * 0.05;
    return 0;
}

// Update item quantity in cart
function updateQuantity(productId, action) {
    const cartItem = cart.find(item => item.product.id === productId);

    if (action === 'increase') {
        cartItem.quantity += 1;
    } else if (action === 'decrease' && cartItem.quantity > 1) {
        cartItem.quantity -= 1;
    } else if (action === 'decrease' && cartItem.quantity === 1) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    updateCartUI();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    saveCart();
    updateCartUI();
}

// Clear cart
function clearCart() {
    cart = [];
    appliedPromoCode = null;
    saveCart();
    updateCartUI();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Apply promo code
function applyPromoCode() {
    const promoInput = document.getElementById('promo-code').value.trim().toLowerCase();
    const promoMessage = document.getElementById('promo-message');

    if (appliedPromoCode) {
        promoMessage.textContent = 'A promo code is already applied!';
        promoMessage.style.color = 'red';
        return;
    }

    if (promoInput === 'ostad10' || promoInput === 'ostad5') {
        appliedPromoCode = promoInput;
        promoMessage.textContent = `Promo code "${promoInput}" applied successfully!`;
        promoMessage.style.color = 'green';
        updateCartUI();
    } else {
        promoMessage.textContent = 'Invalid promo code!';
        promoMessage.style.color = 'red';
    }
}

// Clear promo code
function clearPromoCode() {
    appliedPromoCode = null;
    document.getElementById('promo-message').textContent = '';
    updateCartUI();
}

// Event listeners
document.getElementById('clear-cart').addEventListener('click', clearCart);
document.getElementById('apply-promo').addEventListener('click', applyPromoCode);
