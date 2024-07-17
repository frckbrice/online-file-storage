"use client"
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UploadFile } from "../../home-page";
import { PlusIcon } from "lucide-react";
import { FileCard, SideNav } from "../../dashbord";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { SearchBar } from "../../home-page";
import { useState } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import Link from "next/link";

const PlaceHolder = () => {
    return (
        <div className="flex flex-col justify-center items-center p-8 gap-5">
            <div className=" relative h-72 w-80 pb-2 "> {/* TODO: add a placeholder image */}
                <Image
                    src={"/images/undraw_files.svg"}
                    fill
                    alt={"logo"}
                />
            </div>
            <p className=" text-2xl">Upload some files to get started.</p>
            <UploadFile />
        </div>
    )
}

const NoResult = () => {
    return (
        <div className="flex flex-col justify-center items-center mt-24 gap-5">
            <div className=" relative h-72 w-80 pb-2 "> {/* TODO: add a placeholder image */}
                <Image
                    src={"/images/no-data.svg"}
                    fill
                    alt={"logo"}
                />
            </div>
            <p className=" text-2xl">No results for this search...</p>
        </div>
    )
}

type FilePageProps = {
    title: string;
    favorite?: boolean
}

type FilesType = {
    _id: Id<"files">;
    _creationTime: number;
    name: string;
    organizationId: string;
    fileId: Id<"_storage">;
    type: "image" | "csv" | "pdf";
}
type FavoriteFileType = {
    _id: Id<"favorites">;
    _creationTime: number;
    fileId: Id<"files">;
    userId: Id<"users">;
    orgId: string;
} & { _id: Id<"files">; _creationTime: number; name: string; organizationId: string; fileId: Id<"_storage">; type: "image" | "csv" | "pdf"; }

export default function FilePage({
    title,
    favorite
}: FilePageProps) {

    const [query, setQuery] = useState("");
    const user = useUser();
    // this gives information about the current organization.
    const organization = useOrganization();
    let orgId: string | undefined = organization.organization?.id ?? user.user?.id;

    let files: FilesType[] | FavoriteFileType[];
    if (!favorite)
        files = useQuery(api.files.getFiles, orgId ? { organizationId: orgId, query } : "skip") as FilesType[];
    else
        files = useQuery(api.files.getFiles, orgId ? { organizationId: orgId, query, favorite } : "skip") as FavoriteFileType[];

    const isLoading = files === undefined;

    return (
        <main className=" container mx-auto ">
            {/*  loading when the files load */}
            <div className=" w-full flex ">
                {/* <SideNav /> */}
                <div className="w-full">
                    {
                        files === undefined && (
                            <div className="flex justify-center items-center p-8 gap-5 w-full h-[70vh]">
                                <AiOutlineLoading3Quarters className=" animate-spin text-5xl text-gray-500" />
                                <p className=" text-lg">Loading images...</p>
                            </div>
                        )
                    }
                    {
                        !isLoading && (
                            <>

                                <div className=" flex justify-evenly items-center ">
                                    <h1 className=" text-3xl font-bold">{title}</h1>

                                    {/* TODO: add serch onchange event after enter key */}
                                    <SearchBar query={query} setQuery={setQuery} />
                                    {/* upload file */}
                                    {!favorite ? <UploadFile /> : <Link href={"/dashboard/files"}><Button>Back to files</Button></Link>}
                                </div>

                                {
                                    files?.length === 0 && <NoResult />
                                }
                                {/* show files */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 mb-8">
                                    {files?.map((file) => (
                                        <FileCard key={file?._id} file={file} />
                                    ))}
                                </div>
                            </>
                        )
                    }
                    {/* {files?.length === 0 && !isLoading && <NoResult />} */}
                </div>
            </div>

        </main >
    );
}
