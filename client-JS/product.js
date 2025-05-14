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
    cartCount: document.getElementById('cartCount'),

    similarProductsContainer: document.getElementById('similar-products-container')
};

// Initialize product page
async function initializeProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) throw new Error('Product ID not found');

    const response = await fetch(`https://sbaishop.com/api/website/product/${productId}`);
    if (!response.ok) throw new Error('Product not found');

    currentProduct = await response.json();

    // Load similar products after main product loads
    if (currentProduct.category?.id) {
        const similarProducts = await fetchSimilarProducts(currentProduct.category.id);
        // Filter out current product from similar products
        const filteredSimilar = similarProducts.products.filter(p => p.id !== currentProduct.id);
        renderSimilarProducts(filteredSimilar);
    }

    setupCartHandlers();
    initializeQuantity();
    populateProductData();
    updateCartDisplay();
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
        domElements.discountPrice.textContent = `${parseFloat(discount_price).toFixed(2)} درهم`;
        domElements.sellingPrice.textContent = `${parseFloat(selling_price).toFixed(2)} درهم`;
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

// Add these to domElements


// Add this function
async function fetchSimilarProducts(categoryId) {
    try {
        const response = await fetch(`https://sbaishop.com/api/website/category/${categoryId}`);
        if (!response.ok) throw new Error('Failed to fetch similar products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching similar products:', error);
        return [];
    }
}

// Add this function
async function renderSimilarProducts(products) {
    domElements.similarProductsContainer.innerHTML = '';

    products.forEach(product => {
        const isDiscounted = product.discount_price && product.discount_price < product.selling_price;
        const discountPercent = isDiscounted
            ? Math.round(((product.selling_price - product.discount_price) / product.selling_price) * 100)
            : 0;

        const productCard = document.createElement('div');
        productCard.className = 'product-card bg-white min-w-[22%] max-w-[22%] w-full rounded-lg overflow-hidden shadow-md md:hover:shadow-lg transition-shadow';
        productCard.innerHTML = `
            <div class="relative">
                <img src="${product.image_url}" alt="${product.label}" 
                     class="w-full h-48 object-cover" 
                     onclick="window.location.href='product.html?id=${product.id}'">
                ${isDiscounted ? `
                <div class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded flex flex-col items-center">
                    <span class="font-bold">${discountPercent}% خصم</span>
                </div>` : ''}
            </div>
            <div class="p-4">
                <h3 class="font-semibold md:font-bold text-md md:text-lg mb-1">${product.label}</h3>
                <div class="flex justify-between items-center">
                    ${isDiscounted ? `
                    <div>
                        <span class="text-primary font-semibold md:font-bold text-md md:text-lg">
                            ${parseFloat(product.discount_price).toFixed(2)} درهم
                        </span>
                        <span class="text-gray-400 text-sm line-through block">
                            ${parseFloat(product.selling_price).toFixed(2)} درهم
                        </span>
                    </div>` : `
                    <span class="text-primary font-semibold md:font-bold text-md md:text-lg">
                        ${parseFloat(product.selling_price).toFixed(2)} درهم
                    </span>`}
                    <button class="add-to-cart-similar bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors" 
                            data-id="${product.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        domElements.similarProductsContainer.appendChild(productCard);
    });

    // Add event delegation for similar products
    domElements.similarProductsContainer.addEventListener('click', (event) => {
        const addToCartBtn = event.target.closest('.add-to-cart-similar');
        if (!addToCartBtn) return;

        const productId = parseInt(addToCartBtn.dataset.id);
        addToCartSimilar(productId);
    });
}

// Add this function
async function addToCartSimilar(productId) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    updateCart();
    Swal.fire({
        title: 'تمت الإضافة إلى السلة!',
        text: 'تمت إضافة المنتج إلى سلة التسوق بنجاح',
        icon: 'success',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#C8A574',
    });
}

// Update initializeProductPage function
