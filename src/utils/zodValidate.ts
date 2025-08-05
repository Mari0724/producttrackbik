import { ZodSchema } from "zod";

export const zodValidate = <T>(
  schema: ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const error = result.error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join("; ");
    return { success: false, error };
  }
  return { success: true, data: result.data };
};