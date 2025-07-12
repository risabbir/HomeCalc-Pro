
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Github, Share2, Handshake, ArrowRight, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReportAnIssue } from '@/components/layout/ReportAnIssue';
import { AnimatedSection } from '@/components/about/AnimatedSection';

export const metadata: Metadata = {
    title: 'About Us | HomeCalc Pro',
    description: 'Learn about HomeCalc Pro\'s mission to provide free, accurate, and easy-to-use calculators that empower homeowners, DIY enthusiasts, and professionals for any project.',
};

export default function AboutPage() {
    return (
        <div className="overflow-x-hidden">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-4xl mx-auto">
                    <AnimatedSection>
                        <section className="text-center mb-24">
                            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">Our Mission</h1>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                                To empower homeowners, DIY enthusiasts, and professionals with free, accurate, and easy-to-use calculators for any home project, big or small. We believe that with the right tools, anyone can plan with confidence and build with precision.
                            </p>
                        </section>
                    </AnimatedSection>

                    <AnimatedSection>
                        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                            <div className='relative aspect-video rounded-xl'>
                                 <Image 
                                    src="https://images.unsplash.com/photo-1516542076529-1ea3854896f2?q=80&w=1471&auto=format&fit=crop"
                                    alt="A person using a laptop with blueprints, planning a home project with online tools." 
                                    fill
                                    className="rounded-xl object-cover"
                                    data-ai-hint="planning project"
                                />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold font-headline mb-4">What We Do</h2>
                                <p className="text-muted-foreground">
                                    HomeCalc Pro is a comprehensive suite of online calculators designed to take the guesswork out of home improvement, gardening, HVAC planning, and more. We provide the mathematical foundation for your projects, from estimating the amount of paint for a bedroom to calculating the load for a new HVAC system. Our goal is to save you time, reduce material waste, and help you stay on budget.
                                </p>
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection>
                         <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                            <div className="md:order-2 relative aspect-video rounded-xl">
                                <Image 
                                    src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1470&auto=format&fit=crop"
                                    alt="A well-organized workshop with tools hanging on the wall, representing DIY projects." 
                                    fill
                                    className="rounded-xl object-cover"
                                    data-ai-hint="tools workshop"
                                />
                            </div>
                            <div className="md:order-1">
                                <h2 className="text-3xl font-bold font-headline mb-4">How This Tool Helps You</h2>
                                <p className="text-muted-foreground mb-4">
                                    Planning is the most critical phase of any project. Our calculators help you:
                                </p>
                                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                                    <li><strong>Budget Accurately:</strong> Know exactly how much material you need before you buy.</li>
                                    <li><strong>Save Time:</strong> Get instant calculations without complex formulas.</li>
                                    <li><strong>Reduce Waste:</strong> Buy the right amount, saving money and the environment.</li>
                                    <li><strong>Learn & Discover:</strong> Explore our resources to learn best practices for your projects.</li>
                                </ul>
                            </div>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection>
                        <Card className="mb-24 bg-primary/5 border-primary/20 text-center">
                            <CardHeader>
                                <CardTitle>Explore Our Guides & Resources</CardTitle>
                                <CardDescription className="max-w-xl mx-auto">
                                    Go beyond the numbers. Our comprehensive resource section is filled with step-by-step checklists, planning guides, and expert tips to help you execute your projects successfully.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild>
                                    <Link href="/resources">
                                        Browse Resources <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </AnimatedSection>

                    <AnimatedSection>
                        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                            <div className="relative aspect-video rounded-xl">
                                <Image 
                                    src="https://images.unsplash.com/photo-1706466614967-f4f14a3d9d08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNHx8YWl8ZW58MHx8fHwxNzUyMjE2Nzk3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                    alt="A person's hands typing on a laptop, symbolizing the AI technology behind the calculators." 
                                    fill
                                    className="rounded-xl object-cover"
                                    data-ai-hint="technology code"
                                />
                            </div>
                             <div>
                                <h2 className="text-3xl font-bold font-headline mb-4">The Power Behind Our Tools</h2>
                                <p className="text-lg text-muted-foreground mb-8">
                                    Many of our features, like the AI Recommendations and the Chatbot, are powered by advanced AI models from Google. This allows us to provide smart suggestions and helpful answers to your project questions, going beyond simple calculations.
                                </p>
                                <Button asChild variant="outline">
                                    <Link href="/faq">Learn More About our AI Features</Link>
                                </Button>
                            </div>
                        </div>
                    </AnimatedSection>
                    
                     <AnimatedSection>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold font-headline">Help Us Improve</h2>
                            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">HomeCalc Pro is built for the community. Your feedback is invaluable in helping us make the tool better for everyone.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <Card className="flex flex-col items-center p-6 bg-secondary/50 hover:-translate-y-1 transition-transform duration-300">
                                <Github className="h-10 w-10 text-primary mb-4"/>
                                <h3 className="font-semibold text-lg">Provide Feedback</h3>
                                <p className="text-sm text-muted-foreground mt-1">Suggest a new calculator or report an issue on our GitHub.</p>
                            </Card>
                             <Card className="flex flex-col items-center p-6 bg-secondary/50 hover:-translate-y-1 transition-transform duration-300">
                                <Share2 className="h-10 w-10 text-primary mb-4"/>
                                <h3 className="font-semibold text-lg">Share the Site</h3>
                                <p className="text-sm text-muted-foreground mt-1">Tell your friends, family, or colleagues about HomeCalc Pro.</p>
                            </Card>
                             <Card className="flex flex-col items-center p-6 bg-secondary/50 hover:-translate-y-1 transition-transform duration-300">
                                <Handshake className="h-10 w-10 text-primary mb-4"/>
                                <h3 className="font-semibold text-lg">Contribute</h3>
                                <p className="text-sm text-muted-foreground mt-1">If you're a developer, consider contributing to our open-source project.</p>
                            </Card>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection>
                        <ReportAnIssue />
                    </AnimatedSection>
                </div>
            </div>
        </div>
    );
}
