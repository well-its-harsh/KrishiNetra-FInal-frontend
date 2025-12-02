import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Trash2, CheckCircle2 } from "lucide-react";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    lotId: string;
}

export const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, lotId }: DeleteModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                        <Trash2 className="h-8 w-8 text-red-600" />
                    </div>
                </div>
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">Delete Auction Lot?</DialogTitle>
                    <DialogDescription className="text-center">
                        Are you sure you want to delete Lot #{lotId}? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center mt-4 gap-3">
                    <Button variant="outline" onClick={onClose} className="rounded-full border-[#E6DFD4]">Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm} className="rounded-full bg-red-600 hover:bg-red-700">Delete Lot</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    lot: any; // Replace with proper type if available
}

export const EditLotModal = ({ isOpen, onClose, lot }: EditModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Auction Lot</DialogTitle>
                    <DialogDescription>Update details for Lot #{lot?.id}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-title">Lot Title</Label>
                        <Input id="edit-title" defaultValue={lot?.name} className="bg-[#FFF8EC] border-[#E6DFD4]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-qty">Quantity (kg)</Label>
                            <Input id="edit-qty" type="number" defaultValue={lot?.quantity} className="bg-[#FFF8EC] border-[#E6DFD4]" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-price">Base Price (₹)</Label>
                            <Input id="edit-price" type="number" defaultValue={lot?.currentBid} className="bg-[#FFF8EC] border-[#E6DFD4]" />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} className="rounded-full border-[#E6DFD4]">Cancel</Button>
                    <Button onClick={onClose} className="rounded-full bg-[#2E7D32] hover:bg-[#256428] text-white">Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

export const ErrorModal = ({ isOpen, onClose, message }: ErrorModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                </div>
                <DialogHeader>
                    <DialogTitle className="text-center text-xl">Something went wrong</DialogTitle>
                    <DialogDescription className="text-center">
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center mt-4">
                    <Button onClick={onClose} className="rounded-full bg-[#1F2D3D] text-white">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
