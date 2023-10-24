import { handleRequest } from "../utils/axios";
import { resizeFile } from "../utils/FileUtils";

export const requestUploadImage = async (file, dirPath = '', maxWidth = 800, maxHeight = 1000,) => {
  const newFile = await resizeFile(file, maxWidth, maxHeight);

  const formData = new FormData();
  formData.append("file", newFile);
  formData.append("prefix", dirPath);

  const config = {
    url: '/media/upload',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };

  return handleRequest(config);
};