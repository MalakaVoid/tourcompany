window.addEventListener('load', function(e){
    let swiperEl = document.querySelector('swiper-container');
    let buttonLeft = this.document.querySelector('.left');
    let buttonRight = this.document.querySelector('.right');

    buttonLeft.addEventListener('click', () =>{
        swiperEl.swiper.slideNext();
    });

    buttonRight.addEventListener('click', () =>{
        swiperEl.swiper.slidePrev();
    });

});