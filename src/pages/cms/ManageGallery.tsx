import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { GalleryImage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManageGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<GalleryImage>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await storage.getGallery();
        setImages(data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        toast({ title: 'Failed to load gallery', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [toast]);

  const handleSave = async () => {
    if (!formData.url || !formData.title) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }

    try {
      if (editingId) {
        await storage.updateGalleryImage(editingId, formData);
        toast({ title: 'Image updated' });
      } else {
        await storage.createGalleryImage(formData as Omit<GalleryImage, 'id'>);
        toast({ title: 'Image added' });
      }

      // Refresh images
      const data = await storage.getGallery();
      setImages(data);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving image:', error);
      toast({ title: 'Failed to save image', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await storage.deleteGalleryImage(id);
      toast({ title: 'Image deleted' });
      
      // Refresh images
      const data = await storage.getGallery();
      setImages(data);
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({ title: 'Failed to delete image', variant: 'destructive' });
    }
  };

  const handleEdit = (img: GalleryImage) => {
    setEditingId(img.id);
    setFormData(img);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-center text-muted-foreground">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Manage Gallery</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Image' : 'Add New Image'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Image URL *</Label>
              <Input
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                {editingId ? 'Update' : 'Add'} Image
              </Button>
              {editingId && (
                <Button variant="outline" onClick={() => { setEditingId(null); setFormData({}); }}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          {images.map((img) => (
            <Card key={img.id} className="overflow-hidden">
              <img src={img.url} alt={img.title} className="w-full h-48 object-cover" />
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-1">{img.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{img.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(img)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(img.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
