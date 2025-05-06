import { MoreHorizontal } from "lucide-react";

interface Report {
  id: string;
  name: string;
  consignmentId: string;
  type: string;
  generatedOn: string;
}

interface Props {
  reports: Report[];
}

function ExporterReportsTable({ reports }: Props) {
  return (
    <div className="w-full rounded-md overflow-hidden border border-gray-200">
      <table className="w-full text-sm bg-white">
        <thead className="bg-[#F9FAFB] text-[#5C6474] border-b border-gray-200">
          <tr>
            <th className="text-left px-6 py-3 font-medium">Report name</th>
            <th className="text-left px-6 py-3 font-medium">Consignment ID</th>
            <th className="text-left px-6 py-3 font-medium">Report type</th>
            <th className="text-left px-6 py-3 font-medium">Generated on</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>

        <tbody className="text-[#222]">
          {reports.map((report) => (
            <tr
              key={report.id}
              className="border-t border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="px-6 py-4 font-normal">{report.name}</td>
              <td className="px-6 py-4">{report.consignmentId}</td>
              <td className="px-6 py-4">{report.type}</td>
              <td className="px-6 py-4">{report.generatedOn}</td>
              <td className="px-6 py-4 relative">
                <div className="relative">
                  <button
                    onClick={() => {
                      const allMenus =
                        document.querySelectorAll('[id^="report-menu-"]');
                      allMenus.forEach((menu) => menu.classList.add("hidden"));
                      const current = document.getElementById(
                        `report-menu-${report.id}`
                      );
                      if (current) {
                        current.classList.remove("hidden");
                        setTimeout(() => current.classList.add("hidden"), 5000);
                      }
                    }}
                    className="p-2 rounded bg-white hover:bg-gray-100 focus:outline-none"
                  >
                    <MoreHorizontal className="w-5 h-5 text-black" />
                  </button>

                  <div
                    id={`report-menu-${report.id}`}
                    className="absolute right-0 mt-2 z-10 hidden bg-white border border-gray-200 rounded shadow-md w-36"
                  >
                    <div
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => console.log("View report:", report)}
                    >
                      View
                    </div>
                    <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                      Download
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExporterReportsTable;
