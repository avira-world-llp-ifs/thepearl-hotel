"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

interface DeleteCategoryButtonProps {
  id: string
  name: string
}

export default function DeleteCategoryButton({ id, name }: DeleteCategoryButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Don't render the button if id is empty
  if (!id) return null

  const handleDelete = async () => {
    if (!id) {
      setError("Invalid category ID")
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to delete category")
      }

      toast({
        title: "Category deleted",
        description: `${name} has been successfully deleted.`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error deleting category:", error)
      setError(error.message || "An error occurred while deleting the category")
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setIsOpen(true)}>
        <Trash className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category &quot;{name}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && <div className="bg-destructive/15 text-destructive p-2 rounded-md text-sm">{error}</div>}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

