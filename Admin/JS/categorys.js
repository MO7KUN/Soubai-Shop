let apiUrl = "https://sbaishop.com/api"

async function fetchCategorys() {
    try {
        const response = await fetch(apiUrl + '/categorys', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Attempt to parse error response
            throw { status: response.status, message: errorData.message || "حدث خطأ أثناء جلب الفئات" };
        }

        const data = await response.json();
        console.log('✅ API response:', data); // Log for debugging

        if (!data || !Array.isArray(data.categories)) {
            console.error('❌ Invalid data structure:', data);
            document.getElementById('error-message').classList.remove('hidden'); // Show error message
            return;
        }

        const categorySelect = document.getElementById('categories-grid');
        categorySelect.innerHTML = ''; // Clear existing content

        data.categories.forEach(category => {
            const card = document.createElement('div');
            card.classList.add('bg-white', 'rounded-lg', 'shadow-lg', 'overflow-hidden', 'cursor-pointer');
            card.addEventListener('click', () => openUpdateModal(category));

            let cardImage;
            if (category.image_url !== null) {
                cardImage = document.createElement('img');
                cardImage.src = category.image_url;
                cardImage.alt = category.label;
                cardImage.classList.add('w-full', 'h-48', 'object-cover');
            } else {
                cardImage = document.createElement('div');
                cardImage.classList.add('w-full', 'h-48', 'bg-gray-200');
            }

            const cardTitlePlace = document.createElement('div');
            cardTitlePlace.classList.add('card-title-place', 'text-center', 'p-4');

            const cardTitle = document.createElement('h3');
            cardTitle.classList.add('text-lg', 'font-semibold', 'mb-2');
            cardTitle.textContent = category.label;

            cardTitlePlace.appendChild(cardTitle);
            card.appendChild(cardImage);
            card.appendChild(cardTitlePlace);
            categorySelect.appendChild(card);
        });

    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        errorsHandler(error.status)
    }
}

async function addCategory() {
    const categoryNameInput = document.getElementById("category-name");
    const categoryImageInput = document.getElementById("fileInput2");

    const categoryName = categoryNameInput.value.trim();
    const categoryImageFile = categoryImageInput.files[0];

    // Validate Category Name
    if (!categoryName) {
        return Swal.fire({
            icon: "error",
            title: "خطأ",
            text: "يرجى إدخال اسم الفئة",
        });
    }

    // Validate Image Size
    if (categoryImageFile && categoryImageFile.size > 2048 * 1024) {
        return Swal.fire({
            icon: "error",
            title: "خطأ",
            text: "صورة الفئة يجب أن تكون أقل من 2MB",
        });
    }

    try {
        // Prepare FormData
        const formData = new FormData();
        formData.append("label", categoryName);
        if (categoryImageFile) {
            formData.append("image", categoryImageFile, categoryName + ".jpg");
        }

        const response = await fetch(apiUrl + "/category", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        const data = await response.json().catch(() => ({})); // Handle invalid JSON response

        if (!response.ok) {
            if (response.status === 422) {
                if (data.errors?.label?.includes("has already been taken")) {
                    return Swal.fire({
                        icon: "error",
                        title: "خطأ",
                        text: "اسم الفئة مستخدم من قبل",
                    });
                } else {
                    return Swal.fire({
                        icon: "error",
                        title: "خطأ",
                        text: "البيانات غير صالحة، يرجى التحقق من المدخلات",
                    });
                }
            } else if (response.status === 500) {
                return Swal.fire({
                    icon: "error",
                    title: "خطأ داخلي",
                    text: "خطأ داخلي في الخادم، يرجى المحاولة لاحقًا",
                });
            } else {
                errorsHandler(response.status);
            }
        }

        // Success Message
        Swal.fire({
            icon: "success",
            title: "تم التسجيل",
            text: "تم تسجيل معلومات الفئة بنجاح",
            showConfirmButton: false,
            timer: 1200,
        });

    } catch (error) {
        console.error("❌ حدث خطأ:", error);
        Swal.fire({
            icon: "error",
            title: "خطأ",
            text: "تعذر تسجيل الفئة، يرجى المحاولة لاحقًا",
        });
    }
}


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
    fetch(apiUrl + `/category/${categoryID}/edit`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    })
        .then((response) => {
            if (response.ok) {
                closeUpdateModal();
                Swal.fire({
                    icon: "success",
                    title: "تم تحديث الفئة",
                    text: "تم تحديث معلومات الفئة بنجاح",
                    showConfirmButton: false,
                    timer: 1200,
                });
                fetchCategorys();
            } else {
                throw response;
            }
        })
        .catch((response) => {
            errorsHandler(response.status); // Pass only response.status
        });
}

async function deleteCategory(id) {
    const confirmation = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تتمكن من التراجع عن هذا الإجراء!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "نعم، احذفها",
        cancelButtonText: "إلغاء",
    });

    if (confirmation.isConfirmed) {
        try {
            const response = await fetch(apiUrl + `/category/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete category");
            }

            fetchCategorys(); // Refresh the categories list
            Swal.fire({
                icon: "success",
                title: "تم الحذف",
                text: "تم حذف الفئة بنجاح",
                showConfirmButton: false,
                timer: 1000,
            });
            closeUpdateModal()

        } catch (error) {
            console.error("❌ Error deleting category:", error);
            Swal.fire({
                icon: "error",
                title: "خطأ",
                text: "تعذر حذف الفئة، يرجى المحاولة لاحقًا",
            });
        }
    }
}

// Function to open the update modal
function openUpdateModal(category) {
    categoryID = category.id;
    document.getElementById("categoryName").value = category.label;
    if (category.image_url) {
        document.getElementById("preview_img2").src = category.image_url;
    } else {
        document.getElementById("preview_img2").src = null
    }
    document.getElementById("updateModal").classList.remove("hidden");
    document.getElementById("deleteCategoryBtn").addEventListener("click", () => deleteCategory(category.id));
}

// Function to close the update modal
function closeUpdateModal() {
    document.getElementById("updateModal").classList.add("hidden");
    categoryID = null;
}
