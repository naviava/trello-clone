"use client";

import { useFormStatus } from "react-dom";
import { useState, useEffect, memo } from "react";
import Image from "next/image";
import Link from "next/link";

import { Check, Loader2 } from "lucide-react";

import { FormErrors } from "./form-errors";

import { cn } from "~/lib/utils";
import { unsplash } from "~/lib/unsplash";
import { defaultImages } from "~/constants/images";

interface Props {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormPicker = memo(_FormPicker);
function _FormPicker({ id, errors }: Props) {
  const { pending } = useFormStatus();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [images, setImages] =
    useState<Array<Record<string, any>>>(defaultImages);

  useEffect(() => {
    async function fetchImages() {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });

        if (!!result && !!result.response) {
          const newImages = result.response as Array<Record<string, any>>;
          setImages(newImages);
        } else {
          console.error("Failed to fetch images");
        }
        console.log(result);
      } catch (error) {
        console.log({ error });
        setImages(defaultImages);
      } finally {
        setIsLoading(false);
      }
    }
    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-2 grid grid-cols-3 gap-2">
        {images.map((image) => (
          <div
            key={image.id}
            onClick={() => {
              if (pending) return;
              setSelectedImageId(image.id);
            }}
            className={cn(
              "group relative aspect-video cursor-pointer bg-muted transition hover:opacity-75",
              pending && "cursor-auto opacity-50 hover:opacity-50",
            )}
          >
            <input
              type="radio"
              id={id}
              name={id}
              checked={selectedImageId === image.id}
              disabled={pending}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
              className="hidden"
            />
            <Image
              fill
              src={image.urls.thumb}
              alt="Unsplash image"
              className="rounded-sm object-cover"
            />
            {selectedImageId === image.id && (
              <div className="absolute inset-y-0 flex h-full w-full items-center justify-center bg-black/30">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <Link
              target="_blank"
              href={image.links.html}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 w-full truncate bg-black/50 p-1 text-[10px] text-white opacity-0 hover:underline group-hover:opacity-100"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id="image" errors={errors} />
    </div>
  );
}
