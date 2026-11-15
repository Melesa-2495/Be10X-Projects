import { useState } from 'react';
import { Utensils } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function SafeImage({ src, alt, className = '' }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#eceef0] via-[#f2f4f6] to-[#d9e2ff]/40 text-[#434653] p-4 text-center ${className}`}
      >
        <Utensils className="w-7 h-7 text-[#0f52ba] mb-2 opacity-75" strokeWidth={1.75} />
        <span className="text-xs font-medium leading-snug max-w-[18ch]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
