import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { TravelPackage, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManagePackages() {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TravelPackage>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgData, catData] = await Promise.all([
          storage.getPackages(),
          storage.getCategories()
        ]);
        setPackages(pkgData);
        setCategories(catData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({ title: 'Failed to load data', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleSave = async () => {
    if (!formData.title || !formData.category) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }

    try {
      if (editingId) {
        await storage.updatePackage(editingId, formData);
        toast({ title: 'Package updated' });
      } else {
        await storage.createPackage(formData as Omit<TravelPackage, 'id'>);
        toast({ title: 'Package added' });
      }

      // Refresh packages
      const data = await storage.getPackages();
      setPackages(data);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving package:', error);
      toast({ title: 'Failed to save package', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await storage.deletePackage(id);
      toast({ title: 'Package deleted' });
      
      // Refresh packages
      const data = await storage.getPackages();
      setPackages(data);
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({ title: 'Failed to delete package', variant: 'destructive' });
    }
  };

  const handleEdit = (pkg: TravelPackage) => {
    setEditingId(pkg.id);
    setFormData(pkg);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-center text-muted-foreground">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Manage Travel Packages</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Package' : 'Add New Package'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Category *</Label>
              <Select
                value={formData.category || ''}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Price</Label>
                <Input
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="$1,200"
                />
              </div>
              <div>
                <Label>Duration</Label>
                <Input
                  value={formData.duration || ''}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="5 Days"
                />
              </div>
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Details</Label>
              <Textarea
                value={formData.details || ''}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                {editingId ? 'Update' : 'Add'} Package
              </Button>
              {editingId && (
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          {packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">{pkg.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(pkg)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(pkg.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
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
