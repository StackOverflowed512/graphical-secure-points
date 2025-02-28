
import React, { useState, useRef, useEffect } from "react";
import { AuthImage, ClickPoint } from "@/types/auth";
import { getRelativeCoordinates } from "@/utils/authUtils";
import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageSelectorProps {
  images: AuthImage[];
  onComplete: (clickPoints: ClickPoint[]) => void;
  mode: "register" | "login";
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  images,
  onComplete,
  mode,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [clickPoints, setClickPoints] = useState<ClickPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastClick, setLastClick] = useState<{ x: number; y: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentImage = images[currentImageIndex];

  // Handle image loading
  useEffect(() => {
    setIsLoading(true);
  }, [currentImageIndex]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Handle image click
  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || isLoading) return;

    // Get coordinates relative to the image
    const { x, y } = getRelativeCoordinates(event, imageRef.current);
    
    // Store last click for visual feedback
    setLastClick({ x, y });
    setShowFeedback(true);

    // Create a new click point
    const newClickPoint: ClickPoint = {
      x,
      y,
      imageId: currentImage.id,
    };

    // Add to collection
    const updatedPoints = [...clickPoints, newClickPoint];
    setClickPoints(updatedPoints);

    // Clear feedback after a delay
    setTimeout(() => {
      setShowFeedback(false);
      
      // Move to next image or complete
      if (currentImageIndex < images.length - 1) {
        setTimeout(() => {
          setCurrentImageIndex(currentImageIndex + 1);
          setLastClick(null);
        }, 300);
      } else {
        onComplete(updatedPoints);
      }
    }, 500);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">
          {mode === "register" ? "Create your graphical password" : "Enter your graphical password"}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          {mode === "register"
            ? "Click on a point in each image that you'll remember"
            : "Click on the same points you selected during registration"}
        </p>
        <div className="text-center mb-2">
          <span className="text-sm font-medium">
            Image {currentImageIndex + 1} of {images.length}
          </span>
        </div>
      </div>

      <div 
        className={cn(
          "image-container relative w-full aspect-[4/3] bg-muted", 
          showFeedback && "highlighted"
        )}
        onClick={handleImageClick}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader />
          </div>
        )}
        
        <img
          ref={imageRef}
          src={currentImage.url}
          alt={currentImage.alt}
          className={cn(
            "object-cover w-full h-full",
            isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"
          )}
          onLoad={handleImageLoad}
        />
        
        {showFeedback && lastClick && (
          <div
            className="click-point"
            style={{
              left: `${lastClick.x}px`,
              top: `${lastClick.y}px`,
            }}
          />
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => {
            if (currentImageIndex > 0) {
              setCurrentImageIndex(currentImageIndex - 1);
              setClickPoints(clickPoints.slice(0, -1));
              setLastClick(null);
            }
          }}
          disabled={currentImageIndex === 0 || showFeedback || isLoading}
        >
          Back
        </Button>
        
        <div className="flex gap-1">
          {images.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentImageIndex
                  ? "bg-primary w-4"
                  : index < currentImageIndex
                  ? "bg-primary/60"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          onClick={() => {
            if (clickPoints.length > 0 && currentImageIndex < images.length - 1) {
              setCurrentImageIndex(currentImageIndex + 1);
            }
          }}
          disabled={
            currentImageIndex === images.length - 1 || 
            clickPoints.length <= currentImageIndex ||
            showFeedback ||
            isLoading
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ImageSelector;
