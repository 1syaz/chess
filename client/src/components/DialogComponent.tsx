import type { SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface DialogComponentProps {
  children: React.ReactNode;
  isDialogOpen: boolean;
  dialogTitle: string;
  toggleDialog: React.Dispatch<SetStateAction<boolean>>;
}

function DialogComponent({
  children,
  toggleDialog,
  dialogTitle,
  isDialogOpen,
}: DialogComponentProps) {
  return (
    <div
      onClick={() => toggleDialog(false)}
      className="h-screen w-full absolute bg-black opacity-50 text-white z-30"
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-white font-bold">
                {dialogTitle}
              </DialogTitle>
              <DialogDescription className="sr-only"> </DialogDescription>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default DialogComponent;
