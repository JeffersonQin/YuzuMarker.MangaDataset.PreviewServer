import fs from "fs/promises";
import path from "path";

import { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export async function getStaticPaths() {
  // get all folder names under public/images
  const imageFolders = await fs.readdir(
    path.join(process.cwd(), "public", "images"),
    { withFileTypes: true }
  );
  const uuids = imageFolders
    .filter((folder) => folder.isDirectory())
    .map((folder) => folder.name);

  const paths = uuids.map((uuid) => ({
    params: { uuid },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  // get all images under public/images/{params.uuid}
  // then sort them by name (converting the name without extension to number)
  const folderPath = path.join(process.cwd(), "public", "images", params.uuid);
  const images = await fs.readdir(folderPath);

  const sortedImages = images.sort((a, b) => {
    const aNum = parseInt(path.parse(a).name);
    const bNum = parseInt(path.parse(b).name);
    return aNum - bNum;
  }).map((image) => path.join('/', 'images', params.uuid, image));

  return {
    props: {
      images: sortedImages,
    },
  };
}

export default function Preview({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 dark:from-blue-900 dark:via-purple-800 dark:to-pink-900">
      <div className="flex justify-center items-center bg-gray-100 py-2 bg-gray-100 dark:bg-gray-800">
        <p className="font-semibold text-gray-800 dark:text-gray-100">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
      <div className="flex-grow relative">
        <img
          className="absolute top-0 left-0 w-full h-full object-scale-down"
          src={images[currentIndex]}
          alt={images[currentIndex]}
        />
        <div
          onClick={prevImage}
          className="absolute top-0 left-0 w-1/2 h-full bg-transparent cursor-pointer flex items-center justify-start pl-4"
        >
          <IoIosArrowBack className="text-gray-800 dark:text-gray-100 text-4xl hover:text-gray-600 dark:hover:text-gray-300" />
        </div>
        <div
          onClick={nextImage}
          className="absolute top-0 right-0 w-1/2 h-full bg-transparent cursor-pointer flex items-center justify-end pr-4"
        >
          <IoIosArrowForward className="text-gray-800 dark:text-gray-100 text-4xl hover:text-gray-600 dark:hover:text-gray-300" />
        </div>
      </div>
    </div>
  );
}
