var admin = require("firebase-admin");

var serviceAccount = require("./smartapp-22b6b-firebase-adminsdk-3tavd-26606e72f9.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smartapp-22b6b-default-rtdb.firebaseio.com"
})

module.exports.admin = admin