'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { CalculatorCard } from './CalculatorCard';
import { calculators } from '@/lib/calculators';
import { Search } from 'lucide-react';

export function CalculatorDirectory() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCalculators = useMemo(() => {
    if (!searchTerm) {
      return calculators;
    }
    return calculators.filter(
      (calc) =>
        calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        calc.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div>
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for a calculator (e.g., 'paint', 'hvac', 'cost')..."
          className="w-full pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search for a calculator"
        />
      </div>
      {filteredCalculators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} calculator={calc} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold">No calculators found</h3>
          <p className="text-muted-foreground">Try adjusting your search term.</p>
        </div>
      )}
    </div>
  );
}
