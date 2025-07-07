'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { CalculatorCard } from './CalculatorCard';
import { calculators } from '@/lib/calculators';
import { Search } from 'lucide-react';
import { H2 } from '@/components/ui/typography';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <div className="max-w-3xl mx-auto mb-16">
        <div className="relative flex items-center w-full bg-card border-2 border-border rounded-full shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50 focus-within:ring-offset-background transition-all">
          <Search className="absolute left-5 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search calculators..."
            className="w-full flex-grow pl-14 pr-4 py-3 text-base h-14 rounded-full border-none bg-transparent focus:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search for a calculator"
          />
          <div className="h-8 border-l border-border mx-2"></div>
          <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
            <SelectTrigger className="w-auto flex-shrink-0 pr-6 pl-2 h-full rounded-full border-none bg-transparent text-base focus:ring-0 focus:bg-accent text-muted-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="text-base">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
