import { createServerFn } from "@tanstack/react-start";
import { generateText, tool, stepCountIs, type ModelMessage } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(4000),
});

const inputSchema = z.object({
  messages: z.array(messageSchema).min(1).max(40),
});

const SYSTEM_PROMPT = `You are Klo-AI, the warm, refined design consultant for Kloche Interiors — a Nairobi luxury interior design and premium office fit-out atelier.

Voice: editorial, calm, hospitable, never salesy. Short paragraphs. Use the client's name once you know it.

Your goals, in order:
1. Welcome the visitor and understand what they want (residential, commercial fit-out, renovation, styling, consultation, etc.).
2. Have a natural conversation. Ask one focused question at a time. Gather: project type, location/area in Nairobi (or elsewhere), approximate scope/timeline if it comes up naturally, their name, and a WhatsApp number to reach them.
3. Answer questions about Kloche's services confidently: bespoke interior design, full residential design, office and commercial fit-outs, FF&E sourcing, project management, styling. Pricing is bespoke and discussed after a consultation.
4. Once you have name, phone, and enough context (project type + location or message), call the submit_enquiry tool exactly once to register the consultation request. Do not ask the visitor to confirm before submitting — just submit, then warmly confirm.
5. After submitting, thank them by first name and let them know the principal designer will reach out on WhatsApp within one business day. Do not call the tool a second time.

Rules:
- Never invent prices, timelines, or guarantees.
- If asked something off-topic, gently steer back to their space.
- Keep replies under 70 words.
- Phone numbers should be Kenyan WhatsApp-friendly; accept any format the user gives and pass it through.
- If the user only wants information, answer helpfully without forcing the form — but offer to set up a consultation at the end.`;

export const chatWithKloAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    let submitted = false;
    let enquiryId: string | null = null;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const messages: ModelMessage[] = data.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const result = await generateText({
      model,
      system: SYSTEM_PROMPT,
      messages,
      stopWhen: stepCountIs(5),
      tools: {
        submit_enquiry: tool({
          description:
            "Save the consultation request to the Kloche Interiors atelier. Call this exactly once when you have the visitor's name, phone, and project context.",
          inputSchema: z.object({
            name: z.string().min(2).max(100).describe("Visitor's full name"),
            phone: z
              .string()
              .min(7)
              .max(20)
              .describe("WhatsApp number, any format the user gave"),
            projectType: z
              .string()
              .min(2)
              .max(120)
              .describe("e.g. Residential home, Office fit-out, Restaurant"),
            location: z
              .string()
              .min(2)
              .max(120)
              .describe("Neighbourhood or city"),
            summary: z
              .string()
              .max(800)
              .optional()
              .describe("Short summary of what they want"),
          }),
          execute: async ({ name, phone, projectType, location, summary }) => {
            if (submitted) {
              return { ok: true, alreadySubmitted: true };
            }
            const normalizedPhone = normalizePhone(phone);
            const message = `Project type: ${projectType}\nLocation: ${location}${summary ? `\n\n${summary}` : ""}\nSubmitted via Klo-AI consultant.`;
            const { data: row, error } = await supabaseAdmin
              .from("enquiries")
              .insert({
                name,
                phone: normalizedPhone,
                email: null,
                service: "Interior Design",
                message,
                source: "Klo-AI",
              })
              .select("id")
              .single();
            if (error) {
              console.error("Klo-AI submit error:", error);
              return { ok: false, error: "Could not save enquiry" };
            }
            submitted = true;
            enquiryId = row.id;
            return { ok: true, id: row.id };
          },
        }),
      },
    });

    return {
      text: result.text || "Thank you. I'll be right back with you.",
      submitted,
      enquiryId,
    };
  });

function normalizePhone(raw: string): string {
  const trimmed = raw.trim().replace(/[\s\-()]/g, "");
  if (trimmed.startsWith("+")) return trimmed;
  if (trimmed.startsWith("0")) return "+254" + trimmed.slice(1);
  if (trimmed.startsWith("254")) return "+" + trimmed;
  if (/^\d{9}$/.test(trimmed)) return "+254" + trimmed;
  return trimmed.startsWith("+") ? trimmed : "+" + trimmed;
}
