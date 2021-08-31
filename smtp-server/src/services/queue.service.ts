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
              const { type, email, verifyURL } = JSON.parse(
                msg.content.toString()
              );
              console.log(' [x] Received %s');
              sendMail(type, email, verifyURL).then(() => {
                channel.ack(msg);
              });
            }
          });
        })
    )
    .catch((error) => console.warn(error));
};
