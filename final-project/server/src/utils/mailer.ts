/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { NewsDTO } from "#externalAPIs/DTOs/NewsAPIDTO.js";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  auth: {
    pass: process.env.MAIL_PASSWORD,
    user: process.env.MAIL_USER,
  },
  service: "gmail",
});

export async function sendNotificationEmail(to: string, articles: NewsDTO[]) {
    if (!articles.length) return;
  
    const articleListHtml = articles.map((article, index) => `
      <hr />
      <h3>${index + 1}. ${article.title}</h3>
      <p>${article.description.slice(0, 200)}</p>
      <p><b>Category:</b> ${article.category}</p>
      <p><b>Source:</b> ${article.source}</p>
      <p><a href="${article.url}">Read more</a></p>
    `).join("");
  
    const htmlContent = `
      <h2>You have ${articles.length} new news updates 📬</h2>
      ${articleListHtml}
      <hr />
      <p>This is an automated message from the News Application.</p>
    `;
  
    const info = await transporter.sendMail({
      from: '"News Notifier" <no-reply@news.com>',
      html: htmlContent,
      subject: `📰 ${articles.length} New Article${articles.length > 1 ? "s" : ""} Available`,
      to,
    });
  
    console.log(`Email sent to ${to}:`, info.messageId);
  }