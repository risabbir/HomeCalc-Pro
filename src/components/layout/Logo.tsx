import { Calculator } from 'lucide-react';

export function Logo() {
  return (
    <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
      <Calculator className="h-6 w-6" strokeWidth={2.5} />
    </div>
  );
}
