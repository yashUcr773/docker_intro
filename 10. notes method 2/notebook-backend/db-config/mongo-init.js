const notebooksDB = process.env.NOTEBOOKS_DB;
const notebooksDBUsername = process.env.NOTEBOOKS_DB_USERNAME;
const notebooksDBPassword = process.env.NOTEBOOKS_DB_PASSWORD;

console.log('INITIALIZING', notebooksDB, notebooksDBUsername, notebooksDBPassword)
db = db.getSiblingDB(notebooksDB);

console.log('HERE_HERE_HERE')
console.log(notebooksDB)

db.createUser({
  user: notebooksDBUsername,
  pwd: notebooksDBPassword,
  roles: [
    {
      role: 'readWrite',
      db: notebooksDB,
    },
  ],
});
