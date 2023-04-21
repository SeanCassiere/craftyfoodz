import sendgrid from "@sendgrid/mail";

import { env } from "@/env.mjs";
import { UI_CONFIG } from "@/lib/config";

sendgrid.setApiKey(env.SAP_SENDGRID_API_KEY);

type Person = {
  name: string;
  email: string;
};

export async function sendEmail(payload: {
  data: Record<string, string | number>;
  to: Person[];
  templateId: string;
  subject: string;
}) {
  return await sendgrid.send({
    to: payload.to,
    from: {
      name: `${UI_CONFIG.company_name}`,
      email: env.SAP_SENDGRID_FROM_EMAIL,
    },
    templateId: payload.templateId,
    dynamicTemplateData: payload.data,
    subject: payload.subject,
  });
}
