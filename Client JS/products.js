// Global variables
let cart = [];
let products = [];
let categories = [];
let currentPage = 1;
const productsPerPage = 9; // 3 columns x 3 rows

// Enhanced fetch function with retry logic
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return await fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Fetch products from API
async function fetchProducts() {
  showLoadingIndicator();

  try {
    const data = await fetchWithRetry(
      "https://sbaishop.com/api/website/products",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ API response:", data);

    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid data structure");
    }

    // Process products with only the specified attributes
    products = data.map((product) => ({
      id: product.id,
      label: product.label,
      selling_price: product.selling_price,
      discount_price: product.discount_price,
      category: product.category,
      image_url: product.image_url,
      // Add tags based on available data
      tags: product.discount_price ? ["خصم"] : [],
    }));

    // Extract unique categories
    categories = [
      ...new Set(
        data.map((product) => product.category?.label).filter(Boolean)
      ),
    ];

    initializeProducts();
    initializeCategories();
    updatePagination();

    // After products are loaded, check if we need to filter immediately
    const searchTerm = localStorage.getItem('searchTerm');
    if (searchTerm) {
      filterProducts();
    }
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    handleFetchError(error);
  }
}

// Show loading indicator
function showLoadingIndicator() {
  const productsGrid = document.getElementById("productsGrid");
  const loader = document.createElement("div");
  loader.className = "col-span-full text-center py-12";
  loader.innerHTML = `
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
    <h3 class="mt-4 text-lg font-medium">جاري تحميل المنتجات...</h3>
  `;
  productsGrid.innerHTML = "";
  productsGrid.appendChild(loader);
}

// Handle fetch errors
function handleFetchError(error) {
  let errorMessage =
    "حدث خطأ أثناء محاولة تحميل المنتجات. يرجى المحاولة مرة أخرى لاحقاً.";

  if (error.message.includes("NetworkError")) {
    errorMessage =
      "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت الخاص بك.";
  } else if (error.message.includes("404")) {
    errorMessage = "تعذر العثور على بيانات المنتجات. يرجى إبلاغ المسؤول.";
  }

  Swal.fire({
    title: "خطأ في تحميل المنتجات",
    text: errorMessage,
    icon: "error",
    confirmButtonText: "حسناً",
    confirmButtonColor: "#C8A574",
  });

  showErrorUI();
}

// Show error UI
function showErrorUI() {
  document.getElementById("productsGrid").innerHTML = `
    <div class="col-span-full text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium">خطأ في تحميل المنتجات</h3>
      <button onclick="window.location.reload()" class="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors">
        تحديث الصفحة
      </button>
    </div>
  `;
}

// Show no products message
function showNoProductsMessage() {
  document.getElementById("productsGrid").innerHTML = `
    <div class="col-span-full text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium">لا توجد منتجات متاحة</h3>
    </div>
  `;
}

// Initialize products
function initializeProducts() {
  renderProducts(getPaginatedProducts());
  updateResultsCount(products.length);

  // Set price range max based on highest product price
  if (products.length > 0) {
    const maxPrice = Math.max(
      ...products.map((p) => p.discount_price || p.selling_price)
    );
    const priceRange = document.getElementById("priceRange");
    priceRange.max = Math.ceil(maxPrice / 50) * 50;
    priceRange.value = priceRange.max;
    document.getElementById("maxPriceValue").textContent =
      priceRange.max + " درهم";
  }
}

// Get paginated products
function getPaginatedProducts(filteredProducts = null) {
  const productsToPaginate = filteredProducts || products;
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  return productsToPaginate.slice(startIndex, endIndex);
}

// Update pagination controls
function updatePagination(filteredProducts = null) {
  const productsToPaginate = filteredProducts || products;
  const totalPages = Math.ceil(productsToPaginate.length / productsPerPage);
  const paginationContainer = document.querySelector(".pagination-container");

  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  // Previous button
  const prevButton = document.createElement("button");
  prevButton.className =
    "px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-primary hover:text-white transition-colors";
  prevButton.disabled = currentPage === 1;
  prevButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  `;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts(getPaginatedProducts(filteredProducts));
      updatePagination(filteredProducts);
    }
  });
  paginationContainer.appendChild(prevButton);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.className = `px-3 py-1 rounded border ${
      currentPage === i
        ? "border-primary bg-primary text-white"
        : "border-gray-300 hover:bg-primary hover:text-white"
    } transition-colors`;
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderProducts(getPaginatedProducts(filteredProducts));
      updatePagination(filteredProducts);
    });
    paginationContainer.appendChild(pageButton);
  }

  // Next button
  const nextButton = document.createElement("button");
  nextButton.className =
    "px-3 py-1 rounded border border-gray-300 text-gray-500 hover:bg-primary hover:text-white transition-colors";
  nextButton.disabled = currentPage === totalPages;
  nextButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  `;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts(getPaginatedProducts(filteredProducts));
      updatePagination(filteredProducts);
    }
  });
  paginationContainer.appendChild(nextButton);
}

// Render products
function renderProducts(productsToRender) {
  const productsGrid = document.getElementById("productsGrid");

  if (!productsToRender || productsToRender.length === 0) {
    showNoProductsMessage();
    return;
  }

  productsGrid.innerHTML = "";

  productsToRender.forEach((product) => {
    let percentage = 0;
    if (product.discount_price && product.selling_price) {
      percentage = Math.round(
        ((product.selling_price - product.discount_price) /
          product.selling_price) *
          100
      );
    }
    const cartItem = cart.find((item) => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const productElement = document.createElement("div");
    productElement.className =
      "product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow";
    productElement.innerHTML = `
      <div class="relative">
        <img src="${product.image_url}" alt="${
      product.label
    }" class="w-full h-48 object-cover">
        ${
          product.discount_price
            ? `<div class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded flex flex-col items-center">
                <span class="font-bold">${percentage}% خصم</span>
              </div>`
            : ""
        }
      </div>
      <div class="p-4">
        <h3 class="font-bold text-lg mb-1">${product.label}</h3>
        <div class="flex justify-between items-center">
          ${
            product.discount_price
              ? `<div>
                <span class="text-primary font-bold text-lg">${product.discount_price} درهم</span>
                <span class="text-gray-400 text-sm line-through block">${product.selling_price} درهم</span>
              </div>`
              : `<span class="text-primary font-bold text-lg">${product.selling_price} درهم</span>`
          }
          ${
            quantity > 0
              ? `<div class="quantity-selector flex items-center">
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
              </div>`
              : `<button class="add-to-cart bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors" data-id="${product.id}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>`
          }
        </div>
      </div>
    `;
    productsGrid.appendChild(productElement);
  });

  addCartEventListeners();
}

// Add cart event listeners
function addCartEventListeners() {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.dataset.id);
      addToCart(productId, 1);
    });
  });

  document.querySelectorAll(".increase-quantity").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.dataset.id);
      addToCart(productId, 1);
    });
  });

  document.querySelectorAll(".decrease-quantity").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.dataset.id);
      decreaseQuantity(productId);
    });
  });
}

// Add to cart
function addToCart(productId, quantity) {
  const product = products.find((p) => p.id === productId);

  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      quantity: quantity,
    });
  }

  updateCart();
}

// Decrease quantity
function decreaseQuantity(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity -= 1;
    if (existingItem.quantity <= 0) {
      cart = cart.filter((item) => item.id !== productId);
    }
  }

  updateCart();
}

// Update cart
function updateCart() {
  updateCartCount();
  filterProducts();
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart count
function updateCartCount() {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cartCount").textContent = cartCount;
}

// Update results count
function updateResultsCount(count) {
  document.getElementById("resultsCount").textContent = count + " منتجات";
}

// Initialize categories
function initializeCategories() {
  const categoriesFilter = document.getElementById("categoriesFilter");
  const footerCategories = document.getElementById("footerCategories");

  // Clear existing categories (except "All")
  document
    .querySelectorAll(
      '#categoriesFilter input[name="category"]:not([value="الكل"])'
    )
    .forEach((checkbox) => checkbox.parentElement.remove());

  // Add "All" option
  if (!document.querySelector('#categoriesFilter input[value="الكل"]')) {
    const allOption = document.createElement("div");
    allOption.className = "filter-option";
    allOption.innerHTML = `
      <input type="checkbox" id="category-all" name="category" value="الكل" checked>
      <label for="category-all">الكل</label>
    `;
    categoriesFilter.prepend(allOption);
  }

  // Add categories to filter
  categories.forEach((category) => {
    const filterOption = document.createElement("div");
    filterOption.className = "filter-option";
    filterOption.innerHTML = `
      <input type="checkbox" id="category-${category.replace(/\s+/g, "-")}" 
             name="category" value="${category}">
      <label for="category-${category.replace(/\s+/g, "-")}">${category}</label>
    `;
    categoriesFilter.appendChild(filterOption);
  });

  // Add categories to footer
  footerCategories.innerHTML = "";
  categories.forEach((category) => {
    const categoryItem = document.createElement("li");
    categoryItem.innerHTML = `<a href="#" class="text-gray-400 hover:text-primary">${category}</a>`;
    footerCategories.appendChild(categoryItem);
  });
}

// Filter products
function filterProducts() {
  const searchTerm = document
    .getElementById("searchFilter")
    .value.toLowerCase();
  const selectedCategories = Array.from(
    document.querySelectorAll('input[name="category"]:checked')
  ).map((el) => el.value);
  const maxPrice = parseFloat(document.getElementById("priceRange").value);
  const selectedTags = Array.from(
    document.querySelectorAll('input[name="tag"]:checked')
  ).map((el) => el.value);
  const sortOption = document.getElementById("sortOptions").value;

  let filteredProducts = products;

  // Search filter
  if (searchTerm) {
    filteredProducts = filteredProducts.filter((product) =>
      product.label.toLowerCase().includes(searchTerm)
    );
  }

  // Category filter
  if (!selectedCategories.includes("الكل") && selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      selectedCategories.includes(product.category?.label)
    );
  }

  // Price filter
  filteredProducts = filteredProducts.filter(
    (product) => (product.discount_price || product.selling_price) <= maxPrice
  );

  // Tags filter
  if (selectedTags.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      selectedTags.some((tag) => product.tags?.includes(tag))
    );
  }

  // Sort products
  filteredProducts = sortProducts(filteredProducts, sortOption);

  // Reset to first page when filtering
  currentPage = 1;

  renderProducts(getPaginatedProducts(filteredProducts));
  updateResultsCount(filteredProducts.length);
  updatePagination(filteredProducts);
}

// Sort products
function sortProducts(productsToSort, sortOption) {
  switch (sortOption) {
    case "price-low":
      return [...productsToSort].sort(
        (a, b) =>
          (a.discount_price || a.selling_price) -
          (b.discount_price || b.selling_price)
      );
    case "price-high":
      return [...productsToSort].sort(
        (a, b) =>
          (b.discount_price || b.selling_price) -
          (a.discount_price || a.selling_price)
      );
    case "name-asc":
      return [...productsToSort].sort((a, b) => a.label.localeCompare(b.label));
    case "name-desc":
      return [...productsToSort].sort((a, b) => b.label.localeCompare(a.label));
    default:
      return productsToSort;
  }
}

// Reset filters
function resetFilters() {
  document.getElementById("searchFilter").value = "";
  document.querySelectorAll('input[name="category"]').forEach((checkbox) => {
    checkbox.checked = checkbox.value === "الكل";
  });

  if (products.length > 0) {
    const maxPrice = Math.max(
      ...products.map((p) => p.discount_price || p.selling_price)
    );
    const priceRange = document.getElementById("priceRange");
    priceRange.value = Math.ceil(maxPrice / 50) * 50;
    document.getElementById("maxPriceValue").textContent =
      priceRange.value + " درهم";
  }

  document.querySelectorAll('input[name="tag"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
  document.getElementById("sortOptions").value = "default";
  document.getElementById("sortOptionsDesktop").value = "default";

  filterProducts();
}

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      updateCartCount();
    } catch (error) {
      console.error("Error parsing cart data:", error);
      localStorage.removeItem("cart");
      cart = [];
    }
  }
}

// Mobile Menu Toggle
document
  .getElementById("mobileMenuBtn")
  ?.addEventListener("click", function () {
    document.getElementById("mobileMenu").classList.toggle("hidden");
  });

// Mobile Filters Toggle
document
  .querySelector(".mobile-filters-btn")
  ?.addEventListener("click", function () {
    document.querySelector(".filters-sidebar").classList.add("active");
  });

document
  .querySelector(".close-filters")
  ?.addEventListener("click", function () {
    document.querySelector(".filters-sidebar").classList.remove("active");
  });

// Price Range Slider
const priceRange = document.getElementById("priceRange");
const maxPriceValue = document.getElementById("maxPriceValue");

priceRange?.addEventListener("input", function () {
  maxPriceValue.textContent = this.value + " درهم";
});

// Event listeners
document
  .getElementById("applyFilters")
  ?.addEventListener("click", filterProducts);
document
  .getElementById("resetFilters")
  ?.addEventListener("click", resetFilters);
document
  .getElementById("sortOptions")
  ?.addEventListener("change", filterProducts);
document
  .getElementById("sortOptionsDesktop")
  ?.addEventListener("change", function () {
    document.getElementById("sortOptions").value = this.value;
    filterProducts();
  });

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  // Update pagination container
  const paginationNav = document.querySelector(
    "nav.flex.items-center.space-x-2.space-x-reverse"
  );
  if (paginationNav) {
    paginationNav.className =
      "pagination-container flex items-center space-x-2 space-x-reverse";
  }

  loadCart();

  // Check for search term in localStorage
  const searchTerm = localStorage.getItem('searchTerm');
  if (searchTerm) {
    // Set the search input value
    const searchInput = document.getElementById("searchFilter");
    if (searchInput) {
      searchInput.value = searchTerm;
      // Focus on the search input
      searchInput.focus();
      // Clear the stored search term
      localStorage.removeItem('searchTerm');
    }
  }

  if (!navigator.onLine) {
    Swal.fire({
      title: "لا يوجد اتصال بالإنترنت",
      text: "يجب أن تكون متصلاً بالإنترنت لتحميل المنتجات.",
      icon: "warning",
      confirmButtonText: "حسناً",
      confirmButtonColor: "#C8A574",
    });
    showErrorUI();
    return;
  }

  fetchProducts();

  window.addEventListener("online", () => {
    if (products.length === 0) {
      fetchProducts();
    }
  });
});