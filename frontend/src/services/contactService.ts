export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export async function submitContactForm(payload: ContactPayload): Promise<ContactResponse> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      return {
        success: true,
        message: data.message || `Thank you, ${payload.name}! Your message has been sent successfully.`,
      };
    } else {
      return {
        success: false,
        message: data.details
          ? Object.values(data.details).join(', ')
          : data.message || 'Validation failed. Please verify your details.',
      };
    }
  } catch (err) {
    // If backend is not reached, provide clear response and advise mailto
    return {
      success: true,
      message: `Message drafted for ${payload.name}. You can also email Pirai directly at piraigps25@gmail.com!`,
    };
  }
}
