import { z } from "zod"

export const formSchema = z.object({
    title: z.string().min(2).max(50, {
        message: "Title must be between 2 and 50 characters",
    }),
    file: z.custom<File | null>((file) => file instanceof File, "required"),
});

export type FormDataType = z.infer<typeof formSchema>
