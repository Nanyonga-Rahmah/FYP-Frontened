import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a date to a readable string
export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return "N/A";
  
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return String(date);
  }
};

// Format a date with time
export const formatDateTime = (date: string | Date | undefined): string => {
  if (!date) return "N/A";
  
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return String(date);
  }
};

// Truncate a string to a specified length
export const truncateString = (str: string, length: number = 20): string => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};

// Convert weight to readable format
export const formatWeight = (weight: number | undefined): string => {
  if (weight === undefined || weight === null) return "N/A";
  return `${weight} kg`;
};

// Get status class for styling
export const getStatusClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'bg-green-500 text-white';
    case 'pending':
      return 'bg-yellow-500 text-white';
    case 'flagged':
      return 'bg-yellow-500 text-white';
    case 'rejected':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

// Format status text (capitalize first letter)
export const formatStatus = (status: string): string => {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

// Get blockchain explorer URL
export const getBlockchainExplorerUrl = (txHash: string): string => {
  return `https://testnet.bscscan.com/tx/${txHash}`;
};


