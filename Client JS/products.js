// Cart data
let cart = [];
let products = [];
let categories = [];

// Enhanced fetch function with retry logic
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return await fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Fetch products from API with comprehensive error handling
async function fetchProducts() {
  const loadingIndicator = showLoadingIndicator();
  
  try {
    const data = await fetchWithRetry("https://sbaishop.com/api/products", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid data format received from server");
    }

    // Transform API data to match our expected format
    products = data.map((product) => ({
      id: product.id,
      name: product.label,
      description: product.description,
      image: product.image_url,
      price: product.discount_price || product.selling_price,
      originalPrice: product.selling_price,
      category: product.category.id,
      categoryName: product.category.label,
      quantity: product.qte || 0,
      visible: product.is_visible,
    }));

    // Validate we have products
    if (products.length === 0) {
      showNoProductsMessage();
      return;
    }

    // Extract unique categories
    categories = [
      ...new Set(products.map((product) => product.categoryName)),
    ].filter(cat => cat && cat !== "غير مصنف");

    // Initialize the page with fetched products
    initializeProducts();
    initializeCategories();
  } catch (error) {
    console.error("Error fetching products:", error);
    handleFetchError(error);
  } finally {
    loadingIndicator.remove();
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
  productsGrid.innerHTML = '';
  productsGrid.appendChild(loader);
  return loader;
}

// Handle different types of fetch errors
function handleFetchError(error) {
  let errorMessage = "حدث خطأ أثناء محاولة تحميل المنتجات. يرجى المحاولة مرة أخرى لاحقاً.";
  
  if (error.message.includes("NetworkError")) {
    errorMessage = "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت الخاص بك.";
  } else if (error.message.includes("404")) {
    errorMessage = "تعذر العثور على بيانات المنتجات. يرجى إبلاغ المسؤول.";
  } else if (error.message.includes("500")) {
    errorMessage = "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.";
  } else if (error.message.includes("Invalid data")) {
    errorMessage = "بيانات المنتجات غير صالحة. يرجى إبلاغ المسؤول."; 
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
      <p class="mt-1 text-gray-500">تعذر تحميل المنتجات. يرجى تحديث الصفحة أو المحاولة لاحقاً.</p>
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
      <p class="mt-1 text-gray-500">لا توجد منتجات متاحة للعرض حالياً.</p>
    </div>
  `;
}

// Initialize categories in filters and footer
function initializeCategories() {
  const categoriesFilter = document.getElementById("categoriesFilter");
  const footerCategories = document.getElementById("footerCategories");

  // Clear existing categories (except "All")
  const existingCategoryCheckboxes = document.querySelectorAll(
    '#categoriesFilter input[name="category"]:not([value="الكل"])'
  );
  existingCategoryCheckboxes.forEach((checkbox) =>
    checkbox.parentElement.remove()
  );

  // Add "All" option if it doesn't exist
  if (!document.querySelector('#categoriesFilter input[value="الكل"]')) {
    const allOption = document.createElement("div");
    allOption.className = "filter-option";
    allOption.innerHTML = `
      <input type="checkbox" id="category-all" name="category" value="الكل" class="text-primary focus:ring-primary" checked>
      <label for="category-all">الكل</label>
    `;
    categoriesFilter.prepend(allOption);
  }

  // Add categories to filter
  categories.forEach((category) => {
    const filterOption = document.createElement("div");
    filterOption.className = "filter-option";
    filterOption.innerHTML = `
      <input type="checkbox" id="category-${category.replace(
        /\s+/g,
        "-"
      )}" name="category" value="${category}" class="text-primary focus:ring-primary">
      <label for="category-${category.replace(
        /\s+/g,
        "-"
      )}">${category}</label>
    `;
    categoriesFilter.appendChild(filterOption);
  });

  // Add categories to footer
  footerCategories.innerHTML = "";
  categories.forEach((category) => {
    const categoryItem = document.createElement("li");
    categoryItem.innerHTML = `<a href="#" class="text-gray-400 hover:text-primary transition-colors">${category}</a>`;
    footerCategories.appendChild(categoryItem);
  });
}

// Mobile Menu Toggle
document.getElementById("mobileMenuBtn").addEventListener("click", function () {
  document.getElementById("mobileMenu").classList.toggle("hidden");
});

// Mobile Filters Toggle
document.querySelector(".mobile-filters-btn").addEventListener("click", function () {
  document.querySelector(".filters-sidebar").classList.add("active");
});

document.querySelector(".close-filters").addEventListener("click", function () {
  document.querySelector(".filters-sidebar").classList.remove("active");
});

// Price Range Slider
const priceRange = document.getElementById("priceRange");
const minPriceValue = document.getElementById("minPriceValue");
const maxPriceValue = document.getElementById("maxPriceValue");

priceRange.addEventListener("input", function () {
  maxPriceValue.textContent = this.value + " درهم";
});

// Initialize products
function initializeProducts() {
  renderProducts(products);
  updateResultsCount(products.length);

  // Set price range max based on highest product price
  if (products.length > 0) {
    const maxProductPrice = Math.max(...products.map(p => p.price));
    priceRange.max = Math.ceil(maxProductPrice / 50) * 50; // Round up to nearest 50
    priceRange.value = priceRange.max;
    maxPriceValue.textContent = priceRange.max + " درهم";
  }
}

// Render products
function renderProducts(productsToRender) {
  const productsGrid = document.getElementById("productsGrid");

  if (!productsToRender || productsToRender.length === 0) {
    productsGrid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium">لا توجد منتجات متطابقة</h3>
        <p class="mt-1 text-gray-500">لم نتمكن من العثور على أي منتجات تطابق معايير البحث الخاصة بك.</p>
        <button id="resetFiltersBtn" class="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors">
          إعادة تعيين الفلاتر
        </button>
      </div>
    `;

    document.getElementById("resetFiltersBtn").addEventListener("click", resetFilters);
    return;
  }

  productsGrid.innerHTML = "";

  productsToRender.forEach((product) => {
    if (!product.visible) return;

    const cartItem = cart.find((item) => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const productElement = document.createElement("div");
    productElement.className = "product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow";
    productElement.innerHTML = `
      <div class="relative">
        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
        ${product.tags.includes("جديد") 
          ? '<div class="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">جديد</div>' 
          : ''}
        ${product.tags.includes("خصم") && product.price < product.originalPrice
          ? '<div class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-' + 
            Math.round((1 - product.price / product.originalPrice) * 100) + '%</div>'
          : ''}
        ${product.tags.includes("الأكثر مبيعاً") 
          ? '<div class="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">الأكثر مبيعاً</div>' 
          : ''}
      </div>
      <div class="p-4">
        <h3 class="font-bold text-lg mb-1">${product.name}</h3>
        <p class="text-gray-600 text-sm mb-3">${product.description}</p>
        <div class="flex justify-between items-center">
          ${product.price < product.originalPrice
            ? `<div>
                <span class="text-primary font-bold text-lg">${product.price.toFixed(2)} درهم</span>
                <span class="text-gray-400 text-sm line-through block">${product.originalPrice.toFixed(2)} درهم</span>
              </div>`
            : `<span class="text-primary font-bold text-lg">${product.price.toFixed(2)} درهم</span>`}
          ${quantity > 0
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
              </button>`}
        </div>
      </div>
    `;
    productsGrid.appendChild(productElement);
  });

  // Add event listeners to cart buttons
  addCartEventListeners();
}

// Add event listeners for all cart interactions
function addCartEventListeners() {
  // Add to cart buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.dataset.id);
      addToCart(productId, 1);
    });
  });

  // Increase quantity buttons
  document.querySelectorAll(".increase-quantity").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.dataset.id);
      addToCart(productId, 1);
    });
  });

  // Decrease quantity buttons
  document.querySelectorAll(".decrease-quantity").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.dataset.id);
      decreaseQuantity(productId);
    });
  });
}

// Add product to cart with specific quantity
function addToCart(productId, quantity) {
  const product = products.find((p) => p.id === productId);

  if (!product) return;

  // Check if product already in cart
  const existingItem = cart.find((item) => item.id === productId);

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
      originalPrice: product.originalPrice,
    });
  }

  updateCart();

  // Show success message only when adding from the "+" button
  if (quantity === 1) {
    Swal.fire({
      title: "تمت الإضافة إلى السلة!",
      text: `${product.name} تمت إضافته إلى سلة التسوق`,
      icon: "success",
      confirmButtonText: "حسناً",
      confirmButtonColor: "#C8A574",
    });
  }
}

// Decrease product quantity in cart
function decreaseQuantity(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity -= 1;

    // Remove item if quantity reaches 0
    if (existingItem.quantity <= 0) {
      cart = cart.filter((item) => item.id !== productId);
    }
  }

  updateCart();
}

// Update cart and UI
function updateCart() {
  updateCartCount();
  filterProducts(); // This will re-render the products with updated quantities

  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cartCount").textContent = cartCount;
}

// Update results count
function updateResultsCount(count) {
  document.getElementById("resultsCount").textContent = count + " منتجات";
}

// Filter products
function filterProducts() {
  const searchTerm = document.getElementById("searchFilter").value.toLowerCase();
  const selectedCategories = Array.from(
    document.querySelectorAll('input[name="category"]:checked')
  ).map((el) => el.value);
  const maxPrice = parseFloat(priceRange.value);
  const selectedTags = Array.from(
    document.querySelectorAll('input[name="tag"]:checked')
  ).map((el) => el.value);
  const sortOption = document.getElementById("sortOptions").value;

  let filteredProducts = products.filter(p => p.visible);

  // Search filter
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
  }

  // Category filter
  if (!selectedCategories.includes("الكل") && selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      selectedCategories.includes(product.categoryName)
    );
  }

  // Price filter
  filteredProducts = filteredProducts.filter(
    (product) => product.price <= maxPrice
  );

  // Tags filter
  if (selectedTags.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      selectedTags.some((tag) => product.tags.includes(tag))
    );
  }

  // Sort products
  filteredProducts = sortProducts(filteredProducts, sortOption);

  renderProducts(filteredProducts);
  updateResultsCount(filteredProducts.length);
}

// Sort products
function sortProducts(productsToSort, sortOption) {
  switch (sortOption) {
    case "price-low":
      return [...productsToSort].sort((a, b) => a.price - b.price);
    case "price-high":
      return [...productsToSort].sort((a, b) => b.price - a.price);
    case "name-asc":
      return [...productsToSort].sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return [...productsToSort].sort((a, b) => b.name.localeCompare(a.name));
    case "newest":
      return [...productsToSort].sort(
        (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
      );
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

  // Reset price range to max
  if (products.length > 0) {
    const maxProductPrice = Math.max(...products.map(p => p.price));
    priceRange.value = Math.ceil(maxProductPrice / 50) * 50;
    maxPriceValue.textContent = priceRange.value + " درهم";
  }

  document.querySelectorAll('input[name="tag"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
  document.getElementById("sortOptions").value = "default";
  document.getElementById("sortOptionsDesktop").value = "default";

  filterProducts();

  // Close mobile filters if open
  document.querySelector(".filters-sidebar").classList.remove("active");
}

// Load cart from localStorage on page load
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

// Event listeners
document.getElementById("applyFilters").addEventListener("click", filterProducts);
document.getElementById("resetFilters").addEventListener("click", resetFilters);
document.getElementById("sortOptions").addEventListener("change", filterProducts);
document.getElementById("sortOptionsDesktop").addEventListener("change", function () {
  document.getElementById("sortOptions").value = this.value;
  filterProducts();
});

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  loadCart();
  
  // Check if we're online before trying to fetch
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
  
  // Add offline/online event listeners
  window.addEventListener('online', () => {
    if (products.length === 0) {
      fetchProducts();
    }
  });
  
  window.addEventListener('offline', () => {
    Swal.fire({
      title: "تم فقدان الاتصال بالإنترنت",
      text: "بعض الميزات قد لا تعمل بدون اتصال.",
      icon: "warning",
      confirmButtonText: "حسناً",
      confirmButtonColor: "#C8A574",
    });
  });

  // Close filters when clicking outside on mobile
  document.addEventListener("click", function (event) {
    const filtersSidebar = document.querySelector(".filters-sidebar");
    const mobileFiltersBtn = document.querySelector(".mobile-filters-btn");

    if (
      filtersSidebar.classList.contains("active") &&
      !filtersSidebar.contains(event.target) &&
      event.target !== mobileFiltersBtn &&
      !mobileFiltersBtn.contains(event.target)
    ) {
      filtersSidebar.classList.remove("active");
    }
  });
});