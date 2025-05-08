const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AWo6dJ7KNh0-PQu3wwPZOn0aP4nXTQOoKwDOJTm9MfY3018eHKI7BEMMZRuAnBbc0LTA0QPxssRtwlaf",
  client_secret: "EN8nmrTXhfPpLI1ZSRQ5ix4YmnySSgAV_zzTMEb0wtz6KfEfuCUuB5eLSYpbKjdfKe3r8_HulcI9_bcv",
});

module.exports = paypal;
