
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function makeAdmin() {
    // Your actual Firebase Authentication UID
    const uid = "ED1tmdXg1jVxZPIUBSt5h1O1WLw1";

    const user = await admin.auth().getUser(uid);

    await admin.auth().setCustomUserClaims(uid, {
        ...user.customClaims,
        admin: true
    });

    console.log("SUCCESS: Admin permission assigned!");
}

makeAdmin().catch(error => {
    console.error("ERROR:", error.message);
    process.exitCode = 1;
});
