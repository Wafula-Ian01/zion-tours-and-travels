import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BlogArticle } from '@/types';

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      try {
        const data = await storage.getArticle(id);
        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Button asChild>
            <Link to="/blog/articles">Back to Articles</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/blog/articles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Link>
        </Button>

        <img
          src={article.image}
          alt={article.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />

        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        
        <div className="flex gap-4 text-muted-foreground mb-8">
          <span>{new Date(article.date).toLocaleDateString()}</span>
          <span>•</span>
          <span>By {article.author}</span>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="whitespace-pre-wrap">{article.content}</p>
        </div>
      </div>
    </div>
  );
}
