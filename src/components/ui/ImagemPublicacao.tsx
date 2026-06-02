'use client';

import Image from 'next/image';
import { Flower2 } from 'lucide-react';

type ImagemPublicacaoProps = {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function ImagemPublicacao({
  src,
  alt,
  className = 'object-cover',
  sizes = '100vw',
  priority,
}: ImagemPublicacaoProps) {
  if (!src) {
    return (
      <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary-container/30 via-surface-container-low to-secondary-container/40">
        <Flower2 className="size-12 text-primary/40" aria-hidden="true" />
        <span className="sr-only">{alt}</span>
      </div>
    );
  }

  return <Image src={src} alt={alt} fill sizes={sizes} className={className} priority={priority} />;
}
