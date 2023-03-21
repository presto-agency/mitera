(function () {
  const app = {
    // props
    isMob: false,
    header: document.querySelector('.header'),
    body: document.getElementsByTagName('body')[0],
    mediaQueryDesktop: window.matchMedia('(min-width: 1024px)'),
    navTrigger: document.querySelector('.nav-trigger'),
    imageSlider: document.querySelector('.image-slider-container'),
    imageSliderPager: document.querySelector('.swiper-pager'),
    testimSlider: document.querySelector('.testimonials-slider'),
    testimSliderPager: document.querySelector('.testim-swiper-pager'),
    resourcesSlider: document.querySelector('.resources-slider'),
    resourcesSliderPager: document.querySelector('.resources-swiper-pager'),
    acctordeonTitle: document.querySelectorAll('.accordion__title'),
    bgVideo: document.querySelector('.dec-video'),
    accordion: document.querySelector('.accordion'),
    formInput: document.querySelectorAll('.form-input'),
    logosSlider: document.querySelector('.partners-logos'),
    // methods
    elementExist: function (element) {
      return typeof (element) != 'undefined' && element != null;
    },
    fixedHeader: function () {
      let sticky = this.header.offsetTop;
      if (window.pageYOffset > sticky) {
        this.header.classList.add('sticky');
      } else {
        this.header.classList.remove('sticky');
      }
    },
    addClassBody: function (cl) {
      this.body.classList.add(cl)
    },
    removeClassBody: function (cl) {
      this.body.classList.remove(cl)
    },
    handleTabletChange: function (e) {
      // Check if the media query is true
      if (e.matches) {
        app.isMob = false;
        app.removeClassBody('mob');
        app.removeClassBody('open-mob-nav');
        app.addClassBody('desktop');
      } else {
        app.isMob = true;
        app.removeClassBody('desktop');
        app.addClassBody('mob');
      }
    },
    toggleMobNav: function () {
      if(!app.body.classList.contains('open-mob-nav')){
        app.body.classList.add('open-mob-nav');
        document.querySelector('html').style.overflow = 'hidden'
      }
      else{
        app.body.classList.remove('open-mob-nav');
        document.querySelector('html').style.overflow = ''
      }
    },
    initAccordeon: function () {
      if (!app.elementExist(app.accordion)) return;
      new Accordion('.accordion', {
        duration: 400,
        elementClass: 'accordion__item', // element class {string}
        triggerClass: 'accordion__title', // trigger class {string}
        panelClass: 'accordion__text', // panel class {string}
        activeClass: 'is-active', // active element class {string}
      });

    },
    initImageSlider: function () {
      const swiperImageSlider = new Swiper(app.imageSlider, {
        slidesPerView: 1,
        spaceBetween: 0,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
        },
        on: {
          afterInit: function () {
            app.imageSliderPager.innerHTML = `<span>${this.activeIndex + 1}</span> / ${this.wrapperEl.children.length}`;
          },
          activeIndexChange: function () {
            app.imageSliderPager.innerHTML = `<span>${this.activeIndex + 1}</span> / ${this.wrapperEl.children.length}`;
            if (this.activeIndex + 1 === this.wrapperEl.children.length) {
              app.imageSlider.classList.add('last-item');
            } else {
              app.imageSlider.classList.remove('last-item');
            }
          }
        },
        breakpoints: {
          1024: {
            slidesPerView: 'auto',
            spaceBetween: 32,
          },
        }
      });
    },
    initReourceSlider: function () {
      const swiperResoucesSlider = new Swiper(app.resourcesSlider, {
        slidesPerView: 1,
        spaceBetween: 0,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
        },
        on: {
          afterInit: function () {
            let coef = window.innerWidth < 1024 ? 1 : 4;
            let all = Math.ceil(this.wrapperEl.children.length / coef);
            let current = this.activeIndex + 1;
            app.resourcesSliderPager.innerHTML = `<span>${current}</span> / ${all}`;
          },
          activeIndexChange: function () {
            let coef = window.innerWidth < 1024 ? 1 : 4;
            let all = Math.ceil(this.wrapperEl.children.length / coef);
            let current;
            if (window.innerWidth < 1024) {
              current = this.activeIndex + 1 ;
            } else {
              if (this.activeIndex === 0) {
                current = this.activeIndex + 1;
              } else {
                current = Math.ceil((this.activeIndex + 4) / 4);
              }
            }
            app.resourcesSliderPager.innerHTML = `<span>${current}</span> / ${all}`;
          }
        },
        breakpoints: {
          1024: {
            watchSlidesVisibility: true,
            slidesPerView: 4,
            spaceBetween: 75,
            slidesPerGroup: 4,
          },
        }
      });
    },
    initTestimonialsSlider: function () {
      const swiperTestimonialsSlider = new Swiper(app.testimSlider, {
        slidesPerView: 'auto',
        spaceBetween: 32,
        direction: 'vertical',
        navigation: {
          nextEl: '.testim-swiper-button-next',
          prevEl: '.testim-swiper-button-prev',
        },
        on: {
          afterInit: function () {
            app.testimSliderPager.innerHTML = `<span>${this.activeIndex + 1}</span> / ${this.wrapperEl.children.length}`;
          },
          activeIndexChange: function () {
            app.testimSliderPager.innerHTML = `<span>${this.activeIndex + 1}</span> / ${this.wrapperEl.children.length}`;
            if (this.activeIndex + 1 === this.wrapperEl.children.length) {
              app.testimSliderPager.classList.add('last-item');
            } else {
              app.testimSliderPager.classList.remove('last-item');
            }
          }
        }
      });
    },
    bgVideoSetUp: function () {
      if (!app.elementExist(app.bgVideo)) return;
      app.bgVideo.playbackRate = 0.3;
    },
    tabs: function Tabs() {
      let bindAll = function() {
        let menuElements = document.querySelectorAll('[data-tab]');
        for(let i = 0; i < menuElements.length ; i++) {
          menuElements[i].addEventListener('click', change, false);
        }
      }

      let clear = function() {
        let menuElements = document.querySelectorAll('[data-tab]');
        for(let i = 0; i < menuElements.length ; i++) {
          menuElements[i].classList.remove('active');
          let id = menuElements[i].getAttribute('data-tab');
          document.getElementById(id).classList.remove('active');
        }
      }

      let change = function(e) {
        clear();
        e.target.classList.add('active');
        let id = e.currentTarget.getAttribute('data-tab');
        document.getElementById(id).classList.add('active');
      }

      bindAll();
    },
    closeMenuOnScroll: function () {
      const emptyLinks = document.querySelectorAll('a[href*="#"]');
      for(let i = 0; i < emptyLinks.length; i++) {
        emptyLinks[i].addEventListener('click', function () {
          app.body.classList.remove('open-mob-nav');
        });
      }
    },
    initPartnersCarousel: function () {
      const swiperLogosSlider = new Swiper(app.logosSlider, {
        slidesPerView: 4,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 3000,
        },
        speed: 1000,
      });
      if(window.innerWidth < 1024) {
        swiperLogosSlider.destroy();
      }
    },
  }
  //init
  app.initImageSlider();
  app.initTestimonialsSlider();
  app.navTrigger.addEventListener('click', app.toggleMobNav);
  app.initAccordeon();
  AOS.init();
  MicroModal.init();
  window.onscroll = function () {
    app.fixedHeader();
  };
  app.bgVideoSetUp();
  app.formInput.onblur = function (evn){
    this.classList.add('invalid');
  };
  app.initReourceSlider();

  app.closeMenuOnScroll();
  app.initPartnersCarousel();

  [].forEach.call(app.formInput, function (el) {
    el.addEventListener('blur', function (e) {
      el.closest('.form__item').classList.remove('focus');
    })
    el.addEventListener('focus', function (e) {
      el.closest('.form__item').classList.add('focus');
    })
  });
  app.tabs();


  document.addEventListener('DOMContentLoaded', function (event) {
    //listeners
    app.mediaQueryDesktop.addEventListener('change', app.handleTabletChange);
    app.handleTabletChange(app.mediaQueryDesktop);
  });

  const anchorLinks = document.querySelectorAll('.scroll-to');
  for(let i = 0; i < anchorLinks.length; i++) {
    anchorLinks[i].addEventListener('click', function (e) {
      e.preventDefault();
      let anchorTarget = this.getAttribute('data-scroll');
      let top = document.querySelector(anchorTarget).getBoundingClientRect().y;
      if(!!anchorTarget) {
        window.scrollTo({
          top,
          behavior: 'smooth'
        });
      }
    });
  }

})();
