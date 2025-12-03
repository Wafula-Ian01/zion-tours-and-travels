import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, Image, HelpCircle, Users, Settings, LogOut, Shield } from 'lucide-react';
import { logout } from '@/lib/auth';
import { toast } from 'sonner';

export default function CMS() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const sections = [
    {
      title: 'Travel Packages',
      description: 'Manage safari packages and tours',
      icon: Package,
      link: '/cms/packages',
    },
    {
      title: 'Categories',
      description: 'Add and organize safari categories',
      icon: Settings,
      link: '/cms/categories',
    },
    {
      title: 'Blog Articles',
      description: 'Create and edit blog posts',
      icon: FileText,
      link: '/cms/articles',
    },
    {
      title: 'Gallery',
      description: 'Upload and manage photos',
      icon: Image,
      link: '/cms/gallery',
    },
    {
      title: 'FAQs',
      description: 'Manage frequently asked questions',
      icon: HelpCircle,
      link: '/cms/faqs',
    },
    {
      title: 'Partners',
      description: 'Manage partners and certifications',
      icon: Users,
      link: '/cms/partners',
    },
    {
      title: 'Creditations',
      description: 'Manage creditations with icons',
      icon: Shield,
      link: '/cms/creditations',
    },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">Content Management System</h1>
            <p className="text-muted-foreground">Manage your website content</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Card key={section.link} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <section.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to={section.link}>Manage</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>About Content</CardTitle>
            <CardDescription>Edit your About Us page</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/cms/about">Edit About Page</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
