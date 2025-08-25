"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Save, X, ExternalLink, Star } from "lucide-react"
import Image from "next/image"
import { useFirebaseBrokers, type Broker } from "@/hooks/use-firebase-brokers"

export function AdminBrokerManager() {
  const { brokers, loading, addBroker, updateBroker, deleteBroker } = useFirebaseBrokers()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    attributes: ["", "", ""],
    signupLink: "",
  })

  const handleAdd = async () => {
    if (!formData.name || !formData.description || !formData.signupLink) return

    await addBroker({
      name: formData.name,
      description: formData.description,
      image: formData.image,
      attributes: formData.attributes.filter((attr) => attr.trim() !== ""),
      signupLink: formData.signupLink,
    })

    setFormData({ name: "", description: "", image: "", attributes: ["", "", ""], signupLink: "" })
    setShowAddForm(false)
  }

  const handleEdit = (broker: Broker) => {
    setFormData({
      name: broker.name,
      description: broker.description,
      image: broker.image,
      attributes: [...broker.attributes, "", ""].slice(0, 3), // Ensure 3 attributes
      signupLink: broker.signupLink,
    })
    setEditingId(broker.id)
  }

  const handleSave = async () => {
    if (!editingId) return

    await updateBroker(editingId, {
      name: formData.name,
      description: formData.description,
      image: formData.image,
      attributes: formData.attributes.filter((attr) => attr.trim() !== ""),
      signupLink: formData.signupLink,
    })

    setEditingId(null)
    setFormData({ name: "", description: "", image: "", attributes: ["", "", ""], signupLink: "" })
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this broker?")) {
      await deleteBroker(id)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setShowAddForm(false)
    setFormData({ name: "", description: "", image: "", attributes: ["", "", ""], signupLink: "" })
  }

  const updateAttribute = (index: number, value: string) => {
    const newAttributes = [...formData.attributes]
    newAttributes[index] = value
    setFormData({ ...formData, attributes: newAttributes })
  }

  return (
    <div className="space-y-6">
      {/* Add New Broker Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Broker Management</h3>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] hover:from-[#00e0a4]/80 hover:to-[#4f46e5]/80"
        >
          <Plus size={16} className="mr-2" />
          Add Broker
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <Card className="bg-[#1a2340]/50 border-[#00e0a4]/20">
          <CardHeader>
            <CardTitle className="text-white">{editingId ? "Edit Broker" : "Add New Broker"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name" className="text-[#a6b1d8]">
                  Broker Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white"
                  placeholder="Enter broker name"
                />
              </div>
              <div>
                <Label htmlFor="image" className="text-[#a6b1d8]">
                  Image URL
                </Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white"
                  placeholder="Enter image URL"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-[#a6b1d8]">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white"
                placeholder="Enter broker description"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-[#a6b1d8]">Attributes (3 maximum)</Label>
              <div className="space-y-2">
                {formData.attributes.map((attr, index) => (
                  <Input
                    key={index}
                    value={attr}
                    onChange={(e) => updateAttribute(index, e.target.value)}
                    className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white"
                    placeholder={`Attribute ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="signupLink" className="text-[#a6b1d8]">
                Signup Link
              </Label>
              <Input
                id="signupLink"
                value={formData.signupLink}
                onChange={(e) => setFormData({ ...formData, signupLink: e.target.value })}
                className="bg-[#1a2340]/50 border-[#00e0a4]/30 text-white"
                placeholder="Enter signup link URL"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={editingId ? handleSave : handleAdd}
                className="bg-gradient-to-r from-[#00e0a4] to-[#4f46e5] hover:from-[#00e0a4]/80 hover:to-[#4f46e5]/80"
              >
                <Save size={16} className="mr-2" />
                {editingId ? "Save Changes" : "Add Broker"}
              </Button>
              <Button variant="ghost" onClick={handleCancel} className="text-white hover:bg-white/10">
                <X size={16} className="mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brokers List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-[#a6b1d8]">Loading brokers...</div>
          </div>
        ) : brokers.length === 0 ? (
          <Card className="bg-[#1a2340]/50 border-[#00e0a4]/20">
            <CardContent className="text-center py-8">
              <p className="text-[#a6b1d8]">No Broker Setted</p>
            </CardContent>
          </Card>
        ) : (
          brokers.map((broker) => (
            <Card key={broker.id} className="bg-[#1a2340]/50 border-[#00e0a4]/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#00e0a4]/30 flex-shrink-0">
                    <Image
                      src={broker.image || "/placeholder.svg"}
                      alt={broker.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">{broker.name}</h4>
                    <p className="text-[#a6b1d8] mb-3 text-sm">{broker.description}</p>
                    <div className="space-y-1 mb-3">
                      {broker.attributes.map((attr, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-[#a6b1d8]">
                          <Star size={12} className="text-[#00e0a4] fill-current" />
                          <span>{attr}</span>
                        </div>
                      ))}
                    </div>
                    <a
                      href={broker.signupLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#00e0a4] hover:text-[#00e0a4]/80 transition-colors"
                    >
                      <ExternalLink size={14} />
                      {broker.signupLink}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(broker)}
                      className="text-[#00e0a4] hover:bg-[#00e0a4]/20"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(broker.id)}
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
