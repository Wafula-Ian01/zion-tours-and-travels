import { storage } from '@/lib/storage';

export default async function About() {
  const aboutContent = await storage.getAbout();

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        <div className="prose prose-lg max-w-none">
          <div className="bg-card p-8 rounded-lg border border-border">
            <p className="whitespace-pre-wrap text-foreground">{aboutContent}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
