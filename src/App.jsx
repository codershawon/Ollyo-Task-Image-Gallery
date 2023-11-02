import React, { useState, useEffect, useCallback } from "react";
import galleryList from "./data.js";
import NewImages from "./components/NewImages.jsx";
import Card from "./components/Card.jsx";
import { FaCheckSquare } from "react-icons/fa";

const App = () => {
  // Load selectedImages and deletedImages from localStorage
  const initialSelectedImages = JSON.parse(localStorage.getItem("selectedImages")) || [];
  const initialDeletedImages = JSON.parse(localStorage.getItem("deletedImages")) || [];

  // Clear deletedImages from localStorage 
  localStorage.removeItem("deletedImages");

  const [images, setImages] = useState(galleryList);
  const [selectedImages, setSelectedImages] = useState(initialSelectedImages);
  const [deletedImages, setDeletedImages] = useState(initialDeletedImages);
  const [isDeleteButtonHovered, setDeleteButtonHovered] = useState(false);

  // Function to move an image within the list
  const moveImage = (dragIndex, hoverIndex) => {
    setImages((prevImages) => {
      const clonedImages = [...prevImages];
      const removedImage = clonedImages.splice(dragIndex, 1)[0];
      clonedImages.splice(hoverIndex, 0, removedImage);
      return clonedImages;
    });
  };

  // Function to toggle the selection of an image
  const toggleImageSelection = (imageId) => {
    if (selectedImages.includes(imageId)) {
      setSelectedImages(selectedImages.filter((id) => id !== imageId));
    } else {
      setSelectedImages([...selectedImages, imageId]);
    }
  };

  //  Function to delete selected images
  const deleteSelectedImages = () => {
    const remainingImages = images.filter(
      (image) => !selectedImages.includes(image.id)
    );
    const deleted = images.filter((image) => selectedImages.includes(image.id));
    setImages(remainingImages);
    setDeletedImages([...deletedImages, ...deleted]);
    setSelectedImages([]);
  };

  // Save selectedImages and deletedImages to localStorage when they change
  useEffect(() => {
    localStorage.setItem("selectedImages", JSON.stringify(selectedImages));
    localStorage.setItem("deletedImages", JSON.stringify(deletedImages));
  }, [selectedImages,deletedImages]);

  const onDrop = useCallback((acceptedFiles) => {
    const updatedImages = acceptedFiles.map((file, index) => ({
      id: `new-image-${index}`, // Generate a unique ID for each uploaded image
      img: URL.createObjectURL(file),
      title: "New Image", // You can set a default title or customize it
    }));

    // Add the uploaded images to the existing images
    setImages((prevImages) => [...prevImages, ...updatedImages]);
  }, []);
  return (
    /*-------------Image Gallery section start-------------------*/
    <div className="container">
      <h1 className="text-center text-[#197685] block uppercase mb-2 text-lg lg:text-3xl font-semibold font-mono mt-10">
        ---Image Gallery---
      </h1>
      <div className="bg-gray-100 p-10 rounded-lg mb-10">
        {selectedImages.length > 0 && (
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm lg:text-2xl font-semibold gap-2">
              <FaCheckSquare className="text-blue-600 w-6 h-6 " />
              {selectedImages.length}{" "}
              {selectedImages.length === 1 ? "file" : "files"} selected
            </div>
            <div
              className="delete-button-container"
              onMouseEnter={() => setDeleteButtonHovered(true)}
              onMouseLeave={() => setDeleteButtonHovered(false)}
            >
              <button
                onClick={deleteSelectedImages}
                className="text-red-600 text-sm lg:text-xl font-semibold"
              >
                Delete Files
              </button>
              {isDeleteButtonHovered && (
                <hr className="w-full border-2 border-red-600 rounded-lg " />
              )}
            </div>
          </div>
        )}
        <hr className="w-full border-2 border-x-gray-300 mt-5" />
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card
              src={image.img}
              title={image.title}
              id={image.id}
              index={index}
              moveImage={moveImage}
              isFeature={index === 0}
              selectedImages={selectedImages}
              toggleImageSelection={toggleImageSelection}
            />
          ))}
          <NewImages onDrop={onDrop} />
        </main>
      </div>
    </div>
      /*-------------Image Gallery section end-------------------*/
  );
};

export default App;

