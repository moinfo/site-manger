export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'accountant' | 'viewer';
    email_verified_at?: string;
}

export interface Project {
    id: number;
    name: string;
    location: string | null;
    start_date: string | null;
    end_date: string | null;
    budget: number;
    status: 'active' | 'completed' | 'on_hold';
    total_spent?: number;
    total_received?: number;
    created_at: string;
}

export interface Material {
    id: number;
    project_id: number;
    date: string;
    description: string;
    quantity: number;
    unit: string | null;
    unit_price: number;
    subtotal: number;
    category: string;
    recorded_by: number | null;
    project?: Project;
    recorder?: User;
    created_at: string;
}

export interface Subcontractor {
    id: number;
    name: string;
    phone: string | null;
    notes: string | null;
    contracts?: Contract[];
    total_billed?: number;
    total_paid?: number;
    balance?: number;
    created_at: string;
}

export interface Contract {
    id: number;
    subcontractor_id: number;
    project_id: number;
    description: string;
    billed_amount: number;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    subcontractor?: Subcontractor;
    project?: Project;
    payments?: Payment[];
    total_paid?: number;
    balance?: number;
    created_at: string;
}

export interface Payment {
    id: number;
    contract_id: number;
    date: string;
    amount: number;
    notes: string | null;
    recorded_by: number | null;
    contract?: Contract;
    recorder?: User;
    created_at: string;
}

export interface CashInflow {
    id: number;
    project_id: number;
    date: string;
    source: string;
    amount: number;
    notes: string | null;
    recorded_by: number | null;
    project?: Project;
    recorder?: User;
    created_at: string;
}

export interface ChargeCategory {
    id: number;
    name: string;
}

export interface FinancialCharge {
    id: number;
    project_id: number;
    charge_category_id: number;
    date: string;
    amount: number;
    description: string;
    recorded_by: number | null;
    project?: Project;
    category?: ChargeCategory;
    created_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};
