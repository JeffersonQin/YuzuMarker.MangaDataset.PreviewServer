// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";

type Data = {
  uuid: string;
  msg: string;
};

function saveImages(
  images: { ext: string; content: string }[],
  folderPath: string
): string {
  const folderUUID = uuidv4();
  folderPath = `${folderPath}/${folderUUID}`;
  fs.mkdirSync(folderPath, { recursive: true }); // create folder if it doesn't exist

  Array.from(images.entries()).forEach(([index, image]) => {
    const filepath = `${folderPath}/${index}.${image.ext}`;
    fs.writeFileSync(filepath, Buffer.from(image.content, "base64"));
  });
  return folderUUID;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { images } = await req.body;
    const folderUUID = saveImages(images, "public/images");
    res.status(200).json({ uuid: folderUUID, msg: "success" });
  } else {
    res.status(404).json({ uuid: "", msg: "use POST to send message" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1000mb",
    },
  },
};
