"use client";
import { Category } from "@prisma/client";
import { motion } from "framer-motion";
import { useState } from "react";

interface ISliderProps {
  category: Category[];
}

const Slider = ({ category }: ISliderProps) => {
  const [positionIndexes, setPositionIndexes] = useState<number[]>(
    Array.from({ length: category.length }, (_, index) => index),
  );

  const handleNext = () => {
    setPositionIndexes((prevIndexes) =>
      prevIndexes.map((index) => (index + 1) % category.length),
    );
  };

  const handleBack = () => {
    setPositionIndexes((prevIndexes) =>
      prevIndexes.map(
        (index) => (index + category.length - 1) % category.length,
      ),
    );
  };

  const imageVariants: {
    [key: string]: { x: string; scale: number; zIndex: number };
  } = {};

  const positions = ["center", "left1", "left", "right", "right1"];
  const getXPosition = (position: string) => {
    switch (position) {
      case "center":
        return "0%";
      case "left1":
        return "-50%";
      case "left":
        return "-90%";
      case "right":
        return "90%";
      case "right1":
        return "50%";
      default:
        return "0%";
    }
  };
  const getScale = (position: string) => {
    switch (position) {
      case "center":
        return 1;
      default:
        return 0.7;
    }
  };

  const getZIndex = (position: string) => {
    switch (position) {
      case "center":
        return 5;
      default:
        return 3;
    }
  };
  category.forEach((_, index) => {
    const position = positions[index % positions.length];
    imageVariants[position] = {
      x: getXPosition(position),
      scale: getScale(position),
      zIndex: getZIndex(position),
    };
  });

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {category.map((image, index) => (
        <motion.img
          key={index}
          src={image.imageUrl}
          alt={image.name}
          className="rounded-[12px] border border-s-violet-50 bg-black"
          initial="center"
          animate={positions[positionIndexes[index]]}
          variants={imageVariants}
          transition={{ duration: 0.5 }}
          style={{ width: "380px", height: "165px", position: "absolute" }}
        />
      ))}
      <div className="flex flex-row gap-3">
        <button
          className="mt-[400px] rounded-md bg-indigo-400 px-4 py-2 text-white"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          className="mt-[400px] rounded-md bg-indigo-400 px-4 py-2 text-white"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Slider;
