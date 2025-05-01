function fetchCategories() {
  console.log("Fetching categories...");
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

      console.log("✅ API response:", data);

      // Check if data is an array
      if (!Array.isArray(data)) {
        throw new Error("Invalid data structure: expected array");
      }

      // Check if array is empty
      if (data.length === 0) {
        const errormessage = document.getElementById("Categories-error-message");
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
