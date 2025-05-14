// Cart data and product state
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;

// DOM Elements
const domElements = {
    productTitle: document.querySelectorAll('.productTitle'),
    discountPercentage: document.querySelectorAll('.discountPercentage'),
    productImage: document.getElementById('productImage'),
    sellingPrice: document.getElementById('sellingPrice'),
    discountPrice: document.getElementById('discountPrice'),
    description: document.querySelector('.description'),
    quantityInput: document.querySelector('.quantity-input'),
    minusButton: document.querySelector('.quantity-btn.minus'),
    plusButton: document.querySelector('.quantity-btn.plus'),
    categoryLink: document.querySelector('a[href*="categories.html"]'),
    cartCount: document.getElementById('cartCount')
};

// Initialize product page
async function initializeProductPage() {
    // try {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) throw new Error('Product ID not found');

    const response = await fetch(`https://sbaishop.com/api/website/product/${productId}`);
    if (!response.ok) throw new Error('Product not found');

    currentProduct = await response.json();
    setupCartHandlers();
    initializeQuantity();
    populateProductData()
    updateCartDisplay();
    // } catch (error) {
    //     console.error('Error:', error);
    //     Swal.fire({
    //         title: 'خطأ!',
    //         text: 'تعذر تحميل المنتج',
    //         icon: 'error',
    //         confirmButtonText: 'حسناً'
    //     });
    // }
}

async function populateProductData() {
    const { label, image_url, selling_price, discount_price, description, category } = currentProduct;

    // Basic info
    domElements.productTitle.forEach(titleElement => {
        titleElement.innerText = label;
    });
    domElements.discountPercentage.forEach(percentageElement => {
        if (discount_price && discount_price < selling_price) {
            const discountPercent = ((1 - discount_price / selling_price) * 100).toFixed(0);
            percentageElement.textContent = `-${discountPercent}%`;
        } else {
            percentageElement.parentElement.remove();
        }
    });
    domElements.productImage.src = image_url;
    domElements.productImage.alt = label;
    domElements.description.textContent = description;

    // Pricing
    if (discount_price) {
        domElements.discountPrice.textContent = `${discount_price.toFixed(2)} درهم`;
        domElements.sellingPrice.textContent = `${selling_price.toFixed(2)} درهم`;
    } else {
        domElements.discountPrice.textContent = `${selling_price.toFixed(2)} درهم`;
        domElements.sellingPrice.parentElement.remove();
    }

    // Category link
    if (category) {
        domElements.categoryLink.textContent = category.label;
        domElements.categoryLink.href = `category.html?id=${category.id}`;
    }
}

async function initializeQuantity() {
    const existingItem = cart.find(item => item.id === currentProduct.id);
    domElements.quantityInput.value = existingItem ? existingItem.quantity : 0;
    updateButtonStates();
}

async function setupCartHandlers() {
    // Plus button handler
    domElements.plusButton.addEventListener('click', () => {
        const newValue = parseInt(domElements.quantityInput.value) + 1;
        updateQuantity(newValue);
    });

    // Minus button handler
    domElements.minusButton.addEventListener('click', () => {
        const newValue = parseInt(domElements.quantityInput.value) - 1;
        updateQuantity(newValue);
    });

    // Manual input handler
    domElements.quantityInput.addEventListener('change', () => {
        let newValue = parseInt(domElements.quantityInput.value);
        if (isNaN(newValue)) newValue = 0;
        newValue = Math.min(99, Math.max(0, newValue));
        updateQuantity(newValue);
    });
}

async function updateQuantity(newValue) {
    newValue = Math.min(99, Math.max(0, newValue));
    domElements.quantityInput.value = newValue;

    const existingIndex = cart.findIndex(item => item.id === currentProduct.id);

    if (newValue === 0) {
        // Remove from cart if quantity is 0
        if (existingIndex > -1) {
            cart.splice(existingIndex, 1);
        }
    } else {
        // Add or update item in cart
        const cartItem = {
            id: currentProduct.id,
            quantity: newValue
        };

        if (existingIndex > -1) {
            cart[existingIndex] = cartItem;
        } else {
            cart.push(cartItem);
        }
    }

    updateCart();
    updateButtonStates();
}

async function updateButtonStates() {
    const currentValue = parseInt(domElements.quantityInput.value);
    domElements.minusButton.disabled = currentValue === 0;
    domElements.plusButton.disabled = currentValue === 99;
}

async function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

async function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    domElements.cartCount.textContent = totalItems;
}

document.addEventListener('DOMContentLoaded', () => {
    initializeProductPage();
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.toggle('hidden');
    });
});