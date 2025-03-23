import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { PlusCircle, Pencil, ImageIcon } from "lucide-react"
import { categoryService } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import DeleteCategoryButton from "@/components/admin/delete-category-button"

export const dynamic = "force-dynamic" // Disable caching for this page

export default async function ManageCategoriesPage() {
  let categories = []
  let error = null

  try {
    // Force dynamic rendering to ensure fresh data
    categories = (await categoryService.getAll()) || []
    console.log("Categories fetched:", categories.length)
  } catch (err) {
    console.error("Error fetching categories:", err)
    error = "Failed to load categories. Please try again later."
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Room Categories</h1>
        <Button asChild>
          <Link href="/admin/categories/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Category
          </Link>
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-background rounded-lg border shadow-sm">
        {!categories || categories.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              {error
                ? "Error loading categories."
                : "No categories found. Add your first room category to get started."}
            </p>
            <Button asChild>
              <Link href="/admin/categories/new">Add Category</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Base Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id?.toString() || Math.random().toString()} className="border-b">
                    <td className="px-4 py-3 text-sm">
                      {category.image ? (
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image
                            src={category.image || "/placeholder.svg"}
                            alt={category.name || "Category image"}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">{category.name || "Unnamed Category"}</td>
                    <td className="px-4 py-3 text-sm">
                      {category.description
                        ? category.description.length > 100
                          ? `${category.description.substring(0, 100)}...`
                          : category.description
                        : "No description"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {typeof category.basePrice === "number" ? formatPrice(category.basePrice) : "Price not set"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/categories/${category._id?.toString() || ""}/edit`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <DeleteCategoryButton
                          id={category._id?.toString() || ""}
                          name={category.name || "this category"}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

