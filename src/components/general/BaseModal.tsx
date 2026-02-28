import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface BaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width: number;
  height: number;
  background?: string;
}

export function BaseModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  width,
  height,
  background,
}: BaseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          width: "500w",
          maxWidth: width + "px",
          height: height + "px",
          background: background,
          zIndex: 10000,
        }}
      >
        {(title || description) && (
          <DialogHeader>
            {title && (
              <DialogTitle className="text-foreground">{title}</DialogTitle>
            )}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="py-4 overflow-y-auto overflow-x-hidden">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
