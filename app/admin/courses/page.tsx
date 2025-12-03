"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { BookOpen, Plus, Edit, Trash2, Clock, Eye, Search, Filter, CheckCircle, XCircle, Euro, Image as ImageIcon, Package } from "lucide-react"

interface CoursePackage {
  id: number
  hours: number
  price: number
  description: string | null
  isActive: boolean
  categoryId: number
  createdAt: string
  updatedAt: string
}

interface CourseCategory {
  id: number
  name: string
  description: string | null
  imageUrl: string | null
  packages: CoursePackage[]
  createdAt: string
  updatedAt: string
  _count?: {
    packages: number
  }
}

interface GalleryImage {
  id: number
  title: string
  imageUrl: string
}

interface PackageFormData {
  hours: string
  price: string
  description: string
  is_active: boolean
}

export default function AdminCoursesPage() {
  const [categories, setCategories] = useState<CourseCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [editingCategory, setEditingCategory] = useState<CourseCategory | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<{ package: CoursePackage; categoryId: number } | null>(null)
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
  })
  const [packages, setPackages] = useState<PackageFormData[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const [packageFormData, setPackageFormData] = useState<PackageFormData>({
    hours: "",
    price: "",
    description: "",
    is_active: true,
  })

  useEffect(() => {
    fetchCategories()
    fetchGalleryImages()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch("/api/admin/gallery")
      if (response.ok) {
        const data = await response.json()
        setGalleryImages(data.gallery || [])
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les images de la galerie",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie est requis",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const categoryData = {
        ...formData,
        packages: packages.filter(pkg => pkg.hours && pkg.price),
      }

      // Create or update category
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : "/api/admin/categories"
      const method = editingCategory ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: `Catégorie ${editingCategory ? "modifiée" : "créée"} avec succès`,
        })
        fetchCategories()
        resetForm()
        setIsDialogOpen(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save category")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : `Impossible de ${editingCategory ? "modifier" : "créer"} la catégorie`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (category: CourseCategory) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      image_url: category.imageUrl || "",
    })
    setPackages(category.packages.map(pkg => ({
      hours: pkg.hours.toString(),
      price: pkg.price.toString(),
      description: pkg.description || "",
      is_active: pkg.isActive,
    })))
    setImagePreview(category.imageUrl)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ? Tous les packages associés seront également supprimés.")) return

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCategories((prev) => prev.filter((category) => category.id !== id))
        toast({
          title: "Succès",
          description: "Catégorie supprimée avec succès",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive",
      })
    }
  }

  const handleAddPackage = () => {
    setEditingPackage(null)
    setPackageFormData({
      hours: "",
      price: "",
      description: "",
      is_active: true,
    })
    setIsPackageDialogOpen(true)
  }

  const handleEditPackage = (pkg: CoursePackage, categoryId: number) => {
    setEditingPackage({ package: pkg, categoryId })
    setPackageFormData({
      hours: pkg.hours.toString(),
      price: pkg.price.toString(),
      description: pkg.description || "",
      is_active: pkg.isActive,
    })
    setIsPackageDialogOpen(true)
  }

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!packageFormData.hours || !packageFormData.price) {
      toast({
        title: "Erreur",
        description: "Les heures et le prix sont requis",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const categoryId = editingCategory?.id || editingPackage?.categoryId
      if (!categoryId) {
        throw new Error("Category ID is required")
      }

      if (editingPackage) {
        // Update existing package
        const response = await fetch(`/api/admin/packages/${editingPackage.package.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(packageFormData),
        })

        if (response.ok) {
          toast({
            title: "Succès",
            description: "Package modifié avec succès",
          })
          fetchCategories()
          setIsPackageDialogOpen(false)
          setEditingPackage(null)
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update package")
        }
      } else {
        // Add new package to existing category
        const response = await fetch("/api/admin/packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category_id: categoryId,
            ...packageFormData,
          }),
        })

        if (response.ok) {
          toast({
            title: "Succès",
            description: "Package ajouté avec succès",
          })
          fetchCategories()
          setIsPackageDialogOpen(false)
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create package")
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de sauvegarder le package",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePackage = async (packageId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce package ?")) return

    try {
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Package supprimé avec succès",
        })
        fetchCategories()
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le package",
        variant: "destructive",
      })
    }
  }

  const addPackageToForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (packageFormData.hours && packageFormData.price) {
      setPackages([...packages, packageFormData])
      setPackageFormData({
        hours: "",
        price: "",
        description: "",
        is_active: true,
      })
      setIsPackageDialogOpen(false)
    } else {
      toast({
        title: "Erreur",
        description: "Les heures et le prix sont requis",
        variant: "destructive",
      })
    }
  }

  const removePackageFromForm = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image_url: "",
    })
    setPackages([])
    setEditingCategory(null)
    setImagePreview(null)
  }

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch
  })

  const stats = {
    total: categories.length,
    totalPackages: categories.reduce((sum, c) => sum + (c._count?.packages || c.packages.length), 0),
    activePackages: categories.reduce((sum, c) => sum + c.packages.filter(p => p.isActive).length, 0),
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gestion des Catégories de Cours</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Créez et gérez les catégories de cours et leurs packages de prix</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} size="sm" className="sm:size-default">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Ajouter une catégorie</span>
                <span className="sm:hidden">Ajouter</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Modifier la catégorie" : "Ajouter une nouvelle catégorie"}</DialogTitle>
                <DialogDescription>
                  {editingCategory ? "Modifier les informations de la catégorie" : "Créer une nouvelle catégorie de cours avec ses packages de prix"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nom de la catégorie</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ex: Kitesurfing Group"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {editingCategory ? "Choisir une nouvelle image" : "Image de la galerie"}
                    </label>
                    <Select
                      value={formData.image_url}
                      onValueChange={(value) => {
                        setFormData({ ...formData, image_url: value })
                        setImagePreview(value)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une image de la galerie" />
                      </SelectTrigger>
                      <SelectContent>
                        {galleryImages.length === 0 ? (
                          <SelectItem value="" disabled>
                            Aucune image disponible
                          </SelectItem>
                        ) : (
                          galleryImages.map((image) => (
                            <SelectItem key={image.id} value={image.imageUrl}>
                              {image.title}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description de la catégorie..."
                    rows={3}
                  />
                </div>
                <div className="relative rounded-xl border border-dashed border-border/60 bg-muted/30 p-2">
                  <AspectRatio ratio={4 / 3}>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center text-xs text-muted-foreground text-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/60 mb-2" />
                        <p>Aucune image sélectionnée</p>
                      </div>
                    )}
                  </AspectRatio>
                </div>

                {/* Packages Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Packages de prix</label>
                    {!editingCategory && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPackageFormData({
                            hours: "",
                            price: "",
                            description: "",
                            is_active: true,
                          })
                          setIsPackageDialogOpen(true)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter un package
                      </Button>
                    )}
                  </div>
                  
                  {packages.length > 0 && (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Heures</TableHead>
                            <TableHead>Prix (€)</TableHead>
                            <TableHead>Description</TableHead>
                            {!editingCategory && <TableHead>Actions</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {packages.map((pkg, index) => (
                            <TableRow key={index}>
                              <TableCell>{pkg.hours}h</TableCell>
                              <TableCell>€{pkg.price}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{pkg.description || "-"}</TableCell>
                              {!editingCategory && (
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removePackageFromForm(index)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {editingCategory && editingCategory.packages.length > 0 && (
                    <div className="border rounded-lg mt-4">
                      <div className="p-2 bg-muted/50 font-medium text-sm">Packages existants</div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Heures</TableHead>
                            <TableHead>Prix (€)</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {editingCategory.packages.map((pkg) => (
                            <TableRow key={pkg.id}>
                              <TableCell>{pkg.hours}h</TableCell>
                              <TableCell>€{pkg.price}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{pkg.description || "-"}</TableCell>
                              <TableCell>
                                <Badge variant={pkg.isActive ? "default" : "secondary"}>
                                  {pkg.isActive ? "Actif" : "Inactif"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditPackage(pkg, editingCategory.id)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeletePackage(pkg.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {editingCategory && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddPackage}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter un nouveau package
                    </Button>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Enregistrement..." : editingCategory ? "Modifier la catégorie" : "Créer la catégorie"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                    Annuler
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Catégories</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Catégories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPackages}</div>
            <p className="text-xs text-muted-foreground">Packages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Packages Actifs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePackages}</div>
            <p className="text-xs text-muted-foreground">Disponibles</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" key={refreshKey}>
        {loading
          ? [...Array(6)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))
          : filteredCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {category.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {category._count?.packages || category.packages.length} package(s)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {category.imageUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {category.description || "Aucune description"}
                  </p>
                  
                  {/* Packages Preview */}
                  {category.packages.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">Packages:</div>
                      <div className="space-y-1">
                        {category.packages.slice(0, 3).map((pkg) => (
                          <div key={pkg.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{pkg.hours}h</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Euro className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">{pkg.price}</span>
                            </div>
                          </div>
                        ))}
                        {category.packages.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{category.packages.length - 3} autre(s)
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setSelectedCategory(category)
                        setIsDetailsOpen(true)
                      }}
                      className="flex-1 sm:flex-none"
                    >
                      <Eye className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Voir</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEdit(category)}
                      className="flex-1 sm:flex-none"
                    >
                      <Edit className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Modifier</span>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDelete(category.id)}
                      className="flex-1 sm:flex-none"
                    >
                      <Trash2 className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Supprimer</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Détails de la catégorie */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle>Détails de la catégorie</DialogTitle>
            <DialogDescription>
              Informations complètes sur cette catégorie et ses packages
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Informations générales</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Nom:</strong> {selectedCategory.name}</div>
                    <div><strong>Description:</strong> {selectedCategory.description || "Aucune description"}</div>
                    <div><strong>Packages:</strong> {selectedCategory._count?.packages || selectedCategory.packages.length}</div>
                    <div><strong>Créé le:</strong> {new Date(selectedCategory.createdAt).toLocaleDateString('fr-FR')}</div>
                    <div><strong>Modifié le:</strong> {new Date(selectedCategory.updatedAt).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
                {selectedCategory.imageUrl && (
                  <div>
                    <h4 className="font-medium mb-2">Image</h4>
                    <img 
                      src={selectedCategory.imageUrl} 
                      alt={selectedCategory.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium mb-2">Packages de prix</h4>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Heures</TableHead>
                        <TableHead>Prix (€)</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCategory.packages.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            Aucun package disponible
                          </TableCell>
                        </TableRow>
                      ) : (
                        selectedCategory.packages.map((pkg) => (
                          <TableRow key={pkg.id}>
                            <TableCell>{pkg.hours}h</TableCell>
                            <TableCell>€{pkg.price}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{pkg.description || "-"}</TableCell>
                            <TableCell>
                              <Badge variant={pkg.isActive ? "default" : "secondary"}>
                                {pkg.isActive ? "Actif" : "Inactif"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Fermer
                </Button>
                <Button onClick={() => {
                  setIsDetailsOpen(false)
                  handleEdit(selectedCategory)
                }}>
                  Modifier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour ajouter/modifier un package */}
      <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? "Modifier le package" : editingCategory ? "Ajouter un package" : "Ajouter un package"}
            </DialogTitle>
            <DialogDescription>
              {editingPackage ? "Modifier les informations du package" : "Créer un nouveau package de prix"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            if (editingCategory || editingPackage) {
              handleSavePackage(e)
            } else {
              addPackageToForm(e)
            }
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Heures</label>
                <Input
                  type="number"
                  value={packageFormData.hours}
                  onChange={(e) => setPackageFormData({ ...packageFormData, hours: e.target.value })}
                  placeholder="2"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Prix (€)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={packageFormData.price}
                  onChange={(e) => setPackageFormData({ ...packageFormData, price: e.target.value })}
                  placeholder="70.00"
                  required
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description (optionnel)</label>
              <Input
                value={packageFormData.description}
                onChange={(e) => setPackageFormData({ ...packageFormData, description: e.target.value })}
                placeholder="ex: EXTRA HOUR"
              />
            </div>
            {editingCategory && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="package_is_active"
                  checked={packageFormData.is_active}
                  onCheckedChange={(checked) => setPackageFormData({ ...packageFormData, is_active: checked as boolean })}
                />
                <label htmlFor="package_is_active" className="text-sm font-medium">
                  Package actif
                </label>
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Enregistrement..." : editingPackage ? "Modifier" : "Ajouter"}
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                setIsPackageDialogOpen(false)
                setEditingPackage(null)
              }} disabled={isSaving}>
                Annuler
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
