const notesDB = process.env.NOTES_DB;
const notesDBUsername = process.env.NOTES_DB_USERNAME;
const notesDBPassword = process.env.NOTES_DB_PASSWORD;

console.log('INITIALIZING', notesDB, notesDBUsername, notesDBPassword)
db = db.getSiblingDB(notesDB);

console.log('HERE_HERE_HERE')
console.log(notesDB)

db.createUser({
  user: notesDBUsername,
  pwd: notesDBPassword,
  roles: [
    {
      role: 'readWrite',
      db: notesDB,
    },
  ],
});
