// src/components/common/LazyImage.tsx
import { useState, useEffect, ImgHTMLAttributes } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export const LazyImage = ({ src, alt, className = '', ...props }: LazyImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      // Fallback to a placeholder if image fails to load
      setImageSrc('/images/placeholder-product.jpg');
      setIsLoading(false);
    };
  }, [src]);

  if (isLoading) {
    return <Skeleton className={className} />;
  }

  return <img src={imageSrc} alt={alt} className={className} loading="lazy" {...props} />;
};