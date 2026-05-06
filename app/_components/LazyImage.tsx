"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type LazyImageProps = ImageProps & {
  skeletonClassName?: string;
};

export default function LazyImage({
  alt,
  className,
  skeletonClassName,
  onLoad,
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Image
        alt={alt}
        {...props}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        className={[
          className ?? "",
          "transition-opacity duration-500 ease-out",
          loaded ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
      {loaded ? null : (
        <div
          aria-hidden="true"
          className={[
            "absolute inset-0 animate-pulse bg-gradient-to-br from-black/[.04] via-black/[.10] to-black/[.04] dark:from-white/[.04] dark:via-white/[.10] dark:to-white/[.04]",
            skeletonClassName ?? "",
          ].join(" ")}
        />
      )}
    </>
  );
}
