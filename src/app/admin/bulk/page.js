"use client";

import { useState } from "react";
import {
  bulkImportProducts,
  bulkUploadMedia,
  downloadImportTemplate,
} from "@/api";
import {
  Alert,
  Button,
  Card,
  Input,
  PageHeader,
  Table,
  Td,
} from "@/components/admin/ui";

function ResultReport({ result, columns }) {
  if (!result) return null;

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-3 text-sm">
        <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-navy">
          {result.total} total
        </span>
        <span className="rounded-lg bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
          {result.success} succeeded
        </span>
        <span
          className={`rounded-lg px-3 py-1.5 font-semibold ${
            result.failed > 0
              ? "bg-rose-50 text-rose-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {result.failed} failed
        </span>
      </div>

      {result.errors?.length > 0 && (
        <div className="mt-4">
          <Table head={columns.map((column) => column.label)}>
            {result.errors.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <Td key={column.key} className={column.className}>
                    {row[column.key] || "—"}
                  </Td>
                ))}
              </tr>
            ))}
          </Table>
        </div>
      )}
    </div>
  );
}

export default function BulkPage() {
  const [sheet, setSheet] = useState(null);
  const [sheetBusy, setSheetBusy] = useState(false);
  const [sheetError, setSheetError] = useState("");
  const [sheetResult, setSheetResult] = useState(null);

  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaBusy, setMediaBusy] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [mediaResult, setMediaResult] = useState(null);

  const [templateBusy, setTemplateBusy] = useState(false);
  const [templateError, setTemplateError] = useState("");

  const getTemplate = async () => {
    setTemplateBusy(true);
    setTemplateError("");

    try {
      await downloadImportTemplate();
    } catch (error) {
      setTemplateError(error.message);
    } finally {
      setTemplateBusy(false);
    }
  };

  const importSheet = async (event) => {
    event.preventDefault();
    if (!sheet) return;

    setSheetBusy(true);
    setSheetError("");
    setSheetResult(null);

    try {
      setSheetResult(await bulkImportProducts(sheet));
    } catch (error) {
      setSheetError(error.message);
    } finally {
      setSheetBusy(false);
    }
  };

  const uploadMedia = async (event) => {
    event.preventDefault();
    if (mediaFiles.length === 0) return;

    setMediaBusy(true);
    setMediaError("");
    setMediaResult(null);

    try {
      setMediaResult(await bulkUploadMedia(mediaFiles));
    } catch (error) {
      setMediaError(error.message);
    } finally {
      setMediaBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Bulk import"
        description="Load a whole catalogue from a spreadsheet, then attach media by filename"
      />

      <div className="space-y-5">
        <Card
          title="1 — Template"
          description="The exact columns the importer expects, with a filled sample row"
        >
          <Alert onDismiss={() => setTemplateError("")}>{templateError}</Alert>
          <Button variant="secondary" loading={templateBusy} onClick={getTemplate}>
            Download product-import-template.xlsx
          </Button>
          <p className="mt-3 text-sm text-slate-500">
            The <code className="font-mono text-xs">specs</code>,{" "}
            <code className="font-mono text-xs">options</code> and{" "}
            <code className="font-mono text-xs">price_slabs</code> columns hold
            JSON arrays. Categories and subcategories are matched by name and
            must already exist. Imported products always land as{" "}
            <strong>DRAFT</strong>.
          </p>
        </Card>

        <Card
          title="2 — Import products"
          description=".csv, .xlsx or .xls, up to 20 MB. A bad row is reported and skipped, never fatal."
        >
          <Alert onDismiss={() => setSheetError("")}>{sheetError}</Alert>

          <form onSubmit={importSheet} className="flex flex-wrap gap-3">
            <Input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="max-w-md"
              onChange={(event) => setSheet(event.target.files?.[0] || null)}
              required
            />
            <Button type="submit" loading={sheetBusy} disabled={!sheet}>
              Run import
            </Button>
          </form>

          <ResultReport
            result={sheetResult}
            columns={[
              { key: "row", label: "Row", className: "w-16 text-slate-400" },
              { key: "sku", label: "SKU", className: "font-mono text-xs" },
              { key: "message", label: "Problem", className: "text-rose-700" },
            ]}
          />
        </Card>

        <Card
          title="3 — Attach media"
          description="Files are matched to products by the SKU at the start of the filename"
        >
          <Alert onDismiss={() => setMediaError("")}>{mediaError}</Alert>

          <p className="mb-4 text-sm text-slate-500">
            <code className="font-mono text-xs">MUG001.jpg</code>,{" "}
            <code className="font-mono text-xs">MUG001-2.jpg</code> and{" "}
            <code className="font-mono text-xs">MUG001_3.mp4</code> all attach to
            SKU <strong>MUG001</strong>. The first image on a product without one
            becomes its primary. Up to 200 files, 100 MB each.
          </p>

          <form onSubmit={uploadMedia} className="flex flex-wrap gap-3">
            <Input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
              className="max-w-md"
              onChange={(event) =>
                setMediaFiles(Array.from(event.target.files || []))
              }
              required
            />
            <Button
              type="submit"
              loading={mediaBusy}
              disabled={mediaFiles.length === 0}
            >
              Upload {mediaFiles.length || ""} file
              {mediaFiles.length === 1 ? "" : "s"}
            </Button>
          </form>

          <ResultReport
            result={mediaResult}
            columns={[
              { key: "file", label: "File", className: "text-xs" },
              { key: "sku", label: "SKU", className: "font-mono text-xs" },
              { key: "message", label: "Problem", className: "text-rose-700" },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
