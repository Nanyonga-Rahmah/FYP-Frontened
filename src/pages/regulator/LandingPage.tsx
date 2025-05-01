import Header from "@/components/globals/regulator/Header";
import Footer from "@/components/globals/Footer";
import { Link } from "react-router-dom";

function CoffichainLandingPage() {
  return (
    <div className="bg-white text-[#0F2A38]">
      <Header />

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center px-6 sm:px-8 md:px-12 lg:px-[7.5rem] py-20 min-h-screen flex items-center"
        style={{ backgroundImage: "url('/images/hero.png')" }}
      >
        <div className="max-w-2xl">
          <h1 className="text-white text-4xl sm:text-5xl font-bold mb-6 leading-snug">
            Trace Coffee. Ensure <br /> EUDR-Compliant Exports.
          </h1>
          <p className="text-white text-base sm:text-lg mb-8">
            A complete traceability platform that helps you collect, verify, and report deforestation-free coffee data—secure, auditable, and ready for EU markets.
          </p>
          <Link
            to="/signup"
            className="bg-[#EDB544] text-white px-6 py-3 rounded-md font-medium text-sm"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Content Wrapper */}
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 md:px-12 lg:px-[7.5rem] space-y-24 py-20">

        {/* Why Section */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Why Coffichain</h2>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            Uganda, as one of Africa’s top coffee exporters, faces an urgent challenge with the upcoming enforcement of the EU Deforestation Regulation (EUDR) beginning on 30 December 2024. This law requires that all coffee exported to the EU must be free from deforestation or forest degradation after 31 December 2020 and must comply with all applicable national laws in the country of production.
            <br /><br />
            To meet these standards, exporters must submit accurate geolocation data, verify supply chain activities, and provide a Due Diligence Statement for every consignment. Yet, most smallholder farmers and exporters in Uganda lack the tools and systems to meet these complex requirements.
            <br /><br />
            CoffiChain was created to bridge this gap—offering a trusted, digital platform to collect, track, and report traceability data, ensuring that Uganda’s coffee remains export-ready, compliant, and competitive in global markets.
          </p>
        </section>

        {/* Features Section */}
        <section className="space-y-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">A scalable, all-in-one solution for EUDR compliance</h2>

          {/* Feature Blocks */}
          {[
            {
              title: "End-to-end traceability for every batch",
              desc: "Batch-level traceability using standardized data exchange to ensure regulatory compliance from farm to market.",
              image: "/images/all-in-one.png",
              reverse: false,
            },
            {
              title: "Unified farm location data",
              desc: "Capture and manage EUDR data—like farm GPS points or polygons—in one centralized platform.",
              image: "/images/unified-location.png",
              reverse: true,
            },
            {
              title: "Generate compliance reports effortlessly",
              desc: "Easily generate Due Diligence Statements (DDS) and deforestation-free assessments for EUDR compliance.",
              image: "/images/compliance-reports.png",
              reverse: false,
            },
          ].map(({ title, desc, image, reverse }, i) => (
            <div
              key={i}
              className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-5 min-h-[360px]`}
            >
              <img
                src={image}
                alt={title}
                className="w-full md:w-[50%] h-full object-cover rounded-md"
              />
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-2xl sm:text-3xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-700 text-base sm:text-lg">{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Benefits Section */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Benefits of Coffichain</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                icon: "/images/benefit-farmer.png",
                title: "Farmers",
                desc: "Record and verify farm and harvest data. Build credibility with geotagged and compliant records.",
              },
              {
                icon: "/images/benefit-exporters.png",
                title: "Exporters",
                desc: "Generate Due Diligence Statements (DDS). Track deforestation risk. Gain trust from EU buyers through verifiable proof.",
              },
              {
                icon: "/images/benefit-uganda.png",
                title: "Uganda",
                desc: "Protect market share in the EU. Strengthen national integrity with a compliant system.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-md shadow-sm text-center">
                <img src={item.icon} alt={item.title} className="h-10 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-700 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance Callout */}
        <section className="flex flex-col md:flex-row items-center gap-10 min-h-[400px]">
          <div className="md:w-1/2">
            <h3 className="text-2xl sm:text-3xl font-semibold mb-4">Locally verified, legally compliant</h3>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              CoffiChain simplifies EUDR compliance by ensuring all coffee exported from Uganda is deforestation-free after 31 December 2020 and fully adheres to national laws on land use, environmental protection, and sustainable farming.
              <br /><br />
              Through integrations with MAAIF, extension officers verify farm data, oversee registrations, and help regulate other actors in the coffee chain of custody. This makes compliance seamless, verifiable, and secure—right from the farm to export.
            </p>
          </div>
          <img
            src="/images/locally-verified.png"
            alt="Verification"
            className="md:w-1/2 w-full h-full object-cover rounded-md"
          />
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default CoffichainLandingPage;
