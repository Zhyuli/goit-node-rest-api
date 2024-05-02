import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "hw06_email@meta.ua",
    pass: META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const email = {
  to: "xitew90051@shanreto.com",
  from: "hw06_email@meta.ua",
  subject: "Test email",
  html: "<p><strong>Test email</strong> from localhost:3000</p>",
};

const sendEmail = async (data) => {
  const email = { ...data, from: "hw06_email@meta.ua" };
  await transport.sendMail(email);
  return true;
};
export default sendEmail;
