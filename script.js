// products.js: Manage fetching and displaying products
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

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

// cart.js: Handle cart operations
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

function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    saveCart();
    updateCartUI();
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
}

// ui.js: Handle UI updates
function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';

    let total = 0;

    cart.forEach(item => {
        total += item.product.price * item.quantity;

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

    cartTotal.textContent = `Total: BDT ${total}`;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Clear Cart Button
document.getElementById('clear-cart').addEventListener('click', clearCart);

// Checkout Button
document.getElementById('checkout').addEventListener('click', () => {
    alert('Proceeding to Checkout...');
});
