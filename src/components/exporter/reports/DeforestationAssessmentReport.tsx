import React from "react";

function DeforestationAssessmentReport() {
  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <section className="mb-6">
      <h2 className="text-[#0F2A38] font-semibold text-[13px] mb-1">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );

  const StatusBadge = ({ label, type }: { label: string; type: "green" | "red" | "yellow" }) => {
    const colors = {
      green: "bg-green-500",
      red: "bg-red-500",
      yellow: "bg-yellow-400",
    };

    return (
      <span
        className={`px-2 py-0.5 text-white text-[10px] rounded-full font-medium ${colors[type]}`}
      >
        {label}
      </span>
    );
  };

  const StatusTable = () => {
    const rows = [
      {
        name: "Mary’s Farm",
        geolocation: "1.234567, 32.567890\n1.234567, 32.567890",
        address: "Kampala",
        status: "Deforestation-free",
        statusType: "green",
        date: "Nov 30, 2026",
      },
      {
        name: "Mary’s Farm",
        geolocation: "1.234567, 32.567890\n1.234567, 32.567890",
        address: "Kampala",
        status: "Deforestation-free",
        statusType: "green",
        date: "Nov 30, 2026",
      },
      {
        name: "Mary’s Farm",
        geolocation: "1.234567, 32.567890\n1.234567, 32.567890",
        address: "Kampala",
        status: "Affected",
        statusType: "red",
        date: "Nov 30, 2026",
      },
    ];

    return (
      <table className="w-full border border-gray-300 text-[10px] mt-2 rounded-sm">
        <thead className="bg-gray-100 text-[#0F2A38]">
          <tr>
            <th className="border px-2 py-1">Farm name</th>
            <th className="border px-2 py-1">Farm geolocation</th>
            <th className="border px-2 py-1">Address</th>
            <th className="border px-2 py-1">Deforestation status</th>
            <th className="border px-2 py-1">Last checked</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{r.name}</td>
              <td className="border px-2 py-1 whitespace-pre-wrap">
                {r.geolocation}
              </td>
              <td className="border px-2 py-1">{r.address}</td>
              <td className="border px-2 py-1">
                <StatusBadge label={r.status} type={r.statusType as any} />
              </td>
              <td className="border px-2 py-1">{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const RiskTable = () => {
    const rows = [
      {
        name: "Mary’s Farm",
        address: "Kampala",
        risk: "High risk",
        riskType: "green",
        reason: "Close to an area of deforestation",
      },
      {
        name: "Mary’s Farm",
        address: "Kampala",
        risk: "Low risk",
        riskType: "red",
        reason: "No recent deforestation nearby",
      },
      {
        name: "Mary’s Farm",
        address: "Kampala",
        risk: "Mid risk",
        riskType: "yellow",
        reason: "Close to an area of deforestation",
      },
    ];

    return (
      <table className="w-full border border-gray-300 text-[10px] mt-2 rounded-sm">
        <thead className="bg-gray-100 text-[#0F2A38]">
          <tr>
            <th className="border px-2 py-1">Farm name</th>
            <th className="border px-2 py-1">Address</th>
            <th className="border px-2 py-1">Deforestation risk level</th>
            <th className="border px-2 py-1">Risk factors</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{r.name}</td>
              <td className="border px-2 py-1">{r.address}</td>
              <td className="border px-2 py-1">
                <StatusBadge label={r.risk} type={r.riskType as any} />
              </td>
              <td className="border px-2 py-1">{r.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div
      id="deforestation-report-pdf"
      className="w-[595px] h-[900px] px-10 py-12 bg-white text-[#0F2A38] text-sm font-sans"
    >
      <Section title="C. Deforestation status">
        <div className="flex justify-between text-[11px] mb-1">
          <p>Country of production</p>
          <p className="font-semibold">Uganda</p>
        </div>
        <div className="flex justify-between text-[11px] mb-2">
          <p>Farms</p>
          <p className="font-semibold">80</p>
        </div>
        {StatusTable()}
      </Section>

      <Section title="D. Deforestation risk">
        {RiskTable()}
        <p className="italic text-gray-600 text-[9px] mt-2">
          Data is stored on blockchain. Immutable records, 5-year retention, per EUDR Article 12.
        </p>
      </Section>

      <p className="text-center text-[9px] italic text-gray-500 mt-6">
        Generated by Coffichain Traceability Solution
      </p>
    </div>
  );
}

export default DeforestationAssessmentReport;
