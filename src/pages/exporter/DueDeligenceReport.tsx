import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { QRCode } from "react-qrcode-logo";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { Weight } from "lucide-react";

interface Batch {
    batchId: string;
    farmName: string;
    location: string;
    weight: string;
    qr: string;
    geo: string;
}

interface Farmer {
    id: string;
    name: string;
    address: string;
    email: string;
    batchId: string;
}

interface Processor {
    id: string;
    name: string;
    address: string;
    email: string;
    batchId: string;
}

interface BlockchainEntry {
    batch: string;
    txHash: string;
    timestamp: string;
}

interface Consignment {
    id: string;
    exporter: string;
    processor: string;
    submittedDate: string;
    hsCode: string;
    tradeName: string;
    exportVolume: string;
    destination: string;
    country: string;
    exportDate: string;
    batchesCount: number;
    harvestPeriod: string;
    farmCount: number;
    attachment: string;
    batches: Batch[];
    farmers: Farmer[];
    processors: Processor[];
    blockchain: BlockchainEntry[];
}

function DueDiligenceReport() {
    const { state } = useLocation();
    const consignment = state?.consignment as Consignment;

    const printRef = useRef<HTMLDivElement | null>(null);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `DueDiligence_${consignment?.id || "Report"}`,
        removeAfterPrint: true,
    } as Parameters<typeof useReactToPrint>[0]);

    if (!consignment) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
                No consignment data found. Please return to the previous page and try again.
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div ref={printRef} className="bg-white w-[595px] h-[900px] mx-auto p-8 overflow-auto shadow border border-gray-200 text-[10px] text-[#212121] font-sans">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="mt-4">
                        <h1 className="text-[22px] font-bold text-[#0F2A38]">EU DUE DILLIGENCE REPORT</h1>
                        <p className="text-[15px] text-[#F7A144]">for exported deforestation-free coffee</p>
                    </div>
                    <QRCode value={`Consignment ID: ${consignment.id}`} size={56} />
                </div>
                {/* Sections */}
                <Section title="A. Operator Information">
                    <FlexRow label="User ID:" value="U189" />
                    <FlexRow label="Name" value={consignment.exporter} />
                    <FlexRow label="Location" value="Kabarole, Uganda" />
                    <FlexRow label="Email" value="coffeeworld@gmail.com" />
                    <FlexRow label="UCDA Export Permit Number" value="UCDA/EXP/0653/2025" />
                </Section>

                <Section title="B. Consignment Overview">
                    <FlexRow label="Consignment ID" value={consignment.id} />
                    <FlexRow label="Product Type" value="Green Coffee beans" />
                    <FlexRow label="HS Code" value={consignment.hsCode} />
                    <FlexRow label="Trade Name" value={consignment.tradeName} />
                    <FlexRow label="Export Volume" value={consignment.exportVolume} />
                    <FlexRow label="Country of production:" value={consignment.country} />
                    <FlexRow label="Destination country" value={consignment.destination} />
                    <FlexRow label="Export Date" value={consignment.exportDate} />
                    <FlexRow label="Batches" value={consignment.batches[0].weight} />
                    {/* <FlexRow label="Shipping Details" value={consignment.shippindDetails} /> */}
                </Section>

                <Section title="C. Origin Information">
                    <FlexRow label="Country of production:" value={consignment.country} />
                    {/* <FlexRow label="Harvest Period" value={consignment.batches[0].date} /> */}
                    <FlexRow label="Farms" value={`${consignment.farmCount}`} />

                    <Table headers={["Batch ID", "Geo", "QR Code"]} rows={
                        consignment.batches.map((batch) => [
                            batch.batchId,
                            batch.geo,
                            <QRCode size={32} value={batch.qr} />,
                        ])
                    } />
                </Section>

                <Section title="D. Suppliers">
                    <Subheading>1. Farmers (Tier 1 Suppliers)</Subheading>
                    <Table headers={["Farmer ID", "Name", "Address", "Email", "Batch ID"]} rows={
                        consignment.farmers.map((farmer) => [
                            farmer.id,
                            farmer.name,
                            farmer.address,
                            farmer.email,
                            consignment.batches[0].batchId,
                        ])
                    } />
                    <Subheading>2. Processors (Intermediary Suppliers)</Subheading>
                    <Table headers={["Processor ID", "Name", "Address", "Email", "Batch ID"]} rows={
                        consignment.processors.map((proc) => [
                            proc.id,
                            proc.name,
                            proc.address,
                            proc.email,
                            consignment.batches[0].batchId,
                        ])
                    } />
                </Section>

                <Section title="E. Certifications">
                    <ul className="list-disc pl-6">
                        <li>Organic (UG-CERT)</li>
                        <li>Fairtrade Certified</li>
                        <li>Rainforest Alliance (RA-UG-0092)</li>
                    </ul>
                    <div className="flex items-center gap-3 border border-gray-300 p-3 rounded-md bg-gray-50 w-fit mt-2">
                        <img src="/images/image-placeholder.svg" alt="file" className="w-5 h-5" />
                        <span>{consignment.attachment || "origin_shipment.png"}</span>
                        <Button className="bg-[#0F2A38] text-white text-xs px-3 py-1">Download</Button>
                    </div>
                </Section>

                <Section title="F. Compliance declaration">
                    <ul className="list-disc pl-6">
                        <li>Deforestation-Free: All farms verified deforestation-free post-2020 by UCDA, per risk assessment. No forest conversion detected (Global Forest Watch).</li>
                        <li>Legal Compliance: All batches comply with GDPR and Uganda’s Coffee Regulations 2021, land use rights, and labor laws, per UCDA verification and supplier questionnaires.</li>
                    </ul>
                </Section>

                <Section title="G. Risk Assessment and mitigation">
                    <div className="mb-2">
                        <strong>Risk Assessment</strong>
                        <ul className="list-disc pl-6 mt-1">
                            <li>Country Risk: Uganda, standard risk.</li>
                            <li>Deforestation: Low risk, no forest cover on farms (Global Forest Watch).</li>
                            <li>Legality: Low risk, UCDA compliance verified.</li>
                            <li>Supplier Risk: Low, all suppliers completed EUDR questionnaires (Annex 1).</li>
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
                    <Table headers={["Batch", "Transaction Hash", "Timestamp"]} rows={
                        consignment.blockchain.map((b) => [
                            b.batch,
                            b.txHash,
                            b.timestamp,
                        ])
                    } />
                    <p className="italic text-[8px] text-gray-600 mt-2">
                        Data stored on blockchain. Immutable records, retained per EUDR Article 12.
                    </p>
                </Section>

                <p className="text-center text-[8px] italic text-gray-500 mt-4">Generated by Coffichain Traceability Solution</p>
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

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-4">
        <h2 className="font-bold text-[#F7A144] text-[14px] mb-1">{title}</h2>
        <div>{children}</div>
    </section>
);

const Subheading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="font-semibold text-[11px] mb-1">{children}</h3>
);

const Table = ({ headers, rows }: { headers: string[]; rows: (string | JSX.Element)[][] }) => (
    <table className="w-full border text-[10px] mb-2">
        <thead className="bg-gray-100">
            <tr>{headers.map((h) => <th key={h} className="p-1 border">{h}</th>)}</tr>
        </thead>
        <tbody>
            {rows.map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j} className="p-1 border">{cell}</td>)}</tr>
            ))}
        </tbody>
    </table>
);

const FlexRow = ({ label, value }: { label: string; value: string }) => (

    <p className="flex justify-between my-1"> <span className="font-semibold">{label}</span> <span className="text-right">{value}</span> </p>);
