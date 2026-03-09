import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getResearchNotes } from '@/services/future-api';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StickyNote } from 'lucide-react';

interface ResearchNotesPanelProps {
  isin: string;
  displayName: string;
}

export function ResearchNotesButton({ isin, displayName }: ResearchNotesPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6" title="Research Notes">
          <StickyNote className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[360px] sm:w-[420px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-base">
            <StickyNote className="h-4 w-4" />
            {displayName}
          </SheetTitle>
        </SheetHeader>
        <NotesContent isin={isin} />
      </SheetContent>
    </Sheet>
  );
}

function NotesContent({ isin }: { isin: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['research-notes', isin],
    queryFn: () => getResearchNotes(isin),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="mt-4 space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.notes.length === 0) {
    return (
      <div className="mt-8 text-center text-sm text-muted-foreground">
        No research notes yet.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {data.notes.map((note, i) => (
        <div key={i} className="border-b border-border/30 last:border-0 pb-3 last:pb-0 space-y-1.5">
          <p className="text-[10px] text-muted-foreground font-mono">{note.date}</p>
          <p className="text-sm leading-relaxed">{note.text}</p>
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-[9px] px-1">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
