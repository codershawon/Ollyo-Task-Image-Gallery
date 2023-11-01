import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";

import galleryList from "./data.js";  // imported data.js file
import NewImages from "./components/NewImages.jsx"; //imported NewImages.jsx file

const Card = ({ src, title, id, index, moveImage, isFeature, selectedImages, toggleImageSelection }) => {
  const ref = React.useRef(null);
  const [, drop] = useDrop({
    accept: "image",
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveImage(dragIndex, hoverIndex);

      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging()
      };
    }
  });

  const opacity = isDragging ? 0 : 1;

  return (
    <div
      ref={ref}
      className={`card border-b-gray-400 border-1 ${isFeature ? 'featured' : ''}`}
      style={{ opacity }}
    >
      {/* Container for image and checkbox */}
      <div className="card-content">
        <img src={src} alt={title} />
        {/* Checkbox - Hidden by default and shown on hover */}
        <input
          type="checkbox"
          className="checkbox"
          checked={selectedImages.includes(id)}
          onChange={() => toggleImageSelection(id)}
        />
      </div>
    </div>
  );
};
const App = () => {
  const [images, setImages] = React.useState(galleryList);
  const [selectedImages, setSelectedImages] = useState([]);
  const moveImage = React.useCallback((dragIndex, hoverIndex) => {
    setImages((prevCards) => {
      const clonedCards = [...prevCards];
      const removedItem = clonedCards.splice(dragIndex, 1)[0];

      clonedCards.splice(hoverIndex, 0, removedItem);
      return clonedCards;
    });
  }, []);

  const toggleImageSelection = (imageId) => {
    if (selectedImages.includes(imageId)) {
      setSelectedImages(selectedImages.filter((id) => id !== imageId));
    } else {
      setSelectedImages([...selectedImages, imageId]);
    }
  };
  return (
    /*------------ Image Gallery section start-------------*/
    <div className="container">
    <h1 className="text-center text-[#197685] block uppercase mb-2 text-3xl font-semibold font-mono mt-10">---Gallery---</h1>
  {/* Total selected images */}
     {selectedImages.length > 0 && (
        <div className="selected-images-info">
          {selectedImages.length} {selectedImages.length === 1 ? "file" : "files"} selected
        </div>
      )}
    <main className="image-gallery">
      {React.Children.toArray(
        images.map((image, index) => (
          <Card
            src={image.img}
            title={image.title}
            id={image.id}
            index={index}
            moveImage={moveImage}
            isFeature={index === 0} // Make the first image is feature image
            selectedImages={selectedImages}
            toggleImageSelection={toggleImageSelection}
          />
        ))
      )}
      <NewImages/>
    </main>
    </div>
    /*------------ Image Gallery section end-------------*/
  );
};

export default App;
