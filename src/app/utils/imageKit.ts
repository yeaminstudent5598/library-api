// SDK initialization
import dotenv from "dotenv"
dotenv.config()
import ImageKit from "imagekit"

export const imagekit = new ImageKit({
    publicKey : process.env.IMG_PUBLIC_KEY!,
    privateKey : process.env.IMG_PRIVATE_KEY!,
    urlEndpoint : process.env.IMG_URL_END_POINT!
});

