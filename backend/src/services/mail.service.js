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
    <title>Welcome to Corn Electronics</title>
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
    subject: "Welcome to Corn Electronics",
    html,
    text,
  };
};

const templates = {
  welcome: buildWelcomeTemplate,
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
