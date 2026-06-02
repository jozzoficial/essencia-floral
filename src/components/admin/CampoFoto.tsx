'use client';

import Image from 'next/image';
import { ImagePlus } from 'lucide-react';

type CampoFotoProps = {
  label: string;
  previewUrl?: string;
  onChange: (file: File | null) => void;
  obrigatorio?: boolean;
};

export function CampoFoto({ label, previewUrl, onChange, obrigatorio }: CampoFotoProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-on-surface">
      {label}
      <span className="flex flex-col gap-3 rounded-xl border border-dashed border-outline-variant bg-surface-container-low/50 p-4">
        {(previewUrl || obrigatorio) && (
          <div className="relative mx-auto aspect-[4/3] w-full max-w-xs overflow-hidden rounded-lg bg-surface-white">
            {previewUrl ? (
              <Image src={previewUrl} alt="Pré-visualização" fill sizes="320px" className="object-cover" />
            ) : (
              <span className="grid h-full place-items-center text-on-surface-variant">
                <ImagePlus className="size-10 opacity-50" />
              </span>
            )}
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required={obrigatorio && !previewUrl}
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          className="text-sm text-on-surface-variant file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-on-primary"
        />
        <span className="text-xs font-normal text-on-surface-variant">
          A foto é comprimida e guardada como URL no Supabase — o site carrega só o link, não o ficheiro original.
        </span>
      </span>
    </label>
  );
}
