const crypto = require('crypto');
const http = require('http');
const os = require('os');

const fileImpl = require('./file.impl');
const redisImpl = require('./redis.impl');

const version = '1.0';

const folderPath = fileImpl.init();
const redisClient = redisImpl.init();

function getMessage() {
  let message = `Nodul API version ${version}${os.EOL}`;
  message += `Hostname = ${os.hostname()}${os.EOL}`;
  message += `Environment variable NODUL_FOO = ${process.env.NODUL_FOO}${os.EOL}`;
  return message;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Content-Type', 'text/plain');

  res.write(getMessage());
  res.write(os.EOL);

  const alea1 = crypto.randomBytes(2).toString('hex');
  const filePath = fileImpl.writeNew(folderPath, alea1);
  res.write(`New file written in '${filePath}'${os.EOL}`);
  if (redisClient !== undefined) {
    const alea2 = crypto.randomBytes(2).toString('hex');
    await redisImpl.addValue(redisClient, alea1, alea2);
    res.write(`New value added to Redis ${alea1}=${alea2}${os.EOL}`);
  }
  res.write(os.EOL);

  res.write(`File list in ${folderPath}:${os.EOL}`);
  fileImpl.getList(folderPath).forEach(f => res.write(`  - ${f}${os.EOL}`));
  res.write(os.EOL);

  if (redisClient !== undefined) {
    res.write(`Values in redis:${os.EOL}`);
    (await redisImpl.getAllValues(redisClient)).forEach(v => res.write(`  - ${v}${os.EOL}`));
    res.write(os.EOL);
  }

  res.end();
});

const port = process.env.NODUL_API_PORT || 3000;

server.listen(port, () => {
  console.log(`API listening at port ${port}`);
});
