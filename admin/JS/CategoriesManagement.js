document.addEventListener("DOMContentLoaded", function () {
  sidebarhandeler("gererCategorys");

  if (!userId || !permissions || !token) {
    window.location.href = "index.html";
    return;
  }

  const PermissionsArray = permissions.split("&");
  if (!PermissionsArray.includes("gererCategorys")) {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "index.html";
    }
    return;
  }

  const errorMessage = document.getElementById("error-message");
  const form = document.getElementById("new-category-form");
  const categoryNameInput = document.getElementById("category-name");
  const categoryImageInput = document.getElementById("fileInput2");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const categoryName = categoryNameInput.value.trim();
    const categoryImageFile = categoryImageInput.files[0];

    if (!categoryName) {
      errorMessage.classList.remove("hidden");
      errorMessage.querySelector("span").textContent = "يرجى ادخال اسم الفئة";
      return;
    }

    if (categoryImageFile && categoryImageFile.size > 2048 * 1024) {
      // 2048 KB = 2048 * 1024 bytes
      errorMessage.classList.remove("hidden");
      errorMessage.querySelector("span").textContent =
        "صورة الفئة يجب ان تكون اقل من 2MB";
      return;
    }

    try {
      let imageUrl = null;

      // Upload image if provided
      const formData = new FormData();
      if (categoryImageFile) {
        formData.append("image", categoryImageFile, categoryName + ".jpg");
      }
      formData.append("label", categoryName);

      const response = await fetch("https://sbaishop.com/api/category", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("فشل تحميل الصورة");
      }

      const Data = await response.json();
      imageUrl = Data.imageUrl;

      // Send category data
      if (
        response.status == 422 &&
        response.errors.label == "The label has already been taken."
      ) {
        alert("اسم الفئة مستخدم من قبل");
      } else if (response.status === 422) {
        throw new Error("البيانات غير صالحة، يرجى التحقق من المدخلات");
      } else if (response.status === 500) {
        throw new Error("خطأ داخلي في الخادم، يرجى المحاولة لاحقًا");
      } else if (!response.ok) {
        throw new Error("فشل إضافة الفئة");
      }

      alert("تمت إضافة الفئة بنجاح");
      window.location.href = "Categories.html";
    } catch (error) {
      console.error("حدث خطأ:", error);
    }
  });
});

// Image upload and preview
var loadFile = function (event, uploaderId) {
  var input = event.target;
  var file = input.files[0];
  var output = document.getElementById("preview_img" + uploaderId);
  var deleteButton = document.getElementById("deleteButton" + uploaderId);

  if (file) {
    output.src = URL.createObjectURL(file);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // Free memory
      deleteButton.classList.remove("hidden");
    };
  }
};

function deleteImage(uploaderId) {
  var output = document.getElementById("preview_img" + uploaderId);
  var deleteButton = document.getElementById("deleteButton" + uploaderId);
  var fileInput = document.getElementById("fileInput" + uploaderId);
  var defaultImageURL =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Plus_symbol.svg/500px-Plus_symbol.svg.png";

  // Reset the image preview
  output.src = defaultImageURL;
  deleteButton.classList.add("hidden");
  fileInput.value = ""; // Clear the file input
}
let categoryID = null;

function updateCategory() {
  const successMessage = document.getElementById("success-message");
  const categoryName = document.getElementById("categoryName").value;
  const categoryImage = document.getElementById("fileInput2").files[0];

  if (!categoryName) {
    document.getElementById("categoryNameError").innerText =
      "يرجى ادخال اسم الفئة";
    return;
  }

  if (categoryImage && categoryImage.size > 2 * 1024 * 1024) {
    document.getElementById("categoryImageError").classList.remove("hidden");
    return;
  }

  let imageUrl = null;

  // Upload image if provided
  const formData = new FormData();
  if (categoryImage) {
    formData.append("image", categoryImage);
  }
  formData.append("label", categoryName);
  fetch(`https://sbaishop.com/api/category/${categoryID}/edit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        closeUpdateModal();
        successMessage.classList.remove("hidden");
        fetchCategorys();
      } else {
        throw response;
      }
    })
    .catch((response) => {
      if (response.status === 401) {
        logout();
      } else if (response.status === 422) {
        document.getElementById("categoryNameError").innerText =
          "اسم الفئة موجود بالفعل";
      } else if (response.status === 500) {
        document.getElementById("error-message1").classList.remove("hidden");
      } else {
        closeUpdateModal();
        document.getElementById("error-message").classList.remove("hidden");
      }
    });
}

// Function to open the update modal
function openUpdateModal(category) {
  categoryID = category.id;
  document.getElementById("categoryName").value = category.label;
  document.getElementById("preview_img2").src = category.image_url; // Clear file input
  document.getElementById("updateModal").classList.remove("hidden");
}

// Function to close the update modal
function closeUpdateModal() {
  document.getElementById("updateModal").classList.add("hidden");
  categoryID = null;
}
