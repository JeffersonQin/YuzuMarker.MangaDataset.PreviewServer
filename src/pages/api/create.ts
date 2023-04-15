// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";

const { API_KEY } = process.env;

type Data = {
  uuid: string;
  msg: string;
};

function createFolder(folderPath: string) {
  const folderUUID = uuidv4();
  folderPath = `${folderPath}/${folderUUID}`;
  fs.mkdirSync(folderPath, { recursive: true }); // create folder if it doesn't exist
  return folderUUID;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { key } = await req.body;
  if (key !== API_KEY) {
    res.status(401).json({ uuid: "", msg: "invalid key" });
    return;
  }
  try {
    const folderUUID = createFolder(`images`);

    // Start the task with a delay of 3 days
    setTimeout(async () => {
      try {
        await fs.promises.rmdir(`images/${folderUUID}`, {
          recursive: true,
        });
        console.log(`Preview ${folderUUID} deleted successfully`);
      } catch (err) {
        console.error("Error deleting files:", err);
      }
    }, 259200000); // 3 days in milliseconds

    res.status(200).json({ uuid: folderUUID, msg: "success" });
  } catch (err) {
    console.error("Error deleting files:", err);
    res.status(500).json({ uuid: "", msg: `error: ${err}` });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1000mb",
    },
  },
};
