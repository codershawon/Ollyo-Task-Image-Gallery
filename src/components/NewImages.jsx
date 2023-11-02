import React from "react";
import { useDropzone } from "react-dropzone";

const baseStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  transition: "border .3s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const NewImages = ({ onDrop }) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
  });

  const style = {
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
  };


  return (
    /*-----------Add Images section start------------*/
    <div className="images-container">
    <div
      {...getRootProps({ style })}
      className="card flex justify-center items-center h-full w-full border-dashed border-2 border-gray-500 p-8 rounded-lg cursor-pointer"
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
        <img
          className="w-10 h-10 mx-auto mb-10"
          src="https://i.ibb.co/mNYd1Gd/pngwing-com-1.png"
          alt="upload image"
        />
        <p className="text-gray-500 text-xs sm:text-lg lg:text-4xl -mt-6 sm:-mt-2 lg:-mt-0">Add Images</p>
      </div>
    </div>
  </div>
  /*-----------Add Images section end------------*/
);
};

export default NewImages;



