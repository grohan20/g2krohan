"use client"

import { useState } from "react"
import { useFirebaseReviews } from "@/hooks/use-firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save, X, Loader2 } from "lucide-react"

export function AdminReviewManager() {
  const { reviews, loading, addReview, updateReview, deleteReview } = useFirebaseReviews()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    titleBn: "",
    mediaUrl: "",
    type: "image" as "image" | "video",
    reviewLink: "",
  })

  const handleAdd = async () => {
    if (!formData.title || !formData.titleBn) return

    try {
      await addReview({
        title: formData.title,
        titleBn: formData.titleBn,
        mediaUrl: formData.mediaUrl || "/placeholder.svg?height=200&width=300&text=Review+Image",
        type: formData.type,
        reviewLink: formData.reviewLink || "#",
        timestamp: Date.now(),
      })

      setFormData({ title: "", titleBn: "", mediaUrl: "", type: "image", reviewLink: "" })
      setShowAddForm(false)
    } catch (error) {
      console.error("Error adding review:", error)
    }
  }

  const handleEdit = (review: any) => {
    setFormData({
      title: review.title,
      titleBn: review.titleBn,
      mediaUrl: review.mediaUrl,
      type: review.type,
      reviewLink: review.reviewLink || "",
    })
    setEditingId(review.id)
  }

  const handleSave = async () => {
    if (!editingId) return

    try {
      await updateReview(editingId, {
        title: formData.title,
        titleBn: formData.titleBn,
        mediaUrl: formData.mediaUrl,
        type: formData.type,
        reviewLink: formData.reviewLink,
      })

      setEditingId(null)
      setFormData({ title: "", titleBn: "", mediaUrl: "", type: "image", reviewLink: "" })
    } catch (error) {
      console.error("Error updating review:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(id)
      } catch (error) {
        console.error("Error deleting review:", error)
      }
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setShowAddForm(false)
    setFormData({ title: "", titleBn: "", mediaUrl: "", type: "image", reviewLink: "" })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#00e0a4]" />
        <span className="ml-2 text-white">Loading reviews...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add New Review Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Review Management</h3>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] hover:from-[#00e0a4]/80 hover:to-[#4f46e5]/80"
        >
          <Plus size={16} className="mr-2" />
          Add Review
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <Card className="bg-[#1a2340]/50 border-[#00e0a4]/20">
          <CardHeader>
            <CardTitle className="text-white">{editingId ? "Edit Review" : "Add New Review"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="title" className="text-[#a6b1d8]">
                  Title (English)
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white"
                  placeholder="Enter review title in English"
                />
              </div>
              <div>
                <Label htmlFor="titleBn" className="text-[#a6b1d8]">
                  Title (Bengali)
                </Label>
                <Input
                  id="titleBn"
                  value={formData.titleBn}
                  onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                  className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white"
                  placeholder="Enter review title in Bengali"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mediaUrl" className="text-[#a6b1d8]">
                Image/Video URL
              </Label>
              <Input
                id="mediaUrl"
                value={formData.mediaUrl}
                onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white"
                placeholder="Enter image or video URL (optional)"
              />
            </div>

            <div>
              <Label htmlFor="reviewLink" className="text-[#a6b1d8]">
                See Review Button Link
              </Label>
              <Input
                id="reviewLink"
                value={formData.reviewLink}
                onChange={(e) => setFormData({ ...formData, reviewLink: e.target.value })}
                className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white"
                placeholder="Enter the link for See Review button"
              />
            </div>

            <div>
              <Label htmlFor="type" className="text-[#a6b1d8]">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: "image" | "video") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2340] border-[#00e0a4]/30">
                  <SelectItem value="image" className="text-white">
                    Image
                  </SelectItem>
                  <SelectItem value="video" className="text-white">
                    Video
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={editingId ? handleSave : handleAdd}
                className="bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] hover:from-[#00e0a4]/80 hover:to-[#4f46e5]/80"
              >
                <Save size={16} className="mr-2" />
                {editingId ? "Save Changes" : "Add Review"}
              </Button>
              <Button variant="ghost" onClick={handleCancel} className="text-white hover:bg-white/10">
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card className="bg-[#1a2340]/50 border-[#00e0a4]/20">
            <CardContent className="text-center py-8">
              <p className="text-[#a6b1d8]">No Reviews Available</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="bg-[#1a2340]/50 border-[#00e0a4]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">{review.title}</h4>
                    <p className="text-[#a6b1d8] mb-2">{review.titleBn}</p>
                    <div className="flex items-center gap-4 text-sm text-[#a6b1d8]">
                      <span className="capitalize">{review.type}</span>
                      <span>Added: {new Date(review.timestamp).toLocaleDateString()}</span>
                      {review.reviewLink && <span className="text-[#00e0a4]">Link: {review.reviewLink}</span>}
                    </div>
                    {review.mediaUrl &&
                      review.mediaUrl !== "/placeholder.svg?height=200&width=300&text=Review+Image" && (
                        <div className="mt-2">
                          {review.type === "image" ? (
                            <img
                              src={review.mediaUrl || "/placeholder.svg"}
                              alt={review.title}
                              className="w-20 h-20 object-cover rounded border border-[#00e0a4]/30"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-[#1a2340] rounded border border-[#00e0a4]/30 flex items-center justify-center">
                              <span className="text-xs text-[#a6b1d8]">Video</span>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(review)}
                      className="text-[#00e0a4] hover:bg-[#00e0a4]/20"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(review.id)}
                      className="text-[#ff4d6d] hover:bg-[#ff4d6d]/20"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
