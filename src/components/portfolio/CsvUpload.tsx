import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CsvRow {
  statement_date: string;
  valuation_date: string;
  isin: string;
  ticker: string;
  name: string;
  quantity: string;
  position_value_eur: string;
  price_per_unit: string;
  price_date: string;
  currency: string;
  security_type: string;
  notes: string;
}

interface ParsedPosition {
  ticker: string;
  company_name: string;
  isin: string;
  shares: number;
  position_value: number;
  portfolio_weight: number;
  price_per_unit: number;
  price_date: string | null;
  currency: string;
  security_type: string;
  sector: string;
  notes: string | null;
  is_top40: boolean;
}

function parseCsv(text: string): CsvRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  // Detect delimiter: semicolon or comma
  const headerLine = lines[0];
  const delimiter = headerLine.includes(";") ? ";" : ",";

  const headers = headerLine.split(delimiter).map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));

  return lines.slice(1).map((line) => {
    const values = line.split(delimiter).map((v) => v.trim().replace(/^["']|["']$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || "";
    });
    return row as unknown as CsvRow;
  });
}

function guessSector(securityType: string, name: string): string {
  const n = name.toLowerCase();
  if (securityType.toLowerCase().includes("etf") || n.includes("etf") || n.includes("ishares") || n.includes("vanguard") || n.includes("spdr")) return "ETF";
  if (n.includes("semiconductor") || n.includes("chip") || n.includes("nvidia") || n.includes("amd") || n.includes("tsmc") || n.includes("asml") || n.includes("broadcom")) return "Semiconductors";
  if (n.includes("health") || n.includes("pharma") || n.includes("bio") || n.includes("medical") || n.includes("lilly") || n.includes("pfizer") || n.includes("merck")) return "Healthcare";
  if (n.includes("bank") || n.includes("financial") || n.includes("visa") || n.includes("mastercard") || n.includes("jpmorgan")) return "Financials";
  if (n.includes("consumer") || n.includes("costco") || n.includes("walmart") || n.includes("procter")) return "Consumer";
  return "Technology";
}

export function CsvUpload({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "parsing" | "uploading" | "done" | "error">("idle");
  const [preview, setPreview] = useState<ParsedPosition[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setStatus("parsing");
    setErrorMsg("");
    try {
      const text = await file.text();
      const rows = parseCsv(text);

      if (rows.length === 0) {
        setErrorMsg("No data rows found in CSV");
        setStatus("error");
        return;
      }

      // Check required columns
      const first = rows[0] as unknown as Record<string, string>;
      if (!first.ticker && !first.isin) {
        setErrorMsg("CSV must contain at least 'ticker' or 'isin' column");
        setStatus("error");
        return;
      }

      const totalValue = rows.reduce((sum, r) => sum + (parseFloat(r.position_value_eur) || 0), 0);

      const positions: ParsedPosition[] = rows
        .filter((r) => r.ticker && (parseFloat(r.position_value_eur) || 0) > 0)
        .map((r) => {
          const value = parseFloat(r.position_value_eur) || 0;
          return {
            ticker: r.ticker.toUpperCase().trim(),
            company_name: r.name?.trim() || r.ticker.toUpperCase().trim(),
            isin: r.isin?.trim() || "",
            shares: parseFloat(r.quantity) || 0,
            position_value: value,
            portfolio_weight: totalValue > 0 ? Math.round((value / totalValue) * 1000) / 10 : 0,
            price_per_unit: parseFloat(r.price_per_unit) || 0,
            price_date: r.price_date || null,
            currency: r.currency || "EUR",
            security_type: r.security_type || "stock",
            sector: guessSector(r.security_type || "", r.name || ""),
            notes: r.notes || null,
            is_top40: false,
          };
        })
        .sort((a, b) => b.portfolio_weight - a.portfolio_weight);

      // Mark top 40
      positions.forEach((p, i) => {
        p.is_top40 = i < 40;
      });

      setPreview(positions);
      setStatus("idle");
    } catch {
      setErrorMsg("Failed to parse CSV file");
      setStatus("error");
    }
  };

  const handleUploadToDb = async () => {
    if (preview.length === 0) return;
    setStatus("uploading");

    try {
      // Delete existing positions then insert fresh
      await supabase.from("portfolio_positions").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      const { error } = await supabase.from("portfolio_positions").insert(
        preview.map((p) => ({
          ticker: p.ticker,
          company_name: p.company_name,
          isin: p.isin || null,
          shares: p.shares,
          position_value: p.position_value,
          portfolio_weight: p.portfolio_weight,
          price_per_unit: p.price_per_unit,
          price_date: p.price_date,
          currency: p.currency,
          security_type: p.security_type,
          sector: p.sector,
          notes: p.notes,
          is_top40: p.is_top40,
        }))
      );

      if (error) throw error;

      setStatus("done");
      toast.success(`${preview.length} positions imported successfully`);
      onUploadComplete?.();
    } catch (err: any) {
      setErrorMsg(err.message || "Upload failed");
      setStatus("error");
      toast.error("Failed to import positions");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".csv")) processFile(file);
    else { setErrorMsg("Please upload a .csv file"); setStatus("error"); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const reset = () => {
    setPreview([]);
    setStatus("idle");
    setErrorMsg("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {preview.length === 0 ? (
        <Card
          className={cn(
            "border-2 border-dashed transition-colors cursor-pointer",
            isDragging ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center gap-3 py-10">
            {status === "parsing" ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : status === "error" ? (
              <>
                <AlertCircle className="h-8 w-8 text-loss" />
                <p className="text-sm text-loss">{errorMsg}</p>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); reset(); }}>
                  Try Again
                </Button>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium">Drop CSV file here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Expected columns: ticker, name, quantity, position_value_eur, isin, currency, security_type
                  </p>
                </div>
              </>
            )}
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{preview.length} positions parsed</p>
                  <p className="text-xs text-muted-foreground">
                    Total value: €{preview.reduce((s, p) => s + p.position_value, 0).toLocaleString()} · Top 40 marked for analysis
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={reset}>Cancel</Button>
                <Button size="sm" onClick={handleUploadToDb} disabled={status === "uploading"} className="gap-2">
                  {status === "uploading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  {status === "uploading" ? "Importing..." : "Import to Database"}
                </Button>
              </div>
            </div>

            {status === "done" && (
              <div className="flex items-center gap-2 rounded-md bg-gain/10 px-3 py-2 text-sm text-gain">
                <CheckCircle2 className="h-4 w-4" /> Successfully imported {preview.length} positions
              </div>
            )}

            <div className="max-h-[300px] overflow-auto rounded-md border border-border/50">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">#</th>
                    <th className="px-3 py-2 text-left font-medium">Ticker</th>
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-right font-medium">Value (€)</th>
                    <th className="px-3 py-2 text-right font-medium">Weight</th>
                    <th className="px-3 py-2 text-left font-medium">Sector</th>
                    <th className="px-3 py-2 text-center font-medium">Top 40</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 50).map((p, i) => (
                    <tr key={p.ticker} className="border-t border-border/30 hover:bg-muted/30">
                      <td className="px-3 py-1.5 text-muted-foreground">{i + 1}</td>
                      <td className="px-3 py-1.5 font-mono font-bold">{p.ticker}</td>
                      <td className="px-3 py-1.5 text-muted-foreground truncate max-w-[200px]">{p.company_name}</td>
                      <td className="px-3 py-1.5 text-right font-mono">€{p.position_value.toLocaleString()}</td>
                      <td className="px-3 py-1.5 text-right font-mono">{p.portfolio_weight.toFixed(1)}%</td>
                      <td className="px-3 py-1.5">{p.sector}</td>
                      <td className="px-3 py-1.5 text-center">{p.is_top40 ? "✓" : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
