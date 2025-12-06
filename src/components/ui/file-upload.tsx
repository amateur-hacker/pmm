"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FileUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}

export function FileUpload({ value, onChange, disabled }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!value) {
      setFile(null);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFile = files[0];
    setFile(selectedFile);

    try {
      setUploading(true);
      // Upload the file to Vercel Blob
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Using fetch to upload to a server endpoint that handles blob upload
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // throw new Error("Upload failed");
        toast.error("Upload failed");
      }

      const { url } = await response.json();
      onChange(url); // Update the parent component with the uploaded file URL
    } catch (error) {
      console.error("Upload error:", error);
      // Reset the file if upload fails
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    onChange(null);
  };

  if (file || value) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-secondary p-3 rounded-md text-sm truncate">
          {file ? file.name : value?.split("/").pop()}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || uploading}
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="flex-1 text-muted-foreground"
      />
      {/* <Button */}
      {/*   type="button" */}
      {/*   variant="outline" */}
      {/*   size="sm" */}
      {/*   disabled={!value || uploading} */}
      {/* > */}
      {/*   <Upload className="h-4 w-4 mr-2" /> */}
      {/*   {uploading ? "Uploading..." : "Upload"} */}
      {/* </Button> */}
    </div>
  );
}
