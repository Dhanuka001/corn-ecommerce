const nodemailer = require("nodemailer");
const env = require("../config/env");

const isConfigured = Boolean(env.mailHost && env.mailUser && env.mailPass);

const transporter = nodemailer.createTransport(
  isConfigured
    ? {
        host: env.mailHost,
        port: env.mailPort,
        secure: env.mailSecure,
        auth: {
          user: env.mailUser,
          pass: env.mailPass,
        },
      }
    : {
        jsonTransport: true,
      },
);

const formatCurrency = (value) => {
  if (typeof value !== "number") {
    return value;
  }
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(value);
};

const buildWelcomeTemplate = ({ firstName, lastName, email }) => {
  const nameParts = [firstName, lastName].filter(Boolean);
  const displayName = nameParts.length ? nameParts.join(" ") : "Friend";
  const joinedOn = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const brandColor = "#ff1b1b";
  const cardBackground = "#fff7f7";
  const imageUrl = `${env.frontendBaseUrl}/pb.png`;
  const startLink = `${env.frontendBaseUrl}/shop`;

  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Welcome to PhoneBazzar.lk</title>
  </head>
  <body style="margin:0;background:#f4f6fa;font-family:-apple-system,'Segoe UI',sans-serif;color:#0f172a;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(15,23,42,0.1);">
            <tr>
              <td align="center" style="padding:32px 32px 8px;">
                <img src="${imageUrl}" alt="PhoneBazzar" width="120" style="display:block;margin:0 auto 16px;" />
                <h1 style="margin:0;font-size:28px;color:${brandColor};">Welcome to PhoneBazzar</h1>
                <p style="margin:8px 0 0;font-size:16px;color:#475467;">Hi ${displayName}, thanks for creating an account. We are ready to keep you stocked with the latest gadgets.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;">
                <div style="background:${cardBackground};border-radius:20px;padding:24px;">
                <p style="margin:0 0 12px;font-weight:600;color:#101828;">Account snapshot</p>
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size:14px;color:#475467;">
                    <tr>
                      <td style="padding:6px 0;">Email</td>
                      <td align="right" style="padding:6px 0;font-weight:600;">${email || "Not provided"}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;">Member since</td>
                      <td align="right" style="padding:6px 0;font-weight:600;">${joinedOn}</td>
                    </tr>
                  </table>
                  <p style="margin:20px 0 0;font-size:14px;color:#475467;">
                    Add your shipping address and wishlist items to make future checkout a breeze.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:32px;">
                <a href="${startLink}" style="display:inline-block;padding:14px 32px;border-radius:999px;background:${brandColor};color:#ffffff;text-decoration:none;font-weight:600;">Start browsing</a>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:24px;font-size:12px;color:#94a3b8;">
                Need help? Reply to ${env.mailFromAddress} or visit our <a href="${env.frontendBaseUrl}/support" style="color:${brandColor};text-decoration:none;">support page</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `Hi ${displayName},

Thanks for joining PhoneBazzar. Your account is ready to go and we will keep you updated with new arrivals and offers.

Explore the marketplace: ${startLink}

Need help? Reply to ${env.mailFromAddress}.

— PhoneBazzar`;

  return {
    subject: "Welcome to PhoneBazzar",
    html,
    text,
  };
};

const buildOrderTemplate = ({
  orderNo,
  orderDate,
  paymentMethod,
  shippingAddress = {},
  items = [],
  totals = {},
}) => {
  const brandColor = "#ff1b1b";
  const highlightColor = "#101828";
  const cardBackground = "#f8fafc";
  const orderLink = `${env.frontendBaseUrl}/account`;
  const formattedDate = new Date(orderDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const subtotal = formatCurrency(totals.subTotalLKR ?? 0);
  const shipping = formatCurrency(totals.shippingLKR ?? 0);
  const discount = formatCurrency(totals.discountLKR ?? 0);
  const total = formatCurrency(totals.totalLKR ?? 0);

  const shippingLines = [
    shippingAddress.fullName,
    shippingAddress.phone && `Phone: ${shippingAddress.phone}`,
    shippingAddress.addressLine1,
    shippingAddress.addressLine2,
    shippingAddress.city || shippingAddress.district,
    shippingAddress.postalCode,
    shippingAddress.country,
  ]
    .filter(Boolean)
    .join("<br />");

  const itemsHtml = items
    .map((item) => {
      const variantLine = item.variantName
        ? `<p style="margin:4px 0 0;font-size:13px;color:#475467;">${item.variantName}</p>`
        : "";
      return `
        <tr style="background:#ffffff;border-radius:20px;margin-bottom:12px;box-shadow:0 5px 25px rgba(15,23,42,0.08);">
          <td style="padding:16px;vertical-align:top;width:120px;">
            <img src="${item.imageUrl}" alt="" width="96" height="96" style="border-radius:16px;display:block;object-fit:cover;background:${cardBackground};" />
          </td>
          <td style="padding:16px;font-size:14px;color:${highlightColor};vertical-align:top;">
            <p style="margin:0;font-weight:600;">${item.name}</p>
            ${variantLine}
            <p style="margin:6px 0 0;font-size:13px;color:#475467;">SKU ${item.sku}</p>
          </td>
          <td align="right" style="padding:16px;font-size:14px;font-weight:600;color:${highlightColor};vertical-align:top;">
            ${item.qty} × ${formatCurrency(item.unitPrice)}
            <div style="font-size:13px;color:#475467;font-weight:400;">${formatCurrency(item.lineTotal)}</div>
          </td>
        </tr>`;
    })
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Order ${orderNo}</title>
  </head>
  <body style="margin:0;background:#f4f6fa;font-family:-apple-system,'Segoe UI',sans-serif;color:${highlightColor};">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px;">
          <table width="640" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:36px;overflow:hidden;box-shadow:0 30px 80px rgba(15,23,42,0.15);">
            <tr>
              <td align="center" style="padding:40px 32px 16px;">
                <img src="${env.frontendBaseUrl}/pb.png" alt="PhoneBazzar" width="120" style="display:block;margin:0 auto 16px;" />
                <p style="margin:0;font-size:18px;font-weight:600;color:${brandColor};">Order Confirmed</p>
                <h1 style="margin:6px 0 0;font-size:32px;">${orderNo}</h1>
                <p style="margin:4px 0 0;color:#475467;">Placed on ${formattedDate} · ${paymentMethod}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 24px;">
                <div style="background:${cardBackground};border-radius:24px;padding:24px;">
                  <p style="margin:0 0 12px;font-size:14px;color:#475467;">Hi, we’re preparing your order now.</p>
                  <p style="margin:0;font-size:24px;font-weight:600;color:${highlightColor};">${total}</p>
                  <p style="margin:12px 0 0;font-size:14px;color:#475467;">You’ll receive updates as we pack and ship your items.</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;">
                <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                  ${itemsHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="font-size:14px;color:#475467;">
                  <tr>
                    <td style="padding:8px 0;">Subtotal</td>
                    <td align="right" style="padding:8px 0;font-weight:600;">${subtotal}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;">Shipping</td>
                    <td align="right" style="padding:8px 0;font-weight:600;">${shipping}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;">Discount</td>
                    <td align="right" style="padding:8px 0;font-weight:600;">${discount}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-weight:600;color:${highlightColor};">Total</td>
                    <td align="right" style="padding:8px 0;font-weight:600;color:${highlightColor};">${total}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-top:1px solid #e2e8f0;padding-top:24px;">
                  <tr>
                    <td width="50%" valign="top" style="padding-right:16px;">
                      <p style="margin:0 0 8px;font-weight:600;color:${highlightColor};">Shipping to</p>
                      <p style="margin:0;font-size:14px;color:#475467;">${shippingLines}</p>
                    </td>
                    <td width="50%" valign="top" style="border-left:1px solid #e2e8f0;padding-left:16px;">
                      <p style="margin:0 0 8px;font-weight:600;color:${highlightColor};">Need help?</p>
                      <p style="margin:0;font-size:14px;color:#475467;">Reply to <a href="mailto:${env.mailFromAddress}" style="color:${brandColor};text-decoration:none;">${env.mailFromAddress}</a> or visit our <a href="${env.frontendBaseUrl}/support" style="color:${brandColor};text-decoration:none;">support page</a>.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:0 32px 40px;">
                <a href="${orderLink}" style="display:inline-block;padding:14px 32px;border-radius:999px;background:${brandColor};color:#ffffff;text-decoration:none;font-weight:600;">View order details</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const textItems = items
    .map(
      (item) =>
        `${item.name} (${item.sku}) × ${item.qty} → ${formatCurrency(item.lineTotal)}`,
    )
    .join("\n");

  const text = `Thanks for ordering with PhoneBazzar! Your order ${orderNo} has been confirmed.

Items:
${textItems}

Subtotal: ${subtotal}
Shipping: ${shipping}
Discount: ${discount}
Total: ${total}

Shipping address:
${shippingLines.replace(/<br \/>/g, "\n")}

Need help? Reply to ${env.mailFromAddress}.

View your order: ${orderLink}

— PhoneBazzar`;

  return {
    subject: `Order ${orderNo} confirmed`,
    html,
    text,
  };
};

const templates = {
  welcome: buildWelcomeTemplate,
  orderConfirmation: buildOrderTemplate,
};

const queueTransactionalMail = async ({ to, template, data = {} }) => {
  if (!to) {
    throw new Error("Recipient email is required for transactional mail.");
  }
  const templateBuilder = templates[template];
  if (!templateBuilder) {
    throw new Error(`Unknown mail template "${template}".`);
  }

  const content = templateBuilder(data);
  const message = {
    to,
    from: `${env.mailFromName} <${env.mailFromAddress}>`,
    ...content,
  };

  const info = await transporter.sendMail(message);
  if (!isConfigured) {
    console.log("Transactional mail preview:", info);
  }
  return info;
};

module.exports = {
  queueTransactionalMail,
};
