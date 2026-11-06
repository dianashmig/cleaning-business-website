const RECIPIENT = "purehavendish@gmail.com";
const ALLOWED_SERVICES = [
  "Residential Cleaning",
  "Deep Cleaning",
  "Commercial Cleaning",
  "Move-In / Move-Out",
  "Other",
];

function doPost(e) {
  const params = e && e.parameter ? e.parameter : {};
  const requestId = clean_(params.requestId, 36);

  if (params.website) {
    return response_("success", requestId);
  }

  const name = clean_(params.name, 120);
  const email = clean_(params.email, 254);
  const phone = clean_(params.phone, 50);
  const service = clean_(params.service, 100);
  const message = clean_(params.message, 5000);

  if (
    !name ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !phone ||
    ALLOWED_SERVICES.indexOf(service) === -1
  ) {
    return response_("error", requestId);
  }

  const subject = "New estimate request - " + service;
  const body = [
    "A new estimate request was submitted on the Purehaven website.",
    "",
    "Name: " + name,
    "Email: " + email,
    "Phone: " + phone,
    "Service: " + service,
    "",
    "Project details:",
    message || "(No project details provided)",
  ].join("\n");

  try {
    GmailApp.sendEmail(RECIPIENT, subject, body, {
      replyTo: email,
      name: "Purehaven Website",
    });
    return response_("success", requestId);
  } catch (error) {
    console.error("Estimate email failed: " + error);
    return response_("error", requestId);
  }
}

function clean_(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function response_(status, requestId) {
  const safeRequestId = /^[0-9a-f-]{36}$/i.test(requestId) ? requestId : "";
  return HtmlService.createHtmlOutput(
    '<!doctype html><script>window.top.postMessage(' +
      JSON.stringify({
        type: "purehaven-estimate-result",
        status: status,
        requestId: safeRequestId,
      }) +
      ', "*");</script>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
