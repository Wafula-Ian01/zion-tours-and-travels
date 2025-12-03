import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import type { Category } from '@/types';
import logo from '@/assets/logo.jpg';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await storage.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Zion Train Tours & Travel Uganda" className="h-12 w-12 object-contain" />
            <div className="flex flex-col items-start">
              <span className="text-lg font-bold text-primary leading-tight">Zion Train</span>
              <span className="text-xs text-muted-foreground leading-tight">Tours & Travel Uganda</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About Us
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Safaris</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-48 p-2 bg-popover">
                      {categories.map((category) => (
                        <Link key={category.id} to={`/safaris/${category.slug}`}>
                          <NavigationMenuLink className="block px-4 py-2 hover:bg-accent rounded-md">
                            {category.name}
                          </NavigationMenuLink>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Blog</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-48 p-2 bg-popover">
                      <Link to="/blog/articles">
                        <NavigationMenuLink className="block px-4 py-2 hover:bg-accent rounded-md">
                          Articles
                        </NavigationMenuLink>
                      </Link>
                      <Link to="/blog/gallery">
                        <NavigationMenuLink className="block px-4 py-2 hover:bg-accent rounded-md">
                          Gallery
                        </NavigationMenuLink>
                      </Link>
                      <Link to="/blog/faq">
                        <NavigationMenuLink className="block px-4 py-2 hover:bg-accent rounded-md">
                          FAQ
                        </NavigationMenuLink>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>

            <Link to="/cms">
              <Button variant="outline" size="sm">CMS</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <Link to="/" className="block py-2 text-foreground hover:text-primary">
              Home
            </Link>
            <Link to="/about" className="block py-2 text-foreground hover:text-primary">
              About Us
            </Link>
            <div className="py-2">
              <p className="font-semibold mb-2">Safaris</p>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/safaris/${category.slug}`}
                  className="block py-1 pl-4 text-muted-foreground hover:text-primary"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="py-2">
              <p className="font-semibold mb-2">Blog</p>
              <Link to="/blog/articles" className="block py-1 pl-4 text-muted-foreground hover:text-primary">
                Articles
              </Link>
              <Link to="/blog/gallery" className="block py-1 pl-4 text-muted-foreground hover:text-primary">
                Gallery
              </Link>
              <Link to="/blog/faq" className="block py-1 pl-4 text-muted-foreground hover:text-primary">
                FAQ
              </Link>
            </div>
            <Link to="/contact" className="block py-2 text-foreground hover:text-primary">
              Contact
            </Link>
            <Link to="/cms" className="block py-2 text-foreground hover:text-primary">
              CMS
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
