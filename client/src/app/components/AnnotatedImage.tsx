import React from 'react';
import Image from 'next/image';
import { COCOAnnotation, COCOCategory } from '@/app/api/utils/coco';

interface AnnotatedImageProps {
  src: string;
  width: number;
  height: number;
  annotations: COCOAnnotation[];
  categories: Map<number, COCOCategory>;
}

const AnnotatedImage: React.FC<AnnotatedImageProps> = ({
  src,
  width,
  height,
  annotations,
  categories
}) => {
  return (
    <div className="relative">
      <Image
        src={src}
        alt="Annotated image"
        width={width}
        height={height}
        className="object-contain"
      />
      <svg
        className="absolute top-0 left-0"
        width={width}
        height={height}
        style={{ pointerEvents: 'none' }}
      >
        {annotations.map((annotation) => {
          const category = categories.get(annotation.category_id);
          const [x, y, w, h] = annotation.bbox;
          
          return (
            <g key={annotation.id}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill="none"
                stroke="red"
                strokeWidth="2"
              />
              <text
                x={x}
                y={y - 5}
                fill="red"
                fontSize="12"
                fontWeight="bold"
              >
                {category?.name || 'Unknown'}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default AnnotatedImage; 