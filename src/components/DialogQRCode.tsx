import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DialogQRCodeProps {
  qrCode: string;
}

const DialogQRCode = ({ qrCode }: DialogQRCodeProps) => (
  <Dialog defaultOpen>
    <DialogTrigger>Show QR</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Scan the QR Code</DialogTitle>
        <DialogDescription>
          Use your favorite authenticator app to scan the QR code.
        </DialogDescription>
      </DialogHeader>

      <img
        src={qrCode}
        alt="QR Code"
        className="w-full max-w-[280px] mx-auto"
      />
    </DialogContent>
  </Dialog>
);

export default DialogQRCode;
