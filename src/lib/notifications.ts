// Structured Notification Dispatcher

export interface NotificationPayload {
  to: string;
  subject: string;
  body: string;
  type: 'booking_created' | 'booking_status_updated' | 'user_approved' | 'user_rejected';
  metadata?: Record<string, any>;
}

export async function sendNotification(payload: NotificationPayload): Promise<{ success: boolean }> {
  // Log dispatch cleanly for production environment & webhook hooks
  console.log(`[NOTIFICATION DISPATCH] [${payload.type.toUpperCase()}] To: ${payload.to} | Subject: "${payload.subject}"`);
  console.log(`[BODY]:\n${payload.body}`);

  // Configurable external SMTP or Webhook hook integration point
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('[NOTIFICATION WEBHOOK ERROR]:', err);
    }
  }

  return { success: true };
}
