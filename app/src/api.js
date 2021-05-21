const crypto = require('crypto');
const http = require('http');
const os = require('os');

const fileImpl = require('./impl/file');
// const redisImpl = require('./impl/redis');
const mongoImpl = require('./impl/mongodb');

const version = '1.0';

let fileClient = undefined;
// let redisClient = undefined;
let mongoClient = undefined;

async function main() {
  fileClient = fileImpl.init();
  mongoClient = await mongoImpl.init();
  // redisClient = redisImpl.init();

  const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Content-Type', 'application/json');

    const returnObject = {
      title: `Nodul API version ${version}`,
      hostname: os.hostname(),
      env: {
        NODUL_FOO: process.env.NODUL_FOO
      },
      events: [],
      files: [],
      mongoDocuments: [],
      redisValues: []
    };

    const alea1 = crypto.randomBytes(2).toString('hex');
    const filePath = fileImpl.writeNew(fileClient, alea1);
    returnObject.events.push(`New file written in '${filePath}'`);
    if (mongoClient !== undefined) {
      await mongoImpl.addValue(mongoClient, alea1);
      returnObject.events.push(`New value added to MongoDB: ${alea1}`);
    }
    // if (redisClient !== undefined) {
    //   const alea2 = crypto.randomBytes(2).toString('hex');
    //   await redisImpl.addValue(redisClient, alea1, alea2);
    //   returnObject.events.push(`New value added to Redis: ${alea1}=${alea2}`);
    // }

    returnObject.files = fileImpl.getList(fileClient);
    if (mongoClient !== undefined) {
      returnObject.mongoDocuments = (await mongoImpl.getAllDocuments(mongoClient));
    }
    // if (redisClient !== undefined) {
    //   returnObject.redisValues = (await redisImpl.getAllValues(redisClient));
    // }

    res.write(JSON.stringify(returnObject, undefined, 2));
    res.end();
  });

  const port = process.env.NODUL_API_PORT || 3000;

  server.listen(port, () => {
    console.log(`API listening at port ${port}`);
  });
}

async function close() {
  if (fileClient !== undefined) {
    fileImpl.close();
  }
  if (mongoClient !== undefined) {
    await mongoImpl.close(mongoClient);
  }
  // if (redisClient !== undefined) {
  //   redisImpl.close(redisClient);
  // }
}

try {
  main();
} catch (error) {
  console.error(error);
} finally {
  //close();
}
