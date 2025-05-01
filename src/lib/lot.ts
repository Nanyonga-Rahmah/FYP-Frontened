// types/lot.ts
export type LotStatus =
  | "created"
  | "export_approved"
  | "export_rejected"
  | "exported";

export interface Farm {
  name: string;
  size: number;
  location: string;
  trees: number;
  established: number | string;
}

export interface Batch {
  batchId: string;
  varieties: string[];
  weight: number;
  location: string;
  deliveredDate: string;
}

export interface TimelineEvent {
  type: "created" | "exported" | "approved";
  user: string;
  userId: string | null;
  date: string;
}

export interface ConsignmentDetails {
  consignmentId: string;
  destinationCountry: string;
  destinationPort: string;
  shippingMethod: string;
  exportDate: string;
  notes: string | null;
}

export interface ExporterInfo {
  receivedWeight: number;
  dateReceived: string | null;
  receiptNotes: string | null;
  exporterName: string;
  consignment: ConsignmentDetails | null;
}

export interface LotDetails {
  lotId: string;
  status: LotStatus;
  submittedDate: string;
  varieties: string[];
  totalWeight: number;
  processorName: string;
  exporterFacility: string;
  comments: string | null;
  batches: Batch[];
  batchCount: number;
  farms: Farm[];
}

export interface LotData {
  lotDetails: LotDetails;
  exporterInfo: ExporterInfo | null;
  timelineEvents: TimelineEvent[];
}

export interface LotResponse {
  success: boolean;
  lot: LotData;
}
