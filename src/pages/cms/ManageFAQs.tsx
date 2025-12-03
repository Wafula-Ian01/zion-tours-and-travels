import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import type { FAQ } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManageFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FAQ>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const data = await storage.getFAQs();
        setFaqs(data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        toast({ title: 'Failed to load FAQs', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [toast]);

  const handleSave = async () => {
    if (!formData.question || !formData.answer) {
      toast({ title: 'Please fill both question and answer', variant: 'destructive' });
      return;
    }

    try {
      if (editingId) {
        await storage.updateFAQ(editingId, formData);
        toast({ title: 'FAQ updated' });
      } else {
        await storage.createFAQ(formData as Omit<FAQ, 'id'>);
        toast({ title: 'FAQ added' });
      }

      // Refresh FAQs
      const data = await storage.getFAQs();
      setFaqs(data);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast({ title: 'Failed to save FAQ', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await storage.deleteFAQ(id);
      toast({ title: 'FAQ deleted' });
      
      // Refresh FAQs
      const data = await storage.getFAQs();
      setFaqs(data);
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast({ title: 'Failed to delete FAQ', variant: 'destructive' });
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setFormData(faq);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-center text-muted-foreground">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Manage FAQs</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit FAQ' : 'Add New FAQ'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Question *</Label>
              <Input
                value={formData.question || ''}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              />
            </div>
            <div>
              <Label>Answer *</Label>
              <Textarea
                value={formData.answer || ''}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                {editingId ? 'Update' : 'Add'} FAQ
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
          {faqs.map((faq) => (
            <Card key={faq.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(faq)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(faq.id)}>
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
