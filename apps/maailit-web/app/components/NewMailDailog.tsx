import { useHotkeys } from "react-hotkeys-hook";
import EmailForm from "./EmailForm";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "./ui/dialog";

export default function NewMailDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl bg-white rounded-lg">
        <EmailForm isusedInDialog={true} className="bg-white" />
      </DialogContent>
    </Dialog>
  );
}
