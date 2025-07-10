import { Github } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';

export function ReportAnIssue() {
    return (
        <Card className="mt-16 bg-secondary/50 border-dashed">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="flex-shrink-0">
                        <Github className="h-12 w-12 text-primary" />
                    </div>
                    <div className="flex-grow">
                        <h4 className="font-bold text-lg mb-1 text-foreground">Help Us Improve</h4>
                        <p className="text-sm text-muted-foreground">
                            HomeCalc Pro is an open-source project, and we thrive on community feedback. If you find our tools useful, giving us a star on GitHub helps others discover it. If you encounter a bug or have a feature suggestion, creating an issue is the best way to let us know.
                        </p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto">
                        <Button asChild className="w-full sm:w-auto">
                            <Link href="https://github.com/google/firebase-studio-project-homecalc-pro" target="_blank" rel="noopener noreferrer">
                                Star on GitHub
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full sm:w-auto bg-background">
                             <Link href="https://github.com/google/firebase-studio-project-homecalc-pro/issues" target="_blank" rel="noopener noreferrer">
                                Report an Issue
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
