"use client";
import React, { useRef, useState } from "react";
import {
    IKImage,
    IKVideo,
    ImageKitProvider,
    IKUpload,
    ImageKitContext,
} from "imagekitio-next";
import config from "@/lib/config";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

const authenticator = async () => {
    try {
        const response = await fetch(
            `${config.env.endPointUrl}/api/auth/imagekit`
        );
        if (!response.ok) {
            const errorText = await response.text();
            // console.log("error : ", errorText);
            throw new Error(
                `Request failed with status ${response.status} : ${errorText}`
            );
        }

        const data = await response.json();
        const { token, expire, signature } = data;
        return { token, expire, signature };
    } catch (error: any) {
        // console.log("error : ", error.message);
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};
const ImageUpload = ({
    onFileChange,
}: {
    onFileChange: (filePath: string) => void;
}) => {
    const [file, setFile] = useState<{ filePath: string } | null>(null);
    const ikUploadRef = useRef(null);
    // const toast = useToast()
    return (
        <ImageKitProvider
            publicKey={config.env.imagekit.publicKey}
            urlEndpoint={config.env.imagekit.urlEndpoint}
            authenticator={authenticator}
        >
            <IKUpload
                className="hidden"
                ref={ikUploadRef}
                onError={() => {
                    console.log("error");
                    toast({
                        title: "Image upload failed",
                        description: "Your image couldn't be uploaded.",
                        variant: "destructive",
                    });
                }}
                onSuccess={(res) => {
                    setFile(res);
                    onFileChange(res.filePath);
                    toast({
                        title: "Image Uploaded successfully",
                        description: `${res.filePath} uploaded successfully.`,
                    });
                }}
                fileName="test.png"
            />

            <button
                className="upload-btn"
                onClick={(e) => {
                    e.preventDefault();

                    if (ikUploadRef.current) {
                        // @ts-ignore
                        ikUploadRef.current?.click();
                    }
                }}
            >
                <Image
                    src="/icons/upload.svg"
                    alt="upload"
                    height={20}
                    width={20}
                    className="object-contain"
                />

                <p className="text-light-100 text-base">Upload file</p>
                {file && <p className="upload-filename">{file.filePath}</p>}
            </button>

            {file && (
                <IKImage
                    alt={file.filePath}
                    path={file.filePath}
                    height={500}
                    width={300}
                />
            )}
        </ImageKitProvider>
    );
};

export default ImageUpload;
