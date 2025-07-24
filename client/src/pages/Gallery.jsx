import React, { useEffect, useState } from "react";
import axios from "axios";
import Masonry from "react-masonry-css";
import Lightbox from "react-image-lightbox";
import { useNavigate } from "react-router-dom";
import "react-image-lightbox/style.css";
import "./Gallery.css";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts?limit=100");
        const postsWithImages = res.data.filter((post) => post.image);
        setImages(
          postsWithImages.map((post) => ({
            src: `http://localhost:5000${post.image}`,
            alt: post.title,
            postId: post._id,
          }))
        );
      } catch (err) {
        console.error("Error fetching images", err);
      }
    };

    fetchImages();
  }, []);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">🖼️ Image Gallery</h2>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {images.map((img, index) => (
          <div
            key={index}
            className="gallery-item"
            onClick={() => {
              setPhotoIndex(index);
              setIsOpen(true);
            }}
            style={{ cursor: "pointer" }}
          >
            <img src={img.src} alt={img.alt} className="gallery-img" />
          </div>
        ))}
      </Masonry>

      {isOpen && (
        <Lightbox
          mainSrc={images[photoIndex].src}
          nextSrc={images[(photoIndex + 1) % images.length].src}
          prevSrc={images[(photoIndex + images.length - 1) % images.length].src}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % images.length)
          }
          imageTitle={images[photoIndex].alt}
          toolbarButtons={[
            <button
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                background: "#fff8f0",
                border: "1px solid #e4b168",
                color: "#b45309",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => navigate(`/posts/${images[photoIndex].postId}`)}
            >
              Go to Post
            </button>,
          ]}
        />
      )}
    </div>
  );
};

export default Gallery;
