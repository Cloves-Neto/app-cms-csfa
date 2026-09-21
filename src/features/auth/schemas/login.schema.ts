import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "O e-mail é obrigatório.")
    .email("Informe um formato de e-mail válido (ex: seu.nome@csfa.com.br)."),
  password: z
    .string()
    .min(1, "A senha é obrigatória.")
    .min(4, "A senha deve conter no mínimo 4 caracteres."),
});

export type LoginFormData = z.infer<typeof loginSchema>;
