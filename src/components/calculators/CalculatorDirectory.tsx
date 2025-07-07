'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { CalculatorCard } from './CalculatorCard';
import { calculators } from '@/lib/calculators';
import { Search } from 'lucide-react';
import { H2 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

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
      <div className="mb-16 max-w-2xl mx-auto text-center space-y-6">
        <div className="relative w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search calculators by name or keyword..."
            className="w-full pl-14 pr-4 h-14 text-lg rounded-full border-2 border-border focus:border-primary transition-all duration-300 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search for a calculator"
          />
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ease-in-out border-2",
                selectedCategory === cat 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-transparent text-foreground border-border hover:bg-secondary/50 hover:border-secondary"
              )}
            >
              {cat}
            </button>
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
