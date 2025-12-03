import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ManageAbout() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await storage.getAbout();
        setContent(data);
      } catch (error) {
        console.error('Error fetching about content:', error);
        toast({ title: 'Failed to load about content', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, [toast]);

  const handleSave = async () => {
    try {
      await storage.setAbout(content);
      toast({ title: 'About page updated successfully' });
    } catch (error) {
      console.error('Error saving about content:', error);
      toast({ title: 'Failed to save about content', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-center text-muted-foreground">Loading about content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Edit About Page</h1>

        <Card>
          <CardHeader>
            <CardTitle>About Us Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              placeholder="Enter your about us content here..."
            />
            <Button onClick={handleSave}>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
