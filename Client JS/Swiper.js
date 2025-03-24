var swiper = new Swiper('.swiper-container', {
    slidesPerView: 'auto', // Automatically adjust slides per view
    centeredSlides: true, // Center the active slide
    spaceBetween: 20, // Space between slides
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
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