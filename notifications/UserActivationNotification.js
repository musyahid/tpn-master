const pug = require('pug');
const config = require('config');
const Notifications = require('../libraries/utils/Notifications.js');

/**
 * User Activation Notification
 */
class UserActivationNotification extends Notifications {
  constructor({ fullname, email, emailVerCode }) {
    super(['email']);
    this.fullname = fullname;
    this.email = email;
    this.emailVerCode = emailVerCode;
  }

  /**
   * Get the mail representation of the notification.
   * @return {Object}
   */
  async toEmail() {
    const template = await pug.renderFile('./template/user-activation-notification.jade', {
      fullname: this.fullname,
      link: `${config.get('app.url')}/activation?token=${this.emailVerCode}&email=${this.email}`,
    });

    const body = {
      notification: [
        {
          driver: 'email',
          content: template,
          recipient: {
            name: this.fullname,
            email: this.email,
            subject: 'Activation User',
          },
        },
      ],
    };

    return body;
  }
}

module.exports = UserActivationNotification;
