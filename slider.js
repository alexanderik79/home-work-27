function Slider(element, config = {}) {
    this.element = element;
    this.slides = element.querySelectorAll('.slide');
    this.currentIndex = 0;
    this.isPlaying = true;
    this.intervalId = null;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.config = {
        autoPlay: true,
        interval: 4000,
        ...config
    };
}

Slider.prototype.init = function () {
    this.update();
    if (this.config.autoPlay) this.setAutoPlay();
    this.addEvents();
};

Slider.prototype.update = function () {
    this.element.querySelector('.slides').style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.element.querySelector('.pause-play').textContent = this.isPlaying ? '⏸️' : '▶️';
};

Slider.prototype.goTo = function (index) {
    const total = this.slides.length;
    this.currentIndex = (index % total + total) % total;
    this.update();
};

Slider.prototype.next = function () {
    this.goTo(this.currentIndex + 1);
};

Slider.prototype.prev = function () {
    this.goTo(this.currentIndex - 1);
};

Slider.prototype.setAutoPlay = function () {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.isPlaying && this.config.autoPlay) {
        this.intervalId = setInterval(() => this.next(), this.config.interval);
    }
};

Slider.prototype.togglePlay = function () {
    this.isPlaying = !this.isPlaying;
    this.update();
    this.setAutoPlay();
};

Slider.prototype.addEvents = function () {
    this.element.querySelector('.prev').addEventListener('click', () => this.prev());
    this.element.querySelector('.next').addEventListener('click', () => this.next());
    this.element.querySelector('.pause-play').addEventListener('click', () => this.togglePlay());

    this.element.addEventListener('touchstart', (e) => this.touchStartX = e.touches[0].clientX);
    this.element.addEventListener('touchmove', (e) => this.touchEndX = e.touches[0].clientX);
    this.element.addEventListener('touchend', () => this.handleTouch());
    this.element.addEventListener('mousedown', (e) => this.touchStartX = e.clientX);
    this.element.addEventListener('mousemove', (e) => this.touchEndX = e.clientX);
    this.element.addEventListener('mouseup', () => this.handleTouch());

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
        if (e.code === 'Space') this.togglePlay();
    });
};

Slider.prototype.handleTouch = function () {
    if (!this.touchStartX || !this.touchEndX) return;
    const delta = this.touchEndX - this.touchStartX;
    if (Math.abs(delta) > 50) delta > 0 ? this.prev() : this.next();
    this.touchStartX = this.touchEndX = 0;
};

function EnhancedSlider(element, config) {
    Slider.call(this, element, config);
}


EnhancedSlider.prototype = Object.create(Slider.prototype);
EnhancedSlider.prototype.constructor = EnhancedSlider;

EnhancedSlider.prototype.addDrag = function () {
    let isDragging = false;
    this.element.addEventListener('mousedown', (e) => {
        isDragging = true;
        this.touchStartX = e.clientX;
    });
    this.element.addEventListener('mousemove', (e) => {
        if (isDragging) this.touchEndX = e.clientX;
    });
    this.element.addEventListener('mouseup', () => {
        if (isDragging) {
            this.handleTouch();
            isDragging = false;
        }
    });
};


document.addEventListener('DOMContentLoaded', () => {
    const slider = new EnhancedSlider(document.querySelector('.slider'), {
        autoPlay: true,
        interval: 4000
    });
    slider.init();
    slider.addDrag();
});