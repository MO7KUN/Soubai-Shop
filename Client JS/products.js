function calculateDiscountPercentage(originalPrice, discountedPrice) {
    // Ensure prices are numbers and discountedPrice is less than originalPrice
    if (typeof originalPrice !== 'number' || typeof discountedPrice !== 'number' || discountedPrice >= originalPrice) {
        return 0;
    }
    
    const discountAmount = originalPrice - discountedPrice;
    const discountPercentage = (discountAmount / originalPrice) * 100;
    return Math.round(discountPercentage); // Return whole number percentage
}

function fetchProducts() {
    const productsGrid = document.getElementById('Products-grid');
    if (!productsGrid) return;

    // Show loading state
    productsGrid.innerHTML = '<div class="col-span-full text-center py-8">جاري تحميل المنتجات...</div>';

    fetch('https://sbaishop.com/api/products', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        productsGrid.innerHTML = ''; // Clear loading state

        if (!data || !Array.isArray(data.products)) {
            throw new Error('Invalid data format');
        }

        data.products.forEach(product => {
            if (!product.is_visible) return;

            const productCard = document.createElement('div');
            productCard.className = 'product-card bg-white rounded-lg overflow-hidden shadow-md';

            let badgeHTML = '';
            let priceHTML = '';

            // Handle limited quantity
            if (product.qte <= 5) {
                badgeHTML = `
                    <div class="absolute top-3 right-3 bg-red-500 text-white text-sm font-medium px-2 py-1 rounded">
                        كمية محدودة
                    </div>
                `;
            }

            // Handle discounted products
            if (product.discount_price && product.discount_price < product.selling_price) {
                const discountPercent = calculateDiscountPercentage(
                    parseFloat(product.selling_price), 
                    parseFloat(product.discount_price)
                );
                
                badgeHTML = `
                    <div class="absolute top-3 right-3 bg-primary text-white text-sm font-medium px-2 py-1 rounded">
                        خصم ${discountPercent}%
                    </div>
                `;

                priceHTML = `
                    <div class="flex justify-between items-center">
                        <div>
                            <span class="font-bold text-primary text-lg">${product.discount_price} درهم</span>
                            <span class="text-gray-500 text-sm line-through mr-2">${product.selling_price} درهم</span>
                        </div>
                        <button onclick="addToCart(${product.id})" 
                                class="bg-primary text-white px-3 py-1 rounded-md hover:bg-secondary transition-colors">
                            إضافة للسلة
                        </button>
                    </div>
                `;
            } else {
                // Regular price products
                priceHTML = `
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-primary text-lg">${product.selling_price} درهم</span>
                        <button onclick="addToCart(${product.id})" 
                                class="bg-primary text-white px-3 py-1 rounded-md hover:bg-secondary transition-colors">
                            إضافة للسلة
                        </button>
                    </div>
                `;
            }

            productCard.innerHTML = `
                <div class="relative">
                    <img src="${product.image_url || 'images/placeholder-product.jpg'}" 
                         alt="${product.label || 'منتج'}" 
                         class="w-full h-64 object-cover">
                    ${badgeHTML}
                </div>
                <div class="p-4">
                    <h3 class="font-medium text-lg mb-2">${product.label}</h3>
                    ${priceHTML}
                </div>
            `;

            productsGrid.appendChild(productCard);
        });
    })
    .catch(error => {
        console.error('Error fetching products:', error);
        productsGrid.innerHTML = `
            <div class="col-span-full text-center py-8 text-red-500">
                حدث خطأ في تحميل المنتجات. يرجى المحاولة مرة أخرى.
            </div>
        `;
    });
}