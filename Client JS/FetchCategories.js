function fetchCategories() {
  // Show loading state
  document.getElementById("Categories-loading").style.display = "block";
  document.querySelector(".swiper-container").style.display = "none";
  document.getElementById("Categories-error-message").classList.add("hidden");

  try {
    fetch("https://sbaishop.com/api/categorys", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const categoriesContainer = document.getElementById("Categories");
        categoriesContainer.innerHTML = ""; // Clear previous content

        console.log("✅ API response:", data); // Log for debugging
        // Check if the response is valid
        if (!data || !Array.isArray(data.categories)) {
          console.error("❌ Invalid data structure:", data);
          document.getElementById("Categories-error-message").textContent =
            "حدث خطأ داخلي في الخادم"; // Show error message
          document
            .getElementById("Categories-error-message")
            .classList.remove("hidden"); // Show error message
          return;
        }
        // Check if the response is empty
        if (data.categories.length === 0) {
          const errormessage = document.getElementById(
            "Categories-error-message"
          );
          errormessage.textContent = "لا توجد فئات متاحة حالياً";
          errormessage.classList.remove("hidden");
          return;
        }
        // Check if the response is an array
        if (!Array.isArray(data.categories)) {
          console.error("❌ Invalid data structure:", data);
          document.getElementById("Categories-error-message").textContent =
            "حدث خطأ داخلي في الخادم"; // Show error message
          document
            .getElementById("Categories-error-message")
            .classList.remove("hidden"); // Show error message
          return;
        }

        // Check if data exists and has the expected structure
        if (data && data.categories) {
          data.categories.forEach((category) => {
            console.log(category);
            const slide = document.createElement("div");
            slide.className = "swiper-slide";

            slide.innerHTML = `
            <a href="category.html?id=${category.id}" class="category-item text-center">
                             <div class="category-item text-center" onclick="window.location.href = 'category.html?id=${category.id}'">
                                 <div class="bg-white rounded-lg shadow-md p-6 mb-4 overflow-hidden">
                                     <img src="${category.image_url}" alt="${category.label}" class="w-full h-24 object-cover mx-auto transition-transform duration-300">
                                 </div>
                                 <h3 class="font-medium">${category.label}</h3>
                             </div>
                          </a>
                         `;
            categoriesContainer.appendChild(slide);
          });
          document.getElementById("Categories-loading").style.display = "none";
          document.querySelector(".swiper-container").style.display = "block";
        } else {
          const errormessage = document.getElementById(
            "Categories-error-message"
          );
          errormessage.textContent = "لا توجد فئات متاحة حالياً";
          errormessage.classList.remove("hidden");
        }
      });
  } catch (error) {
    // Handle any errors that occur during the fetch
    const errormessage = document.getElementById("Categories-error-message");
    if (error.status === 404) {
      // Handle 404 error specifically if needed
      console.error("❌ 404 Not Found:", error);
      errormessage.textContent = "لم يتم العثور على الفئات";
    } else if (error.status === 500) {
      // Handle 500 error specifically if needed
      console.error("❌ 500 Internal Server Error:", error);
      errormessage.textContent = "حدث خطأ داخلي في الخادم";
    }
  }
}
