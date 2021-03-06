import ampqlib from 'amqplib';
import { sendMail } from './mail.service';

const queue = process.env.QUEUE;
const open = ampqlib.connect(process.env.AMQP_SERVER);

export const consumeMessage = () => {
  open
    .then((connection) => connection.createChannel())
    .then((channel) =>
      channel
        .assertQueue(queue, {
          durable: false,
        })
        .then(() => {
          console.log(
            ' [*] Waiting for messages in %s. To exit press CTRL+C',
            queue
          );
          return channel.consume(queue, (msg) => {
            if (msg !== null) {
              const queueMessage = msg.content.toString();
              const { pattern, data } = JSON.parse(queueMessage);
              console.log(data);
              const { type, email, mailContent } = JSON.parse(data);
              console.log(' [x] Received %s');
              sendMail(type, email, mailContent).then(() => {
                channel.ack(msg);
              });
            }
          });
        })
    )
    .catch((error) => console.warn(error));
};
