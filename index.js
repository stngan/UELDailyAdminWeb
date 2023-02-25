const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const admin = require("firebase-admin");
const path = require('path')

const serviceAccount = require('./ueldaily-hubing-firebase-adminsdk-n7z22-6a739f3910.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ueldaily-hubing-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const csrfMiddleware = csrf({cookie:true});

const PORT = process.env.PORT || 5000;
// Initialise Express
const app = express();
app.engine("html", require("ejs").renderFile);
// Render static files
app.use("/",express.static('src'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// Set the view engine to ejs
app.set('view engine', 'ejs');
// *** GET Routes - display pages ***
// Root Route
app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

// app.get("/notification", function (req, res) {
//   res.render("notification.html");
// });

// app.get("/department", function (req, res) {
//   res.render("department.html");
// });

// app.get("/", function (req, res) {
//   res.render("account.html");
// });

app.get("/", function (req, res) {
  res.render("index.html");
});

app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/");
});
const registrationToken = ['eYMda8ZwQ4CHtQ5dFPu5I-:APA91bE8EG3qoysK6nf2HPZ-PJp2OqMOQ7zlTDxyj3XYi4PivNhbcTL5eDdQLDXz0470LZCM-s11Evi6bPkHey0ebrdbyeeoBmdc5wG7Vk4TZXwHG6RUtaB-VHAmFCxVgrSAGtPsXnZA',];
const message = {
  data: {score: '850', time: '2:45'},
  tokens: registrationToken,
};

// admin.messaging().sendMulticast(message)
//   .then((resp) => {
//     console.log('Message sent successfully:', resp);
//   }).catch((err) => {
//     console.log('Failed to send the message:', err);
//   });
// Port website will run on
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});



