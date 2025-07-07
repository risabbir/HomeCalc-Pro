'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { CalculatorCard } from './CalculatorCard';
import { calculators } from '@/lib/calculators';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = ['All', ...Array.from(new Set(calculators.map(c => c.category)))];

export function CalculatorDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredCalculators = useMemo(() => {
    const byCategory =
      activeCategory === 'All'
        ? calculators
        : calculators.filter((calc) => calc.category === activeCategory);

    if (!searchTerm) {
      return byCategory;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    return byCategory.filter(
      (calc) =>
        calc.name.toLowerCase().includes(lowercasedTerm) ||
        calc.description.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm, activeCategory]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search calculators..."
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search for a calculator"
          />
        </div>
      </div>
      <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          {categories.map(category => (
              <Button 
                  key={category}
                  variant={activeCategory === category ? 'default' : 'outline'}
                  onClick={() => setActiveCategory(category)}
                  className="capitalize"
              >
                  {category}
              </Button>
          ))}
      </div>
      {filteredCalculators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalculators.map((calc) => (
            <CalculatorCard key={calc.slug} calculator={calc} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold font-headline">No calculators found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
}
