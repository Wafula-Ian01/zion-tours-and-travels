import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Partner } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManagePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Partner>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await storage.getPartners();
        setPartners(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
        toast({ title: 'Failed to load partners', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [toast]);

  const handleSave = async () => {
    if (!formData.name || !formData.type) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }

    try {
      if (editingId) {
        await storage.updatePartner(editingId, formData);
        toast({ title: 'Partner updated' });
      } else {
        await storage.createPartner(formData as Omit<Partner, 'id'>);
        toast({ title: 'Partner added' });
      }

      // Refresh partners
      const data = await storage.getPartners();
      setPartners(data);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving partner:', error);
      toast({ title: 'Failed to save partner', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await storage.deletePartner(id);
      toast({ title: 'Partner deleted' });
      
      // Refresh partners
      const data = await storage.getPartners();
      setPartners(data);
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast({ title: 'Failed to delete partner', variant: 'destructive' });
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingId(partner.id);
    setFormData(partner);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-center text-muted-foreground">Loading partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Manage Partners</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Partner' : 'Add New Partner'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Partner Name *</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Type *</Label>
              <Select
                value={formData.type || ''}
                onValueChange={(value: 'accommodation' | 'certification') => 
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accommodation">Accommodation Partner</SelectItem>
                  <SelectItem value="certification">Certification/Accreditation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Logo URL</Label>
              <Input
                value={formData.logo || ''}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                {editingId ? 'Update' : 'Add'} Partner
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
          {partners.map((partner) => (
            <Card key={partner.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {partner.logo && (
                      <img src={partner.logo} alt={partner.name} className="h-12 w-12 object-contain" />
                    )}
                    <div>
                      <h3 className="font-semibold">{partner.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{partner.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(partner)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(partner.id)}>
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
