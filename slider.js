class Slider {
    constructor(element, config = {}) {
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
            pauseOnHover: true, 
            ...config
        };
    }

    init() {
        this.update();
        if (this.config.autoPlay) this.setAutoPlay();
        this.addEvents();
    }

    update() {
        this.element.querySelector('.slides').style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.element.querySelector('.pause-play').textContent = this.isPlaying ? '⏸️' : '▶️';
    }

    goTo(index) {
        const total = this.slides.length;
        this.currentIndex = (index % total + total) % total;
        this.update();
    }

    next() {
        this.goTo(this.currentIndex + 1);
    }

    prev() {
        this.goTo(this.currentIndex - 1);
    }

    setAutoPlay() {
        if (this.intervalId) clearInterval(this.intervalId);
        if (this.isPlaying && this.config.autoPlay) {
            this.intervalId = setInterval(() => this.next(), this.config.interval);
        }
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        this.update();
        this.setAutoPlay();
    }

    handleTouch() {
        if (!this.touchStartX || !this.touchEndX) return;
        const delta = this.touchEndX - this.touchStartX;
        if (Math.abs(delta) > 50) delta > 0 ? this.prev() : this.next();
        this.touchStartX = this.touchEndX = 0;
    }

    addEvents() {
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

        if (this.config.pauseOnHover) {
            this.element.addEventListener('mouseenter', () => {
                if (this.isPlaying) {
                    this.isPlaying = false;
                    this.setAutoPlay();
                }
            });
            this.element.addEventListener('mouseleave', () => {
                if (!this.isPlaying && this.config.autoPlay) {
                    this.isPlaying = true;
                    this.setAutoPlay();
                }
            });
        }
    }
}

class EnhancedSlider extends Slider {
    addDrag() {
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
        this.element.addEventListener('mouseleave', () => {
            isDragging = false;
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const slider = new EnhancedSlider(document.querySelector('.slider'), {
        autoPlay: true,
        interval: 4000,
        pauseOnHover: true
    });
    slider.init();
    slider.addDrag();
});