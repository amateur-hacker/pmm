"use client";

import { cn } from "@/lib/utils";
import { ImageIcon, Upload, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
  onPreview?: () => void;
  previewClassName?: string;
}

export function FileUpload({
  value,
  onChange,
  disabled,
  onPreview,
  previewClassName,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      <div className="flex items-center gap-2 overflow-hidden">
        <button
          type="button"
          onClick={onPreview}
          className={cn(
            "shrink-0 w-9 h-9 overflow-hidden border border-muted bg-background flex items-center justify-center hover:opacity-80 transition-opacity cursor-zoom-in rounded-sm",
            previewClassName,
          )}
        >
          {value?.startsWith("https://picsum.photos/200/200?random=") ? (
            <User className="h-4 w-4 text-muted-foreground" />
          ) : value ? (
            <img
              src={value}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <div className="flex-1 bg-secondary p-3 rounded-md text-sm truncate">
          {file ? file.name : value?.split("/").pop()}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="cursor-pointer"
          disabled={disabled || uploading}
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="cursor-pointer"
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? "Uploading..." : "Choose File"}
      </Button>
      <span className="text-sm text-muted-foreground">
        {uploading ? "Uploading..." : "No file chosen"}
      </span>
    </div>
  );
}
