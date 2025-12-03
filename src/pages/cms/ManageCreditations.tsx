import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Creditation } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Trash2, Shield } from 'lucide-react';

export default function ManageCreditations() {
  const navigate = useNavigate();
  const [creditations, setCreditations] = useState<Creditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', icon: '' });

  useEffect(() => {
    const fetchCreditations = async () => {
      try {
        const data = await storage.getCreditations();
        setCreditations(data);
      } catch (error) {
        console.error('Error fetching creditations:', error);
        toast.error('Failed to load creditations');
      } finally {
        setLoading(false);
      }
    };

    fetchCreditations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await storage.updateCreditation(editingId, formData);
        toast.success('Creditation updated successfully');
      } else {
        await storage.createCreditation(formData as Omit<Creditation, 'id'>);
        toast.success('Creditation added successfully');
      }

      // Refresh creditations
      const data = await storage.getCreditations();
      setCreditations(data);
      setFormData({ name: '', icon: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving creditation:', error);
      toast.error('Failed to save creditation');
    }
  };

  const handleEdit = (cred: Creditation) => {
    setEditingId(cred.id);
    setFormData({ name: cred.name, icon: cred.icon });
  };

  const handleDelete = async (id: string) => {
    try {
      await storage.deleteCreditation(id);
      toast.success('Creditation deleted successfully');
      
      // Refresh creditations
      const data = await storage.getCreditations();
      setCreditations(data);
    } catch (error) {
      console.error('Error deleting creditation:', error);
      toast.error('Failed to delete creditation');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading creditations...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/cms')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to CMS
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {editingId ? 'Edit Creditation' : 'Add New Creditation'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., ISO 9001 Certified"
                  required
                />
              </div>

              <div>
                <Label htmlFor="icon">Icon Name</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., Shield, Award, BadgeCheck"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use any Lucide icon name (e.g., Shield, Award, BadgeCheck, Star, Trophy)
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Plus className="mr-2 h-4 w-4" />
                  {editingId ? 'Update' : 'Add'} Creditation
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ name: '', icon: '' });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Creditations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {creditations.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No creditations yet. Add your first one!
                </p>
              ) : (
                creditations.map((cred) => (
                  <div
                    key={cred.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{cred.name}</p>
                        <p className="text-sm text-muted-foreground">Icon: {cred.icon}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(cred)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(cred.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
