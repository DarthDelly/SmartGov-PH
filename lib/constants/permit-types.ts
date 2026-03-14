export interface PermitType {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  requirements: string[];
  fee: string;
  processingDays: number;
}

export const PERMIT_TYPES: PermitType[] = [
  {
    id: "clearance",
    title: "Barangay Clearance",
    description:
      "Official certification confirming you have no pending complaints, violations, or unresolved issues within the barangay.",
    icon: "ShieldCheck",
    fee: "₱50.00",
    processingDays: 3,
    requirements: [
      "Duly accomplished application form",
      "Valid government-issued ID (e.g. PhilSys, Driver's License, Passport)",
      "Proof of residency (utility bill or barangay ID)",
      "Community Tax Certificate (Cedula)",
      "Payment of clearance fee",
      "No pending blotter record or unresolved complaint",
    ],
  },
  {
    id: "indigency",
    title: "Certificate of Indigency",
    description:
      "Certifies that a resident belongs to the low-income sector, required for scholarships, medical assistance, and government benefits.",
    icon: "HeartHandshake",
    fee: "Free",
    processingDays: 1,
    requirements: [
      "Duly accomplished application form",
      "Valid government-issued ID",
      "Proof of residency",
      "Certificate of No Income or latest ITR",
      "Endorsement from Purok Leader or Kagawad",
    ],
  },
  {
    id: "residency",
    title: "Residency Certificate",
    description:
      "Confirms that you are an official registered resident of the barangay, used for employment, enrollment, and legal transactions.",
    icon: "Home",
    fee: "₱30.00",
    processingDays: 1,
    requirements: [
      "Duly accomplished application form",
      "Valid government-issued ID",
      "Proof of residency (utility bill, lease contract, or deed of property)",
      "Community Tax Certificate (Cedula)",
      "Payment of certificate fee",
    ],
  },
  {
    id: "business",
    title: "Business Clearance",
    description:
      "Required for businesses operating within the barangay. Certifies compliance with local ordinances and community standards.",
    icon: "Briefcase",
    fee: "₱200.00",
    processingDays: 5,
    requirements: [
      "Duly accomplished application form",
      "DTI / SEC / CDA registration certificate",
      "Valid ID of business owner",
      "Proof of business address (contract of lease or title)",
      "Community Tax Certificate (Cedula)",
      "Payment of business clearance fee",
      "No pending barangay violations",
    ],
  },
  {
    id: "id",
    title: "Barangay ID Generation",
    description:
      "Official barangay-issued identification card for registered residents. Accepted as valid ID for local government transactions.",
    icon: "CreditCard",
    fee: "₱100.00",
    processingDays: 7,
    requirements: [
      "Duly accomplished registration form",
      "1 valid government-issued ID",
      "2 pcs 1×1 recent ID photo (white background)",
      "Proof of residency",
      "Community Tax Certificate (Cedula)",
      "Payment of ID fee",
    ],
  },
];
