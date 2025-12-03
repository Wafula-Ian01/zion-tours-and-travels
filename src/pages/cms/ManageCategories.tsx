import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await storage.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({ title: 'Failed to load categories', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const handleSave = async () => {
    if (!formData.name) {
      toast({ title: 'Please enter category name', variant: 'destructive' });
      return;
    }

    try {
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-');
      
      if (editingId) {
        await storage.updateCategory(editingId, { ...formData, slug });
        toast({ title: 'Category updated' });
      } else {
        await storage.createCategory({ name: formData.name!, slug });
        toast({ title: 'Category added' });
      }

      // Refresh categories
      const data = await storage.getCategories();
      setCategories(data);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving category:', error);
      toast({ title: 'Failed to save category', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await storage.deleteCategory(id);
      toast({ title: 'Category deleted' });
      
      // Refresh categories
      const data = await storage.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({ title: 'Failed to delete category', variant: 'destructive' });
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormData(cat);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-center text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Manage Categories</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Category' : 'Add New Category'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Category Name</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Wildlife Safaris"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                {editingId ? 'Update' : 'Add'} Category
              </Button>
              {editingId && (
                <Button variant="outline" onClick={() => { setEditingId(null); setFormData({}); }}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="pt-6 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">Slug: {cat.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(cat)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.id)}>
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
