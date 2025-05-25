// Global variables
let products = [];
let cart = [];

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  loadCart();
  fetchCategories();
  fetchDiscountedProducts();
  fetchFeaturedProducts()
    .then(() => {
      setupCartButtons();
    })
    .catch((error) => {
      console.error("Error initializing products:", error);
      handleFetchError(error);
    });

  //clear the search input initially
  //add an event listener on search-input
  document.querySelectorAll('.search-input').forEach((input) => {
    input.value = ""
    input.addEventListener('input', (event) => {
      const value = event.target.value;
      window.location.href = "products.html?q=" + encodeURIComponent(value);
    });
  });
});

// Enhanced fetch function with retry logic
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      
      await new Promise((resolve) => setTimeout(resolve, delay));
      return await fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Show loading indicator
function showLoadingIndicator() {
  const productsContainer = document.getElementById("Products-grid");
  if (productsContainer) {
    const loader = document.createElement("div");
    loader.className = "col-span-full text-center py-12";
    loader.innerHTML = `
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <h3 class="mt-4 text-lg font-medium">جاري تحميل المنتجات...</h3>
        `;
    productsContainer.innerHTML = "";
    productsContainer.appendChild(loader);
  }
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

  const errorElement = document.getElementById("Products-error-message");
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.classList.remove("hidden");
  }

  Swal.fire({
    title: "خطأ في تحميل المنتجات",
    text: errorMessage,
    icon: "error",
    confirmButtonText: "حسناً",
    confirmButtonColor: "#C8A574",
  });
}

// Fetch featured products (renamed from fetchprod)
async function fetchFeaturedProducts() {
  showLoadingIndicator();

  return fetchWithRetry(
    "https://sbaishop.com/api/website/featured-products?limit=4",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((data) => {

      // Check if the response is valid
      if (!data || !Array.isArray(data)) {
        console.error("❌ Invalid data structure:", data);
        throw new Error("Invalid data structure");
      }

      // Check if the response is empty
      if (data.length === 0) {
        const errormessage = document.getElementById("Products-error-message");
        if (errormessage) {
          errormessage.textContent = "لا توجد فئات متاحة حالياً";
          errormessage.classList.remove("hidden");
        }
        throw new Error("No products available");
      }

      // Store products globally
products = [
        ...products,
        ...data.map((product) => ({
          id: product.id,
          label: product.label,
          image_url: product.image_url,
          selling_price: product.selling_price,
          discount_price: product.discount_price,
        })),
      ];

      // products = data.map((product) => ({
      //   id: product.id,
      //   label: product.label,
      //   image_url: product.image_url,
      //   selling_price: product.selling_price,
      //   discount_price: product.discount_price,
      //   is_visible: product.is_visible,
      // }));

      const ProductsGrid = document.getElementById("Products-grid");
      if (ProductsGrid) {
        ProductsGrid.innerHTML = ""; // Clear existing content

        data.forEach((product) => {
          // Check if product is valid
          if (product.is_visible) {
            
            const productcard = document.createElement("div");
            productcard.className =
              "product-card bg-white rounded-lg w-full shadow-md hover:shadow-lg transition-shadow cursor-pointer";

            // Add click handler for product card
            productcard.addEventListener("click", function () {
              window.location.href = `product.html?id=${product.id}`;
            });

            const cartItem = cart.find((item) => item.id == product.id);
            const quantity = cartItem ? cartItem.quantity : 0;

            if (product.discount_price) {
              productcard.innerHTML = `
                <div class="relative">
                  <img src="${product.image_url}"
                      alt="${product.label}"
                      class="w-full h-64 object-cover" loading="lazy">
                  <span class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">خصم</span>
                </div>
                <div class="p-4">
                  <h3 class="font-medium text-md md:text-lg mb-2">${product.label}</h3>
                  <div class="flex justify-between items-center">
                    <div>
                      <span class="font-bold text-primary text-md md:text-lg">${product.discount_price
                } درهم</span>
                      <span class="font-light text-dark text-sm md:text-md line-through block">${product.selling_price
                } درهم</span>
                    </div>
                    <div class="add-to-cart-container" data-id="${product.id}">
                      ${quantity > 0
                  ? `
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
                      `
                  : `
                        <button class="add-to-cart bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors" data-id="${product.id}">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                        </button>
                      `
                }
                    </div>
                  </div>
                </div>
              `;
            } else {
              productcard.innerHTML = `
                <div class="relative">
                  <img src="${product.image_url}"
                      alt="${product.label}"
                      class="w-full h-64 object-cover" loading="lazy">
                </div>
                <div class="p-4">
                  <h3 class="font-medium text-lg mb-2">${product.label}</h3>
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-primary text-lg">${product.selling_price
                } درهم</span>
                    <div class="add-to-cart-container" data-id="${product.id}">
                      ${quantity > 0
                  ? `
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
                      `
                  : `
                        <button class="add-to-cart bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors" data-id="${product.id}">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                        </button>
                      `
                }
                    </div>
                  </div>
                </div>
              `;
            }

            ProductsGrid.appendChild(productcard);
          }
        });
      }

      return data;
    })
    .catch((error) => {
      console.error("❌ Error fetching products:", error);
      handleFetchError(error);
      throw error;
    });
}

// Mobile Menu Toggle
document
  .getElementById("mobileMenuBtn")
  ?.addEventListener("click", function () {
    document.getElementById("mobileMenu").classList.toggle("hidden");
  });

// Add to cart functionality
async function setupCartButtons() {
  if (!products || !Array.isArray(products)) {
    console.error("Products not loaded yet");
    return;
  }

  document.querySelectorAll(".add-to-cart-container").forEach((container) => {
    const productId = container.dataset.id;
    const product = products.find((p) => p.id == productId);
    

    if (!product) {
      console.error("Product not found:", productId);
      return;
    }

    const cartItem = cart.find((item) => item.id == productId);
    const quantity = cartItem ? cartItem.quantity : 0;

    container.innerHTML =
      quantity > 0
        ? `
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
        `
        : `
            <button class="add-to-cart bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors" data-id="${productId}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
            </button>
        `;
  });

  // Add event listeners to new buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent triggering the card click
      const productId = this.dataset.id;
      addToCart(productId, 1);
    });
  });

  document.querySelectorAll(".increase-quantity").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent triggering the card click
      const productId = this.dataset.id;
      addToCart(productId, 1);
    });
  });

  document.querySelectorAll(".decrease-quantity").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent triggering the card click
      const productId = this.dataset.id;
      decreaseQuantity(productId);
    });
  });
}

// Add product to cart with specific quantity
async function addToCart(productId, quantity) {
  const product = products.find((p) => p.id == productId);

  if (!product) {
    console.error("Product not found:", productId);
    return;
  }

  // Check if product already in cart
  const existingItem = cart.find((item) => item.id == productId);

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

// Decrease product quantity in cart
async function decreaseQuantity(productId) {
  const existingItem = cart.find((item) => item.id == productId);

  if (existingItem) {
    existingItem.quantity -= 1;

    // Remove item if quantity reaches 0
    if (existingItem.quantity <= 0) {
      cart = cart.filter((item) => item.id != productId);
    }
  }

  updateCart();
}

// Update cart and UI
function updateCart() {
  updateCartCount();
  setupCartButtons();

  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

// Load cart from localStorage on page load
async function loadCart() {
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

// Initialize categories swiper
async function initCategoriesSwiper() {
  const swiperEl = document.querySelector(".swiper-container");
  if (!swiperEl) return;

  const slides = swiperEl.querySelectorAll(".swiper-slide");
  const shouldLoop = slides.length > 3; // Only enable loop if enough slides

  return new Swiper(".swiper-container", {
    loop: shouldLoop,
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: ".swiper-pagination",
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
    },
  });
}

async function fetchDiscountedProducts() {
  
  showLoadingIndicator("promotions-grid");

  return fetchWithRetry(
    "https://sbaishop.com/api/website/discounted-products?limit=3",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((data) => {
      

      if (!data || !Array.isArray(data)) {
        console.error("❌ Invalid data structure:", data);
        throw new Error("Invalid data structure");
      }

      if (data.length === 0) {
        const errormessage = document.getElementById("promotions-error-message");
        if (errormessage) {
          errormessage.textContent = "لا توجد عروض متاحة حالياً";
          errormessage.classList.remove("hidden");
        }
        throw new Error("No promotions available");
      }

      // Merge with existing products
      products = [
        ...products,
        ...data.map((product) => ({
          id: product.id,
          label: product.label,
          image_url: product.image_url,
          selling_price: product.selling_price,
          discount_price: product.discount_price,
        })),
      ];

      const promotionsGrid = document.getElementById("promotions-grid");
      if (promotionsGrid) {
        promotionsGrid.innerHTML = "";

        data.forEach((product) => {
          const promotionscard = document.createElement("div");
          promotionscard.className =
            "product-card bg-white rounded-lg w-full shadow-md hover:shadow-lg transition-shadow cursor-pointer";

          // Add click handler for product card
          promotionscard.addEventListener("click", function (e) {
            // Check if the click was on a button or its children
            if (!e.target.closest(".add-to-cart-container, .add-to-cart, .quantity-selector, .quantity-btn")) {
              window.location.href = `product.html?id=${product.id}`;
            }
          });

          const cartItem = cart.find((item) => item.id == product.id);
          const quantity = cartItem ? cartItem.quantity : 0;

          promotionscard.innerHTML = `
            <div class="relative">
              <img src="${product.image_url}"
                  alt="${product.label}"
                  class="w-full h-64 object-cover" loading="lazy">
              ${product.discount_price ? 
                `<span class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">خصم</span>` 
                : ''}
            </div>
            <div class="p-4">
              <h3 class="font-medium text-lg mb-2">${product.label}</h3>
              <div class="flex justify-between items-center">
                <div>
                  ${product.discount_price ? 
                    `<span class="font-bold text-primary text-lg">${product.discount_price} درهم</span>
                     <span class="font-light text-dark text-md line-through block">${product.selling_price} درهم</span>`
                    : `<span class="font-bold text-primary text-lg">${product.selling_price} درهم</span>`}
                </div>
                <div class="add-to-cart-container" data-id="${product.id}">
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
            </div>
          `;

          promotionsGrid.appendChild(promotionscard);
          
          // Add event listeners immediately
          const container = promotionscard.querySelector('.add-to-cart-container');
          if (container) {
            const addBtn = container.querySelector('.add-to-cart');
            const increaseBtn = container.querySelector('.increase-quantity');
            const decreaseBtn = container.querySelector('.decrease-quantity');
            
            if (addBtn) {
              addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(product.id, 1);
              });
            }
            if (increaseBtn) {
              increaseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(product.id, 1);
              });
            }
            if (decreaseBtn) {
              decreaseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                decreaseQuantity(product.id);
              });
            }
          }
        });
      }

      return data;
    })
    .catch((error) => {
      console.error("❌ Error fetching discounted products:", error);
      handleFetchError(error);
      throw error;
    });
}
async function fetchCategories() {
  
  // Show loading state
  document.getElementById("Categories-loading").style.display = "block";
  document.querySelector(".swiper-container").style.display = "none";
  document.getElementById("Categories-error-message").classList.add("hidden");

  fetch("https://sbaishop.com/api/website/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const categoriesContainer = document.getElementById("Categories");
      categoriesContainer.innerHTML = "";

      

      // Check if data is an array
      if (!Array.isArray(data)) {
        throw new Error("Invalid data structure: expected array");
      }

      // Check if array is empty
      if (data.length === 0) {
        const errormessage = document.getElementById(
          "Categories-error-message"
        );
        errormessage.textContent = "لا توجد فئات متاحة حالياً";
        hideloader();
        errormessage.classList.remove("hidden");
        return;
      }

      // Process categories
      data.forEach((category) => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        slide.innerHTML = `
            <a href="category.html?id=${category.id}" class="category-item text-center">
              <div class="category-item text-center" onclick="window.location.href = 'category.html?id=${category.id}'">
                <div class="bg-white rounded-lg shadow-md p-6 mb-4 overflow-hidden">
                  <img src="${category.image_url}" alt="${category.label}" class="w-full h-24 object-cover mx-auto " loading="lazy">
                </div>
                <h3 class="font-medium">${category.label}</h3>
              </div>
            </a>
          `;
        categoriesContainer.appendChild(slide);
      });

      hideloader();
      initCategoriesSwiper();
    })
    .catch((error) => {
      console.error("Error:", error);
      const errormessage = document.getElementById("Categories-error-message");

      if (error.message.includes("404")) {
        errormessage.textContent = "لم يتم العثور على الفئات";
      } else if (error.message.includes("500")) {
        errormessage.textContent = "حدث خطأ داخلي في الخادم";
      } else {
        errormessage.textContent = "حدث خطأ أثناء جلب البيانات";
      }

      hideloader();
      errormessage.classList.remove("hidden");
    });
}

function hideloader() {
  // Hide loading state
  document.getElementById("Categories-loading").style.display = "none";
  document.querySelector(".swiper-container").style.display = "block";
}
