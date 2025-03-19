import { z } from "zod";
export const registrationSchema = z.object({
  username: z
    .string()
    .min(4, { message: "یوزر حداقل باید 4 حرف باشد" })
    .max(8, { message: "یوزر حداکثر میتواند 8 حرف باشد" }),
  email: z.string().min(1, { message: "This field has to be filled." }).email("This is not a valid email."),
});
