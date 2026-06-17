import { Clock, ShieldCheck, Headphones, CreditCard } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: '60 Mins Delivery',
    description: 'Free shipping over 1500Tk',
  },
  {
    icon: ShieldCheck,
    title: 'Authorized Products',
    description: 'within 30 days for an exchange',
  },
  {
    icon: Headphones,
    title: 'Customer Service Support',
    description: '9am to 9pm',
  },
  {
    icon: CreditCard,
    title: 'Flexible Payments',
    description: 'Pay with multiple credit cards',
  },
];

export default function FeatureBoxes() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-8 mt-2 md:mt-8">
      <div className="max-w-[95rem] mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white/80 backdrop-blur-md p-2 md:p-6 rounded-lg shadow-sm transition-all border border-gray-100/50"
              >
                <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-primary flex items-center justify-center bg-red-50/50 backdrop-blur-sm">
                      <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">
                      {feature.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
