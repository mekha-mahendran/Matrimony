/**
 * Manamaalai Matrimony — Global typography scale
 *
 * Brings every screen down to the compact type sizes used by mainstream
 * matrimony apps (Shaadi / Jeevansathi / BharatMatrimony style):
 *   page titles ≈ 18–22, section headings ≈ 15–17, body ≈ 13–14,
 *   labels / captions ≈ 11–12.
 *
 * It wraps `StyleSheet.create` so that every `fontSize` (and its matching
 * `lineHeight`) declared in any screen/component stylesheet is scaled once,
 * in one place. This module MUST be imported before any screen module
 * (see index.js) so that all stylesheets are created through the wrapper.
 *
 * To make text bigger/smaller app-wide, tweak `scaleFontSize` below.
 */
import { StyleSheet } from 'react-native';

/** Smallest size we ever shrink text to (keeps captions readable). */
const MIN_READABLE = 11;

export const scaleFontSize = (size: number): number => {
  return size;
};

const scaleStyle = (style: any): any => {
  if (!style || typeof style !== 'object' || typeof style.fontSize !== 'number') {
    return style;
  }
  const next = scaleFontSize(style.fontSize);
  if (next === style.fontSize) {
    return style;
  }
  const result = { ...style, fontSize: next };
  if (typeof style.lineHeight === 'number') {
    // Keep the original line-height ratio.
    result.lineHeight = Math.round((style.lineHeight * next) / style.fontSize);
  }
  return result;
};

let patched = false;

export const applyTypographyScale = (): void => {
  if (patched) {
    return;
  }
  patched = true;

  const originalCreate = StyleSheet.create.bind(StyleSheet);
  const scaledCreate = (styles: any) => {
    const out: any = {};
    Object.keys(styles).forEach(key => {
      out[key] = scaleStyle(styles[key]);
    });
    return originalCreate(out);
  };

  try {
    (StyleSheet as any).create = scaledCreate;
  } catch {
    Object.defineProperty(StyleSheet, 'create', {
      value: scaledCreate,
      configurable: true,
      writable: true,
    });
  }
};

applyTypographyScale();

