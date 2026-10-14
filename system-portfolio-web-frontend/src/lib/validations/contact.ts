import { z } from "zod";

// As mensagens de erro são chaves de tradução (contact.validation.*).
// Os limites são os mesmos validados de novo na Edge Function "contact".
export const contactSchema = z.object({
  name: z.string().trim().min(2, "name").max(100, "name"),
  email: z.email("email").max(200, "email"),
  message: z.string().trim().min(10, "message").max(5000, "message"),
  // Campo-armadilha: invisível para pessoas, robôs costumam preencher
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
