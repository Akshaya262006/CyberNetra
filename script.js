document.querySelectorAll(".hotspot-nav a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelectorAll(".hotspot-nav a").forEach((item) => {
      item.classList.toggle("is-active", item === link);
    });
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    button.dispatchEvent(new CustomEvent("cybernetra:action", {
      bubbles: true,
      detail: { action: button.dataset.action }
    }));
  });
});

// Scroll-reveal for the newly added sections
const revealItems = document.querySelectorAll(".reveal");
if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}

// Contact form: front-end only handler (no backend wired up yet)
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = contactForm.querySelector("[data-status]");
    if (status) {
      status.hidden = false;
    }
    contactForm.dispatchEvent(new CustomEvent("cybernetra:action", {
      bubbles: true,
      detail: { action: "Contact Form Submit" }
    }));
    contactForm.reset();
  });
}
