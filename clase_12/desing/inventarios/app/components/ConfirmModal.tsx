"use client";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  warning?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  warning,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in">
      <div
        className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md p-lg relative z-10 animate-scale-in">
        <div className="flex items-center gap-md mb-md text-error">
          <span className="material-symbols-outlined text-[32px]">warning</span>
          <h3 className="text-lg font-semibold text-on-surface">{title}</h3>
        </div>
        <p className="text-base text-on-surface-variant mb-lg">{message}</p>
        {warning && (
          <div className="bg-error-container/50 rounded-lg p-md mb-lg">
            <p className="text-sm text-on-error-container flex items-start gap-xs">
              <span className="material-symbols-outlined text-[16px] mt-0.5">
                info
              </span>
              <span dangerouslySetInnerHTML={{ __html: warning }} />
            </p>
          </div>
        )}
        <div className="flex justify-end gap-md">
          <button
            onClick={onCancel}
            className="px-md py-sm rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-error text-on-error px-md py-sm rounded-lg text-sm font-medium hover:bg-error/90 transition-colors shadow-sm"
          >
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
