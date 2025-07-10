import { Github, MessageSquareHeart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';

export function ReportAnIssue() {
    return (
        <Card className="mt-16 bg-secondary/50 border-dashed">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="flex-shrink-0">
                        <MessageSquareHeart className="h-12 w-12 text-primary" />
                    </div>
                    <div className="flex-grow">
                        <h4 className="font-bold text-lg mb-1 text-foreground">Your Feedback Matters</h4>
                        <p className="text-sm text-muted-foreground">
                            We're always working to make HomeCalc Pro the best tool for your home projects. If you find it helpful, giving us a star on GitHub helps a lot! For any feature requests, new calculator ideas, or issues you find, please let us know there.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <Button asChild>
                            {/* TODO: Replace with your actual GitHub repository link */}
                            <Link href="https://github.com/your-username/your-repo" target="_blank" rel="noopener noreferrer">
                                <Github className="mr-2 h-4 w-4" /> Provide Feedback on GitHub
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
