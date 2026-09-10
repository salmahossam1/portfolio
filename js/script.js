document.addEventListener("DOMContentLoaded", () => {
  // 1. تايب رايتر للسطر المكتوب في الهيرو
  const typedElement = document.getElementById("typedText");
  const phrases = [
    "Machine Learning Engineer",
    "Data Analyst & Visualization",
    "AI Systems Developer"
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
  }
  typeEffect();

  // 2. الهيدر وزر الانتقال للأعلى أثناء السكرول
  const header = document.getElementById("header");
  const toTopBtn = document.getElementById("toTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }

    if (window.scrollY > 300) {
      toTopBtn.classList.add("is-visible");
    } else {
      toTopBtn.classList.remove("is-visible");
    }
  });

  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 3. فتح وإغلاق قائمة الموبايل
  const navToggle = document.getElementById("navToggle");
  const navPanel = document.getElementById("navPanel");

  navToggle.addEventListener("click", () => {
    navPanel.classList.toggle("is-open");
    navToggle.classList.toggle("is-open");
  });

  // 4. أنيميشن ظهور العناصر عند السكرول (Scroll Reveal)
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach((el) => observer.observe(el));

  // 5. نموذج التواصل
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formStatus.style.color = "var(--ok)";
    formStatus.textContent = "تم إرسال رسالتك بنجاح! سأتواصل معك قريباً.";
    contactForm.reset();
  });
});
