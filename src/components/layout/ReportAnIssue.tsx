import { Github } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export function ReportAnIssue() {
    return (
        <Card className="mt-16 bg-secondary/50">
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
                <Github className="h-6 w-6 mx-auto mb-3" />
                <p>
                    If you love HomeCalc Pro,{' '}
                    <Link href="https://github.com/google/firebase-studio-project-homecalc-pro" target="_blank" rel="noopener noreferrer" className="underline text-primary">
                        give us a star on GitHub!
                    </Link>
                </p>
                <p>
                    If you find any issues, please{' '}
                    <Link href="https://github.com/google/firebase-studio-project-homecalc-pro/issues" target="_blank" rel="noopener noreferrer" className="underline text-primary">
                        let us know through GitHub as well.
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
