import React from "react";
import { useDrag, useDrop } from "react-dnd";

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
    drag(drop(ref));
    return (
        /*-------Card section start--------*/
        <div
          ref={ref}
          className={`card border-b-gray-400 border-1 ${isFeature ? 'featured' : ''}`}
          style={{ opacity }}
        >
          {/* Container for image and checkbox */}
          <div className="card-content rounded-lg">
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
          /*-------Card section end--------*/
      );
    };
    export default Card;