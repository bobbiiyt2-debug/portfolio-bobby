const themeButtons = document.querySelectorAll("#themeToggle");

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      btn.textContent = "☀️";
    } else {
      btn.textContent = "🌙";
    }
  });
});

// simple contact form demo
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Message submitted successfully!");
    contactForm.reset();
  });
}
