let apiUrl = "https://sbaishop.com/api"

// Check URL parameters on page load for edit mode
document.addEventListener("DOMContentLoaded", function () {
    sidebarHandler("gererOrders");
    getClients(); // تحميل العملاء عند تحميل الصفحة
    getProducts();
    if (!permissions.includes('gererClients')) {
        document.getElementById('editModal').remove();
        document.getElementById('editButton').remove();
    }

    // Check if we are in edit mode
    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "edit" && params.get("order")) {
        const orderId = params.get("order");
        fetchOrder(orderId);
        document.getElementById('submitOrder').innerText = "تطبيق التعديلات"
    }
});

// --------------------------
// CLIENT MANAGEMENT (existing)
// --------------------------
let clients = [];
let selectedClientId = null;

const clientSearchInput = document.getElementById("clientSearchInput");
const clientList = document.getElementById("clientList");
const clientInfoContainer = document.getElementById("clientInfoContainer"); // Where client info is displayed
const clientNameDisplay = document.getElementById("clientNameDisplay"); // Element to show client name
const clientPhoneDisplay = document.getElementById("clientPhoneDisplay"); // Element to show phone
const clientCityDisplay = document.getElementById("clientCityDisplay"); // Element to show city

const editModal = document.getElementById("editModal");
const editName = document.getElementById("editName");
const editPhone = document.getElementById("editTel");
const editCity = document.getElementById("editCity");
const editButton = document.getElementById("editButton");
const closeModalButton = document.getElementById("closeModal");

// Show client list when input is focused
clientSearchInput.addEventListener("focus", () => {
    updateClientList(clients);
});

// Filter client list based on search input
clientSearchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = clients.filter(client => client.name.toLowerCase().includes(query));
    updateClientList(filtered);
});

// Hide client list when clicking outside
document.addEventListener("click", (e) => {
    if (!clientSearchInput.contains(e.target) && !clientList.contains(e.target)) {
        clientList.classList.add("hidden");
    }
});

// Update client list dynamically
function updateClientList(filteredClients) {
    clientList.innerHTML = "";
    if (filteredClients.length === 0) {
        clientList.classList.add("hidden");
        return;
    }
    filteredClients.forEach(client => {
        const li = document.createElement("li");
        li.textContent = client.name;
        li.className = "px-4 py-2 hover:bg-gray-200 cursor-pointer";
        li.dataset.clientId = client.id;
        li.addEventListener("click", () => selectClient(client));
        clientList.appendChild(li);
    });
    clientList.classList.remove("hidden");
}

// Select a client and display their info
function selectClient(client) {
    selectedClientId = client.id;
    clientSearchInput.value = client.name;
    clientList.classList.add("hidden");

    // Display client info
    clientNameDisplay.textContent = client.name || "";
    clientPhoneDisplay.textContent = client.phone || "";
    clientCityDisplay.textContent = client.city || "";
    clientInfoContainer.classList.remove("hidden"); // Show the client info container
}

// Fetch clients from API
async function getClients() {
    try {

        const response = await fetch(apiUrl + '/clients', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Try to parse error JSON, fallback to empty object
            throw { status: response.status, message: errorData.message || "حدث خطأ أثناء جلب المنتجات" };
        }

        const result = await response.json()

        clients = result.map(client => ({
            name: client.name,
            id: client.id,
            phone: client.tel || "",
            city: client.city || ""
        }));
    } catch (error) {
        console.error("❌ Error fetching products:", error); // Log the full error for debugging
        errorsHandler(error.status || 500);
        throw new Error(`Error occurred while fetching products: ${error.message}`);
    }
}

// Open modal and pre-fill with selected client info
editButton.addEventListener("click", function () {
    if (!selectedClientId) return; // Ensure a client is selected
    const client = clients.find(c => c.id === selectedClientId);
    console.log(client)
    editName.value = client.name || "";
    editPhone.value = client.phone || "";
    editCity.value = client.city || "";

    editModal.classList.remove("hidden");
});

// Close modal
closeModalButton.addEventListener("click", function () {
    editModal.classList.add("hidden");
});

// Close modal when clicking outside of it
window.addEventListener("click", function (event) {
    if (event.target === editModal) {
        editModal.classList.add("hidden");
    }
});

// Save changes and update client info
async function editClientInfos() {
    if (!selectedClientId) return;
    try {

        const response = await fetch(apiUrl + `/${selectedClientId}/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                name: editName.value,
                tel: editPhone.value,
                city: editCity.value
            })
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Try to parse error JSON, fallback to empty object
            throw { status: response.status, message: errorData.message || "حدث خطأ أثناء جلب المنتجات" };
        }

        // Update local client data
        const clientIndex = clients.findIndex(c => c.id === selectedClientId);
        if (clientIndex !== -1) {
            clients[clientIndex] = {
                id: selectedClientId,
                name: editName.value,
                phone: editPhone.value,
                city: editCity.value
            };
        }

        // Update displayed client info
        selectClient(clients[clientIndex]);

        Swal.fire({
            icon: "success",
            title: "تم تسجيل العميل بنجاح",
            text: "تم تسجيل معلومات العميل بنجاح",
            showConfirmButton: false,
            timer: 1200, // The timer is 1200 ms (1.2 seconds)
        }).then(() => {
            // Close modal
            editModal.classList.add("hidden");
        });

    } catch (error) {
        console.error("❌ Error fetching products:", error); // Log the full error for debugging
        errorsHandler(error.status || 500);
        throw new Error(`Error occurred while fetching products: ${error.message}`);
    }
}

// --------------------------
// PRODUCT & ORDER MANAGEMENT (existing)
// --------------------------
let products = [];
const productSearchInput = document.getElementById("productSearchInput");
const productList = document.getElementById("productList");
const productsTableBody = document.querySelector("table tbody");
const orderTotalElement = document.getElementById("order-subtotal");

// Store selected products to prevent duplicates
let selectedProducts = {};

// Show product list when input is focused
productSearchInput.addEventListener("focus", () => {
    updateProductList(products.filter(p => !selectedProducts[p.id]));
});

// Filter product list based on search input
productSearchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query) && !selectedProducts[product.id]
    );
    updateProductList(filtered);
});

// Hide product list when clicking outside
document.addEventListener("click", (e) => {
    if (!productSearchInput.contains(e.target) && !productList.contains(e.target)) {
        productList.classList.add("hidden");
    }
});

function updateProductList(filteredProducts) {
    productList.innerHTML = "";
    if (filteredProducts.length === 0) {
        productList.classList.add("hidden");
        return;
    }
    filteredProducts.forEach(product => {
        const li = document.createElement("li");
        li.textContent = product.name;
        li.className = "px-4 py-2 hover:bg-gray-200 cursor-pointer";
        li.dataset.productId = product.id;
        li.addEventListener("click", () => {
            addProductToTable(product);
            productSearchInput.value = "";
            productList.classList.add("hidden");
        });
        productList.appendChild(li);
    });
    productList.classList.remove("hidden");
}

async function getProducts() {
    try {

        const response = await fetch(apiUrl + '/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Try to parse error JSON, fallback to empty object
            throw { status: response.status, message: errorData.message || "حدث خطأ أثناء جلب المنتجات" };
        }
        const result = await response.json()

        products = result.map(product => ({
            name: product.label,
            id: product.id,
            price: product.discount_price || product.selling_price,
            stock: product.qte ?? "غير متعقب",
            image: product.image_url
        }));

    } catch (error) {
        console.error("❌ Error fetching products:", error); // Log the full error for debugging
        errorsHandler(error.status || 500);
        throw new Error(`Error occurred while fetching products: ${error.message}`);
    }
}

function addProductToTable(product) {
    if (selectedProducts[product.id]) return;
    selectedProducts[product.id] = product;

    const row = document.createElement("tr");
    row.classList.add("border-b");
    row.dataset.productId = product.id;

    row.innerHTML = `
        <td class="p-3 flex items-center gap-2 w-24">
            <img src="${product.image}" class="w-12 h-12 object-cover rounded-lg shadow"> ${product.name}
        </td>
        <td class="p-3 text-center">
            <input type="number" value="${product.price}" min="0" step="0.01"
                class="w-16 text-center border rounded-lg product-price">
        </td>
        <td class="p-3 text-center">
            <input type="number" value="1" min="1"
                class="w-16 text-center border rounded-lg product-qty">
        </td>
        <td class="p-3 text-center product-total" dir="ltr">${product.price} DH</td>
        <td class="p-3 text-center text-gray-500">${product.stock}</td>
        <td class="p-3 text-center">
            <button class="text-red-500 hover:text-red-700 rounded-full bg-gray-100 px-2 py-1 remove-product">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;

    productsTableBody.appendChild(row);
    updateOrderTotal();

    // Attach event listeners
    row.querySelector(".product-qty").addEventListener("input", () => updateProductTotal(row));
    row.querySelector(".product-price").addEventListener("input", () => updateProductTotal(row));
    row.querySelector(".remove-product").addEventListener("click", () => removeProduct(row, product.id));

    updateProductList(products.filter(p => !selectedProducts[p.id]));
}

function updateProductTotal(row) {
    const qty = parseFloat(row.querySelector(".product-qty").value) || 1;
    const price = parseFloat(row.querySelector(".product-price").value) || 0;
    const totalCell = row.querySelector(".product-total");

    const total = qty * price;
    totalCell.textContent = `${total.toFixed(2)} DH`;

    updateOrderTotal();
}

function removeProduct(row, productId) {
    delete selectedProducts[productId];
    row.remove();
    updateOrderTotal();
    updateProductList(products.filter(p => !selectedProducts[p.id]));
}

function updateOrderTotal() {
    let total = 0;
    document.querySelectorAll(".product-total").forEach(cell => {
        total += parseFloat(cell.textContent);
    });
    orderTotalElement.textContent = `${total.toFixed(2)} DH`;
}

// --------------------------
// ORDER SAVE & EDIT FUNCTIONS
// --------------------------

async function saveOrder() {
    if (!selectedClientId || Object.keys(selectedProducts).length === 0) {
        Swal.fire({
            icon: "warning",
            title: "تنبيه",
            text: "الرجاء تحديد العميل وإضافة منتج واحد على الأقل.",
        });
        return;
    }

    const orderedProducts = [];
    // Gather product data from the table
    document.querySelectorAll("table tbody tr").forEach(row => {
        const productId = row.dataset.productId;
        const price = parseFloat(row.querySelector(".product-price").value);
        const qte = parseInt(row.querySelector(".product-qty").value);
        if (!productId || isNaN(price) || isNaN(qte) || qte <= 0) {
            return;
        }
        orderedProducts.push({
            product_id: productId,
            qte: qte,
            price: price
        });
    });

    if (orderedProducts.length === 0) {
        Swal.fire({
            icon: "error",
            title: "خطأ",
            text: "الرجاء إضافة منتجات الى الطلب.",
        });
        return;
    }

    // Build the order data object (date_order and status could be added as needed)
    const orderData = {
        client_id: selectedClientId,
        ordered_products: orderedProducts
    };

    // Determine whether we're editing an existing order or creating a new one
    const params = new URLSearchParams(window.location.search);
    let url = apiUrl + '/order';
    if (params.get("action") === "edit" && params.get("order")) {
        const orderId = params.get("order");
        url = apiUrl + `/order/${orderId}/edit`;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(orderData)
        })
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Try to parse error JSON, fallback to empty object
            throw { status: response.status, message: errorData.message || "حدث خطأ أثناء جلب المنتجات" };
        }

        Swal.fire({
            icon: "success",
            title: "تم تسجيل الطلب بنجاح",
            text: "تم تسجيل معلومات الطلب بنجاح",
            showConfirmButton: false,
            timer: 1200, // The timer is 1200 ms (1.2 seconds)
        })
    } catch (error) {
        console.error("❌ Error fetching products:", error); // Log the full error for debugging
        errorsHandler(error.status || 500);
        throw new Error(`Error occurred while fetching products: ${error.message}`);
    }
}

// New helper function for editing: add product rows pre-filled from order data
function addProductToTableForEdit(product, qty) {
    if (selectedProducts[product.id]) return;
    selectedProducts[product.id] = product;

    const row = document.createElement("tr");
    row.classList.add("border-b");
    row.dataset.productId = product.id;

    row.innerHTML = `
        <td class="p-3 flex items-center gap-2 w-24">
            <img src="${product.image}" class="w-12 h-12 object-cover rounded-lg shadow"> ${product.name}
        </td>
        <td class="p-3 text-center">
            <input type="number" value="${product.price}" min="0" step="0.01"
                class="w-16 text-center border rounded-lg product-price">
        </td>
        <td class="p-3 text-center">
            <input type="number" value="${qty}" min="1"
                class="w-16 text-center border rounded-lg product-qty">
        </td>
        <td class="p-3 text-center product-total" dir="ltr">${(product.price * qty).toFixed(2)} DH</td>
        <td class="p-3 text-center text-gray-500">${product.stock}</td>
        <td class="p-3 text-center">
            <button class="text-red-500 hover:text-red-700 rounded-full bg-gray-100 px-2 py-1 remove-product">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;

    productsTableBody.appendChild(row);
    updateOrderTotal();

    // Attach event listeners
    row.querySelector(".product-qty").addEventListener("input", () => updateProductTotal(row));
    row.querySelector(".product-price").addEventListener("input", () => updateProductTotal(row));
    row.querySelector(".remove-product").addEventListener("click", () => removeProduct(row, product.id));

    updateProductList(products.filter(p => !selectedProducts[p.id]));
}

// Function to fetch the order details in edit mode
async function fetchOrder(orderId) {
    try {

        const response = await fetch(apiUrl + `/order/${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Try to parse error JSON, fallback to empty object
            throw { status: response.status, message: errorData.message || "حدث خطأ أثناء جلب المنتجات" };
        }
        const order = await response.json()
        populateOrderFromData(order);
    } catch (error) {
        console.error("❌ Error fetching products:", error); // Log the full error for debugging
        errorsHandler(error.status || 500);
        throw new Error(`Error occurred while fetching products: ${error.message}`);
    }
}

// Function to populate the order form using fetched order data
function populateOrderFromData(order) {
    // Set selected client from order data
    selectedClientId = order.client.id;
    clientSearchInput.value = order.client.name;
    clientNameDisplay.textContent = order.client.name;
    clientPhoneDisplay.textContent = order.client.tel;
    clientCityDisplay.textContent = order.client.city;
    clientInfoContainer.classList.remove("hidden");

    // Clear current product selections
    selectedProducts = {};
    productsTableBody.innerHTML = "";

    // Populate the products table with ordered products
    order.ordered_products.forEach(item => {
        const prod = {
            id: item.product.id,
            name: item.product.label,
            price: item.price,
            stock: "", // You can set stock if available from order data
            image: item.image_url
        };
        addProductToTableForEdit(prod, item.qte);
    });
    updateOrderTotal();
}
