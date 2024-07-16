"use client"
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UploadFile } from "./upload-file-dialog";
import { PlusIcon } from "lucide-react";
import { FileCard } from "../../dashbord";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function HomePage() {

    const user = useUser();
    // this gives information about the current organization.
    const organization = useOrganization();
    let orgId: string | undefined = organization.organization?.id ?? user.user?.id;

    const getFiles = useQuery(api.files.getFiles, orgId ? { organizationId: orgId } : "skip");

    return (
        <main className=" container mx-auto pt-12">
            {/* load loading when the files load */}
            {
                getFiles === undefined && (
                    <div className="flex flex-col justify-center items-center p-8 gap-5">
                        <AiOutlineLoading3Quarters className=" animate-spin text-5xl text-gray-500" />
                        <p className=" text-lg">Loading images...</p>
                    </div>
                )
            }

            {/* check if the files are empty i.e [] */}
            {getFiles?.length === 0 && (
                <div className="flex flex-col justify-center items-center p-8 gap-5">
                    <div className=" relative h-72 w-80 pb-2 ">
                        <Image
                            src={"/images/undraw_files.svg"}
                            fill
                            alt={"logo"}
                        />
                    </div>
                    <p className=" text-2xl">You do not have any files yet.</p>
                    {/* upload file */}
                    <UploadFile />
                </div>
            )
            }
            {/* check if there is files */}
            {
                !!getFiles?.length && (
                    <>

                        <div className=" flex justify-between items-center ">
                            <h1 className=" text-4xl font-bold">Your Files</h1>
                            {/* upload file */}
                            <UploadFile />
                        </div>
                        {/* show files */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 mb-8">
                            {getFiles?.map((file) => (
                                <FileCard key={file?._id} file={file} />
                            ))}
                        </div>
                    </>
                )
            }
        </main >
    );
}
