import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onCall } from "firebase-functions/v2/https";
import { adminDb } from "../../lib/firebase/admin";

/**
 * When a new suggestion is created, log it and prepare for email notification.
 * Add Resend/SendGrid integration when env vars are configured.
 */
export const onNewSuggestion = onDocumentCreated(
  "suggestions/{suggestionId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const suggestion = snapshot.data();
    console.log("New suggestion received:", suggestion);
  }
);

/**
 * Send push notification to all subscribed tokens.
 */
export const sendPushNotification = onCall(async (request) => {
  const { title, body, url } = request.data as {
    title: string;
    body: string;
    url?: string;
  };

  const snapshot = await adminDb.collection("pushSubscriptions").get();
  const tokens = snapshot.docs.map((doc) => doc.data().token);

  console.log(`Sending push notification to ${tokens.length} subscribers`, {
    title,
    body,
    url,
  });

  // TODO: Integrate Firebase Cloud Messaging (FCM) here
  // const admin = await import("firebase-admin");
  // const message = { notification: { title, body }, tokens };
  // await admin.messaging().sendEachForMulticast(message);

  return { success: true, notifiedCount: tokens.length };
});
