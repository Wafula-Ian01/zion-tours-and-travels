import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { BlogArticle } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManageArticles() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BlogArticle>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await storage.getArticles();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
        toast({ title: 'Failed to load articles', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [toast]);

  const handleSave = async () => {
    if (!formData.title) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }

    try {
      if (editingId) {
        await storage.updateArticle(editingId, formData);
        toast({ title: 'Article updated' });
      } else {
        await storage.createArticle({
          ...formData,
          date: new Date().toISOString(),
        } as Omit<BlogArticle, 'id'>);
        toast({ title: 'Article added' });
      }

      // Refresh articles
      const data = await storage.getArticles();
      setArticles(data);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving article:', error);
      toast({ title: 'Failed to save article', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await storage.deleteArticle(id);
      toast({ title: 'Article deleted' });
      
      // Refresh articles
      const data = await storage.getArticles();
      setArticles(data);
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({ title: 'Failed to delete article', variant: 'destructive' });
    }
  };

  const handleEdit = (article: BlogArticle) => {
    setEditingId(article.id);
    setFormData(article);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-center text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Manage Blog Articles</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Article' : 'Add New Article'}</CardTitle>
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
              <Label>Author</Label>
              <Input
                value={formData.author || ''}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author name"
              />
            </div>
            <div>
              <Label>Excerpt</Label>
              <Textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                {editingId ? 'Update' : 'Add'} Article
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
          {articles.map((article) => (
            <Card key={article.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{article.excerpt}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(article.date).toLocaleDateString()} • {article.author}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(article)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(article.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
