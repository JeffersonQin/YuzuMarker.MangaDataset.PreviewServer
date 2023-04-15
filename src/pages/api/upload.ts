// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";

const { API_KEY } = process.env;

type Data = {
  msg: string;
};

function saveImages(
  image: { ext: string; content: string; index: number },
  folderPath: string
): void {
  const filepath = `${folderPath}/${image.index}.${image.ext}`;
  fs.writeFileSync(filepath, Buffer.from(image.content, "base64"));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { image, uuid, key } = await req.body;
    if (key !== API_KEY) {
      res.status(401).json({ msg: "invalid key" });
      return;
    }
    try {
      saveImages(image, `public/images/${uuid}`);
      res.status(200).json({ msg: "success" });
    } catch (err) {
      console.error("Error deleting files:", err);
      res.status(500).json({ msg: `error: ${err}` });
    }
  } else {
    res.status(404).json({ msg: "use POST to send message" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1000mb",
    },
  },
};
