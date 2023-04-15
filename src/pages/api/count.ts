// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

type Data = { index: number; uuid: string; key: string };

const getLength = async (uuid: string): Promise<number> => {
  const folderPath = path.join("/tmp", uuid);
  const images = await fs.readdir(folderPath);
  return images.length;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  var { uuid } = req.query;
  uuid = uuid as string;

  try {
    const length = await getLength(uuid);
    res.status(200).json({ length });
  } catch (error) {
    // Handle errors reading file or sending response
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1000mb",
    },
  },
};
