const axios = require('axios');
const config = require('config');

const baseUrl = config.get('app.notif');

/**
 * Notifications Class
 */
class Notifications {
  constructor(via) {
    this.via = via;
  }

  /**
   * Send notification according to channel that has been set (database, email, chataja)
   */
  async send() {
    this.via.forEach(async (val) => {
      switch (val) {
        case 'database':
          // TODO menambahkan executor notifikasi database
          break;
        case 'email':
          await axios.post(baseUrl, await this.toEmail());
          break;
        case 'chataja':
          // TODO menambahkan executor notifikasi chat aja
          break;
        default:
          break;
      }
    });
  }
}

module.exports = Notifications;
