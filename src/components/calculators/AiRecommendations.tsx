
'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Info, Loader2, Wand2 } from 'lucide-react';
import Link from 'next/link';

import { getAiRecommendations } from '@/lib/actions';
import { assistantSuggestions } from '@/lib/assistant-suggestions';
import { calculators } from '@/lib/calculators';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

function AiRecommendationsComponent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [projectDescription, setProjectDescription] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [noResultsMessage, setNoResultsMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const runRecommendations = useCallback(async (description: string) => {
    if (!description) return;
    setLoading(true);
    setRecommendations([]);
    setNoResultsMessage(null);
    try {
      const result = await getAiRecommendations(description);
      if (result && result.recommendations && result.recommendations.length > 0) {
        setRecommendations(result.recommendations);
      } else {
        setNoResultsMessage("We couldn't find any specific calculators for your project, but our AI assistant might be able to help. Try asking in the chatbot!");
      }
    } catch (error) {
      setNoResultsMessage("Sorry, an error occurred while getting recommendations. Please try again later.");
      toast({
        title: 'An error occurred',
        description: error instanceof Error ? error.message : 'Failed to get AI recommendations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const prompt = searchParams.get('prompt');
    if (prompt) {
      const decodedPrompt = decodeURIComponent(prompt);
      setProjectDescription(decodedPrompt);
      runRecommendations(decodedPrompt);
    }
  }, [searchParams, runRecommendations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectDescription) {
        toast({
            title: 'Input needed',
            description: 'Please describe your project.',
            variant: 'destructive',
        });
        return;
    }
    runRecommendations(projectDescription);
  };

  const getSlugForRecommendation = (name: string) => {
    const found = calculators.find(calc => calc.name.toLowerCase() === name.toLowerCase());
    return found?.slug;
  }

  return (
    <div className="mt-16">
        <Card className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold font-headline mb-2 flex items-center justify-center gap-2">
                        <Wand2 className="h-8 w-8 text-primary" />
                        Need a suggestion?
                    </CardTitle>
                    <CardDescription className="max-w-xl mx-auto">
                        Tell us what you're working on. The more detail you provide, the better the recommendations will be. For example: "I'm building a deck and painting my bedroom."
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Describe your project here..."
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        disabled={loading}
                        rows={4}
                        className="resize-y min-h-[80px]"
                    />
                     {recommendations.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-semibold mb-3">Based on your project, here are the tools that can help:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {recommendations.map(rec => {
                                    const slug = getSlugForRecommendation(rec);
                                    const calculator = calculators.find(c => c.slug === slug);
                                    if(slug && calculator) {
                                       return (
                                        <Link href={`/calculators/${slug}`} key={rec} className="group">
                                            <div className="p-3 border rounded-md hover:bg-accent hover:border-primary/50 transition-colors flex items-center gap-3 h-full">
                                                <calculator.Icon className="h-6 w-6 text-primary shrink-0" />
                                                <span className="font-medium">{rec}</span>
                                            </div>
                                        </Link>
                                       )
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    )}
                    {noResultsMessage && (
                        <Alert className="mt-6">
                            <Info className="h-4 w-4" />
                            <AlertTitle>No specific calculators found</AlertTitle>
                            <AlertDescription>
                                {noResultsMessage}
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={loading} size="lg">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Get Recommendations
                    </Button>
                </CardFooter>
            </form>
        </Card>
    </div>
  );
}

export function AiRecommendations() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AiRecommendationsComponent />
        </Suspense>
    )
}
