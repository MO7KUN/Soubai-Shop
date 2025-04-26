<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>إضافة فئة جديدة - Soubai Shop</title>
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

<body class="bg-gray-100 text-black flex flex-col min-h-screen">
    <?php include 'components/header.html'; ?>

    <!-- Main Content -->
    <div class="p-6 md:mr-64">
        <!-- Add margin-top for navbar -->
        <h1 class="text-center text-2xl font-bold text-gray-800 mb-4">
            <i class="fas fa-plus text-yellow-400"></i> إضافة فئة جديدة
        </h1>

        <!-- Error Message -->
        <div id="error-message" class="hidden border border-red-500 rounded-lg p-4 mb-4">
            <p class="text-red-500">
                <i class="fas fa-exclamation-triangle">
                    <span id="error-text"></span>
                </i>
            </p>
        </div>

        <!-- New Category Form -->
        <div class="bg-white rounded-lg shadow p-6">
            <div id="new-category-form">
                <!-- Category Name -->
                <div class="mb-6">
                    <label for="category-name" class="block text-gray-700 mb-2">اسم الفئة</label>
                    <input id="category-name" type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="أدخل اسم الفئة">
                </div>

                <!-- Category Image Upload -->
                <div id="image-preview-container" class="mb-4 ">
                    <div class="relative lg:w-1/4 w-1/2">
                        <label for="fileInput2"
                            class="cursor-pointer w-full h-full rounded-sm flex items-center justify-center bg-gray-100">
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

                <!-- Actions -->
                <div class="flex justify-end gap-4">
                    <button type="button"
                        class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                    <button type="button" onclick="addCategory()"
                        class="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300">
                        <i class="fas fa-save"></i> حفظ الفئة
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="JS/categorys.js"></script>
</body>

</html>