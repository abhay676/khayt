import nodemailer from 'nodemailer';

type EmailType = 'verify' | 'welcome' | 'password_reset' | 'notification';

const transport = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PWD,
  },
});

export const sendMail = async (
  type: EmailType,
  to: string,
  verifyURL?: string
) => {
  let mailSubject: string, mailContent: string;
  switch (type) {
    case 'verify':
      mailSubject = `Welcome to Khayt 💪`;
      mailContent = `
      <p>Hi</p> <br />
    <p>http://localhost:3000/user/verify?token=${verifyURL}</p> <br/>
    <p>Click on above link to verify your account</p>
    <footer>Thanks!</footer>`;
      break;

    default:
      break;
  }
  return transport.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject: mailSubject,
    html: mailContent,
  });
};
