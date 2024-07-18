"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { formSchema, FormDataType } from "../api/data";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { api } from "../../../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useOrganization, useUser, } from "@clerk/nextjs";
import * as React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Doc } from "../../../../../convex/_generated/dataModel";


type TFormProps = {
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export function FormUpload({ setIsDialogOpen }: TFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            file: null
        },
    });

    const [isPending, startTransition] = React.useTransition();

    // get the current attached organization
    const organization = useOrganization();
    // get current user
    const user = useUser();
    let orgId: string | undefined = organization.organization?.id ?? user.user?.id;

    // call the backend operations
    const createFile = useMutation(api.files.createFile);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    if (!orgId) return <div>NO organization or user connected</div>

    // define the types of image allowed by the system.
    const types = {
        "application/pdf": "pdf",
        "image/png": "image",
        "image/jpeg": "image",
        "image/jpg": "image",
        "text/csv": "csv",
    } as Record<string, Doc<"files">["type"]>;

    const onSubmit = async (values: FormDataType) => {
        startTransition(async () => {

            try {
                // it generates the upload url: https://<convex.dev>/api/storage/fileId
                const postUrl = await generateUploadUrl();
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": values.file!.type },
                    body: values.file,
                });
                const { storageId } = await result.json();
                await createFile({
                    name: values.title,
                    organizationId: orgId as string,
                    fileId: storageId,
                    type: types[values.file!.type],
                });
                toast.success("File uploaded successfully");
                setIsDialogOpen(false);
            } catch (error) {
                toast.error("Failed to upload the file!");
                setIsDialogOpen(false);
                console.error("Error submitting the form:", error);
            }
        })
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="space-y-5">
                            <FormControl>
                                <Input placeholder="Title" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your file title.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { onChange, onBlur }, ...field }) => (
                        <FormItem className="space-y-5">
                            <FormControl>
                                <Input
                                    type="file" {...field}
                                    accept="image/*"
                                    onChange={
                                        (e) => {
                                            onChange(e.target.files?.[0])
                                        }
                                    } />
                            </FormControl>
                            <FormDescription>
                                Enter your file or drag and drop it here.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full flex gap-2" disabled={isPending}>
                    <AiOutlineLoading3Quarters size={30}
                        className={cn("animate-spin ", { hidden: !isPending })}
                    />
                    Submit
                </Button>
            </form>
        </Form>
    );
}
