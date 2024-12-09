declare module 'tiff' {
    export interface TIFFImage {
      width: number;
      height: number;
      toRGBAImage(): Uint8Array;
    }
  
    export function decode(buffer: ArrayBuffer): TIFFImage;
  }
  