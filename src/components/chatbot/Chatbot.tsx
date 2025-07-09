
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Loader2, Send, User, X, Volume2, VolumeX, MessageCircle, LifeBuoy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getChatbotResponse } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Message {
  role: 'user' | 'model';
  content: string;
  link?: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCallout, setShowCallout] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi! How can I help you plan your next home project?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevMessagesLength = useRef(messages.length);

  useEffect(() => {
    const savedMuteState = localStorage.getItem('chatbotMuted');
    if (savedMuteState !== null) {
      setIsMuted(JSON.parse(savedMuteState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatbotMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
        // A silent WAV file to avoid errors, and to allow for programmatic play() calls.
        audioRef.current = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABgAZGF0YQAAAAA=');
    }

    if (messages.length > prevMessagesLength.current && messages[messages.length - 1].role === 'model' && !isMuted) {
        audioRef.current?.play().catch(e => console.error("Error playing sound:", e));
    }
    prevMessagesLength.current = messages.length;

    if (isOpen && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isMuted, isOpen]);

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
           <div className="relative bg-card text-card-foreground rounded-lg p-4 border w-64 animate-in fade-in-50 slide-in-from-bottom-10 shadow-none border-border/50">
             <p className="text-sm font-medium leading-relaxed border-none">
              Need help? I can find calculators or give project advice!
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
            className="gap-1 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-8 [&_svg]:shrink-0 from-gradient-from to-gradient-to text-primary-foreground [background-size:200%_auto] hover:[background-position:right_center] h-16 w-16 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center p-0 shrink-0"
            aria-label="Open chatbot"
        >
            <MessageCircle className="h-8 w-8 text-primary-foreground" />
        </Button>
      </div>


      {/* Chat Window */}
      <div className={cn("fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out", isOpen ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none')}>
        <Card className="w-[380px] h-[600px] flex flex-col shadow-2xl border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>HomeCalc Pro</CardTitle>
                <CardDescription>Your personal AI helper for all your home needs.</CardDescription>
              </div>
            </div>
            <div>
                <Button variant="ghost" size="icon" onClick={() => setIsMuted(prev => !prev)}>
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close chat</span>
                </Button>
            </div>
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
          <CardFooter className="pt-4 border-t">
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
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
