export interface DriverFormData {
    firstName: string;
    lastName: string;
    licenseNumber: string;
    issuingCountry: string;
    licenseCategory: string;
    vehicleMakeModelYear: string;
    vehicleRegistrationNumber: string;
    vehicleType: string;
    insuranceNumber: string;
    insuranceExpiry: string;
    drivingExperience: string;
    insuranceProof: File | null;
}

export interface DecodedToken {
    id: number;
    userId: number;
}
