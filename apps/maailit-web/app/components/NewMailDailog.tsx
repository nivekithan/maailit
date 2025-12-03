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
      <DialogContent className="sm:max-w-3xl px-4 py-4 bg-neutral-900 border-none mong rounded-md h-[40vh]">
        <EmailForm isusedInDialog={true} className="" />
      </DialogContent>
    </Dialog>
  );
}
