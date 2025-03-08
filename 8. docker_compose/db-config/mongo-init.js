const keyValueDb = process.env.KEY_VALUE_DB;
const keyValueUser = process.env.KEY_VALUE_USER;
const keyValuePassword = process.env.KEY_VALUE_PASSWORD;

console.log('INITIALIZING', keyValueDb, keyValueUser, keyValuePassword)
db = db.getSiblingDB(keyValueDb);

console.log('HERE_HERE_HERE')
console.log(keyValueDb)

db.createUser({
  user: keyValueUser,
  pwd: keyValuePassword,
  roles: [
    {
      role: 'readWrite',
      db: keyValueDb,
    },
  ],
});
