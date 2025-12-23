import dotenv from 'dotenv';
import ImageKit from "imagekit";

// Ensure environment variables are loaded
dotenv.config();

var imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imageKit;