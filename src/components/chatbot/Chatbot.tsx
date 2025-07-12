
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, X, MessagesSquare, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getChatbotResponse } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Message {
  role: 'user' | 'model';
  content: string;
  link?: string | null;
}

const allPresetQuestions = [
  // HVAC
  "How much money can I save with a smart thermostat?",
  "What's the difference between SEER and SEER2 for AC units?",
  "What size AC unit do I need for a 2000 sq ft house?",
  "What are the signs that I need a new furnace?",
  "What are the benefits of a ductless mini-split system?",
  "How often should I change my HVAC air filter?",
  "What is a 'Manual J' calculation and why is it important?",
  "Is a heat pump a good option for my climate?",
  "What's the best temperature to set my thermostat to in the summer?",
  "How can I improve the air quality in my home?",
  "Explain what a 'ton' means for an AC unit.",
  "What is AFUE for furnaces?",
  "How can I tell if my ducts are leaking?",
  "What's better for my home, a furnace or a heat pump?",
  "Are attic fans a good investment for energy savings?",
  "What are some common HVAC maintenance tasks I can do myself?",
  "How much does a new furnace typically cost?",
  "What's the average lifespan of an air conditioner?",
  "Why is my AC unit freezing up?",
  "What are the pros and cons of different types of insulation?",
  "How do I find my climate zone for HVAC sizing?",
  "What are the main components of a central AC system?",
  "Can you explain how a heat pump works in the winter?",
  "Is it worth upgrading to a variable-speed furnace?",
  "How does humidity affect how my home feels?",

  // Home Improvement
  "What do I need to know before building a deck?",
  "What's the best type of paint for a bathroom?",
  "What's a reasonable budget for a mid-range kitchen renovation?",
  "What are the most durable types of flooring for a family with pets?",
  "How do I properly prepare a wall for wallpaper?",
  "What are the pros and cons of granite vs. quartz countertops?",
  "What's the most important safety tip for any DIY project?",
  "How can I tell if a wall is load-bearing?",
  "What are some common mistakes to avoid when painting a room?",
  "Give me a step-by-step guide for installing laminate flooring.",
  "What are the different types of paint finishes (sheens)?",
  "How much extra material should I buy for a flooring project?",
  "What is a 'waste factor' in construction?",
  "How do I calculate the perimeter of a room for trim work?",
  "What's the best way to pour a small concrete slab for a shed?",
  "How long should I wait before staining a new wood deck?",
  "What tools are essential for a beginner DIYer?",
  "How do I find a stud in the wall?",
  "What's the difference between stock and custom cabinets?",
  "What are some budget-friendly kitchen upgrade ideas?",
  "How can I make a small room look bigger with paint?",
  "What are the safety precautions for using a power saw?",
  "How do I fix a small hole in my drywall?",
  "What's the best way to clean and maintain a wood deck?",
  "How do I measure for new kitchen countertops?",

  // Gardening
  "What is my USDA plant hardiness zone and what can I plant?",
  "How much compost should I add to my garden bed?",
  "What are some low-maintenance plants for a shady area?",
  "How can I test the pH of my garden soil?",
  "What's the difference between fertilizer numbers like 10-10-10?",
  "How do I get rid of common garden pests naturally?",
  "When is the best time to plant tomatoes in my area?",
  "What are some good companion plants for a vegetable garden?",
  "How deep should I make my raised garden bed?",
  "What are the basics of starting a compost pile?",
  "What does 'full sun' mean for a plant label?",
  "How do I improve clay soil in my garden?",
  "What's the difference between an annual and a perennial plant?",
  "How often should I water my vegetable garden?",
  "What are some drought-tolerant plants for my region?",
  "How do I properly space my plants when I put them in the ground?",
  "What are the signs of overwatering a plant?",
  "What is 'deadheading' and why should I do it?",
  "What's a good natural weed killer for my driveway cracks?",
  "How do I attract pollinators like bees and butterflies to my garden?",
  "What are the benefits of using mulch in a garden?",
  "Can I grow vegetables in containers on my balcony?",
  "What is crop rotation and why is it important?",
  "How do I prepare my garden for winter?",
  "What are some easy-to-grow herbs for a beginner gardener?",

  // Other / Financial
  "Can you help me calculate my monthly mortgage payment?",
  "What would my monthly payment be for a $30,000 car loan?",
  "How much will my investment be worth in 15 years with compound interest?",
  "What are some simple ways to save on my energy bill?",
  "What are the pros and cons of a 15-year vs a 30-year mortgage?",
  "What is PMI and how can I avoid it?",
  "How much of an emergency fund should I have as a homeowner?",
  "Should I get a fixed-rate or adjustable-rate mortgage?",
  "What's the first step in planning for retirement?",
  "How can I improve my credit score before applying for a loan?",
  "What is compound interest and how does it work?",
  "How much will my monthly car payment be with a $5,000 down payment?",
  "What is 'PITI' in a mortgage payment?",
  "How much sooner will I pay off my mortgage if I make one extra payment a year?",
  "Is it better to have a lower interest rate or a shorter loan term on a car?",
  "How does a down payment affect my monthly mortgage?",
  "What are some common closing costs when buying a home?",
  "How do I calculate the total interest paid on a loan?",
  "What's a good rule of thumb for how much house I can afford?",
  "How do I start an investment account?",
  "What's the difference between a Roth IRA and a Traditional IRA?",
  "How much will I save on gas if I switch to an electric car?",
  "What are some high-yield savings accounts?",
  "How can I create a household budget?",
  "What are the tax advantages of owning a home?",
];


// Function to shuffle an array and get the first N items
const getShuffledItems = (arr: string[], num: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHelpBubble, setShowHelpBubble] = useState(true);
  const [showPresets, setShowPresets] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi! How can I help you plan your next home project?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [presetQuestions, setPresetQuestions] = useState<string[]>([]);
  const { toast } = useToast();
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Randomize questions only on the client-side to prevent hydration mismatch
    setPresetQuestions(getShuffledItems(allPresetQuestions, 3));
  }, []);


  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, 128)}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isOpen, showPresets]);

  const handleSendMessage = async (queryOverride?: string) => {
    const query = queryOverride || inputValue.trim();
    if (!query || isLoading) return;

    setShowPresets(false);
    const userMessage: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    
    if (!queryOverride) {
        setInputValue('');
    }
    setIsLoading(true);

    try {
      const history = [...messages, userMessage].map(({ role, content }) => ({ role, content: content.toString() }));
      const res = await getChatbotResponse({ query: query, history });
      
      const modelMessage: Message = { role: 'model', content: res.answer, link: res.link };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.';
      toast({
        title: 'Chatbot Error',
        description: errorMessage,
        variant: 'destructive',
      });
      const errorResponseMessage: Message = { role: 'model', content: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages(prev => [...prev, errorResponseMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <>
      { !isOpen && showHelpBubble && (
        <div className="fixed bottom-24 right-4 md:right-6 z-40 animate-in fade-in-50 slide-in-from-bottom-4">
            <Card className="p-3 shadow-none">
                 <CardContent className="p-0 flex items-center gap-2">
                    <p className="text-sm font-medium">How can I help with your project?</p>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 shrink-0 rounded-full"
                        onClick={() => setShowHelpBubble(false)}
                        aria-label="Dismiss"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                 </CardContent>
            </Card>
        </div>
      )}

      <Button
          variant="default"
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 h-16 w-16 rounded-full flex items-center justify-center p-0 shrink-0 [&_svg]:size-8",
            "transition-all duration-300 ease-in-out hover:scale-110",
            isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          )}
          aria-label="Open chatbot"
      >
          <MessagesSquare />
      </Button>

      <div className={cn("fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 transition-transform duration-300 ease-in-out", isOpen ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none')}>
        <Card className="w-[calc(100vw-2rem)] max-w-[400px] h-[calc(100vh-5rem)] max-h-[640px] flex flex-col shadow-2xl border">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <MessagesSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">HomeCalc Helper</CardTitle>
                <CardDescription className="text-xs">Your friendly home project guide</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-9 w-9 rounded-full text-muted-foreground">
              <X className="h-5 w-5" />
              <span className="sr-only">Close chat</span>
            </Button>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col overflow-hidden p-0">
            <ScrollArea className="flex-grow" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex gap-3 text-sm',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'model' && <MessagesSquare className="h-6 w-6 shrink-0 text-primary" />}
                    <div
                      className={cn(
                        'rounded-lg px-4 py-2.5 max-w-[85%] break-words',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.link && typeof message.link === 'string' && (
                        <Button asChild size="sm" className="mt-2">
                           <Link href={`/calculators/${message.link}`}>Go to calculator</Link>
                        </Button>
                      )}
                    </div>
                     {message.role === 'user' && <User className="h-6 w-6 shrink-0 rounded-full bg-secondary text-secondary-foreground p-0.5" />}
                  </div>
                ))}
                
                {showPresets && presetQuestions.length > 0 && (
                  <div className="pt-2 animate-in fade-in-50">
                    <p className="text-xs text-muted-foreground mb-2 px-1">Or, ask one of these questions:</p>
                    <div className="space-y-2">
                      {presetQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handlePresetClick(q)}
                          className="w-full text-left p-2.5 rounded-lg border bg-background hover:bg-accent hover:border-primary/30 text-sm font-medium text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-between"
                        >
                          <span>{q}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"/>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="flex justify-start gap-3 text-sm">
                      <MessagesSquare className="h-6 w-6 shrink-0 text-primary" />
                      <div className="rounded-lg px-4 py-3 bg-muted flex items-center space-x-1.5">
                        <span className="h-2 w-2 bg-muted-foreground/70 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-muted-foreground/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-muted-foreground/70 rounded-full animate-bounce"></span>
                      </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-2 border-t">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
              className="flex w-full items-end gap-2"
            >
              <Textarea
                ref={textareaRef}
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a question..."
                className="flex-grow overflow-y-auto resize-none py-2.5 px-3 no-scrollbar bg-secondary/50 border-input rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="h-10 w-10 shrink-0" disabled={isLoading || !inputValue.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
