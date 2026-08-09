import React, { createContext, useContext, useState, useEffect } from "react";

const ImageCMSContext = createContext({
  systemImages: {},
  loading: true,
  getSystemImage: (page, section, fallbackUrl) => fallbackUrl,
  refreshSystemImages: async () => {}
});

export const useImageCMS = () => useContext(ImageCMSContext);

export const ImageCMSProvider = ({ children }) => {
  const [systemImages, setSystemImages] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSystemImages = async () => {
    try {
      const res = await fetch("/api/gallery/system-images");
      if (res.ok) {
        const data = await res.json();
        setSystemImages(data.systemImages || {});
      }
    } catch (err) {
      console.error("Failed to fetch system images mapping:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemImages();
  }, []);

  const getSystemImage = (page, section, fallbackUrl) => {
    if (systemImages[page] && systemImages[page][section]) {
      const imgInfo = systemImages[page][section];
      const version = imgInfo.updatedAt ? new Date(imgInfo.updatedAt).getTime() : Date.now();
      return `${imgInfo.imageUrl}?v=${version}`;
    }
    return fallbackUrl;
  };

  return (
    <ImageCMSContext.Provider
      value={{
        systemImages,
        loading,
        getSystemImage,
        refreshSystemImages: fetchSystemImages
      }}
    >
      {children}
    </ImageCMSContext.Provider>
  );
};
