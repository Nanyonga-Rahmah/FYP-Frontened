// types.ts - Shared type definitions for the coffee traceability application

// Basic Farm information
export interface Farm {
  _id: string;
  numberofTrees: number;
  farmName: string;
  location: string;
  latitude: number;
  longitude: number;
  farmSize: number;
  cultivationMethods: string[];
  certifications: string[];
  yearEstablished: string;
}

// Harvest information
export interface Harvest {
  harvestPeriod: {
    start: string;
    end: string;
  };
  plantingPeriod: {
    start: string;
    end: string;
  };
  _id: string;
  coffeeVariety: string;
  weight: number;
  farm: Farm;
  cultivationMethods: string[];
  certifications: string[];
}

// Processing details
export interface ProcessingDetails {
  processingStartDate: string | null;
  processingEndDate: string | null;
  outputWeight: number | null;
  processingNotes: string | null;
  dryingMethod: string;
  grading: string;
  certification: string | null;
  processedCoffeeImages: string[];
}

// Basic user information
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Batch information
export interface Batch {
  processingDetails: ProcessingDetails;
  _id: string;
  batchId: string;
  farmerId: User;
  harvestIds: Harvest[];
  totalWeight: number;
  submissionDate: string;
  dataHash: string;
  processorId: User;
  numberOfBagsReceived: number;
  dateReceived: string;
  receiptNotes: string;
  exporterId: User | null;
  exportApproval: string | null;
  rejectionReason: string | null;
  documents: any[];
  status: string;
  blockchainTxHash: string;
  processorBlockchainTxHash: string | null;
  blockchainStatus: string;
  processorBlockchainStatus: string | null;
  qrCodeUrl: string;
  qrCodeImageUrl: string;
  isDeleted: boolean;
  consignmentId: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Lot information
export interface Lot {
  _id: string;
  lotId: string;
  processorId: User;
  batchIds: Batch[];
  totalOutputWeight: number;
  exporterFacility: string;
  comments: string;
  dataHash: string;
  blockchainTxHash: string;
  blockchainStatus: string;
  status: string;
  qrCodeUrl: string;
  qrCodeImageUrl: string;
  isDeleted: boolean;
  creationDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  dateReceived: string;
  exporterId: User;
  receiptNotes: string;
  receivedWeight: number;
  consignmentId: string;
}

// Consignment information
export interface Consignment {
  _id: string;
  consignmentId: string;
  exporterId: User;
  lotIds: Lot[];
  totalWeight: number;
  destinationCountry: string;
  destinationPort: string;
  exportDate: string;
  shippingMethod: string;
  notes: string;
  dataHash: string;
  blockchainTxHash: string;
  blockchainStatus: string;
  qrCodeUrl: string;
  qrCodeImageUrl: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// API response for consignment
export interface ConsignmentResponse {
  success: boolean;
  consignment: Consignment;
}

// Due Diligence Report Types

// Consignment overview in due diligence report
export interface ConsignmentOverview {
  consignmentId: string;
  totalWeight: number;
  destinationCountry: string;
  destinationPort: string;
  exportDate: string;
  shippingMethod: string;
  notes: string;
  qrCodeUrl: string;
}

// Exporter information in due diligence report
export interface ExporterInformation {
  name: string;
  email: string;
}

// Processor information in due diligence report
export interface ProcessorInfo {
  name: string;
  email: string;
}

// Farmer information in due diligence report
export interface FarmerInfo {
  name: string;
  email: string;
}

// Farm information in due diligence report
export interface FarmInfo {
  farmName: string;
  location: string;
  coordinates: [number, number];
  farmSize: number;
  numberofTrees: number;
  cultivationMethods: string[];
  certifications: string[];
  yearEstablished: string;
}

// Harvest information in due diligence report
export interface HarvestInfo {
  coffeeVariety: string;
  weight: number;
  harvestPeriod: {
    start: string;
    end: string;
  };
  plantingPeriod: {
    start: string;
    end: string;
  };
  cultivationMethods: string[];
  certifications: string[];
  farm: FarmInfo;
}

// Processing information in due diligence report
export interface ProcessingInfo {
  dryingMethod: string;
  grading: string;
  outputWeight: number | null;
  processor: ProcessorInfo;
}

// Receipt details in due diligence report
export interface ReceiptDetails {
  receivedWeight: number;
  dateReceived: string;
  receiptNotes: string;
}

// Blockchain information in due diligence report
export interface BlockchainInfo {
  txHash: string;
  status: string;
}

// Batch information in due diligence report
export interface BatchInfo {
  batchId: string;
  totalWeight: number;
  farmer: FarmerInfo;
  harvests: HarvestInfo[];
  processingDetails: ProcessingInfo;
}

// Lot information in due diligence report
export interface LotInfo {
  lotId: string;
  totalOutputWeight: number;
  exporterFacility: string;
  receiptDetails: ReceiptDetails;
  processor: ProcessorInfo;
  batches: BatchInfo[];
  blockchain: BlockchainInfo;
}

// Due diligence report
export interface DueDiligenceReport {
  consignmentOverview: ConsignmentOverview;
  exporterInformation: ExporterInformation;
  lots: LotInfo[];
  blockchain: BlockchainInfo;
  generatedAt: string;
}

// API response for due diligence report
export interface DueDiligenceResponse {
  success: boolean;
  report: DueDiligenceReport;
}

// Types for the legacy due diligence report PDF format
export interface BatchForPDF {
  batchId: string;
  farmName: string;
  location: string;
  weight: string;
  qr: string;
  geo: string;
}

export interface FarmerForPDF {
  id: string;
  name: string;
  address: string;
  email: string;
  batchId: string;
}

export interface ProcessorForPDF {
  id: string;
  name: string;
  address: string;
  email: string;
  batchId: string;
}

export interface BlockchainEntryForPDF {
  batch: string;
  txHash: string;
  timestamp: string;
}

export interface LegacyConsignment {
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
  batches: BatchForPDF[];
  farmers: FarmerForPDF[];
  processors: ProcessorForPDF[];
  blockchain: BlockchainEntryForPDF[];
}

// Location state types
export interface ConsignmentLocationState {
  consignment?: LegacyConsignment;
  report?: DueDiligenceReport;
}
