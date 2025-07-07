'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { CalculatorCard } from './CalculatorCard';
import { calculators } from '@/lib/calculators';
import { Search, ListFilter } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                  type="search"
                  placeholder="Search calculators by name or keyword..."
                  className="w-full pl-12 pr-4 py-3 text-base h-12 rounded-lg border-2 border-input focus:border-primary transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search for a calculator"
              />
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <Select onValueChange={setSelectedCategory} defaultValue={selectedCategory}>
              <SelectTrigger className="w-full md:w-[240px] h-12 rounded-lg text-base">
                <div className="flex items-center gap-2">
                  <ListFilter className="h-5 w-5 text-muted-foreground" />
                  <SelectValue placeholder="Filter by category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} className="text-base">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
