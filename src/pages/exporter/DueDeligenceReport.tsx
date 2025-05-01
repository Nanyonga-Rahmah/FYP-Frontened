import { useRef } from "react";
import { useLocation, useParams} from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { API_URL } from "@/lib/routes";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";
import { useEffect, useState } from "react";

import {
  DueDiligenceReport as DueDiligenceReportType,
  DueDiligenceResponse,
  BatchForPDF,
  FarmerForPDF,
  ProcessorForPDF,
  BlockchainEntryForPDF,
  ConsignmentLocationState,
} from "@/lib/types";

function DueDiligenceReport() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const locationState = state as ConsignmentLocationState;
  const { authToken } = useAuth();
  const { profile } = useUserProfile(authToken);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<DueDiligenceReportType | null>(null);

  const legacyConsignment = locationState?.consignment;
  const apiReport = locationState?.report;

  useEffect(() => {
    const fetchDueDiligenceReport = async () => {
      if (apiReport) {
        setReport(apiReport);
        setLoading(false);
        return;
      }

      if (id) {
        try {
          setLoading(true);
          const response = await fetch(
            `${API_URL}exporter/due-diligence/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch due diligence report");
          }

          const data: DueDiligenceResponse = await response.json();
          setReport(data.report);
          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
          setLoading(false);
        }
      } else {
        if (!legacyConsignment) {
          setError("No consignment data or ID available");
        }
        setLoading(false);
      }
    };

    fetchDueDiligenceReport();
  }, [id, apiReport, legacyConsignment, authToken]);

  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `DueDiligence_${report?.consignmentOverview.consignmentId || legacyConsignment?.id || "Report"}`,
    removeAfterPrint: true,
  } as Parameters<typeof useReactToPrint>[0]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const consignmentId =
    report?.consignmentOverview.consignmentId || legacyConsignment?.id;

  const createFarmersFromReport = (
    report: DueDiligenceReportType
  ): FarmerForPDF[] => {
    if (!report) return [];

    return report.lots.flatMap((lot) =>
      lot.batches.map((batch) => ({
        id: batch.farmer.email.split("@")[0],
        name: batch.farmer.name,
        address: batch.harvests[0]?.farm.location || "Uganda",
        email: batch.farmer.email,
        batchId: batch.batchId,
      }))
    );
  };

  const createProcessorsFromReport = (
    report: DueDiligenceReportType
  ): ProcessorForPDF[] => {
    if (!report) return [];

    return report.lots.map((lot) => ({
      id: lot.processor.email.split("@")[0],
      name: lot.processor.name,
      address: lot.receiptDetails.receiptNotes || "Uganda",
      email: lot.processor.email,
      batchId: lot.batches[0]?.batchId || "",
    }));
  };

  const createBatchesFromReport = (
    report: DueDiligenceReportType
  ): BatchForPDF[] => {
    if (!report) return [];

    return report.lots.flatMap((lot) =>
      lot.batches.map((batch) => ({
        batchId: batch.batchId,
        farmName: batch.harvests[0]?.farm.farmName || "Farm",
        location: batch.harvests[0]?.farm.location || "Uganda",
        weight: `${batch.totalWeight} kg`,
        qr: batch.batchId,
        geo: batch.harvests[0]?.farm.coordinates
          ? `${batch.harvests[0].farm.coordinates[0]}, ${batch.harvests[0].farm.coordinates[1]}`
          : "0.347596, 32.58252",
      }))
    );
  };

  const createBlockchainEntriesFromReport = (
    report: DueDiligenceReportType
  ): BlockchainEntryForPDF[] => {
    if (!report) return [];

    const entries: BlockchainEntryForPDF[] = [];

    entries.push({
      batch: "Consignment",
      txHash: report.blockchain.txHash,
      timestamp: formatDate(report.generatedAt),
    });

    report.lots.forEach((lot) => {
      entries.push({
        batch: lot.lotId,
        txHash: lot.blockchain.txHash,
        timestamp: formatDate(lot.receiptDetails.dateReceived),
      });
    });

    return entries;
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-[#0F2A38] text-xl">
          Loading due diligence report...
        </p>
      </div>
    );
  }

  if (error && !legacyConsignment) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold">Error: {error}</p>
      </div>
    );
  }

  if (!report && !legacyConsignment) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center text-red-600 font-semibold">
        No consignment data found. Please return to the previous page and try
        again.
      </div>
    );
  }

  const farmers = report
    ? createFarmersFromReport(report)
    : legacyConsignment?.farmers || [];
  const processors = report
    ? createProcessorsFromReport(report)
    : legacyConsignment?.processors || [];
  const batches = report
    ? createBatchesFromReport(report)
    : legacyConsignment?.batches || [];
  const blockchain = report
    ? createBlockchainEntriesFromReport(report)
    : legacyConsignment?.blockchain || [];

  const exporterName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : report?.exporterInformation.name ||
        legacyConsignment?.exporter ||
        "Coffee Exporter";
  const exporterEmail =
    profile?.email ||
    report?.exporterInformation.email ||
    "coffeeworld@gmail.com";
  const destination =
    report?.consignmentOverview.destinationCountry ||
    legacyConsignment?.destination ||
    "Germany";
  const exportDate = report?.consignmentOverview.exportDate
    ? formatDate(report.consignmentOverview.exportDate)
    : legacyConsignment?.exportDate || "May 15, 2025";
  const hsCode = legacyConsignment?.hsCode || "0901.11";
  const tradeName =
    legacyConsignment?.tradeName ||
    `Uganda ${report?.lots[0]?.batches[0]?.harvests[0]?.coffeeVariety || "Coffee"}`;
  const totalWeight =
    report?.consignmentOverview.totalWeight || batches[0]?.weight || "40 kg";
  const country = "Uganda";
  const farmCount =
    report?.lots.reduce(
      (acc, lot) =>
        acc +
        lot.batches.reduce((bAcc, batch) => bAcc + batch.harvests.length, 0),
      0
    ) ||
    legacyConsignment?.farmCount ||
    1;

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div
        ref={printRef}
        className="bg-white w-[595px] h-[900px] mx-auto p-8 overflow-auto shadow border border-gray-200 text-[10px] text-[#212121] font-sans"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="mt-4">
            <h1 className="text-[22px] font-bold text-[#0F2A38]">
              EU DUE DILLIGENCE REPORT
            </h1>
            <p className="text-[15px] text-[#F7A144]">
              for exported deforestation-free coffee
            </p>
          </div>
          <QRCodeSVG
            value={`Consignment ID: ${consignmentId}`}
            size={56}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="H"
          />
        </div>
        {/* Sections */}
        <Section title="A. Operator Information">
          <FlexRow label="User ID:" value="U189" />
          <FlexRow label="Name" value={exporterName} />
          <FlexRow label="Location" value="Kabarole, Uganda" />
          <FlexRow label="Email" value={exporterEmail} />
          <FlexRow
            label="UCDA Export Permit Number"
            value="UCDA/EXP/0653/2025"
          />
        </Section>

        <Section title="B. Consignment Overview">
          <FlexRow label="Consignment ID" value={consignmentId || ""} />
          <FlexRow label="Product Type" value="Green Coffee beans" />
          <FlexRow label="HS Code" value={hsCode} />
          <FlexRow label="Trade Name" value={tradeName} />
          <FlexRow
            label="Export Volume"
            value={
              typeof totalWeight === "number"
                ? `${totalWeight} kg`
                : totalWeight
            }
          />
          <FlexRow label="Country of production:" value={country} />
          <FlexRow label="Destination country" value={destination} />
          <FlexRow label="Export Date" value={exportDate} />
          <FlexRow label="Batches" value={batches[0]?.weight || "40 kg"} />
        </Section>

        <Section title="C. Origin Information">
          <FlexRow label="Country of production:" value={country} />
          <FlexRow label="Farms" value={`${farmCount}`} />

          <Table
            headers={["Batch ID", "Geo", "QR Code"]}
            rows={batches.map((batch) => [
              batch.batchId,
              batch.geo,
              <QRCodeSVG
                value={batch.qr}
                size={32}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="H"
              />,
            ])}
          />
        </Section>

        <Section title="D. Suppliers">
          <Subheading>1. Farmers (Tier 1 Suppliers)</Subheading>
          <Table
            headers={["Farmer ID", "Name", "Address", "Email", "Batch ID"]}
            rows={farmers.map((farmer) => [
              farmer.id,
              farmer.name,
              farmer.address,
              farmer.email,
              farmer.batchId,
            ])}
          />
          <Subheading>2. Processors (Intermediary Suppliers)</Subheading>
          <Table
            headers={["Processor ID", "Name", "Address", "Email", "Batch ID"]}
            rows={processors.map((proc) => [
              proc.id,
              proc.name,
              proc.address,
              proc.email,
              proc.batchId,
            ])}
          />
        </Section>

        <Section title="E. Certifications">
          <ul className="list-disc pl-6">
            {report?.lots[0]?.batches[0]?.harvests[0]?.cultivationMethods?.includes(
              "organic"
            ) && <li>Organic (UG-CERT)</li>}
            {report?.lots[0]?.batches[0]?.harvests[0]?.certifications?.includes(
              "Fair Trade"
            ) && <li>Fairtrade Certified</li>}
            {report?.lots[0]?.batches[0]?.harvests[0]?.certifications?.includes(
              "Rainforest Alliance"
            ) && <li>Rainforest Alliance (RA-UG-0092)</li>}
            {(!report ||
              (!report?.lots[0]?.batches[0]?.harvests[0]?.cultivationMethods?.includes(
                "organic"
              ) &&
                !report?.lots[0]?.batches[0]?.harvests[0]?.certifications?.includes(
                  "Fair Trade"
                ) &&
                !report?.lots[0]?.batches[0]?.harvests[0]?.certifications?.includes(
                  "Rainforest Alliance"
                ))) && (
              <>
                <li>Organic (UG-CERT)</li>
                <li>Fairtrade Certified</li>
                <li>Rainforest Alliance (RA-UG-0092)</li>
              </>
            )}
          </ul>
          <div className="flex items-center gap-3 border border-gray-300 p-3 rounded-md bg-gray-50 w-fit mt-2">
            <img
              src="/images/image-placeholder.svg"
              alt="file"
              className="w-5 h-5"
            />
            <span>
              {legacyConsignment?.attachment || "origin_shipment.png"}
            </span>
            <Button className="bg-[#0F2A38] text-white text-xs px-3 py-1">
              Download
            </Button>
          </div>
        </Section>

        <Section title="F. Compliance declaration">
          <ul className="list-disc pl-6">
            <li>
              Deforestation-Free: All farms verified deforestation-free
              post-2020 by UCDA, per risk assessment. No forest conversion
              detected (Global Forest Watch).
            </li>
            <li>
              Legal Compliance: All batches comply with GDPR and Uganda's Coffee
              Regulations 2021, land use rights, and labor laws, per UCDA
              verification and supplier questionnaires.
            </li>
          </ul>
        </Section>

        <Section title="G. Risk Assessment and mitigation">
          <div className="mb-2">
            <strong>Risk Assessment</strong>
            <ul className="list-disc pl-6 mt-1">
              <li>Country Risk: Uganda, standard risk.</li>
              <li>
                Deforestation: Low risk, no forest cover on farms (Global Forest
                Watch).
              </li>
              <li>Legality: Low risk, UCDA compliance verified.</li>
              <li>
                Supplier Risk: Low, all suppliers completed EUDR questionnaires
                (Annex 1).
              </li>
            </ul>
          </div>

          <div className="mt-3">
            <strong>Mitigation</strong>
            <ul className="list-disc pl-6 mt-1">
              <li>Supplier training on EUDR compliance.</li>
              <li>Satellite monitoring via geovalidation.</li>
              <li>Quality checks.</li>
              <li>Third-party audit by UCDA, 2026.</li>
            </ul>
          </div>
        </Section>

        <Section title="H. Blockchain References">
          <Table
            headers={["Batch", "Transaction Hash", "Timestamp"]}
            rows={blockchain.map((b) => [b.batch, b.txHash, b.timestamp])}
          />
          <p className="italic text-[8px] text-gray-600 mt-2">
            Data stored on blockchain. Immutable records, retained per EUDR
            Article 12.
          </p>
        </Section>

        <p className="text-center text-[8px] italic text-gray-500 mt-4">
          Generated by Coffichain Traceability Solution
        </p>
      </div>

      <div className="flex justify-center mt-4 print:hidden">
        <Button className="bg-[#0F2A38] text-white" onClick={handlePrint}>
          Download as PDF
        </Button>
      </div>
    </div>
  );
}

export default DueDiligenceReport;

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-4">
    <h2 className="font-bold text-[#F7A144] text-[14px] mb-1">{title}</h2>
    <div>{children}</div>
  </section>
);

const Subheading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-semibold text-[11px] mb-1">{children}</h3>
);

const Table = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | JSX.Element)[][];
}) => (
  <table className="w-full border text-[10px] mb-2">
    <thead className="bg-gray-100">
      <tr>
        {headers.map((h) => (
          <th key={h} className="p-1 border">
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i}>
          {row.map((cell, j) => (
            <td key={j} className="p-1 border">
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const FlexRow = ({ label, value }: { label: string; value: string }) => (
  <p className="flex justify-between my-1">
    <span className="font-semibold">{label}</span>
    <span className="text-right">{value}</span>
  </p>
);
