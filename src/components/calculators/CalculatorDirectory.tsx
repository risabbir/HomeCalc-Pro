'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { CalculatorCard } from './CalculatorCard';
import { calculators } from '@/lib/calculators';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { H2 } from '@/components/ui/typography';

const categories = ['HVAC', 'Home Improvement', 'Gardening', 'Other'];

export function CalculatorDirectory() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCalculators = useMemo(() => {
    if (!searchTerm) {
      return calculators;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return calculators.filter(
      (calc) =>
        calc.name.toLowerCase().includes(lowercasedTerm) ||
        calc.description.toLowerCase().includes(lowercasedTerm) ||
        calc.category.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm]);

  const calculatorsByCategory = useMemo(() => {
    return categories.map(category => ({
      name: category,
      calculators: filteredCalculators.filter(calc => calc.category === category),
    })).filter(group => group.calculators.length > 0);
  }, [filteredCalculators]);

  const handleCategoryJump = (value: string) => {
    if (value) {
      const element = document.getElementById(value);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div id="calculators">
      <div className="sticky top-[65px] bg-background/80 backdrop-blur-sm z-10 py-4 mb-8 -mx-4 px-4 border-b">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
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
            <Select onValueChange={handleCategoryJump}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Go to category..." />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(cat => (
                        <SelectItem key={cat} value={cat.toLowerCase().replace(/\s+/g, '-')}>{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      {calculatorsByCategory.length > 0 ? (
        <div className="space-y-16">
          {calculatorsByCategory.map(category => (
            <section key={category.name} id={category.name.toLowerCase().replace(/\s+/g, '-')}>
              <H2 className="font-headline border-b pb-2 mb-6">{category.name}</H2>
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
          <p className="text-muted-foreground">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
}
