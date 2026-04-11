"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type TransactionDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  description: string
  onConfirm: () => Promise<void>
}

export function TransactionDeleteDialog({
  open,
  onOpenChange,
  description,
  onConfirm,
}: TransactionDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false)

  const handleConfirm = async () => {
    setDeleting(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" showCloseButton>
        <DialogHeader>
          <DialogTitle>Delete transaction</DialogTitle>
          <DialogDescription>
            This cannot be undone. Remove{" "}
            <span className="font-medium text-foreground">&ldquo;{description}&rdquo;</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={deleting}
            onClick={handleConfirm}
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
