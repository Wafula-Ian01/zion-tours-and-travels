import { storage } from '@/lib/storage';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import { useState, useEffect } from 'react';
import { TravelPackage, BlogArticle } from '@/types';
import hero1 from '@/assets/hero-1.jpg';
import hero2 from '@/assets/hero-2.jpg';
import hero3 from '@/assets/hero-3.jpg';
import hero4 from '@/assets/hero-4.jpg';

export default function Home() {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [articles, setArticles] = useState<BlogArticle[]>([]);

  const heroImages = [hero1, hero2, hero3, hero4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgData, articleData] = await Promise.all([
          storage.getPackages(),
          storage.getArticles()
        ]);
        setPackages(pkgData.slice(0, 4));
        setArticles(articleData.slice(0, 4));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Images with Transition */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: currentImageIndex === index ? 1 : 0,
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        {/* Dark Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Explore African Adventures
          </h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-md">
            Unforgettable safaris and tours across East Africa
          </p>
          <Button size="lg" asChild>
            <Link to="/safaris/wildlife">
              Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Latest Destinations */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Latest Tour Destinations</h2>
          <Button variant="outline" asChild>
            <Link to="/safaris/wildlife">View All</Link>
          </Button>
        </div>
        <Carousel
          opts={{ align: 'start', loop: true }}
          plugins={[Autoplay({ delay: 4000 })]}
          className="w-full"
        >
          <CarouselContent>
            {packages.map((pkg) => (
              <CarouselItem key={pkg.id} className="md:basis-1/2 lg:basis-1/4">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle className="text-xl">{pkg.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{pkg.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{pkg.price}</span>
                      <span className="text-muted-foreground">{pkg.duration}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/package/${pkg.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </section>

      {/* Latest Blog Articles */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest Articles</h2>
            <Button variant="outline" asChild>
              <Link to="/blog/articles">View All</Link>
            </Button>
          </div>
          <Carousel
            opts={{ align: 'start', loop: true }}
            plugins={[Autoplay({ delay: 5000 })]}
            className="w-full"
          >
            <CarouselContent>
              {articles.map((article) => (
                <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/4">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <CardHeader>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-2">{article.excerpt}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(article.date).toLocaleDateString()}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="ghost" className="w-full">
                        <Link to={`/article/${article.id}`}>Read More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      </section>
    </div>
  );
}
