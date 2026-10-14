import { z } from "zod";

// As mensagens de erro são chaves de tradução (contact.validation.*)
export const contactSchema = z.object({
  name: z.string().trim().min(2, "name"),
  email: z.email("email"),
  message: z.string().trim().min(10, "message"),
});

export type ContactInput = z.infer<typeof contactSchema>;
