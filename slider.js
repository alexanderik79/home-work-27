let currentIndex = 0;
let isPlaying = true;
let intervalId = null;
let touchStartX = 0;
let touchEndX = 0;

function updateSlider() {
    document.querySelector('.slides').style.transform = `translateX(-${currentIndex * 100}%)`;
}

function goToSlide(index) {
    const totalSlides = document.querySelectorAll('.slide').length;
    currentIndex = (index % totalSlides + totalSlides) % totalSlides;
    updateSlider();
}

function nextSlide() {
    goToSlide(currentIndex + 1);
}

function prevSlide() {
    goToSlide(currentIndex - 1);
}

function setAutoPlay() {
    if (intervalId) clearInterval(intervalId);
    if (isPlaying) {
        intervalId = setInterval(nextSlide, 4000);
    }
}

function togglePlayPause() {
    isPlaying = !isPlaying;
    document.querySelector('.pause-play').textContent = isPlaying ? '⏸️' : '▶️';
    setAutoPlay();
}

function handleGestureStart(event) {
    touchStartX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
}

function handleGestureMove(event) {
    if (!touchStartX) return;
    touchEndX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
}

function handleGestureEnd() {
    if (!touchStartX || !touchEndX) return;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) > 50) {
        if (delta > 0) prevSlide();
        else nextSlide(); 
    }
    touchStartX = 0;
    touchEndX = 0;
}

function handleKeydown(event) {
    if (event.key === 'ArrowLeft') prevSlide();
    else if (event.key === 'ArrowRight') nextSlide();
}

function init() {
    updateSlider();
    setAutoPlay();

    document.querySelector('.prev').addEventListener('click', prevSlide);
    document.querySelector('.next').addEventListener('click', nextSlide);
    document.querySelector('.pause-play').addEventListener('click', togglePlayPause);

    const slider = document.querySelector('.slider');
    slider.addEventListener('touchstart', handleGestureStart);
    slider.addEventListener('touchmove', handleGestureMove);
    slider.addEventListener('touchend', handleGestureEnd);
    slider.addEventListener('mousedown', handleGestureStart);
    slider.addEventListener('mousemove', handleGestureMove);
    slider.addEventListener('mouseup', handleGestureEnd);

    document.addEventListener('keydown', handleKeydown);
}

document.addEventListener('DOMContentLoaded', init);