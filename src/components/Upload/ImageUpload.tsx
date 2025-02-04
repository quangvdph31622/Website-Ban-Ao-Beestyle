"use client";

import React, {useState} from "react";
import Image from "next/image";

const ImageUpload = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/jpg",
        "image/webp",
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);

            const validFiles = selectedFiles.filter((file) =>
                allowedTypes.includes(file.type)
            );

            if (validFiles.length === selectedFiles.length) {
                setFiles(validFiles);
            } else {
                setFiles(validFiles);
                console.error(
                    "Chỉ được phép tải lên các tệp hình ảnh (JPG, PNG, GIF, WEBP)."
                );
            }
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setImageUrls([]);
        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "beestyle_images");

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/du7lpbqc2/image/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    return data.secure_url;
                } else {
                    console.error("Upload failed:", await response.json());
                    return null;
                }
            });

            const urls = await Promise.all(uploadPromises);
            setImageUrls(urls.filter((url) => url !== null));
        } catch (error) {
            console.error("Đã xảy ra lỗi khi upload hình ảnh:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <div>
                <input type="file" multiple onChange={handleFileChange}/>{" "}
                <button onClick={handleUpload} disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload Images"}
                </button>
            </div>
            {imageUrls.length > 0 && (
                <div className="d-flex flex-wrap mt-4">
                    {imageUrls.map((url, index) => (
                        <div key={index} className="m-2">
                            <p>Uploaded Image {index + 1}:</p>
                            <Image
                                src={url}
                                alt={`Uploaded Image ${index + 1}`}
                                width={150}
                                height={150}
                                unoptimized
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
