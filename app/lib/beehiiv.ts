const BEEHIIV_API_URL = "https://api.beehiiv.com/v2";

export interface SubscribeResult {
  success: boolean;
  error?: string;
}

export async function subscribeEmail(
  email: string,
  utmSource?: string
): Promise<SubscribeResult> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    console.error("Beehiiv credentials not configured");
    return { success: false, error: "Newsletter not configured" };
  }

  try {
    const res = await fetch(
      `${BEEHIIV_API_URL}/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: utmSource || "website",
          utm_medium: "landing_page",
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Beehiiv error:", errorData);

      if (res.status === 400) {
        return { success: false, error: "Invalid email address" };
      }

      return { success: false, error: "Failed to subscribe" };
    }

    return { success: true };
  } catch (error) {
    console.error("Subscribe error:", error);
    return { success: false, error: "Something went wrong" };
  }
}
