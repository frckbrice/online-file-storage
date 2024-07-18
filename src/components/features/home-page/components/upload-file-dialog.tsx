"use client"
import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FormUpload } from './upload-form';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';


export interface IUploadFileProps {
    children?: React.ReactNode;

}

export function UploadFile({ children }: IUploadFileProps) {

    const [isdialogOpen, setIsDialogOpen] = React.useState(false)


    return (
        <Dialog open={isdialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className=' ' size="sm">
                    <PlusIcon /> &nbsp; Upload File
                </Button>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader className="space-y-8">
                    <DialogTitle>Upload Your File</DialogTitle>
                    <DialogDescription asChild>
                        <FormUpload setIsDialogOpen={setIsDialogOpen} />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
