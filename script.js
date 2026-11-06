
// ==============================
// 1. MOBILE NAVIGATION MENU
// ==============================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");

    // Change the menu icon
    if (navLinks.classList.contains("active")) {
        menuToggle.textContent = "✕";
        menuToggle.setAttribute("aria-label", "Close navigation menu");
    } else {
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }
});


// Close the mobile menu after clicking a navigation link

const navigationItems = document.querySelectorAll(".nav-links a");

navigationItems.forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("active");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    });
});


// ==============================
// 2. AUTOMATIC COPYRIGHT YEAR
// ==============================

const year = document.getElementById("year");

year.textContent = new Date().getFullYear();


// ==============================
// 3. FREE ESTIMATE FORM
// ==============================

const estimateForm = document.getElementById("estimateForm");
const formMessage = document.getElementById("formMessage");
const estimateResponse = document.querySelector('iframe[name="estimateResponse"]');
const estimateSubmitButton = estimateForm.querySelector('button[type="submit"]');
const estimateScriptUrl = "https://script.google.com/macros/s/AKfycby5pDijCh8b6yCjnu3sSwMK6L04F4bTIFx4-uDXNp2ptL5tX5WEvBc5g_ajsVM-wriXXg/exec";
const requestIdField = document.getElementById("requestId");
let estimateTimeout;
let currentRequestId = "";

window.addEventListener("message", function (event) {
    if (
        event.data?.type !== "purehaven-estimate-result" ||
        !currentRequestId ||
        event.data.requestId !== currentRequestId
    ) {
        return;
    }

    clearTimeout(estimateTimeout);
    estimateSubmitButton.disabled = false;
    currentRequestId = "";

    if (event.data.status === "success") {
        const customerName = document.getElementById("name").value.trim();
        formMessage.dataset.status = "success";
        formMessage.textContent =
            "Thank you, " + customerName +
            "! Your estimate request was sent. We will be in touch.";
        estimateForm.reset();
        return;
    }

    formMessage.dataset.status = "error";
    formMessage.textContent =
        "We couldn't send your request. Please try again or email purehavendish@gmail.com.";
});

estimateForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!estimateScriptUrl) {
        formMessage.dataset.status = "error";
        formMessage.textContent =
            "Online requests are not connected yet. Please email purehavendish@gmail.com.";
        return;
    }

    if (!estimateForm.reportValidity()) {
        return;
    }

    if (document.getElementById("website").value.trim() !== "") {
        return;
    }

    if (estimateSubmitButton.disabled) {
        return;
    }

    currentRequestId = crypto.randomUUID();
    requestIdField.value = currentRequestId;
    estimateSubmitButton.disabled = true;
    formMessage.dataset.status = "pending";
    formMessage.textContent = "Sending your estimate request...";

    estimateForm.method = "post";
    estimateForm.action = estimateScriptUrl;
    estimateForm.target = estimateResponse.name;
    estimateForm.submit();

    estimateTimeout = setTimeout(function () {
        currentRequestId = "";
        estimateSubmitButton.disabled = false;
        formMessage.dataset.status = "error";
        formMessage.textContent =
            "We couldn't confirm whether the request was delivered. Please check your inbox before trying again, or email purehavendish@gmail.com.";
    }, 20000);
});
