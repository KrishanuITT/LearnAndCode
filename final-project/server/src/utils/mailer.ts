/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { NewsDTO } from "#externalAPIs/DTOs/NewsAPIDTO.js";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  auth: {
    pass: process.env.BREVO_PASS,
    user: process.env.BREVO_USER,
  },
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
});

export async function sendNotificationEmail(to: string, articles: NewsDTO[]) {
  if (!articles.length) return;

  const articleListHtml = `
      <hr />
      <h3>1. ${articles[0].title}</h3>
      <p>${articles[0].description.slice(0, 200)}</p>
      <p><b>Category:</b> ${articles[0].category}</p>
      <p><b>Source:</b> ${articles[0].source}</p>
      <p><a href="${articles[0].url}">Read more</a></p>
    `;

  const htmlContent = `
      <h2>You have ${articles.length} new news updates 📬</h2>
      <hr />
      ${articleListHtml}
      <hr />
      <p>This is an automated message from the News Application.</p>
    `;

  await transporter.sendMail({
    from: '"Test" <mishrakrishanu23@gmail.com>',
    html: htmlContent,
    subject: `📰 ${articles.length} New Article${articles.length > 1 ? "s" : ""} Available`,
    to: "mishrakrishanu05@gmail.com",
  });
}
