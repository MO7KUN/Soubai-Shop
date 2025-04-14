function fetchCategories() {

    try {
        fetch('https://sbaishop.com/api/categorys', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                const categoriesContainer = document.getElementById('Categories');

                // Check if data exists and has the expected structure
                if (data && data.categories && Array.isArray(data.categories)) {
                    data.categories.forEach(category => {
                        const swiperslide = document.createElement('div');
                     swiperslide.classList.add('swiper-slide');

                     const categoryItem = document.createElement('div');
                     categoryItem.classList.add('category-item', 'text-center');

                     const bgwhite = document.createElement('div');
                     bgwhite.classList.add('bg-white', 'rounded-lg', 'shadow-md', 'p-6', 'mb-4', 'overflow-hidden');

                     const img = document.createElement('img');
                     img.src = category.image_url;
                     img.alt = category.label;
                     img.classList.add('w-full', 'h-auto', 'object-cover', 'mx-auto', 'transition-transform', 'duration-300');

                     const h3 = document.createElement('h3');
                     h3.textContent = category.label;
                     h3.classList.add('font-medium');

                     bgwhite.appendChild(img);
                     categoryItem.appendChild(bgwhite);
                     categoryItem.appendChild(h3);
                     swiperslide.appendChild(categoryItem);
                     categoriesContainer.appendChild(swiperslide);
                    });
                } else {
                    const errormessage = document.getElementById('Categories-error-message');
                    errormessage.textContent = 'لا توجد فئات متاحة حالياً';
                    errormessage.classList.remove('hidden');
                }
            })
    }
    catch (error) {
        console.error('Error fetching categories:', error);
    }
    
}
