import Link from 'next/link';
import type { Calculator } from '@/lib/calculators';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface CalculatorCardProps {
  calculator: Calculator;
}

export function CalculatorCard({ calculator }: CalculatorCardProps) {
  const { slug, name, description, Icon } = calculator;
  return (
    <Link href={`/calculators/${slug}`} className="group">
      <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary">
        <CardHeader className="flex flex-col h-full">
          <div className="flex justify-between items-start">
            <Icon className="h-10 w-10 mb-4 text-primary" />
            <ArrowRight className="h-6 w-6 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
          </div>
          <CardTitle className="font-headline text-xl">{name}</CardTitle>
          <CardDescription className="flex-grow pt-2">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
