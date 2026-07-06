const appConfig = window.ALLA_CONFIG || {};
const root = document.documentElement;
const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector(".menu-toggle");
const langButtons = document.querySelectorAll("[data-lang]");
const yearNode = document.getElementById("year");
const bookingForm = document.getElementById("bookingForm");
const formStatus = document.getElementById("formStatus");
const serviceSelect = document.getElementById("serviceSelect");
const serviceOptions = {
  de: [
    "Rückenmassage",
    "Ganzkörpermassage",
    "Gesichtsmassage",
    "Lymphdrainage",
    "Anti-Cellulite-Massage"
  ],
  en: [
    "Back massage",
    "Full body massage",
    "Facial massage",
    "Lymphatic drainage",
    "Anti-cellulite massage"
  ]
};

const copy = {
  de: {
    formPending: "Google-Sheets-Verbindung ist noch nicht eingetragen. Tragen Sie die Web-App-URL in config.js ein.",
    formSending: "Wird gesendet...",
    formSuccess: "Vielen Dank. Die Anfrage wurde erfolgreich gesendet.",
    formError: "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    submit: "Anfrage senden"
  },
  en: {
    formPending: "Google Sheets connection is not configured yet. Add the web app URL in config.js.",
    formSending: "Sending...",
    formSuccess: "Thank you. Your request has been sent successfully.",
    formError: "The request could not be sent. Please try again.",
    submit: "Send request"
  }
};

function getLanguage() {
  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get("lang");

  if (queryLang === "de" || queryLang === "en") {
    localStorage.setItem("alla-language", queryLang);
    return queryLang;
  }

  const stored = localStorage.getItem("alla-language");
  return stored === "en" ? "en" : "de";
}

function setLanguage(lang) {
  root.lang = lang;
  localStorage.setItem("alla-language", lang);

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = node.dataset[lang];
    if (value) {
      node.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const value = node.dataset[lang];
    if (value) {
      node.setAttribute("placeholder", value);
    }
  });

  document.querySelectorAll("[data-page-link]").forEach((node) => {
    const baseHref = node.dataset.pageLink;
    if (!baseHref) {
      return;
    }

    const [pathWithQuery, hash] = baseHref.split("#");
    const separator = pathWithQuery.includes("?") ? "&" : "?";
    const hrefWithLang = `${pathWithQuery}${separator}lang=${lang}`;
    node.setAttribute("href", hash ? `${hrefWithLang}#${hash}` : hrefWithLang);
  });

  if (document.body.dataset[`pageTitle${lang === "de" ? "De" : "En"}`]) {
    document.title = document.body.dataset[`pageTitle${lang === "de" ? "De" : "En"}`];
  }

  langButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === lang);
  });

  hydrateServiceOptions(lang);
  updateSubmitLabel(lang);
}

function hydrateServiceOptions(lang) {
  if (!serviceSelect) {
    return;
  }

  const previousValue = serviceSelect.value;
  const options = serviceOptions[lang];
  serviceSelect.innerHTML = "";

  options.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = serviceOptions.de[index];
    option.textContent = item;
    serviceSelect.appendChild(option);
  });

  if (previousValue) {
    serviceSelect.value = previousValue;
  }

  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get("service");
  if (requestedService) {
    serviceSelect.value = requestedService;
  }
}

function updateSubmitLabel(lang, sending = false) {
  if (!bookingForm) {
    return;
  }

  const button = bookingForm.querySelector("button[type='submit']");
  if (!button) {
    return;
  }

  button.textContent = sending ? copy[lang].formSending : copy[lang].submit;
}

function setStatus(message, mode = "") {
  if (!formStatus) {
    return;
  }

  formStatus.textContent = message;
  formStatus.className = `form-status ${mode}`.trim();
}

async function handleBookingSubmit(event) {
  event.preventDefault();

  const lang = getLanguage();
  const submitButton = bookingForm.querySelector("button[type='submit']");
  const endpoint = (appConfig.bookingEndpoint || "").trim();

  if (!endpoint) {
    setStatus(copy[lang].formPending, "warning");
    return;
  }

  const formData = new FormData(bookingForm);
  const payload = Object.fromEntries(formData.entries());
  payload.language = lang;
  payload.createdAt = new Date().toISOString();

  submitButton.disabled = true;
  updateSubmitLabel(lang, true);
  setStatus("");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    bookingForm.reset();
    hydrateServiceOptions(lang);
    setStatus(copy[lang].formSuccess, "success");
  } catch (error) {
    setStatus(copy[lang].formError, "error");
  } finally {
    submitButton.disabled = false;
    updateSubmitLabel(lang);
  }
}

if (menuToggle && topbar) {
  menuToggle.addEventListener("click", () => {
    const isOpen = topbar.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (topbar) {
      topbar.classList.remove("is-open");
    }
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

langButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

if (bookingForm) {
  bookingForm.addEventListener("submit", handleBookingSubmit);
}

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

setLanguage(getLanguage());
