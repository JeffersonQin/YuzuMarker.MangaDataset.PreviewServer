// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { readFile } from "fs";

const { API_KEY } = process.env;

type Data = { index: number; uuid: string; key: string };

const getImages = async (uuid: string): Promise<string[]> => {
  const folderPath = path.join("/tmp", uuid);
  const images = await fs.readdir(folderPath);

  const sortedImages = images
    .sort((a, b) => {
      const aNum = parseInt(path.parse(a).name);
      const bNum = parseInt(path.parse(b).name);
      return aNum - bNum;
    })
    .map((image) => path.join("/tmp", uuid, image));

  return sortedImages;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  var { index, uuid } = req.query;
  uuid = uuid as string;
  var image_index = 0;
  if (typeof index === "string") {
    image_index = parseInt(index as string);
  }

  try {
    const images = await getImages(uuid);
    const image = images[image_index];

    // Read image file data from path
    const imageData = await fs.readFile(image);
    // Set response headers to indicate content type and length
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Content-Length", imageData.length);

    // Send image data in response body
    res.send(imageData);
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
