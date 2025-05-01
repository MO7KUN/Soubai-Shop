function fetchprod() {
  console.log("Fetching featured products..."); // Log for debugging
  return fetch("https://sbaishop.com/api/website/featured-products?limit=4", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("✅ API response:", data); // Log for debugging

      // Check if the response is valid (now checking if data itself is an array)
      if (!data || !Array.isArray(data)) {
        console.error("❌ Invalid data structure:", data);
        document.getElementById("Products-error-message").textContent =
          "حدث خطأ داخلي في الخادم"; // Show error message
        document
          .getElementById("Products-error-message")
          .classList.remove("hidden"); // Show error message
        return Promise.reject("Invalid data structure");
      }

      // Check if the response is empty
      if (data.length === 0) {
        const errormessage = document.getElementById("Products-error-message");
        errormessage.textContent = "لا توجد فئات متاحة حالياً";
        errormessage.classList.remove("hidden");
        return Promise.reject("No products available");
      }

      // Store products globally
      products = data.map((product) => ({
        id: product.id,
        label: product.label,
        description: product.description || "لا يوجد وصف",
        image: product.image_url,
        price: product.discount_price || product.selling_price,
        originalPrice: product.selling_price,
      }));

      const ProductsGrid = document.getElementById("Products-grid");
      ProductsGrid.innerHTML = ""; // Clear existing content

      data.forEach((product) => {
        // Check if product is valid
        if (product.is_visible) {
          console.log("Product:", product);
          const productcard = document.createElement("div");
          productcard.className =
            "product-card bg-white rounded-lg w-full shadow-md";
          productcard.addEventListener("click", function () {
            window.location.href = `product.html?id=${product.id}`;
          });

          if (product.discount_price) {
            productcard.innerHTML = `
                    <div class="relative">
                        <img src="${product.image_url}"
                            alt="${product.label}"
                            class="w-full h-64 object-cover" loading="lazy">
                        <span class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">خصم</span>
                    </div>
                    <div class="p-4">
                        <h3 class="font-medium text-lg mb-2">${product.label}</h3>
                        <div class="flex justify-between items-center">
                            <span
                                class="font-bold text-primary text-lg">${product.discount_price} درهم</span>
                            <span
                                class="font-light text-dark text-md line-through">${product.selling_price} درهم</span>
                                <div class="add-to-cart-container" data-id="${product.id}">
                                <button
                                    class="add-to-cart bg-primary text-white px-3 py-1 rounded-full hover:bg-secondary transition-colors">
                                   +
                                </button>
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
                            <span
                                class="font-bold text-primary text-lg">${product.selling_price}
                                درهم</span>
                            <div class="add-to-cart-container" data-id="${product.id}">
                                <button
                                    class="add-to-cart bg-primary text-white px-3 py-1 rounded-full hover:bg-secondary transition-colors">
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                `;
          }

          ProductsGrid.appendChild(productcard);
        }
      });

      return data; // Return the data for chaining
    })
    .catch((error) => {
      console.error("❌ Error fetching products:", error);
      document.getElementById("Products-error-message").textContent =
        "حدث خطأ داخلي في الخادم"; // Show error message
      document
        .getElementById("Products-error-message")
        .classList.remove("hidden"); // Show error message
      return Promise.reject(error);
    });
}
