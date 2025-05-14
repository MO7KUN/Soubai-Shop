// Global variables
        let products = [];
        let cart = [];
        let categories = [];

        // Initialize the page
        document.addEventListener("DOMContentLoaded", function() {
            loadCart();
            fetchAllCategoriesWithProducts();
            
            // Mobile menu toggle
            document.getElementById("mobileMenuBtn")?.addEventListener("click", function() {
                document.getElementById("mobileMenu").classList.toggle("hidden");
            });
            
            // Search functionality
            document.querySelectorAll('.search-input').forEach((input) => {
                input.value = "";
                input.addEventListener('input', (event) => {
                    const value = event.target.value;
                    window.location.href = "products.html?q=" + encodeURIComponent(value);
                });
            });
        });

        // Load cart from localStorage
        function loadCart() {
            const savedCart = localStorage.getItem("cart");
            if (savedCart) {
                try {
                    cart = JSON.parse(savedCart);
                    updateCartCount();
                } catch (e) {
                    console.error("Error parsing cart data:", e);
                    cart = [];
                }
            }
        }

        // Update cart count in header
        function updateCartCount() {
            const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            const cartCountElement = document.getElementById("cartCount");
            if (cartCountElement) {
                cartCountElement.textContent = cartCount;
            }
        }

        // Fetch all categories with their products
        async function fetchAllCategoriesWithProducts() {
            try {
                // First fetch all categories
                const categoriesResponse = await fetch("https://sbaishop.com/api/website/categories");
                if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
                
                categories = await categoriesResponse.json();
                
                if (!Array.isArray(categories) || categories.length === 0) {
                    throw new Error("No categories found");
                }
                
                // Then fetch products for each category
                const categoriesContainer = document.getElementById("categories-container");
                categoriesContainer.innerHTML = "";
                
                for (const category of categories) {
                    // Create category section
                    const categorySection = document.createElement("section");
                    categorySection.className = "mb-12";
                    categorySection.innerHTML = `
                        <div class="category-header flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-display font-bold">${category.label}</h2>
                            <a href="category.html?id=${category.id}" class="text-primary hover:text-secondary transition-colors">
                                عرض الكل
                            </a>
                        </div>
                        <div class="products-loading-${category.id} text-center py-8">
                            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                            <p class="mt-2 text-gray-600">جاري تحميل المنتجات...</p>
                        </div>
                        <div class="category-products-${category.id} swiper-container category-swiper" style="display: none;">
                            <div class="swiper-wrapper"></div>
                            <div class="swiper-pagination"></div>
                        </div>
                    `;
                    
                    categoriesContainer.appendChild(categorySection);
                    
                    // Fetch products for this category
                    try {
                        const productsResponse = await fetch(`https://sbaishop.com/api/website/category/${category.id}`);
                        if (!productsResponse.ok) throw new Error(`Failed to fetch products for category ${category.id}`);
                        
                        const products = await productsResponse.json();
                        
                        // Hide loading and show products
                        document.querySelector(`.products-loading-${category.id}`).style.display = "none";
                        const productsContainer = document.querySelector(`.category-products-${category.id}`);
                        productsContainer.style.display = "block";
                        
                        // Add products to swiper
                        const swiperWrapper = productsContainer.querySelector(".swiper-wrapper");
                        
                        if (Array.isArray(products) && products.length > 0) {
                            products.forEach(product => {
                                const cartItem = cart.find(item => item.id == product.id);
                                const quantity = cartItem ? cartItem.quantity : 0;
                                
                                const slide = document.createElement("div");
                                slide.className = "swiper-slide";
                                slide.innerHTML = `
                                    <div class="product-card bg-white rounded-lg shadow-md overflow-hidden h-full">
                                        <div class="relative">
                                            <img src="${product.image_url}" alt="${product.label}" 
                                                class="w-full h-48 object-cover" loading="lazy">
                                            ${product.discount_price ? `
                                                <span class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">خصم</span>
                                            ` : ""}
                                        </div>
                                        <div class="p-4">
                                            <h3 class="font-medium text-lg mb-2">${product.label}</h3>
                                            <div class="flex justify-between items-center">
                                                <div>
                                                    ${product.discount_price ? `
                                                        <span class="font-bold text-primary">${product.discount_price} درهم</span>
                                                        <span class="font-light text-dark text-sm line-through block">${product.selling_price} درهم</span>
                                                    ` : `
                                                        <span class="font-bold text-primary">${product.selling_price} درهم</span>
                                                    `}
                                                </div>
                                                <div class="add-to-cart-container" data-id="${product.id}">
                                                    ${quantity > 0 ? `
                                                        <div class="quantity-selector flex items-center">
                                                            <button class="quantity-btn decrease-quantity bg-gray-100 hover:bg-gray-200 p-1 rounded" data-id="${product.id}">
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                                                </svg>
                                                            </button>
                                                            <span class="quantity-display mx-2">${quantity}</span>
                                                            <button class="quantity-btn increase-quantity bg-gray-100 hover:bg-gray-200 p-1 rounded" data-id="${product.id}">
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ` : `
                                                        <button class="add-to-cart bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors" data-id="${product.id}">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                            </svg>
                                                        </button>
                                                    `}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                                
                                swiperWrapper.appendChild(slide);
                            });
                            
                            // Initialize swiper for this category
                            new Swiper(productsContainer, {
                                slidesPerView: 1,
                                spaceBetween: 20,
                                pagination: {
                                    el: productsContainer.querySelector(".swiper-pagination"),
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
                            
                            // Setup cart buttons for this category's products
                            setupCartButtonsForCategory(category.id);
                        } else {
                            swiperWrapper.innerHTML = `
                                <div class="swiper-slide text-center py-8">
                                    <p class="text-gray-500">لا توجد منتجات في هذه الفئة حالياً</p>
                                </div>
                            `;
                        }
                    } catch (error) {
                        console.error(`Error loading products for category ${category.id}:`, error);
                        document.querySelector(`.products-loading-${category.id}`).innerHTML = `
                            <p class="text-red-500">حدث خطأ أثناء تحميل منتجات هذه الفئة</p>
                        `;
                    }
                }
                
                // Hide global loading
                document.getElementById("categories-loading").style.display = "none";
            } catch (error) {
                console.error("Error loading categories:", error);
                document.getElementById("categories-loading").style.display = "none";
                document.getElementById("categories-error").classList.remove("hidden");
            }
        }

        // Setup cart buttons for a specific category's products
        function setupCartButtonsForCategory(categoryId) {
            const containers = document.querySelectorAll(`.category-products-${categoryId} .add-to-cart-container`);
            
            containers.forEach(container => {
                const productId = container.dataset.id;
                
                // Add to cart button
                const addButton = container.querySelector(".add-to-cart");
                if (addButton) {
                    addButton.addEventListener("click", function(e) {
                        e.stopPropagation();
                        addToCart(productId, 1);
                    });
                }
                
                // Increase quantity button
                const increaseButton = container.querySelector(".increase-quantity");
                if (increaseButton) {
                    increaseButton.addEventListener("click", function(e) {
                        e.stopPropagation();
                        addToCart(productId, 1);
                    });
                }
                
                // Decrease quantity button
                const decreaseButton = container.querySelector(".decrease-quantity");
                if (decreaseButton) {
                    decreaseButton.addEventListener("click", function(e) {
                        e.stopPropagation();
                        decreaseQuantity(productId);
                    });
                }
            });
        }

        // Add product to cart
        function addToCart(productId, quantity) {
            // Find product in any of the categories
            let product;
            for (const category of categories) {
                product = category.products?.find(p => p.id == productId);
                if (product) break;
            }
            
            if (!product) {
                console.error("Product not found:", productId);
                return;
            }
            
            // Check if product already in cart
            const existingItem = cart.find(item => item.id == productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    quantity: quantity,
                    selling_price: product.discount_price || product.selling_price,
                    name: product.label,
                    image: product.image_url
                });
            }
            
            updateCart();
            updateProductCartButton(productId);
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
            updateProductCartButton(productId);
        }

        // Update cart and UI
        function updateCart() {
            updateCartCount();
            
            // Save cart to localStorage
            localStorage.setItem("cart", JSON.stringify(cart));
        }

        // Update a specific product's cart button
        function updateProductCartButton(productId) {
            const cartItem = cart.find(item => item.id == productId);
            const quantity = cartItem ? cartItem.quantity : 0;
            
            document.querySelectorAll(`.add-to-cart-container[data-id="${productId}"]`).forEach(container => {
                container.innerHTML = quantity > 0 ? `
                    <div class="quantity-selector flex items-center">
                        <button class="quantity-btn decrease-quantity bg-gray-100 hover:bg-gray-200 p-1 rounded" data-id="${productId}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                            </svg>
                        </button>
                        <span class="quantity-display mx-2">${quantity}</span>
                        <button class="quantity-btn increase-quantity bg-gray-100 hover:bg-gray-200 p-1 rounded" data-id="${productId}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </div>
                ` : `
                    <button class="add-to-cart bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors" data-id="${productId}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                    </button>
                `;
                
                // Reattach event listeners
                const addButton = container.querySelector(".add-to-cart");
                if (addButton) {
                    addButton.addEventListener("click", function(e) {
                        e.stopPropagation();
                        addToCart(productId, 1);
                    });
                }
                
                const increaseButton = container.querySelector(".increase-quantity");
                if (increaseButton) {
                    increaseButton.addEventListener("click", function(e) {
                        e.stopPropagation();
                        addToCart(productId, 1);
                    });
                }
                
                const decreaseButton = container.querySelector(".decrease-quantity");
                if (decreaseButton) {
                    decreaseButton.addEventListener("click", function(e) {
                        e.stopPropagation();
                        decreaseQuantity(productId);
                    });
                }
            });
        }