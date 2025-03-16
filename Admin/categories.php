<!DOCTYPE html>
<html lang="ar">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>الفئات - Soubai Shop</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        body {
            font-family: 'Tajawal', sans-serif;
            padding-top: 64px;
        }

        /* Add padding for navbar */
    </style>
</head>

<body class="bg-gray-100 text-black flex flex-col min-h-screen" dir="rtl">
    <?php include 'components/header.html'; ?>

    <!-- Main Content -->
    <div class="p-6 md:mr-64">
        <!-- Add Category Button -->
        <div class="flex justify-between align-center mb-6">
            <h1 class="text-center text-2xl font-bold text-black md:text-800 mb-4">
                <i class="fas fa-list text-yellow-400"></i> الفئات
            </h1>
            <a href="NewCategory.html"
                class="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300">
                <i class="fas fa-plus"></i> إضافة فئة
            </a>
        </div>

        <!-- Error Message -->
        <div id="error-message" class="hidden border border-red-500 rounded-lg p-4 mb-4">
            <p class="text-red-500">حدث خطأ ما. يرجى المحاولة مرة أخرى</p>
        </div>

        <!-- success Message -->
        <div id="success-message" class="hidden border border-green-500 rounded-lg p-4 mb-4">
            <p class="text-green-500">تمت العملية بنجاح</p>
        </div>

        <!-- Categories Grid -->
        <div id="categories-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        </div>
    </div>

    <!-- Update Category Modal -->
    <div id="updateModal"
        class="fixed inset-0 bg-black bg-opacity-50 hidden place-items-center h-screen grid justify-center items-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-96 p-6">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-gray-800 mb-4">تحديث
                    الفئة</h2>
                <button type="button" onclick="closeUpdateModal()"
                    class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"><i
                        class="fas fa-times"></i></button>
            </div>
            <!-- Error Message -->
            <div id="error-message1" class="hidden border border-red-500 rounded-lg p-4 mb-4">
                <p class="text-red-500">
                    <i class="fas fa-exclamation-triangle"></i>
                    حدث خطأ في الخادم، يرجى المحاولة مرة أخرى
                </p>
            </div>
            <div id="updateForm">
                <div class="mb-4">
                    <label for="categoryName" class="block text-gray-700 mb-2">اسم الفئة</label>
                    <input type="text" id="categoryName"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required>
                    <p id="categoryNameError" class="text-red-500 mt-1"> </p>
                </div>
                <div class="mb-4">
                    <div class="relative w-full">
                        <label for="fileInput2"
                            class="cursor-pointer w-full h-full rounded-sm flex items-center justify-center bg-gray-100 ">
                            <img id="preview_img2" class="h-32 w-full object-contain rounded-sm p-0"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Plus_symbol.svg/500px-Plus_symbol.svg.png"
                                alt />
                            <div
                                class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 rounded-sm opacity-0 hover:opacity-100 transition-opacity">
                                <span class="text-white text-3xl">+</span>
                            </div>
                        </label>
                        <button type="button" id="deleteButton2"
                            class="hidden absolute top-0 right-0 p-0 text-yellow-500 font-black shadow-lg"
                            onclick="deleteImage(2)">
                            <span class="sr-only">Delete</span>
                            <span class="text-lg">&times;</span>
                        </button>
                        <input id="fileInput2" name="fileInput2" type="file" accept="image/*"
                            onchange="loadFile(event, 2)" hidden>
                    </div>
                    <p id="categoryImageError" class="text-red-500 hidden mt-1"> الصورة لا يجب ان
                        تتخطى 2 ميغابايت </p>
                </div>
                <div class="flex justify-end gap-4">
                    <button type="button" onclick="deleteCategory()"
                        class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"><i
                            class="fas fa-trash"></i></button>
                    <button type="submit" onclick="updateCategory()"
                        class="bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-500 transition duration-300"><i
                            class="fas fa-save"></i></button>
                </div>
            </div>
        </div>
    </div>
    <script src="JS/categorys.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            sidebarhandeler("gererCategorys");
            // Fetch categories from the API
            fetchCategorys();
        })
        async function fetchCategorys() {

            fetch('https://sbaishop.com/api/categorys', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw response; // Throw the response to handle errors
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('API response:', data); // Log the response for debugging

                    // Check if the data structure is valid
                    if (data && Array.isArray(data.categories)) {
                        const categories = data.categories;
                        const categorySelect = document.getElementById('categories-grid');

                        // Clear existing content (if any)
                        categorySelect.innerHTML = '';

                        // Create and append category cards
                        categories.forEach(category => {
                            const card = document.createElement('div');
                            const cardImage = document.createElement('img');
                            const cardTitlePlace = document.createElement('div');
                            const cardTitle = document.createElement('h3');

                            // Add classes and content
                            cardTitlePlace.classList.add('card-title-place');
                            cardTitlePlace.classList.add('text-center');
                            cardTitlePlace.classList.add('p-4');
                            cardTitle.classList.add('text-lg', 'font-semibold', 'mb-2');
                            cardTitle.textContent = category.label;
                            cardImage.src = category.image_url;
                            cardImage.alt = category.label;
                            cardImage.classList.add('w-full', 'h-48', 'object-cover');
                            card.classList.add('bg-white', 'rounded-lg', 'shadow-lg', 'overflow-hidden',
                                'cursor-pointer');

                            // Add click event to open update modal
                            card.addEventListener('click', () => {
                                openUpdateModal(category);
                            });

                            // Append elements to the card
                            card.appendChild(cardImage);
                            cardTitlePlace.appendChild(cardTitle);
                            card.appendChild(cardTitlePlace);

                            // Append the card to the grid
                            categorySelect.appendChild(card);
                        });
                    } else {
                        console.error('Invalid data structure:', data);
                        document.getElementById('error-message').classList.remove('hidden'); // Show error message
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    if (error.json) {
                        // Handle API errors (e.g., 401, 403, 500)
                        error.json().then(err => {
                            console.error('API error:', err);
                            if (error.status === 401 || error.status === 403) {
                                window.location.href = "index.html"; // Redirect if unauthorized
                            } else {
                                document.getElementById('error-message').classList.remove(
                                    'hidden'); // Show error message
                            }
                        });
                    } else {
                        // Handle network errors (e.g., no internet connection)
                        console.error('Network error:', error);
                        document.getElementById('error-message').classList.remove('hidden'); // Show error message
                    }
                });
        }
    </script>
</body>


</html>