async function fetchCategories() {
    const response = await fetch('https://sbaishop.com/api/categories');
    const categories = await response.json();

    const categoriesGrid = document.getElementById('categories-grid');
    categoriesGrid.innerHTML = '';

    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('bg-white', 'rounded-lg', 'p-4', 'hover:shadow-lg', 'transition', 'duration-300');

        const categoryImage = document.createElement('img');
        categoryImage.src = category.image;
        categoryImage.alt = category.name;
        categoryImage.classList.add('w-full', 'h-64', 'object-cover', 'rounded-t-lg');

        const categoryName = document.createElement('h2');
        categoryName.textContent = category.name;
        categoryName.classList.add('text-lg', 'font-bold', 'text-black');

        categoryElement.appendChild(categoryImage);
        categoryElement.appendChild(categoryName);

        categoriesGrid.appendChild(categoryElement);
    });
}
