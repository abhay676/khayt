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
  mailDynamicData?: string
) => {
  let mailSubject: string, mailContent: string;
  switch (type) {
    case 'verify':
      mailSubject = `Request to verify email`;
      mailContent = `
      <p>Hi</p> <br />
    <a href=http://localhost:3000/user/verify?token=${mailDynamicData}>Verify Email</a> <br/>
    <p>Click on above link to verify your account</p>
    <footer>Thanks!</footer>`;
      break;
    case 'welcome':
      mailSubject = `Welcome to Khayt 💪`;
      mailContent = `
      <h2>Welcome, ${mailDynamicData}</h2>
      <main>
      <div><p>Good to see your choice. Hope we will become longer partner than your ex-URL service.</p></div>
      </main>
    <footer>Thanks!</footer>`;
      break;
    default:
      break;
  }
  return transport
    .sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: mailSubject,
      html: mailContent,
    })
    .then(() => {
      console.log('Email Send!');
    });
};
