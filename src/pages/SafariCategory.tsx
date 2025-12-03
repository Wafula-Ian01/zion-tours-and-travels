import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TravelPackage, Category } from '@/types';

export default function SafariCategory() {
  const { category } = useParams();
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgData, catData] = await Promise.all([
          storage.getPackages(category),
          storage.getCategories()
        ]);
        setPackages(pkgData);
        setCategories(catData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const currentCategory = categories.find((cat) => cat.slug === category);

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">
          {currentCategory?.name || 'Safari Packages'}
        </h1>
        <p className="text-muted-foreground mb-8">
          Explore our carefully curated {currentCategory?.name.toLowerCase()} experiences
        </p>

        {packages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No packages available in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-56 object-cover"
                />
                <CardHeader>
                  <CardTitle>{pkg.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{pkg.description}</p>
                  <div className="flex justify-between">
                    <span className="font-semibold text-primary">{pkg.price}</span>
                    <span className="text-muted-foreground">{pkg.duration}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/package/${pkg.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
