import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

/* =========================================================
   CHECK EMAIL ENV VARIABLES
========================================================= */

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.warn("⚠️ Email credentials missing in .env");
}

/* =========================================================
   NODEMAILER TRANSPORTER
========================================================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/* =========================================================
   VERIFY EMAIL CONNECTION
========================================================= */

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email transporter ready!");
  }
});

/* =========================================================
   TRACTOR REGISTRATION EMAIL
========================================================= */

export const sendRegistrationEmail = async ({
  ownerName,
  email,
  model,
  tractorNumber,
  horsepower,
  fuelType,
}) => {
  try {
    console.log(`📧 Sending registration email to ${email}`);

    await transporter.sendMail({
      from: `"Green Field Hub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🚜 Tractor Registration Successful",

      html: `
      <h2>🚜 Tractor Registered Successfully</h2>

      <p>Hello <b>${ownerName}</b>,</p>

      <p>Your tractor has been successfully registered.</p>

      <ul>
        <li><b>Model:</b> ${model}</li>
        <li><b>Number:</b> ${tractorNumber}</li>
        <li><b>Horsepower:</b> ${horsepower} HP</li>
        <li><b>Fuel Type:</b> ${fuelType}</li>
      </ul>

      <p>Thank you for using <b>Green Field Hub</b>.</p>
      `,
    });

    console.log(`✅ Registration email sent to ${email}`);

  } catch (error) {
    console.error("❌ Registration email failed:", error.message);
  }
};

/* =========================================================
   TRACTOR RENTAL EMAIL (OWNER)
========================================================= */

export const sendRentalConfirmationEmail = async ({
  ownerEmail,
  ownerName,
  renterName,
  renterEmail,
  ownerPhone,
  model,
  tractorNumber,
  totalCost,
}) => {
  try {
    console.log(`📧 Sending rental email to ${ownerEmail}`);

    await transporter.sendMail({
      from: `"Green Field Hub" <${process.env.EMAIL_USER}>`,
      to: ownerEmail,
      subject: "🚜 New Tractor Rental",

      html: `
      <div style="font-family: Arial, sans-serif">

      <h2>New Tractor Rental</h2>

      <p>Hello <b>${ownerName.toUpperCase()}</b>,</p>

      <p>
      <b>Farmer:</b> ${renterName} & ${ownerPhone || "Phone Not Provided"} (${renterEmail})
      </p>

      <p>
      <b>Tractor:</b> ${model} (${tractorNumber})
      </p>

      <p>
      <b>Total:</b> ₹${totalCost}
      </p>

      </div>
      `,
    });

    console.log(`✅ Rental email sent to ${ownerEmail}`);

  } catch (error) {
    console.error("❌ Rental email failed:", error.message);
  }
};

/* =========================================================
   PASSWORD RESET EMAIL
========================================================= */

export const sendPasswordResetEmail = async ({
  email,
  name,
  resetUrl,
}) => {
  try {
    console.log(`📧 Sending password reset email to ${email}`);

    await transporter.sendMail({
      from: `"Green Field Hub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Password Reset Request",

      html: `
      <div style="font-family: Arial; max-width:600px; margin:auto">

      <h2>Password Reset Request</h2>

      <p>Hello <b>${name}</b>,</p>

      <p>You requested a password reset.</p>

      <p>Click the button below:</p>

      <a href="${resetUrl}" 
      style="background:#16a34a;color:white;padding:12px 24px;
      text-decoration:none;border-radius:6px;">
      Reset Password
      </a>

      <p style="margin-top:20px;font-size:12px;color:#888">
      Link expires in 15 minutes.
      </p>

      </div>
      `,
    });

    console.log(`✅ Password reset email sent to ${email}`);

  } catch (error) {
    console.error("❌ Password reset email failed:", error.message);
    throw error;
  }
};