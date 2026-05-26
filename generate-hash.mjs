import crypto from 'crypto';

const password = 'DormManagerCMSC127'; // change this
const salt = 'default-salt';

const hash = crypto
  .createHash('sha256')
  .update(password + salt)
  .digest('hex');

console.log(hash);