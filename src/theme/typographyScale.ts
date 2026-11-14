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
  if (!style || typeof style !== 'object') {
    return style;
  }

  let nextStyle = style;
  let modified = false;

  // Protect against Android Fabric crash:
  // "FontSize should be a positive value. Current value: 0"
  // On Android, TextAttributeProps strictly throws IllegalArgumentException if
  // letterSpacing is defined but fontSize <= 0 (or undefined / NaN).
  if (style.letterSpacing != null && (typeof style.fontSize !== 'number' || style.fontSize <= 0 || isNaN(style.fontSize))) {
    nextStyle = { ...nextStyle, fontSize: 14 };
    modified = true;
  } else if (typeof style.fontSize === 'number' && (style.fontSize <= 0 || isNaN(style.fontSize))) {
    nextStyle = { ...nextStyle, fontSize: 14 };
    modified = true;
  }

  if (typeof nextStyle.fontSize === 'number') {
    const next = scaleFontSize(nextStyle.fontSize);
    if (next !== nextStyle.fontSize) {
      nextStyle = { ...nextStyle, fontSize: Math.max(next, 1) };
      if (typeof style.lineHeight === 'number' && style.fontSize > 0) {
        nextStyle.lineHeight = Math.round((style.lineHeight * next) / style.fontSize);
      }
      modified = true;
    }
  }

  return modified ? nextStyle : style;
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

