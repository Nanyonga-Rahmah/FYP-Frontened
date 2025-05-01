import Header from "@/components/globals/regulator/Header";
import Footer from "@/components/globals/Footer";

// ✅ Single-row stacked label-value
const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between text-sm text-gray-700 py-0.5">
        <span className="text-left">{label}</span>
        <span className="text-right font-medium">{value}</span>
    </div>
);

function QRScanTraceabilityPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-grow px-8 md:px-32 py-16 max-w-[900px] mx-auto">
                <h2 className="text-center text-2xl font-medium text-[#0F2A38] mb-1">
                    Coffee Batch Traceability Report
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Accessed: April 19, 2025
                </p>

                <hr className="border-t border-gray-300 mb-8" />

                <h3 className="text-center text-xl font-semibold text-[#0F2A38] mb-8">
                    BATCH-74839-KY
                </h3>

                {/* Section A */}
                <section className="mb-10 space-y-1">
                    <h4 className="font-bold text-[#0F2A38] mb-2">A. Batch identification</h4>
                    <InfoRow label="Batch ID:" value="BH-248-X49" />
                    <InfoRow label="Traceability Code:" value="QD-8PL-218" />
                    <InfoRow label="QR Code Created on:" value="Mar 1, 2025" />
                    <InfoRow label="Harvest period:" value="March - May 2025" />
                    <InfoRow label="Volume:" value="13 bags/800kg" />
                    <InfoRow label="Exported to:" value="Germany" />
                    <InfoRow label="Exported on:" value="12, 2025" />
                </section>

                {/* Section B */}
                <section className="mb-10 space-y-1">
                    <h4 className="font-bold text-[#0F2A38] mb-2">B. Farm details</h4>
                    <InfoRow label="Farm name:" value="Mary’s Plot" />
                    <InfoRow label="Farm location:" value="Makole, Uganda" />
                    <InfoRow label="Farm size:" value="1.2 acres" />
                    <InfoRow label="Year started:" value="2018" />
                    <InfoRow label="Cultivation methods:" value="Organic, Agroforestry" />
                    <InfoRow label="Certifications:" value="EUDR, Rainforest Alliance" />
                    <InfoRow label="Farmer name:" value="Mary Nantongo" />
                    <InfoRow label="Phone number:" value="+256709091035" />
                    <InfoRow label="Email address:" value="naryanantongo92@gmail.com" />

                    <div className="mt-10 pt-10">
                        <img
                            src="/images/scan-image.png"
                            alt="Farm Map"
                            className="rounded-md w-full shadow-md"
                        />
                        <p className="text-xs text-gray-500 text-center mt-1 italic">
                            Mary’s Plot – Makole, Uganda
                        </p>
                    </div>
                </section>

                {/* Section C – Processing */}
                <section className="mb-10 space-y-1">
                    <h4 className="font-bold text-[#0F2A38] mb-2">C. Processing details</h4>
                    <InfoRow label="Processor Name:" value="Coffee World Ltd" />
                    <InfoRow label="Facility location:" value="Mbale, Uganda" />
                    <InfoRow label="Phone number:" value="+256709091035" />
                    <InfoRow label="Email address:" value="naryanantongo92@gmail.com" />
                    <InfoRow label="Processed period:" value="Nov 28 - Dec 12, 2025" />
                    <InfoRow label="Destination country:" value="Germany" />
                    <InfoRow label="Lot ID:" value="LP-248-X49" />
                    <InfoRow label="Consignment ID:" value="CON-248-X49" />
                </section>

                {/* Section C – Export */}
                <section className="mb-10 space-y-1">
                    <h4 className="font-bold text-[#0F2A38] mb-2">C. Export details</h4>
                    <InfoRow label="Exporter Name:" value="Coffee World Ltd" />
                    <InfoRow label="Facility location:" value="Mbale, Uganda" />
                    <InfoRow label="Email address:" value="naryanantongo92@gmail.com" />
                    <InfoRow label="Export date:" value="May 2, 2025" />
                    <InfoRow label="Destination country:" value="Germany" />
                    <InfoRow label="Lot ID:" value="LP-248-X49" />
                    <InfoRow label="Consignment ID:" value="CON-248-X49" />
                </section>

                {/* Section D */}
                <section className="mb-10">
                    <h4 className="font-bold text-[#0F2A38] mb-2">D. Compliance</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        <span className="font-bold">   EUDR: </span>Farm #123 verified deforestation-free post-2020 by UCDA. <br />
                        <span className="font-bold">   Legal: </span>Complies with GDPR, Uganda’s Data Protection Act. <br />
                        <span className="font-bold">   Blockchain: </span>Data immutable, Reference ID: <span className="font-medium">CON-248-X49</span>.<br /><br /> <span className="font-bold">            This information is retained for a period of 5 years from May 1, 2025 as outlined in Article 7.4.1 of the EUDR to facilitate audits and compliance checks by competent authorities.
                        </span>
                    </p>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default QRScanTraceabilityPage;
