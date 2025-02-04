import config from "@/lib/config";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
    privateKey: config.env.imagekit.privateKey!,
    publicKey: config.env.imagekit.publicKey!,
    urlEndpoint: config.env.imagekit.urlEndpoint!
})

export async function GET() {
    return NextResponse.json(imagekit.getAuthenticationParameters())
}