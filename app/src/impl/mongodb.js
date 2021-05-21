const MongoClient = require('mongodb').MongoClient;

async function init() {
  if (process.env.NODUL_USE_MONGO === undefined) {
    console.warn('Not using MongoDB');
    return undefined;
  }

  const mongoDBHost = process.env.NODUL_MONGO_HOST || '127.0.0.1';
  const mongoDBPort = process.env.NODUL_MONGO_PORT || 27017;

  const mongoDBUrl = `mongodb://${mongoDBHost}:${mongoDBPort}`;
  console.log(`Connecting to MongoDB '${mongoDBUrl}'`);
  const client = new MongoClient(mongoDBUrl, { useUnifiedTopology: true });
  return client.connect();
}

async function close(client) {
  console.log(`Disconnecting from MongoDB`);
  await client.close();
}

async function getAllDocuments(client) {
  const db = client.db('nodulapp');
  const collection = db.collection('nodulapp');
  const docs = await collection.find('{}').toArray();
  const values = [];
  for (const doc of docs) {
    values.push({ value: doc.value });
  }
  return values;
}

async function addValue(client, value) {
  const db = client.db('nodulapp');
  const collection = db.collection('nodulapp');
  await collection.insertOne({ value: value });
}

module.exports = {
  init: init,
  close: close,
  getAllDocuments: getAllDocuments,
  addValue: addValue
}
