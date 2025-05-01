import { useState } from "react";
import { useTranslation } from "react-i18next";
import { maxFileSize } from "../Components/Logic/StaticLists";
import { toast } from "react-toastify";

const useFileHandler = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const { t: key } = useTranslation();
  const notifyError = () => toast.error(key("imgSizeError"));

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file?.size > maxFileSize) {
      notifyError();
      return;
    }
    setSelectedFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
    e.target.value = null;
  };

  return {
    selectedFile,
    imagePreviewUrl,
    handleFileChange,
  };
};

export default useFileHandler;
