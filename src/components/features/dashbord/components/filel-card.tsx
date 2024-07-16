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
import { DownloadIcon, FileIcon, FileImageIcon, FilesIcon, FileX2Icon, GanttChartIcon, GitPullRequestDraftIcon, ImageIcon, MoreVertical, TrashIcon } from 'lucide-react';
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
import Image from 'next/image';


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
    {/* <FileIcon size={30} /> */ }
    const fileType = {
        pdf: <span className=' flex items-center w-20 h-20'>&nbsp; Document</span>,
        image: <span className=' flex items-center'><ImageIcon size={30} /> '📄'&nbsp; Image</span>,
        csv: <span className=' flex items-center'><GanttChartIcon size={30} />&nbsp; CSV</span>,
    } as Record<Doc<"files">["type"], React.ReactNode>;
    //

    //query to get the file url
    const getFileUrl = useQuery(api.files.getFileUrl, {
        fileId: file.fileId,
        organizationId: orgId as string
    })

    return (
        <Card>
            <CardHeader className=' relative '>
                <CardTitle className=' flex items-center gap-2'>

                    <span>{file.name}</span>
                </CardTitle>
                <div className=' absolute top-5 right-1'>
                    <FileCardActions fileId={file._id} />
                </div>
                {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent className=' h-[250px] display flex justify-start'>
                {file.type === "image" && (
                    <Image
                        src={getFileUrl as string}
                        width={200}
                        height={100}
                        alt={"logo"}
                    />
                )}
                {file.type === "pdf" && (
                    <Image
                        src={"/images/pdf_file.png" as string}
                        width={200}
                        height={100}
                        alt={"logo"}
                    />
                )}
                {file.type === "csv" && (
                    <Image
                        src={"/images/csv_file.jpg" as string}
                        width={200}
                        height={100}
                        alt={"logo"}
                    />
                )}
                {/* <p>{fileType[file.type]}</p> */}
            </CardContent>
            <CardFooter >
                <Button onClick={() => window.open(getFileUrl as string, "_blank")}>
                    <DownloadIcon size={20} className=' mr-2' /> Download</Button>
            </CardFooter>
        </Card>
    );
}
