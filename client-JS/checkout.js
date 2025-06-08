// checkout.js
document.addEventListener('DOMContentLoaded', async () => {
    // Check if cart exists and has items
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        Swal.fire({
            title: 'سلة فارغة!',
            text: 'الرجاء إضافة منتجات إلى السلة أولاً',
            icon: 'error',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#C8A574'
        }).then(() => {
            window.location.href = 'cart.html';
        });
        return;
    }

    try {
        // Fetch product details
        const productIds = cart.map(item => item.id);
        const response = await fetch('https://sbaishop.com/api/website/getCartProdcuts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_ids: productIds })
        });

        if (!response.ok) throw new Error('Failed to fetch products');

        const productsData = await response.json();

        // Merge cart with product data
        const mergedCart = cart.map(cartItem => {
            const product = productsData.products.find(p => p.id === cartItem.id);
            return {
                ...cartItem,
                ...product,
                price: product.discount_price || product.selling_price
            };
        });

        // Calculate totals
        const subtotal = mergedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= parseFloat(productsData.free_shipping_threshold) ? 0 : parseFloat(productsData.shipping_price);
        
        const total = subtotal + shipping;

        // Store checkout data for later use
        const checkoutData = {
            items: mergedCart,
            subtotal,
            shipping,
            total
        };
        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

        // Render order summary
        renderOrderSummary(checkoutData);
        updateCartCount(checkoutData)
        setupFormSubmission(checkoutData);

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'خطأ!',
            text: 'تعذر تحميل معلومات الطلب',
            icon: 'error',
            confirmButtonText: 'حسناً'
        });
    }
});

async function renderOrderSummary(checkoutData) {
    
    const orderItemsContainer = document.getElementById('orderItems');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');

    // Clear existing items
    orderItemsContainer.innerHTML = '';

    // Populate items
    checkoutData.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'flex justify-between items-center border-b pb-4';
        itemElement.innerHTML = `
            <div class="flex items-center">
                <img src="${item.image_url}" alt="${item.label}" class="w-12 h-12 object-cover rounded-md">
                <div class="mr-3">
                    <h4 class="font-medium">${item.label}</h4>
                    <p class="text-sm text-gray-500">${item.quantity} × ${(parseFloat(item.discount_price || item.selling_price)).toFixed(2)} درهم</p>
                </div>
            </div>
            <span class="font-medium">${((parseFloat(item.discount_price || item.selling_price)) * item.quantity).toFixed(2)} درهم</span>
        `;
        orderItemsContainer.appendChild(itemElement);
    });

    // Update totals
    subtotalElement.textContent = `${checkoutData.subtotal.toFixed(2)} درهم`;
    shippingElement.textContent = `${checkoutData.shipping.toFixed(2)} درهم`;
    totalElement.textContent = `${checkoutData.total.toFixed(2)} درهم`;
}

async function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

async function setupFormSubmission(checkoutData) {
    document.getElementById('placeOrderBtn').addEventListener('click', async (e) => {
        e.preventDefault();

        // Get form values
        const firstName = document.getElementById('firstName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const city = document.getElementById('city').value.trim();
        const termsChecked = document.getElementById('terms').checked;

        // Validate form
        if (!firstName || !phone || !city) {
            Swal.fire({
                title: 'حقول مطلوبة!',
                text: 'الرجاء ملء جميع الحقول المطلوبة',
                icon: 'error',
                confirmButtonText: 'حسناً',
                confirmButtonColor: '#C8A574'
            });
            return;
        }

        if (!termsChecked) {
            Swal.fire({
                title: 'الشروط والأحكام',
                text: 'الرجاء الموافقة على الشروط والأحكام قبل المتابعة',
                icon: 'warning',
                confirmButtonText: 'حسناً',
                confirmButtonColor: '#C8A574'
            });
            return;
        }

        // Prepare order data
        const orderData = {
            client_name: `${firstName}`,
            client_phone: phone,
            city: city,
            products: checkoutData.items.map(item => ({
                id: item.id,
                quantity: item.quantity
            })),
            total_price: checkoutData.total
        };

        try {
            // Show loading
            Swal.fire({
                title: 'جاري معالجة الطلب',
                html: 'الرجاء الانتظار...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            // Send order to API
            const response = await fetch('https://sbaishop.com/api/website/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message || 'Failed to place order');

            // Success handling
            Swal.fire({
                title: 'تم بنجاح!',
                text: 'لقد تم استلام طلبك بنجاح، وسيتصل بك أحد أعضاء الفريق قريبًا لتأكيد طلبك',
                icon: 'success',
                confirmButtonText: 'حسناً',
                confirmButtonColor: '#C8A574'
            }).then(() => {
                // Clear cart and checkout data
                localStorage.removeItem('cart');
                localStorage.removeItem('checkoutData');
                window.location.href = 'index.html';

                ocalStorage.removeItem('cart');
                localStorage.removeItem('checkoutData');
                updateCartCount(); // Update count before redirect
            });

        } catch (error) {
            console.error('Order submission error:', error);
            Swal.fire({
                title: 'خطأ!',
                text: 'حدث خطأ أثناء معالجة الطلب',
                icon: 'error',
                confirmButtonText: 'حسناً'
            });
        }
    });
}