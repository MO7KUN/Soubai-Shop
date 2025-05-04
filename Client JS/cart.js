
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let productsData = [];

async function initializeCart() {
    try {
        // Get product IDs from cart
        const productIds = cart.map(item => item.id);
        console.log(productIds)

        if (productIds.length === 0) {
            renderEmptyCart();
            return;
        }

        // Fetch product details
        const response = await fetch('https://sbaishop.com/api/website/getCartProdcuts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_ids: productIds })
        });

        if (!response.ok) throw new Error('Failed to fetch products');

        productsData = await response.json();

        // Merge product data with cart quantities
        const mergedCart = cart.map(cartItem => {
            const product = productsData.find(p => p.id === cartItem.id);
            return {
                ...cartItem,
                ...product,
                price: product.discount_price || product.selling_price
            };
        });

        renderCartItems(mergedCart);
        updateCartTotals(mergedCart);
        updateCartCount(mergedCart);
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'خطأ!',
            text: 'تعذر تحميل محتويات السلة',
            icon: 'error',
            confirmButtonText: 'حسناً'
        });
    }
}

async function renderCartItems(mergedCart) {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';

    mergedCart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item bg-white p-4 rounded-lg shadow-sm relative';
        itemElement.dataset.id = item.id;
        itemElement.innerHTML = `
                <button class="remove-item text-gray-400 hover:text-red-500 hover:bg-red-200 bg-transpraent rounded-full px-1.5 py-1 absolute top-2 left-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div class="flex flex-col md:flex-row md:items-center">
                    <div class="flex items-start md:w-1/2 mb-2 md:mb-0">
                        <div class="flex items-center">
                            <img src="${item.image_url}" alt="${item.label}" class="w-20 h-20 object-cover rounded-md">
                            <div class="mr-4">
                                <h3 class="font-medium">${item.label}</h3>
                                ${item.category ? `<p class="text-sm text-gray-500">${item.category.label}</p>` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div class="md:w-1/6 mb-2 md:mb-0 text-center">
                        ${item.discount_price ?
                `<div>
                                <span class="font-medium text-primary item-price" data-price="${item.price}">${item.price.toFixed(2)} درهم</span>
                                <span class="text-gray-500 text-sm line-through block">${item.selling_price.toFixed(2)} درهم</span>
                            </div>` :
                `<span class="font-medium text-primary item-price" data-price="${item.price}">${item.price.toFixed(2)} درهم</span>`
            }
                    </div>
                    <div class="md:w-1/6 mb-2 md:mb-0 flex justify-center">
                        <div class="flex items-center border border-gray-200 rounded-md">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" value="${item.quantity}" min="0" max="99" class="quantity-input">
                            <button class="quantity-btn plus">+</button>
                        </div>
                    </div>
                    <div class="md:w-1/6 text-center">
                        <span class="font-medium text-primary item-total">${(item.price * item.quantity).toFixed(2)} درهم</span>
                    </div>
                    
                </div>
            `;
        cartItemsContainer.appendChild(itemElement);
    });

    addCartEventListeners();
}

async function addCartEventListeners() {
    // Quantity controls
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function () {
            const input = this.parentNode.querySelector('input');
            const itemId = this.closest('.cart-item').dataset.id;
            const currentValue = parseInt(input.value);
            let newValue = currentValue;

            if (this.classList.contains('plus')) {
                newValue = currentValue < 99 ? currentValue + 1 : 99;
            } else {
                newValue = currentValue > 0 ? currentValue - 1 : 0;
            }

            input.value = newValue;
            updateCartItem(itemId, newValue);
        });
    });

    // Input changes
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function () {
            const itemId = this.closest('.cart-item').dataset.id;
            let newValue = parseInt(this.value);
            newValue = isNaN(newValue) ? 0 : Math.min(99, Math.max(0, newValue));
            this.value = newValue;
            updateCartItem(itemId, newValue);
        });
    });

    // Remove items
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function () {
            const itemId = this.closest('.cart-item').dataset.id;
            removeCartItem(itemId);
        });
    });
}

async function updateCartItem(itemId, newQuantity) {
    const itemIndex = cart.findIndex(item => item.id == itemId);

    if (itemIndex === -1) return;

    if (newQuantity === 0) {
        cart.splice(itemIndex, 1);
    } else {
        cart[itemIndex].quantity = newQuantity;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartTotals(cart);
    updateCartCount(cart);
}

function removeCartItem(itemId) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'هل تريد حقاً إزالة هذا المنتج من سلة التسوق؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#C8A574',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، إزالة',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            // Remove from cart array
            cart = cart.filter(item => item.id != itemId);
            localStorage.setItem('cart', JSON.stringify(cart));

            // Remove from DOM
            const itemElement = document.querySelector(`.cart-item[data-id="${itemId}"]`);
            if (itemElement) itemElement.remove();

            // Update totals and count
            updateCartTotals(cart);
            updateCartCount(cart);

            // Show empty state if needed
            if (cart.length === 0) renderEmptyCart();
        }
    });
}

async function updateCartTotals(cartData) {
    let subtotal = 0;
    const shipping = 5.00;

    cartData.forEach(item => {
        const product = productsData.find(p => p.id === item.id);
        if (product) {
            subtotal += (product.discount_price || product.selling_price) * item.quantity;
        }
    });

    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)} درهم`;
    document.getElementById('shipping').textContent = `${shipping.toFixed(2)} درهم`;
    document.getElementById('total').textContent = `${(subtotal + shipping).toFixed(2)} درهم`;
}

async function updateCartCount(cartData) {
    const count = cartData.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

async function renderEmptyCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = `
            <div class="bg-white p-8 rounded-lg shadow-sm text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 class="text-lg font-medium text-gray-700 mb-2">سلة التسوق فارغة</h3>
                <a href="products.html" class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors">
                    تصفح المنتجات
                </a>
            </div>
        `;
    updateCartTotals([]);
    updateCartCount([]);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
    // Mobile menu toggle
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.toggle('hidden');
    });

    // Add checkout button handler
    document.getElementById('checkoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();

        if (cart.length > 0) {
            window.location.href = 'checkout.html';
        } else {
            Swal.fire({
                title: 'سلة فارغة!',
                text: 'لا يمكنك إتمام الشراء بسلة فارغة',
                icon: 'error',
                confirmButtonText: 'حسناً',
                confirmButtonColor: '#C8A574',
            });
        }
    });
    //clear the search input initially
    document.querySelector('.search-input').value = ""
    //add an event listener on search-input
    document.querySelector('.search-input').addEventListener('input', (event) => {
        const value = event.target.value;
        window.location.href = "products.html?q=" + encodeURIComponent(value);
    })
});