window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  window.setTimeout(() => {
    loader?.classList.add("is-hidden");
  }, 550);
});

const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-link");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu?.classList.remove("is-open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionIds = ["about", "skills", "projects", "education", "contact"];
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);
const navLinks = document.querySelectorAll(".nav-link");

const updateActiveNav = () => {
  const marker = window.scrollY + window.innerHeight * 0.28;
  let activeId = "";

  sections.forEach((section) => {
    if (marker >= section.offsetTop) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isActive);
  });
};

window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("resize", updateActiveNav);
updateActiveNav();

// ── EmailJS config ── replace these three values from your EmailJS dashboard
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

const form       = document.getElementById("contact-form");
const submitBtn  = document.getElementById("submit-btn");
const formStatus = document.getElementById("form-status");

function showError(fieldId, errId, show) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  field.classList.toggle("is-error", show);
  err.style.display = show ? "block" : "none";
}

function validateForm(data) {
  let valid = true;

  const nameOk = data.name.trim().length >= 2;
  showError("field-name", "err-name", !nameOk);
  if (!nameOk) valid = false;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
  showError("field-email", "err-email", !emailOk);
  if (!emailOk) valid = false;

  const msgOk = data.message.trim().length >= 10;
  showError("field-message", "err-message", !msgOk);
  if (!msgOk) valid = false;

  return valid;
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.className = "";
    formStatus.style.display = "none";

    const data = {
      name:    form.name.value,
      email:   form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    if (!validateForm(data)) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:    data.name.trim(),
        from_email:   data.email.trim(),
        subject:      data.subject.trim() || "Portfolio contact",
        message:      data.message.trim(),
        to_email:     "yaminiuiux@gmail.com",
      });

      formStatus.className = "is-success";
      formStatus.textContent = "Message sent! I'll get back to you soon.";
      form.reset();
      ["field-name","field-email","field-message"].forEach((id) =>
        document.getElementById(id).classList.remove("is-error")
      );
    } catch {
      formStatus.className = "is-error";
      formStatus.textContent = "Something went wrong. Please try emailing yaminiuiux@gmail.com directly.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });

  // Clear error on input
  [["field-name","err-name"],["field-email","err-email"],["field-message","err-message"]]
    .forEach(([fieldId, errId]) => {
      document.getElementById(fieldId)?.addEventListener("input", () =>
        showError(fieldId, errId, false)
      );
    });
}
