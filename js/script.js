(() => {
  const root = document.documentElement;
  const header = document.getElementById("siteHeader");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const themeToggle = document.getElementById("themeToggle");
  const typedEl = document.getElementById("typedText");
  const toTop = document.getElementById("toTop");
  const year = document.getElementById("year");
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const canvas = document.getElementById("dataCanvas");
  const grid = document.querySelector(".bg-grid");
  const links = [...document.querySelectorAll(".nav-link")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const phrases = [
    "Data Analysis",
    "Power BI Dashboard",
    "AI Automation",
    "Machine Learning",
  ];

  year.textContent = String(new Date().getFullYear());

  const storedTheme = localStorage.getItem("salma-theme");
  const theme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
  applyTheme(theme);

  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("salma-theme", next);
  });

  function applyTheme(value) {
    root.setAttribute("data-theme", value);
    themeToggle.setAttribute(
      "aria-label",
      value === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  function isMobileNav() {
    return window.matchMedia("(max-width: 1100px)").matches;
  }

  function setMenu(open) {
    const shouldOpen = open && isMobileNav();
    navToggle.classList.toggle("is-open", shouldOpen);
    navMenu.classList.toggle("is-open", shouldOpen);
    navToggle.setAttribute("aria-expanded", String(shouldOpen));
    navToggle.setAttribute("aria-label", shouldOpen ? "Close menu" : "Open menu");
    if (isMobileNav()) {
      navMenu.setAttribute("aria-hidden", String(!shouldOpen));
    } else {
      navMenu.removeAttribute("aria-hidden");
    }
    document.body.classList.toggle("menu-open", shouldOpen);
  }

  navToggle.addEventListener("click", () => {
    setMenu(!navMenu.classList.contains("is-open"));
  });

  links.forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  let typingIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    const current = phrases[typingIndex];
    typedEl.textContent = current.slice(0, charIndex);

    if (!deleting && charIndex < current.length) {
      charIndex += 1;
      window.setTimeout(typeLoop, 78);
      return;
    }

    if (deleting && charIndex > 0) {
      charIndex -= 1;
      window.setTimeout(typeLoop, 42);
      return;
    }

    if (!deleting && charIndex === current.length) {
      deleting = true;
      window.setTimeout(typeLoop, 1200);
      return;
    }

    deleting = false;
    typingIndex = (typingIndex + 1) % phrases.length;
    window.setTimeout(typeLoop, 280);
  }

  typeLoop();

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === id);
        });
      });
    },
    { threshold: 0.35, rootMargin: "-18% 0px -50% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 12);
    toTop.classList.toggle("is-visible", y > 480);
    if (grid) {
      grid.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    if (!isMobileNav()) setMenu(false);
  });
  onScroll();
  setMenu(false);

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelectorAll('img[src=""]').forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";
    });
    img.addEventListener("load", () => {
      if (img.getAttribute("src")) {
        img.style.display = "block";
        img.style.opacity = "1";
        const fallback = img.parentElement.querySelector(".portrait-fallback");
        if (fallback) fallback.style.opacity = "0";
      }
    });
  });

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    };

    const errors = {
      name: data.name ? "" : "Please enter your name.",
      email: !data.email
        ? "Please enter your email."
        : emailPattern.test(data.email)
          ? ""
          : "Please enter a valid email address.",
      subject: data.subject ? "" : "Please add a subject.",
      message: data.message.length >= 20
        ? ""
        : "Please write a message of at least 20 characters.",
    };

    let valid = true;
    Object.entries(errors).forEach(([field, message]) => {
      const wrap = form.querySelector(`[name="${field}"]`).closest(".field");
      wrap.classList.toggle("is-invalid", Boolean(message));
      form.querySelector(`[data-error-for="${field}"]`).textContent = message;
      if (message) valid = false;
    });

    formStatus.classList.remove("is-ok", "is-error");

    if (!valid) {
      formStatus.classList.add("is-error");
      formStatus.textContent = "Please fix the highlighted fields.";
      return;
    }

    formStatus.classList.add("is-ok");
    formStatus.textContent =
      "Message ready. This demo form does not send email — copy the details or replace the placeholder links when you are ready to connect.";
    form.reset();
  });

  const ctx = canvas.getContext("2d");
  const nodes = [];
  let width = 0;
  let height = 0;
  let scrollOffset = 0;
  let raf = 0;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    nodes.length = 0;
    const count = Math.min(72, Math.floor((width * height) / 28000));
    for (let i = 0; i < count; i += 1) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      });
    }
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("scroll", () => {
    scrollOffset = window.scrollY;
  }, { passive: true });
  resizeCanvas();

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const themeNow = root.getAttribute("data-theme");
    const color = themeNow === "light" ? "27, 60, 83" : "227, 227, 227";
    const yShift = (scrollOffset * 0.12) % height;

    nodes.forEach((node, index) => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      const drawY = (node.y + yShift) % height;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${color}, 0.28)`;
      ctx.arc(node.x, drawY, node.r, 0, Math.PI * 2);
      ctx.fill();

      for (let j = index + 1; j < nodes.length; j += 1) {
        const other = nodes[j];
        const oy = (other.y + yShift) % height;
        const dx = node.x - other.x;
        const dy = drawY - oy;
        const dist = Math.hypot(dx, dy);
        if (dist < 110) {
          ctx.strokeStyle = `rgba(${color}, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(node.x, drawY);
          ctx.lineTo(other.x, oy);
          ctx.stroke();
        }
      }
    });

    raf = window.requestAnimationFrame(draw);
  }

  const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (motionOk) {
    draw();
  } else {
    window.cancelAnimationFrame(raf);
  }
})();
