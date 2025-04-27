const uploadImage = async (image) => {
  if (!image) {
    throw new Error("No image provided for upload.");
  }

  const url = `https://api.cloudinary.com/v1_1/do1nvdtpm/image/upload`;

  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "mern_product");

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Upload error:", error.message);
    return null;
  }
};

export default uploadImage;