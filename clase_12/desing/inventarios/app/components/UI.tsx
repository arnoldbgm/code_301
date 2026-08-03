"use client";

import { ReactNode } from "react";

interface IconBtnProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger";
  title?: string;
  className?: string;
}

export function IconButton({ children, onClick, variant = "default", title, className = "" }: IconBtnProps) {
  const variants = {
    default: "text-on-surface-variant hover:text-primary hover:bg-surface-container-highest",
    danger: "text-on-surface-variant hover:text-error hover:bg-error-container",
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1 rounded transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

interface StockBadgeProps {
  stock: number;
}

export function StockBadge({ stock }: StockBadgeProps) {
  let bgColor = "bg-green-100 text-green-700";
  let dotColor = "bg-green-600";

  if (stock < 10) {
    bgColor = "bg-error-container text-on-error-container";
    dotColor = "bg-error";
  } else if (stock <= 50) {
    bgColor = "bg-[#fff8e1] text-[#f57f17]";
    dotColor = "bg-[#fbc02d]";
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium gap-1 ${bgColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {stock}
    </span>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-xl">
      <span className="material-symbols-outlined animate-spin text-[32px] text-on-surface-variant">
        progress_activity
      </span>
    </div>
  );
}

export function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-xl text-center">
      <span className="material-symbols-outlined text-[48px] text-outline-variant mb-md">
        {icon}
      </span>
      <p className="text-sm text-on-surface-variant">{message}</p>
    </div>
  );
}
