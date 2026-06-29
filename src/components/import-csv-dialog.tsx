import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileUp,
  Upload,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import {
  type CsvEntity,
  type ImportMode,
  importCsvWithHeaderMap,
} from '@/api/stock/import-csv';
import { ToastError } from '@/components/toast-error';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/** A single column definition shown to the user */
export interface CsvColumnDef {
  /** Portuguese label shown in the UI and used as CSV header */
  label: string;
  /** Backend field name that the column maps to */
  field: string;
  /** Whether this column must be present */
  required: boolean;
  /** Example value shown in the template CSV */
  example: string;
}

interface ImportCsvDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity: CsvEntity;
  entityLabel: string;
  /** Query keys to invalidate on success */
  queryKeys: string[];
  /** Column definitions: label shown in PT-BR, mapped to backend field */
  columns: CsvColumnDef[];
}

const modeLabels: Record<ImportMode, { label: string; description: string }> =
  {
    ADD_NEW: {
      label: 'Adicionar novos',
      description:
        'Importa apenas os registros que ainda não existem. Os existentes são ignorados.',
    },
    UPDATE_EXISTING: {
      label: 'Adicionar e atualizar',
      description:
        'Importa os novos registros e atualiza os que já existem pelo código/nome.',
    },
    RESET: {
      label: 'Apagar tudo e reimportar',
      description:
        'Remove todos os registros existentes e importa a planilha do zero. Use com cuidado.',
    },
  };

export function ImportCsvDialog({
  open,
  onOpenChange,
  entity,
  entityLabel,
  queryKeys,
  columns,
}: ImportCsvDialogProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<ImportMode>('ADD_NEW');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Build header map: { 'Código': 'code', 'Nome': 'name', ... }
  const headerMap = Object.fromEntries(
    columns.map((c) => [c.label, c.field]),
  );

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => {
      if (!selectedFile) throw new Error('Nenhum arquivo selecionado.');
      return importCsvWithHeaderMap(entity, mode, selectedFile, headerMap);
    },
    onSuccess: (result) => {
      toast.success(
        `Importação concluída: ${result.imported} importados, ${result.skipped} ignorados.`,
      );
      queryKeys.forEach((key) =>
        queryClient.removeQueries({ queryKey: [key] }),
      );
      handleClose();
    },
    onError: (error) => {
      ToastError(error);
    },
  });

  function handleClose() {
    setSelectedFile(null);
    setMode('ADD_NEW');
    setIsDragging(false);
    onOpenChange(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
    } else {
      toast.error('Apenas arquivos .csv são aceitos.');
    }
  }

  function handleDownloadTemplate() {
    const header = columns.map((c) => c.label).join(',');
    const example = columns.map((c) => c.example).join(',');
    const csv = `${header}\n${example}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `modelo-${entity}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleSubmit() {
    await mutateAsync();
  }

  const isReset = mode === 'RESET';
  const requiredColumns = columns.filter((c) => c.required);
  const optionalColumns = columns.filter((c) => !c.required);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <FileUp className="h-5 w-5 text-primary" />
            Importar {entityLabel} via CSV
          </DialogTitle>
          <DialogDescription>
            Faça o upload de um arquivo <strong>.csv</strong> para importar{' '}
            {entityLabel.toLowerCase()} em massa.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Modo de importação */}
          <div className="space-y-2">
            <Label>Modo de importação</Label>
            <Select
              value={mode}
              onValueChange={(v) => setMode(v as ImportMode)}
              disabled={isPending}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(modeLabels) as ImportMode[]).map((m) => (
                  <SelectItem key={m} value={m}>
                    {modeLabels[m].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {modeLabels[mode].description}
            </p>
          </div>

          {/* Aviso modo RESET */}
          {isReset && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm text-destructive space-y-1">
                <p className="font-semibold">Atenção: operação irreversível</p>
                <p>
                  Todos os registros de {entityLabel.toLowerCase()} serão
                  removidos antes da importação.
                </p>
              </div>
            </div>
          )}

          {/* Drop zone */}
          <div className="space-y-2">
            <Label>Arquivo CSV</Label>
            <div
              className={[
                'relative flex flex-col items-center justify-center gap-3',
                'rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer',
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/30',
                isPending ? 'pointer-events-none opacity-60' : '',
              ].join(' ')}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
              {selectedFile ? (
                <>
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                  <div className="text-center">
                    <p className="font-medium text-sm">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {(selectedFile.size / 1024).toFixed(1)} KB •{' '}
                      <span
                        className="text-primary underline cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                      >
                        Trocar arquivo
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      Arraste o arquivo aqui ou clique para selecionar
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Somente arquivos .csv
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Colunas */}
          <div className="rounded-lg bg-muted/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Colunas do CSV
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 text-xs text-primary"
                onClick={handleDownloadTemplate}
              >
                <Download className="h-3.5 w-3.5" />
                Baixar modelo
              </Button>
            </div>

            {/* Obrigatórias */}
            {requiredColumns.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground font-medium">
                  Obrigatórias
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {requiredColumns.map((col) => (
                    <span
                      key={col.field}
                      className="inline-flex items-center rounded-md border bg-background px-2 py-0.5 text-xs font-medium"
                      title={`Campo interno: ${col.field}`}
                    >
                      {col.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Opcionais */}
            {optionalColumns.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground font-medium">
                  Opcionais
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {optionalColumns.map((col) => (
                    <span
                      key={col.field}
                      className="inline-flex items-center rounded-md border border-dashed bg-background px-2 py-0.5 text-xs text-muted-foreground"
                      title={`Campo interno: ${col.field}`}
                    >
                      {col.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={!selectedFile || isPending}
            variant={isReset ? 'destructive' : 'default'}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Importando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                {isReset ? 'Apagar e importar' : 'Importar'}
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
