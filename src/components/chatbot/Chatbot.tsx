
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getChatbotResponse } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { AlertDescription } from '../ui/alert';

interface Message {
  role: 'user' | 'model';
  content: string;
  link?: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCallout, setShowCallout] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm the HomeCalc Helper. How can I assist you with your home projects today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const history = [...messages, userMessage].map(({ role, content }) => ({ role, content: content.toString() }));
      const res = await getChatbotResponse({ query: currentInput, history });
      
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

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowCallout(false);
  };

  return (
    <>
      {/* FAB and Callout container */}
      <div className={cn(
        "fixed bottom-6 right-6 z-50 flex items-end gap-4",
        "transition-all duration-300 ease-in-out",
        isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
      )}>
        {/* Callout */}
        {showCallout && (
          <div className="bg-card text-card-foreground rounded-lg p-4 border w-64 relative animate-in fade-in-50 slide-in-from-bottom-10">
            <p className="text-sm">
              Stuck on a calculation? Ask me anything! 👇
            </p>
            <Button 
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); setShowCallout(false); }} 
                className="absolute top-1 right-1 h-6 w-6"
                aria-label="Dismiss message"
            >
                <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* FAB */}
        <Button
            onClick={handleOpenChat}
            className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center p-0 shrink-0"
            aria-label="Open chatbot"
        >
            <MessageCircle className="h-10 w-10 text-primary-foreground" />
        </Button>
      </div>


      {/* Chat Window */}
      <div className={cn("fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out", isOpen ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none')}>
        <Card className="w-[380px] h-[600px] flex flex-col shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>HomeCalc Helper</CardTitle>
                <CardDescription>AI Assistant</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-0">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex gap-3 text-sm',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'model' && <Bot className="h-6 w-6 shrink-0 text-primary" />}
                    <div
                      className={cn(
                        'rounded-lg px-4 py-2 max-w-[80%]',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.link && (
                        <Button asChild size="sm" className="mt-2">
                           <Link href={`/calculators/${message.link}`}>Go to calculator</Link>
                        </Button>
                      )}
                    </div>
                     {message.role === 'user' && <User className="h-6 w-6 shrink-0" />}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start gap-3 text-sm">
                      <Bot className="h-6 w-6 shrink-0 text-primary" />
                      <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                          <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 pt-4">
             <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex w-full items-start gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about a project..."
                className="min-h-0 h-12 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="h-12 w-12 shrink-0" disabled={isLoading}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
             <AlertDescription className="text-xs px-2">
              AI-generated answers may be inaccurate. Please verify important information.
            </AlertDescription>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
