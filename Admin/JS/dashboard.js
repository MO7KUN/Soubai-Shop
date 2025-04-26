// let apiUrl = "http://e_sahara.test/api"
let apiUrl = "https://sbaishop.com/api"

document.addEventListener('DOMContentLoaded', fetchOrdersStats())
async function fetchOrdersStats() {
    try {
        const response = await fetch(apiUrl + '/dashboard/ordersStats',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        // Handle different response statuses
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Try to parse error JSON, fallback to empty object
            throw { status: response.status, message: errorData.message || "حدث خطأ أثناء جلب المنتجات" };
        }

        const data = await response.json();

        // Fill the HTML elements with the data
        document.getElementById('totalOrders').textContent = data.total_orders || 0;
        document.getElementById('totalRevenue').textContent = data.total_revenue || '0 DH';
        document.getElementById('totalCustomers').textContent = data.total_customers || 0;
        document.getElementById('pendingOrders').textContent = data.pending_orders || 0;
    } catch (error) {
        console.error("❌ Error fetching orders statistics:", error); // Log the full error for debugging
        errorsHandler(error.status || 500);
        // Reset data to avoid showing wrong numbers
        document.getElementById('totalOrders').textContent = 0;
        document.getElementById('totalRevenue').textContent = '0 DH';
        document.getElementById('totalCustomers').textContent = 0;
        document.getElementById('pendingOrders').textContent = 0;
        throw new Error(`Error occurred while fetching orders statistics: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', fetchRecentOrders())
async function fetchRecentOrders() {
    try {
        const response = await fetch(apiUrl + '/dashboard/recentOrders',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        // Handle different response statuses
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Try to parse error JSON, fallback to empty object
            throw { status: response.status, message: errorData.message || "حدث خطأ أثناء جلب المنتجات" };
        }

        const data = await response.json();

        const tableBody = document.getElementById('recentOrders');
        tableBody.innerHTML = ''; // Clear previous data

        // Loop through the orders and create table rows
        if (data.length > 0) {

            data.forEach(order => {
                const statusBadge = getOrderStatusBadge(order.status);
                const row = `
                <tr class="hover:bg-gray-50">
                    <td class="p-3 border-b text-center whitespace-nowrap">${order.client_name || 'غير معروف'}</td>
                    <td class="p-3 border-b text-center whitespace-nowrap">${order.client_tel || 'غير متوفر'}</td>
                    <td class="p-3 border-b text-center whitespace-nowrap">${order.total || '0 DH'}</td>
                    <td class="p-3 border-b text-center whitespace-nowrap">${order.city || '-'}</td>
                    <td class="p-3 border-b text-center whitespace-nowrap" dir="ltr">${formatDate(order.date) || '-'}</td>
                    <td class="p-3 border-b text-center whitespace-nowrap">${statusBadge}</td>
                    <td class="p-3 border-b text-center whitespace-nowrap text-center">
                        <a href="newOrder.php?action=edit&order=${order.order_id}" class="bg-blue-500 text-white pr-1 py-1 rounded-lg ml-2">
                            <i class="fas fa-eye"></i>
                        </a>
                        <a href="tel:${order.client_tel}" class="bg-green-500 text-white px-2 py-1 rounded-lg">
                        <i class="fas fa-phone"></i>
                        </a>
                        </td>
                        </tr>
                        `;
                tableBody.innerHTML += row;
            });
        } else {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="100%" class="py-6 text-center text-gray-500 font-semibold bg-gray-50 border border-gray-200 rounded">
                        ⚠️ لا توجد طلبات حديثة لعرضها.
                    </td>
                </tr>
            `
        }
    } catch (error) {
        console.error("❌ Error fetching recent orders:", error); // Log the full error for debugging
        errorsHandler(error.status || 500);
        // Clear the table if there is an error
        document.getElementById('recentOrders').innerHTML = `
          <tr>
            <td colspan="100%" class="py-6 text-center text-red-500 font-semibold bg-red-50 border border-red-200 rounded">
                ⚠️ هناك مشكلة في الخادم، يرجى المحاولة لاحقًا أو التواصل مع الدعم الفني.
            </td>
          </tr>
        `;;
        throw new Error(`Error occurred while fetching products: ${error.message}`);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
}


function getOrderStatusBadge(status) {
    switch (status.toLowerCase()) {
        case 'en attente':
            return `<span class="bg-yellow-400 text-white px-2 py-1 rounded-lg">قيد المعالجة</span>`;
        case 'confirmé':
            return `<span class="bg-blue-400 text-white px-2 py-1 rounded-lg">تم التأكيد</span>`;
        case 'livré':
            return `<span class="bg-green-500 text-white px-2 py-1 rounded-lg">تم التوصيل</span>`;
        case 'annulé':
            return `<span class="bg-red-500 text-white px-2 py-1 rounded-lg">ملغي</span>`;
        default:
            return `<span class="bg-gray-400 text-white px-2 py-1 rounded-lg">غير معروف</span>`;
    }
}

document.addEventListener('DOMContentLoaded', fetchBestSellingProducts())
async function fetchBestSellingProducts() {
    try {
        const response = await fetch(apiUrl + '/dashboard/bestSellingProducts',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        // Handle different response statuses
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Try to parse error JSON, fallback to empty object
            throw { status: response.status, message: errorData.message || "حدث خطأ أثناء جلب المنتجات" };
        }

        const data = await response.json();

        const tableBody = document.getElementById('bestSoldProducts');
        tableBody.innerHTML = ''; // Clear previous data

        if (data.length > 0) {

            // Loop through products and create table rows
            data.forEach(product => {
                const row = `
                <tr class="border-b">
                    <td class="p-3 text-center">
                        <img src="${product.image_url}" alt="product image" class="w-16 h-16 rounded-lg object-cover shadow">
                    </td>
                    <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${product.product_name || 'غير معروف'}</td>
                    <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${product.qty_sold || 0}</td>
                    <td class="px-4 py-3 text-center whitespace-nowrap font-semibold" dir="ltr">${product.total_revenue || '0 DH'}</td>
                    </tr>
                    `;
                tableBody.innerHTML += row;
            });
        } else {
            tableBody.innerHTML = `
            <tr>
                <td colspan="100%" class="py-6 text-center text-gray-500 font-semibold bg-gray-50 border border-gray-200 rounded">
                    ⚠️ لا توجد منتجات لعرضها.
                </td>
            </tr>`
        }
    } catch (error) {
        console.error("❌ Error fetching best selling products:", error); // Log the full error for debugging
        errorsHandler(error.status || 500);
        document.getElementById('bestSoldProducts').innerHTML = `
        <tr>
            <td colspan="100%" class="py-6 text-center text-red-500 font-semibold bg-red-50 border border-red-200 rounded">
                ⚠️ هناك مشكلة في الخادم، يرجى المحاولة لاحقًا أو التواصل مع الدعم الفني.
            </td>
        </tr>
        `
        throw new Error(`Error occurred while fetching best selling products: ${error.message}`);
    }
}

document.addEventListener("DOMContentLoaded", fetchLowStockProducts())
async function fetchLowStockProducts() {
    try {
        const response = await fetch(apiUrl + "/dashboard/lowStockProducts",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Try to parse error JSON, fallback to empty object
            throw { status: response.status, message: errorData.message || "حدث خطأ أثناء جلب المنتجات" };
        }

        const data = await response.json();

        const tableBody = document.getElementById('lowStockProducts');
        tableBody.innerHTML = ''; // Clear existing rows

        if (data.length > 0) {

            data.forEach(product => {
                const row = `
                <tr>
                    <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${product.product_name}</td>
                    <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${product.barcode || '---'}</td>
                    <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${product.remaining_qty}</td>
                    <td class="px-4 py-3 text-center whitespace-nowrap font-medium">${product.status}</td>
                    <td class="px-4 py-3 text-center whitespace-nowrap">
                    <a href="newProduct.php?action=edit&id=${product.id}" class="bg-blue-500 text-white px-2 py-1 rounded-full">
                    <i class="fas fa-pen"></i>
                        </a>
                    </td>
                    </tr>
                    `;
                tableBody.innerHTML += row;
            });
        } else {
            tableBody.innerHTML = `
            <tr>
                <td colspan="100%" class="py-6 text-center text-gray-500 font-semibold bg-gray-50 border border-gray-200 rounded">
                    ⚠️ لا توجد منتجات منخفضة المخزون لعرضها.
                </td>
            </tr>
        `
        }
    } catch (error) {
        console.error("❌ Error fetching low stock products:", error); // Log the full error for debugging
        errorsHandler(error.status || 500);
        document.getElementById('lowStockProducts').innerHTML = `
          <tr>
            <td colspan="100%" class="py-6 text-center text-red-500 font-semibold bg-red-50 border border-red-200 rounded">
                ⚠️ هناك مشكلة في الخادم، يرجى المحاولة لاحقًا أو التواصل مع الدعم الفني.
            </td>
          </tr>
        `;
        throw new Error(`Error occurred while fetching low stock products: ${error.message}`);
    }
}
