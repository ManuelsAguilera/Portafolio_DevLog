importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBDRdJ5ZfZT_i91wcTrbyxRw8ZfMKD0L9A",
  authDomain: "manudevlog.firebaseapp.com",
  projectId: "manudevlog",
  storageBucket: "manudevlog.firebasestorage.app",
  messagingSenderId: "697787494046",
  appId: "1:697787494046:web:10516731515f83b8f9558f",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  if (!title) return;
  self.registration.showNotification(title, {
    body,
    icon: "/favicon.ico",
  });
});
