
const { omit, pick } = require('lodash');
const bcrypt = require('bcrypt');

// method compare password bcrypt
async function comparePassword(candidatePassword) {
  const result = await bcrypt.compare(candidatePassword, this.password);
  return result;
}

function toJSON() {
  return omit(this.toObject(), ['password']);
}

function transform() {
  return pick(this.toJSON(), ['_id', 'email', 'fullname', 'type', 'nik']);
}

module.exports = {
  comparePassword, toJSON, transform,
};
