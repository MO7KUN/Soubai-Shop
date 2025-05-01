// Initialize global variables
let products = []; // Initialize products array
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    fetchCategories();
    fetchDiscountedProducts();
    fetchprod().then(() => {
        setupCartButtons();
    }).catch(error => {
        console.error('Error initializing products:', error);
    });
});

// Mobile Menu Toggle
document.getElementById('mobileMenuBtn')?.addEventListener('click', function() {
    document.getElementById('mobileMenu').classList.toggle('hidden');
});

// Add to cart functionality
function setupCartButtons() {
    if (!products || !Array.isArray(products)) {
        console.error('Products not loaded yet');
        return;
    }

    document.querySelectorAll('.add-to-cart-container').forEach(container => {
        const productId = container.dataset.id;
        const product = products.find(p => p.id == productId);
        
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }

        const cartItem = cart.find(item => item.id == productId);
        
        if (cartItem) {
            // Show quantity selector
            container.innerHTML = `
                <div class="quantity-selector">
                    <button class="quantity-btn decrease-quantity" data-id="${productId}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                    </button>
                    <span class="quantity-display">${cartItem.quantity}</span>
                    <button class="quantity-btn increase-quantity" data-id="${productId}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                </div>
            `;
        }
    });

    // Add event listeners to new buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            addToCart(productId, 1);
        });
    });

    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            addToCart(productId, 1);
        });
    });

    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            decreaseQuantity(productId);
        });
    });
}

// Add product to cart with specific quantity
function addToCart(productId, quantity) {
    const product = products.find(p => p.id == productId);
    
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id
        });
    }
    
    updateCart();
    
    
}

// Decrease product quantity in cart
function decreaseQuantity(productId) {
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity -= 1;
        
        // Remove item if quantity reaches 0
        if (existingItem.quantity <= 0) {
            cart = cart.filter(item => item.id != productId);
        }
    }
    
    updateCart();
}

// Update cart and UI
function updateCart() {
    updateCartCount();
    setupCartButtons();
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Load cart from localStorage on page load
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartCount();
        } catch (e) {
            console.error('Error parsing cart data:', e);
            cart = [];
        }
    }
}

        
                // Initialize categories swiper
                function initCategoriesSwiper() {
                    const swiperEl = document.querySelector('.swiper-container');
                    if (!swiperEl) return;
        
                    const slides = swiperEl.querySelectorAll('.swiper-slide');
                    const shouldLoop = slides.length > 3; // Only enable loop if enough slides
                    
                    return new Swiper('.swiper-container', {
                        loop: shouldLoop,
                        slidesPerView: 1,
                        spaceBetween: 20,
                        pagination: {
                            el: '.swiper-pagination',
                            clickable: true,
                        },
                        breakpoints: {
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 40,
                            },
                        }
                    });
                }