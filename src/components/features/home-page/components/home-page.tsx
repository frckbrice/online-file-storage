"use client"

import { Button } from "@/components/ui/button";
import { UploadFile } from "./upload-file-dialog";
import { PlusIcon } from "lucide-react";

export default function HomePage() {

    return (
        <main className=" container mx-auto pt-12">
            <div className=" flex justify-between items-center ">
                <h1 className=" text-4xl font-bold">Your Files</h1>
                <UploadFile >
                    <Button variant={"outline"}>
                        <PlusIcon size={20} /> &nbsp; Upload File
                    </Button>
                </UploadFile>
            </div>
        </main>
    );
}
