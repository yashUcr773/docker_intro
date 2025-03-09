const db_name = process.env.NOTES_DB;
const db_username = process.env.NOTES_DB_USERNAME;
const db_password = process.env.NOTES_DB_PASSWORD;

console.log('INITIALIZING', db_name, db_username, db_password)
db = db.getSiblingDB(db_name);

console.log('HERE_HERE_HERE')
console.log(db_name)

db.createUser({
  user: db_username,
  pwd: db_password,
  roles: [
    {
      role: 'readWrite',
      db: db_name,
    },
  ],
});
