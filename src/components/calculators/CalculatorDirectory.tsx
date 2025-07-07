'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { CalculatorCard } from './CalculatorCard';
import { calculators } from '@/lib/calculators';
import { Search } from 'lucide-react';
import { H2 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

const categories = ['All', 'HVAC', 'Home Improvement', 'Gardening', 'Other'];

export function CalculatorDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCalculators = useMemo(() => {
    return calculators.filter(calc => {
        const categoryMatch = selectedCategory === 'All' || calc.category === selectedCategory;
        const searchMatch = !searchTerm || (
            calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            calc.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return categoryMatch && searchMatch;
    });
  }, [searchTerm, selectedCategory]);

  const calculatorsByCategory = useMemo(() => {
    const activeCategories = selectedCategory === 'All' 
      ? ['HVAC', 'Home Improvement', 'Gardening', 'Other'] 
      : [selectedCategory];

    return activeCategories.map(category => ({
      name: category,
      calculators: filteredCalculators.filter(calc => calc.category === category),
    })).filter(group => group.calculators.length > 0);
  }, [filteredCalculators, selectedCategory]);

  return (
    <div id="calculators">
       <div className="flex flex-col md:flex-row items-center gap-4 mb-16 max-w-4xl mx-auto">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for a calculator..."
            className="w-full pl-10 h-11 text-base rounded-md shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search for a calculator"
          />
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'ghost'}
              onClick={() => setSelectedCategory(cat)}
              className="rounded-md px-3 h-11"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {filteredCalculators.length > 0 ? (
        <div className="space-y-16">
          {calculatorsByCategory.map(category => (
            <section key={category.name} id={category.name.toLowerCase().replace(/\s+/g, '-')}>
              <H2 className="font-headline border-b pb-2 mb-8">{category.name}</H2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.calculators.map((calc) => (
                  <CalculatorCard key={calc.slug} calculator={calc} />
                ))}
              </div>
            </section>
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
