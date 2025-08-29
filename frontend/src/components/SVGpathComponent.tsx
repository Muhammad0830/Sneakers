"use client";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { useTheme } from "next-themes";
import Dots from "@/components/Dots";

interface TrendingProduct {
  id: number;
  name: string;
  size: string;
}

const products: TrendingProduct[] = [
  { id: 0, name: "sneakersRed", size: "32" },
  { id: 1, name: "sneakersBlue", size: "33" },
  { id: 2, name: "sneakersYellow", size: "34" },
  { id: 3, name: "sneakersGreen", size: "35" },
  { id: 4, name: "sneakersPink", size: "36" },
];

type handleFunctions = {
  moveToIndex: (index: number) => void;
};

type SVGpathComponentProps = {
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>;
  initialIndex: number;
};

const SVGpathComponent = forwardRef<handleFunctions, SVGpathComponentProps>(
  ({ setIsAnimating, initialIndex }, ref) => {
    //   const [isAnimating, setIsAnimating] = useState(false);
    const { theme } = useTheme();
    const [dotPositions, setDotPositions] = useState<
      { x: number; y: number }[]
    >([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);
    const dotsGroupRef = useRef<SVGGElement>(null);
    const selectedCircleRef = useRef<SVGCircleElement>(null);

    const updatePath = () => {
      const totalDots = products.length;

      const maxPathLength = 400;
      const minPathLength = 200;
      const pathLength =
        minPathLength + ((totalDots - 2) / 3) * (maxPathLength - minPathLength);

      const maxCurveDepth = 0;
      const minCurveDepth = 80;
      const curveDepth =
        maxCurveDepth - ((totalDots - 2) / 3) * (maxCurveDepth - minCurveDepth);

      const startX = 50,
        startY = 250;
      const endX = 50 + pathLength,
        endY = 250;
      const controlX = (startX + endX) / 2;
      const controlY = startY - curveDepth;

      if (pathRef.current) {
        pathRef.current.setAttribute(
          "d",
          `M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`
        );
      }

      return pathRef.current?.getTotalLength() || 0;
    };

    const updateDots = () => {
      const fullPathLength = updatePath();
      const positions = products
        .map((_, i) => {
          if (!pathRef.current) return { x: 0, y: 0 };
          return pathRef.current.getPointAtLength(
            fullPathLength * (i / (products.length - 1))
          );
        })
        .reverse();

      setDotPositions(positions);

      if (dotsGroupRef.current) {
        dotsGroupRef.current.innerHTML = ""; // clear existing dots

        if (selectedCircleRef.current) {
          gsap.set(selectedCircleRef.current, {
            x: positions[initialIndex].x,
            y: positions[initialIndex].y,
          });
        }
      }
    };

    const moveToIndex = (index: number) => {
      if (index < 0 || index >= products.length || index === currentIndex)
        return;

      const fullPathLength = updatePath();
      const positions = products
        .map((_, i) => {
          if (!pathRef.current) return { x: 0, y: 0 };
          return pathRef.current.getPointAtLength(
            fullPathLength * (i / (products.length - 1))
          );
        })
        .reverse();

      if (selectedCircleRef.current) {
        setIsAnimating(true);

        gsap.to(selectedCircleRef.current, {
          x: positions[index].x,
          y: positions[index].y,
          duration: 0.7,
          ease: "power1.inOut",
          onComplete: () => {
            setIsAnimating(false);
          },
        });
      }

      setCurrentIndex(index);
    };

    useImperativeHandle(ref, () => ({
      moveToIndex,
    }));

    useEffect(() => {
      updateDots();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className="w-full">
        <div className="absolute w-[150%] mx-auto my-0 top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%]">
          <svg viewBox="0 0 500 500">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g transform="rotate(270, 250, 250)" filter="url(#glow)">
              <path
                ref={pathRef}
                stroke={`${theme === "light" ? "black" : "white"}`}
                strokeWidth="3"
                fill="none"
              />
              <g ref={dotsGroupRef}>
                <Dots products={products} positions={dotPositions} />
              </g>
              <circle
                filter="url(#glow)"
                ref={selectedCircleRef}
                r="8"
                fill={`${theme === "light" ? "black" : "white"}`}
              />
            </g>
          </svg>
        </div>
      </div>
    );
  }
);

SVGpathComponent.displayName = "SVGpathComponent";

export default SVGpathComponent;
