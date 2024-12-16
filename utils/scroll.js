import LocomotiveScroll from 'https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.esm.js';

window.onload = () => {
  const scroll = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]"),
    smooth: true,
    inertia: 0.8,
    getDirection: true,
    multiplier: 1.5,
    smoothMobile: true
  });

  setTimeout(() => {
    scroll.update();
  }, 500);

  window.addEventListener("resize", () => {
    scroll.update();
  });
};