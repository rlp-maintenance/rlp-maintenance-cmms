interface CsvColumn<T> {
  label: string;
  value: (row: T) => string | number | null | undefined;
}

/** Escapa um campo pro padrao CSV: aspas duplicadas, campo inteiro entre aspas quando tem
 * virgula, aspas ou quebra de linha - o minimo pra abrir certo no Excel/Sheets. */
function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCsvField(c.label)).join(",");
  const lines = rows.map((row) =>
    columns.map((c) => escapeCsvField(String(c.value(row) ?? ""))).join(","),
  );
  return [header, ...lines].join("\r\n");
}

export function downloadCsv(filename: string, csv: string): void {
  // BOM no inicio: sem isso o Excel abre acento errado (ISO-8859-1 em vez de UTF-8).
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
