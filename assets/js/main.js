// SOUL — shared site behavior. Vanilla JS, no dependencies.
(function () {
  "use strict";

  // ---------------------------------------------------------------------
  // Mobile menu toggle
  // ---------------------------------------------------------------------
  var toggle = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.querySelector(".menu-toggle-label").textContent = isOpen ? "Tutup" : "Menu";
    });

    // Close menu when a link is chosen, so it never blocks the next page.
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.querySelector(".menu-toggle-label").textContent = "Menu";
      });
    });
  }

  // ---------------------------------------------------------------------
  // Scroll-reveal animation (subtle fade + rise), reduced-motion aware
  // ---------------------------------------------------------------------
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealTargets = document.querySelectorAll(".reveal, .reveal-stagger");

  if (revealTargets.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    // Only now opt into the hidden-until-revealed styling — content stayed
    // visible up to this point for anyone without working JS.
    document.documentElement.classList.add("js");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });

    // Safety net: if anything is still unrevealed after 4s (e.g. an element
    // that never crosses the viewport threshold), show it anyway.
    window.setTimeout(function () {
      revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
    }, 4000);
  }

  // ---------------------------------------------------------------------
  // Header: subtle shadow once page has scrolled (visual depth cue only)
  // ---------------------------------------------------------------------
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.style.boxShadow = window.scrollY > 8
        ? "0 8px 20px -16px rgba(43,42,36,0.5)"
        : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------------------------------------------------------------------
  // FAQ accordion: keep only one panel open at a time (reduces clutter)
  // ---------------------------------------------------------------------
  var faqItems = document.querySelectorAll(".faq-list details");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // ---------------------------------------------------------------------
  // Contact form: lightweight client-side validation with clear messaging
  // ---------------------------------------------------------------------
  var contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = contactForm.querySelector("[data-form-status]");
      var name = contactForm.querySelector("#nama");
      var phone = contactForm.querySelector("#telepon");
      var valid = true;

      [name, phone].forEach(function (field) {
        if (field && !field.value.trim()) {
          valid = false;
          field.style.borderColor = "#B5622E";
        } else if (field) {
          field.style.borderColor = "";
        }
      });

      if (!status) return;
      if (!valid) {
        status.textContent = "Mohon lengkapi Nama dan Nomor WhatsApp terlebih dahulu.";
        status.style.color = "#954E23";
        return;
      }
      status.textContent = "Terima kasih. Tim kami akan segera menghubungi Anda melalui WhatsApp.";
      status.style.color = "#3F5245";
      contactForm.reset();
    });
  }
})();
