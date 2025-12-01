// src/components/trace/TraceBadge.tsx
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { QrCode, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface TraceBadgeProps {
  traceId: string;
}

export const TraceBadge = ({ traceId }: TraceBadgeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  // Mock trace data - replace with actual API call
  const traceData = {
    batch: {
      id: traceId,
      variety: 'Foxtail Millet',
      harvest_date: '2023-10-15',
      quantity: '500 kg',
      location: 'Nashik, Maharashtra',
      coordinates: { lat: 19.9975, lng: 73.7898 },
    },
    events: [
      {
        id: '1',
        type: 'harvest',
        date: '2023-10-15',
        actor: 'Ramesh Patil',
        role: 'Farmer',
        description: 'Harvested from organic farm',
        photos: ['/images/farmer_profile_1.jpg'],
      },
      {
        id: '2',
        type: 'processing',
        date: '2023-10-18',
        actor: 'Sahyadri Farmers Group',
        role: 'FPO',
        description: 'Cleaned and processed',
        photos: ['/images/warehouse_packaging.jpg'],
      },
      {
        id: '3',
        type: 'quality_check',
        date: '2023-10-20',
        actor: 'Agri Labs Pvt. Ltd.',
        role: 'Lab',
        description: 'Quality check passed',
        photos: ['/images/lab_sample_1.jpg'],
        documents: ['/docs/quality_certificate.pdf'],
      },
    ],
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="bg-white/90 backdrop-blur-sm hover:bg-white border-[#FFFD8F] text-[#043915] hover:text-[#043915] flex items-center gap-1.5 shadow-sm"
        onClick={() => setIsOpen(true)}
      >
        <QrCode className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">
          {language === 'HI' ? 'ट्रेसेबिलिटी' : 'Trace'}
        </span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              {language === 'HI' ? 'उत्पाद ट्रेसेबिलिटी' : 'Product Traceability'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Batch Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">
                {language === 'HI' ? 'बैच विवरण' : 'Batch Details'}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">
                    {language === 'HI' ? 'किस्म' : 'Variety'}
                  </div>
                  <div>{traceData.batch.variety}</div>
                </div>
                <div>
                  <div className="text-gray-500">
                    {language === 'HI' ? 'फसल तिथि' : 'Harvest Date'}
                  </div>
                  <div>
                    {new Date(traceData.batch.harvest_date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">
                    {language === 'HI' ? 'मात्रा' : 'Quantity'}
                  </div>
                  <div>{traceData.batch.quantity}</div>
                </div>
                <div>
                  <div className="text-gray-500">
                    {language === 'HI' ? 'स्थान' : 'Location'}
                  </div>
                  <div>{traceData.batch.location}</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-medium mb-4">
                {language === 'HI' ? 'जीवनचक्र' : 'Product Journey'}
              </h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {/* Event items */}
                <div className="space-y-8">
                  {traceData.events.map((event, index) => (
                    <div key={event.id} className="relative pl-12">
                      {/* Dot */}
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-[#043915] border-4 border-white flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{event.actor}</h4>
                            <p className="text-sm text-gray-500">{event.role}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-2 text-sm">{event.description}</p>

                        {event.photos && event.photos.length > 0 && (
                          <div className="mt-3 flex gap-2">
                            {event.photos.map((photo, i) => (
                              <div
                                key={i}
                                className="w-16 h-16 rounded-md bg-gray-100 overflow-hidden"
                              >
                                <img
                                  src={photo}
                                  alt={`${event.type} ${i + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {event.documents && event.documents.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <h5 className="text-sm font-medium mb-2">
                              {language === 'HI' ? 'दस्तावेज़' : 'Documents'}
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {event.documents.map((doc, i) => (
                                <a
                                  key={i}
                                  href={doc}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-sm text-[#043915] hover:underline"
                                >
                                  <svg
                                    className="h-4 w-4 mr-1.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                  </svg>
                                  {language === 'HI'
                                    ? `दस्तावेज़ ${i + 1}`
                                    : `Document ${i + 1}`}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8">
              <h3 className="font-medium mb-3">
                {language === 'HI' ? 'उत्पत्ति स्थान' : 'Origin Location'}
              </h3>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">
                  {language === 'HI'
                    ? 'यहां मानचित्र दिखाई देगा'
                    : 'Map will be displayed here'}
                </p>
                {/* In a real app, you would integrate with a mapping library like Leaflet or Google Maps */}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  // In a real app, this would generate and download a PDF
                  alert(
                    language === 'HI'
                      ? 'पीडीएफ डाउनलोड शुरू हो रहा है...'
                      : 'Starting PDF download...'
                  );
                }}
              >
                {language === 'HI' ? 'पीडीएफ डाउनलोड करें' : 'Download PDF'}
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-[#043915] hover:bg-[#032a0f]"
                onClick={() => {
                  // In a real app, this would share the traceability link
                  if (navigator.share) {
                    navigator.share({
                      title: 'Product Traceability',
                      text: `Check out the journey of this product: ${traceData.batch.variety}`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert(
                      language === 'HI'
                        ? 'लिंक क्लिपबोर्ड पर कॉपी हो गया'
                        : 'Link copied to clipboard'
                    );
                  }
                }}
              >
                {language === 'HI' ? 'साझा करें' : 'Share'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};