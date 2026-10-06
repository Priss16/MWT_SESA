import React from 'react';
import { useSettings } from '../context/SettingsContext';

function toCamelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').substring(0, 30);
}

export default function T({ children }) {
  const { t } = useSettings();
  if (typeof children !== 'string') return <>{children}</>;
  
  const text = children.trim();
  if (!text || text.length <= 2) return <>{children}</>;
  
  const key = toCamelCase(text);
  const translated = t(key);
  
  return <>{translated || text}</>;
}
