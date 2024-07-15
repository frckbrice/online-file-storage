"use client"
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UploadFile } from "./upload-file-dialog";
import { PlusIcon } from "lucide-react";
import { FileCard } from "../../dashbord";

export default function HomePage() {

    const user = useUser();
    // this gives information about the current organization.
    const organization = useOrganization();
    let orgId: string | undefined = organization.organization?.id ?? user.user?.id;

    const getFiles = useQuery(api.files.getFiles, orgId ? { organizationId: orgId } : "skip");

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 mb-8">
                {getFiles?.map((file) => (
                    <FileCard key={file?._id} file={file} />
                ))}
            </div>

        </main>
    );
}
