import * as React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc, Id } from '../../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, TrashIcon } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';


export interface IFileCardProps {
    file: Doc<"files">;  // to get the exact type that come from the table.
}

export function AlertDeleteDialog({ isdialogOpen, setIsDialogOpen, fileId }: { isdialogOpen: boolean, setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>, fileId: Id<"files"> }) {
    const deleteFile = useMutation(api.files.deleteFile);

    const handleDelete = async () => {
        try {
            await deleteFile({ fileId });
            toast.success("File successfully deleted");
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Failed to delete file");
        }

    }

    return (
        <AlertDialog open={isdialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    );
}


export function FileCardActions({ fileId }: { fileId: Id<"files"> }) {

    const [isdialogOpen, setIsDialogOpen] = React.useState(false);

    return (
        <>
            <AlertDeleteDialog isdialogOpen={isdialogOpen} setIsDialogOpen={setIsDialogOpen} fileId={fileId} />
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVertical size={20} className=' ring-0 focus:outline-none' />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        className=' flex gap-1 text-red-500 items-center cursor-pointer'
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <TrashIcon size={20} /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>

    );
}


export function FileCard({ file }: IFileCardProps) {
    const user = useUser();
    // this gives information about the current organization.
    const organization = useOrganization();
    let orgId: string | undefined = organization.organization?.id ?? user.user?.id;

    return (
        <Card>
            <CardHeader className=' relative '>
                <CardTitle>
                    {file.name}
                </CardTitle>
                <div className=' absolute top-5 right-1'>
                    <FileCardActions fileId={file._id} />
                </div>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter >
                <Button>Download</Button>
            </CardFooter>
        </Card>
    );
}
