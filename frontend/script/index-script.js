const sliderSection = document.getElementById('slider-section');

window.setTimeout(() => {
    sliderSection.classList.add('hide-slider-section');

    window.setTimeout(() => {
        sliderSection.remove();
    }, 500)
}, 4000)