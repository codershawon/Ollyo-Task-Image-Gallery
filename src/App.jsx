import React, { useState, useEffect, useCallback } from "react";
import galleryList from "./data.js";
import NewImages from "./components/NewImages.jsx";
import Card from "./components/Card.jsx";
import { FaCheckSquare } from "react-icons/fa";
import Aos from "aos";
import 'aos/dist/aos.css';

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

  useEffect(() => {
    Aos.init();
  }, []);

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
    
    // Remove the deleted images from the selectedImages state
    const updatedSelectedImages = selectedImages.filter(
      (imageId) => !deleted.map((image) => image.id).includes(imageId)
    );
  
    setImages(remainingImages);
    setDeletedImages([...deletedImages, ...deleted]);
    setSelectedImages(updatedSelectedImages);
  };
  

  // Save selectedImages and deletedImages to localStorage when they change
  useEffect(() => {
    localStorage.setItem("selectedImages", JSON.stringify(selectedImages));
    localStorage.setItem("deletedImages", JSON.stringify(deletedImages));
  }, [selectedImages,deletedImages]);

  const onDrop = useCallback((acceptedFiles) => {
    const updatedImages = acceptedFiles.map((file, index) => ({
      id: `new-image-${index}`, 
      img: URL.createObjectURL(file),
      title: "New Image", 
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
      <div className="bg-gray-300 p-10 rounded-lg mb-10 mt-10">
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
        <hr className="w-full border-2 border-x-gray-200 mt-5" />
        <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
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
              key={image.id}
             
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

