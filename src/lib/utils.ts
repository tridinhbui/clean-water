import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Utility functions for water quality analysis
export const generateSampleId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status: 'safe' | 'caution' | 'unsafe'): string => {
  switch (status) {
    case 'safe':
      return 'text-green-600 bg-green-100';
    case 'caution':
      return 'text-yellow-600 bg-yellow-100';
    case 'unsafe':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}; 