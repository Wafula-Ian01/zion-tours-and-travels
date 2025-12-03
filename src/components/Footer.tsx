import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import * as LucideIcons from 'lucide-react';
import type { Partner, Creditation } from '@/types';

export const Footer = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [creditations, setCreditations] = useState<Creditation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partnersData, creditationsData] = await Promise.all([
          storage.getPartners(),
          storage.getCreditations()
        ]);
        setPartners(partnersData);
        setCreditations(creditationsData);
      } catch (error) {
        console.error('Error fetching footer data:', error);
        setPartners([]);
        setCreditations([]);
      }
    };

    fetchData();
  }, []);

  const certifications = partners.filter((p) => p.type === 'certification');
  const accommodations = partners.filter((p) => p.type === 'accommodation');

  return (
    <footer className="bg-muted mt-16 py-12 border-t border-border">
      <div className="container mx-auto px-4">
        {creditations.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Our Creditations</h3>
            <div className="flex flex-wrap gap-6">
              {creditations.map((cred) => {
                const IconComponent = (LucideIcons as any)[cred.icon];
                return (
                  <div key={cred.id} className="flex items-center gap-2">
                    {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
                    <span className="text-sm">{cred.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Accreditations & Certifications</h3>
            <div className="flex flex-wrap gap-6">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex items-center gap-2">
                  {cert.logo && (
                    <img src={cert.logo} alt={cert.name} className="h-12 object-contain" />
                  )}
                  <span className="text-sm">{cert.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {accommodations.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Accommodation Partners</h3>
            <div className="flex flex-wrap gap-6">
              {accommodations.map((partner) => (
                <div key={partner.id} className="flex items-center gap-2">
                  {partner.logo && (
                    <img src={partner.logo} alt={partner.name} className="h-12 object-contain" />
                  )}
                  <span className="text-sm">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center text-muted-foreground text-sm pt-8 border-t border-border">
          <p>&copy; {new Date().getFullYear()} Zion Train Tours & Travel Uganda. All rights reserved.</p>
          <p className="mt-1 text-xs italic">Mpaka Kwa Mpaka</p>
        </div>
      </div>
    </footer>
  );
};
