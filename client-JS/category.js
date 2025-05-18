
        let currentPage = 1;
        const productsPerPage = 6;
        let currentSort = 'newest';

        // Sample products data
        let products = [
        ];

        // Cart data
        let cart = [];

        // Mobile Menu Toggle
        document.getElementById('mobileMenuBtn').addEventListener('click', function () {
            document.getElementById('mobileMenu').classList.toggle('hidden');
        });

        // Initialize products
        async function initializeProducts() {
            const urlParams = new URLSearchParams(window.location.search);
            const categoryId = urlParams.get('id');
            const productsGrid = document.getElementById('productsGrid');

            if (!categoryId) {
                productsGrid.classList = "w-full flex justify-center items-center h-64 text-center"
                productsGrid.innerHTML = `
                <div class="">
                <p class="w-full text-center text-gray-500 text-lg">تمت إزالة الفئة أو أنها غير موجودة</p>
                </div>`;
                return;
            }

            try {
                const response = await fetch(`https://sbaishop.com/api/website/category/${categoryId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                document.getElementById('categoryTitle').innerText = data.label
                const categoryBanner = document.querySelector('.category-banner');
                if (categoryBanner && data.image_url && data.image_url.trim() !== "") {
                    categoryBanner.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${data.image_url})`;
                }
                if (data && data.products && data.products.length > 0) {
                    products = data.products
                    applySorting(); // Apply default sorting
                    renderProducts(data.products);
                } else {
                    productsGrid.classList = "w-full flex justify-center items-center h-64 text-center"
                    productsGrid.innerHTML = `
                <div class="">
                    <p class="text-center text-gray-500 text-lg">لا توجد منتجات في هذه الفئة</p>
                </div>`;
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                productsGrid.classList = "w-full flex justify-center items-center h-64 text-center"
                productsGrid.innerHTML = `
                <div class="">
                <p class="text-center text-gray-500 text-lg">حدث خطأ أثناء تحميل المنتجات</p>
                </div>`;
            }
        }

        function applySorting() {
            switch (currentSort) {
                case 'newest':
                    products.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                    break;
                case 'price-low':
                    products.sort((a, b) => (a.discount_price || a.selling_price) - (b.discount_price || b.selling_price));
                    break;
                case 'price-high':
                    products.sort((a, b) => (b.discount_price || b.selling_price) - (a.discount_price || a.selling_price));
                    break;
            }
        }

        function renderProducts() {
            const startIndex = (currentPage - 1) * productsPerPage;
            const endIndex = startIndex + productsPerPage;
            const paginatedProducts = products.slice(startIndex, endIndex);

            // Update product count display
            document.querySelector('.product-count').innerHTML = `
            عرض <span class="font-medium">${startIndex + 1}-${Math.min(endIndex, products.length)}</span> 
            منتج من أصل <span class="font-medium">${products.length}</span>
        `;

            renderProductsGrid(paginatedProducts);
            renderPagination();
        }

        // Render products
        function renderProductsGrid(productsToRender) {
            const productsGrid = document.getElementById('productsGrid');
            productsGrid.innerHTML = '';

            productsToRender.forEach(product => {
                const cartItem = cart.find(item => item.id === product.id);
                const quantity = cartItem ? cartItem.quantity : 0;

                const productElement = document.createElement('div');
                productElement.className = 'product-card bg-white rounded-lg shadow-sm overflow-hidden';
                productElement.setAttribute('data-product-id', product.id); // Add this
                productElement.innerHTML = `
                <div class="relative">
                    <img src="${product.image_url}" alt="${product.label}" class="w-full h-64 object-cover" onclick="window.open('product.html?id=${product.id}','_self')">                    
                    ${new Date(product.created_at) >= new Date(new Date().setMonth(new Date().getMonth() - 2)) ?
                        '<div class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">جديد</div>' : ''}
                    ${product.discount_price && product.selling_price && product.discount_price < product.selling_price ?
                        `<div class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            ${Math.round(((product.selling_price - product.discount_price) / product.selling_price) * 100)}% خصم
                        </div>` : ''}
                </div>
                <div class="p-4">
                    <h3 class="font-medium mb-1">${product.label}</h3>
                    <div class="flex items-center justify-between">
                        ${product.discount_price ?
                        `<div>
                                <span class="font-medium text-primary">${parseFloat(product.discount_price).toFixed(2)} درهم</span>
                                <span class="text-gray-500 text-sm line-through mr-2">${parseFloat(product.selling_price).toFixed(2)} درهم</span>
                            </div>` :
                        product.selling_price ?
                            `<span class="font-medium text-primary">${parseFloat(product.selling_price).toFixed(2)} درهم</span>` :
                            ``
                    }
                        <div class="quantity-controls ${quantity > 0 ? '' : 'hidden'}">
                            <div class="quantity-selector">
                                <button class="quantity-btn decrease-quantity" data-id="${product.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                    </svg>
                                </button>
                                <span class="quantity-display">${quantity}</span>
                                <button class="quantity-btn increase-quantity" data-id="${product.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </button>
                            </div>
                            </div>
                            <button class="add-to-cart bg-primary text-white p-2 rounded-full hover:bg-secondary ${quantity > 0 ? 'hidden' : ''}" data-id="${product.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                            </button>
                </div>
            `;
                productsGrid.appendChild(productElement);
            });


            // Add event listeners to cart buttons
            addCartEventListeners();
        }

        // New function to handle pagination rendering
        function renderPagination() {
            const totalPages = Math.ceil(products.length / productsPerPage);
            const paginationContainer = document.querySelector('.pagination-container');

            let paginationHTML = `
            <button class="px-3 py-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 prev-page" 
                ${currentPage === 1 ? 'disabled' : ''}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        `;

            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `
                <button class="px-4 py-1 rounded-md border ${i === currentPage ? 'border-primary bg-primary text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } page-button">${i}</button>
            `;
            }

            paginationHTML += `
            <button class="px-3 py-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 next-page" 
                ${currentPage === totalPages ? 'disabled' : ''}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        `;

            paginationContainer.innerHTML = paginationHTML;
            addPaginationListeners();
        }

        // New function to handle pagination events
        function addPaginationListeners() {
            document.querySelectorAll('.page-button').forEach(button => {
                button.addEventListener('click', () => {
                    currentPage = parseInt(button.textContent);
                    renderProducts();
                });
            });

            document.querySelector('.prev-page')?.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderProducts();
                }
            });

            document.querySelector('.next-page')?.addEventListener('click', () => {
                if (currentPage < Math.ceil(products.length / productsPerPage)) {
                    currentPage++;
                    renderProducts();
                }
            });
        }

        // Add sorting event listener (add this in DOMContentLoaded)
        document.querySelector('select').addEventListener('change', (e) => {
            currentSort = e.target.value;
            currentPage = 1; // Reset to first page when sorting changes
            applySorting();
            renderProducts();
        });

        // Add event listeners for all cart interactions
        function addCartEventListeners() {
            // Add to cart buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function () {
                    const productId = parseInt(this.dataset.id);
                    addToCart(productId, 1);
                });
            });

            // Quantity buttons
            document.querySelectorAll('.increase-quantity, .decrease-quantity').forEach(button => {
                button.addEventListener('click', function () {
                    const productId = parseInt(this.dataset.id);
                    if (this.classList.contains('increase-quantity')) {
                        addToCart(productId, 1);
                    } else {
                        decreaseQuantity(productId);
                    }
                });
            });
        }

        // Add product to cart with specific quantity
        function addToCart(productId, quantity) {
            const product = products.find(p => p.id === productId);

            // Check if product already in cart
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    image: product.image,
                    price: product.price,
                    quantity: quantity,
                    originalPrice: product.discount_price
                });
            }

            updateCart();

            // Show success message only when adding from the "+" button
            // if (quantity === 1) {
            //     Swal.fire({
            //         title: 'تمت الإضافة إلى السلة!',
            //         text: `${product.name} تمت إضافته إلى سلة التسوق`,
            //         icon: 'success',
            //         confirmButtonText: 'حسناً',
            //         confirmButtonColor: '#C8A574'
            //     });
            // }

            updateProductQuantity(productId, getCartQuantity(productId));
        }

        // Decrease product quantity in cart
        function decreaseQuantity(productId) {
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity -= 1;

                // Remove item if quantity reaches 0
                if (existingItem.quantity <= 0) {
                    cart = cart.filter(item => item.id !== productId);
                }
            }

            updateCart();
            updateProductQuantity(productId, getCartQuantity(productId));
        }

        // Helper function to get current quantity
        function getCartQuantity(productId) {
            return cart.find(item => item.id === productId)?.quantity || 0;
        }

        // Update cart and UI
        function updateCart() {
            updateCartCount();
            // renderProducts(products); // Re-render the products with updated quantities

            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // New function to update individual product quantity display
        function updateProductQuantity(productId, quantity) {
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (!productCard) return;

            const quantityDisplay = productCard.querySelector('.quantity-display');
            const addButton = productCard.querySelector('.add-to-cart');
            const quantityControls = productCard.querySelector('.quantity-controls');

            if (quantity > 0) {
                quantityDisplay.textContent = quantity;
                addButton.classList.add('hidden');
                quantityControls.classList.remove('hidden');
            } else {
                addButton.classList.remove('hidden');
                quantityControls.classList.add('hidden');
            }
        }

        // Update cart count in header
        function updateCartCount() {
            const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cartCount').textContent = cartCount;
        }

        // Load cart from localStorage on page load
        function loadCart() {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
                updateCartCount();
            }
        }

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function () {
            loadCart();
            initializeProducts();
        });