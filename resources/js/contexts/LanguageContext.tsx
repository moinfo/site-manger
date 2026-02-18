import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ─── Translation Type ────────────────────────────────────────────
export interface Translations {
    nav: {
        dashboard: string;
        expenses: string;
        projects: string;
        subcontractors: string;
        cashFlow: string;
        charges: string;
        reports: string;
        users: string;
        importData: string;
        admin: string;
    };
    common: {
        save: string;
        cancel: string;
        delete: string;
        edit: string;
        view: string;
        filter: string;
        clear: string;
        search: string;
        actions: string;
        name: string;
        email: string;
        phone: string;
        date: string;
        notes: string;
        status: string;
        total: string;
        records: string;
        noDataYet: string;
        profile: string;
        logOut: string;
        downloadPdf: string;
        downloadExcel: string;
        success: string;
        error: string;
        password: string;
        confirmPassword: string;
        role: string;
        location: string;
        budget: string;
        siteManager: string;
        poweredBy: string;
        copyright: string;
    };
    auth: {
        welcomeBack: string;
        signInSubtitle: string;
        signIn: string;
        rememberMe: string;
        forgotPassword: string;
        emailLabel: string;
        passwordLabel: string;
        constructionProjectMgmt: string;
        nameLabel: string;
        registerTitle: string;
        register: string;
        alreadyRegistered: string;
        forgotPasswordTitle: string;
        forgotPasswordDesc: string;
        emailResetLink: string;
        confirmPasswordTitle: string;
        confirmPasswordDesc: string;
        confirm: string;
        verifyEmailTitle: string;
        verifyEmailDesc: string;
        verificationLinkSent: string;
        resendVerification: string;
        resetPasswordTitle: string;
        resetPassword: string;
    };
    dashboard: {
        title: string;
        spentThisMonth: string;
        totalSpent: string;
        totalReceived: string;
        cashBalance: string;
        monthlySpendingTrend: string;
        spendingByCategory: string;
        subcontractorBalances: string;
        recentExpenses: string;
        viewAll: string;
        billed: string;
        paid: string;
        balance: string;
    };
    expenses: {
        title: string;
        addExpense: string;
        editExpense: string;
        searchPlaceholder: string;
        allProjects: string;
        allCategories: string;
        from: string;
        to: string;
        description: string;
        category: string;
        project: string;
        qty: string;
        unit: string;
        price: string;
        subtotal: string;
        unitPriceTzs: string;
        noExpenses: string;
        deleteConfirm: string;
        saveExpense: string;
        updateExpense: string;
    };
    projects: {
        title: string;
        newProject: string;
        editProject: string;
        projectName: string;
        startDate: string;
        endDate: string;
        budgetTzs: string;
        spent: string;
        remaining: string;
        progress: string;
        noProjects: string;
        deleteConfirm: string;
        createProject: string;
        updateProject: string;
        viewAllExpenses: string;
        active: string;
        onHold: string;
        completed: string;
    };
    subcontractors: {
        title: string;
        addSubcontractor: string;
        editSubcontractor: string;
        totalBilled: string;
        totalPaid: string;
        balanceOwed: string;
        contracts: string;
        addContract: string;
        addPayment: string;
        recordPayment: string;
        workDescription: string;
        billedAmountTzs: string;
        amountTzs: string;
        noSubcontractors: string;
        deleteConfirm: string;
        update: string;
        pending: string;
        inProgress: string;
        completed: string;
    };
    cashFlow: {
        title: string;
        totalReceived: string;
        totalSpent: string;
        balance: string;
        monthlySummary: string;
        month: string;
        cashIn: string;
        cashOut: string;
        net: string;
        cashInflows: string;
        recordCashIn: string;
        recordCashReceived: string;
        source: string;
        sourcePlaceholder: string;
        amount: string;
        deleteConfirm: string;
    };
    reports: {
        title: string;
        monthlyExpenseReport: string;
        monthlyExpenseDesc: string;
        subcontractorSummary: string;
        subcontractorSummaryDesc: string;
        cashFlowStatement: string;
        cashFlowStatementDesc: string;
        viewReport: string;
        backToReports: string;
        grandTotal: string;
        monthTotal: string;
        contract: string;
        billed: string;
        paid: string;
        balance: string;
        projectStatement: string;
        projectStatementDesc: string;
        openingBalance: string;
        closingBalance: string;
        debit: string;
        credit: string;
        totalDebit: string;
        totalCredit: string;
        description: string;
        selectProject: string;
    };
    users: {
        title: string;
        addUser: string;
        editUser: string;
        createUser: string;
        updateUser: string;
        newPassword: string;
        newPasswordDesc: string;
        deleteConfirm: string;
        admin: string;
        manager: string;
        accountant: string;
        viewer: string;
    };
    import: {
        title: string;
        description: string;
        whatGetsImported: string;
        accountsSheets: string;
        subcontractorSheets: string;
        cashSheets: string;
        excelFile: string;
        choosePlaceholder: string;
        importButton: string;
    };
    charges: {
        title: string;
        addCharge: string;
        editCharge: string;
        categories: string;
        addCategory: string;
        categoryName: string;
        amount: string;
        description: string;
        deleteConfirm: string;
        deleteCategoryConfirm: string;
        categoryInUse: string;
        noCharges: string;
        allCategories: string;
        saveCharge: string;
        updateCharge: string;
        manageCategories: string;
    };
    profile: {
        title: string;
        profileInfo: string;
        profileInfoDesc: string;
        updatePassword: string;
        updatePasswordDesc: string;
        deleteAccount: string;
        deleteAccountDesc: string;
        deleteAccountConfirmTitle: string;
        deleteAccountConfirmDesc: string;
        emailUnverified: string;
        resendVerification: string;
        verificationSent: string;
        saved: string;
        currentPassword: string;
        newPassword: string;
    };
}

// ─── English ─────────────────────────────────────────────────────
const en: Translations = {
    nav: {
        dashboard: 'Dashboard',
        expenses: 'Expenses',
        projects: 'Projects',
        subcontractors: 'Subcontractors',
        cashFlow: 'Cash Flow',
        charges: 'Charges',
        reports: 'Reports',
        users: 'Users',
        importData: 'Import Data',
        admin: 'Admin',
    },
    common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        filter: 'Filter',
        clear: 'Clear',
        search: 'Search',
        actions: 'Actions',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        date: 'Date',
        notes: 'Notes',
        status: 'Status',
        total: 'Total',
        records: 'records',
        noDataYet: 'No data yet',
        profile: 'Profile',
        logOut: 'Log Out',
        downloadPdf: 'Download PDF',
        downloadExcel: 'Download Excel',
        success: 'Success',
        error: 'Error',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        role: 'Role',
        location: 'Location',
        budget: 'Budget',
        siteManager: 'Site Manager',
        poweredBy: 'Powered by',
        copyright: '\u00A9 2026 Wildedge Safaris Limited',
    },
    auth: {
        welcomeBack: 'Welcome back',
        signInSubtitle: 'Sign in to your account to continue',
        signIn: 'Sign in',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        constructionProjectMgmt: 'Construction Project Management',
        nameLabel: 'Name',
        registerTitle: 'Register',
        register: 'Register',
        alreadyRegistered: 'Already registered?',
        forgotPasswordTitle: 'Forgot Password',
        forgotPasswordDesc: 'Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.',
        emailResetLink: 'Email Password Reset Link',
        confirmPasswordTitle: 'Confirm Password',
        confirmPasswordDesc: 'This is a secure area of the application. Please confirm your password before continuing.',
        confirm: 'Confirm',
        verifyEmailTitle: 'Email Verification',
        verifyEmailDesc: 'Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn\'t receive the email, we will gladly send you another.',
        verificationLinkSent: 'A new verification link has been sent to the email address you provided during registration.',
        resendVerification: 'Resend Verification Email',
        resetPasswordTitle: 'Reset Password',
        resetPassword: 'Reset Password',
    },
    dashboard: {
        title: 'Dashboard',
        spentThisMonth: 'Spent This Month',
        totalSpent: 'Total Spent',
        totalReceived: 'Total Received',
        cashBalance: 'Cash Balance',
        monthlySpendingTrend: 'Monthly Spending Trend',
        spendingByCategory: 'Spending by Category',
        subcontractorBalances: 'Subcontractor Balances',
        recentExpenses: 'Recent Expenses',
        viewAll: 'View all',
        billed: 'Billed',
        paid: 'Paid',
        balance: 'Balance',
    },
    expenses: {
        title: 'Expenses',
        addExpense: '+ Add Expense',
        editExpense: 'Edit Expense',
        searchPlaceholder: 'Search description...',
        allProjects: 'All Projects',
        allCategories: 'All Categories',
        from: 'From',
        to: 'To',
        description: 'Description',
        category: 'Category',
        project: 'Project',
        qty: 'Qty',
        unit: 'Unit',
        price: 'Price',
        subtotal: 'Subtotal',
        unitPriceTzs: 'Unit Price (TZS)',
        noExpenses: 'No expenses found.',
        deleteConfirm: 'Delete this expense?',
        saveExpense: 'Save Expense',
        updateExpense: 'Update Expense',
    },
    projects: {
        title: 'Projects',
        newProject: 'New Project',
        editProject: 'Edit Project',
        projectName: 'Project Name',
        startDate: 'Start Date',
        endDate: 'End Date',
        budgetTzs: 'Budget (TZS)',
        spent: 'Spent',
        remaining: 'Remaining',
        progress: 'Progress',
        noProjects: 'No projects yet.',
        deleteConfirm: 'Delete this project?',
        createProject: 'Create Project',
        updateProject: 'Update Project',
        viewAllExpenses: 'View All Expenses',
        active: 'Active',
        onHold: 'On Hold',
        completed: 'Completed',
    },
    subcontractors: {
        title: 'Subcontractors',
        addSubcontractor: '+ Add Subcontractor',
        editSubcontractor: 'Edit Subcontractor',
        totalBilled: 'Total Billed',
        totalPaid: 'Total Paid',
        balanceOwed: 'Balance Owed',
        contracts: 'Contracts',
        addContract: '+ Add Contract',
        addPayment: '+ Add Payment',
        recordPayment: 'Record Payment',
        workDescription: 'Work Description',
        billedAmountTzs: 'Billed Amount (TZS)',
        amountTzs: 'Amount (TZS)',
        noSubcontractors: 'No subcontractors yet.',
        deleteConfirm: 'Delete?',
        update: 'Update',
        pending: 'Pending',
        inProgress: 'In Progress',
        completed: 'Completed',
    },
    cashFlow: {
        title: 'Cash Flow',
        totalReceived: 'Total Received',
        totalSpent: 'Total Spent',
        balance: 'Balance',
        monthlySummary: 'Monthly Summary',
        month: 'Month',
        cashIn: 'Cash In',
        cashOut: 'Cash Out',
        net: 'Net',
        cashInflows: 'Cash Inflows',
        recordCashIn: '+ Record Cash In',
        recordCashReceived: 'Record Cash Received',
        source: 'Source',
        sourcePlaceholder: 'e.g. Wildedge Safaris Ltd',
        amount: 'Amount',
        deleteConfirm: 'Delete?',
    },
    charges: {
        title: 'Financial Charges',
        addCharge: '+ Add Charge',
        editCharge: 'Edit Charge',
        categories: 'Categories',
        addCategory: '+ Add Category',
        categoryName: 'Category Name',
        amount: 'Amount (TZS)',
        description: 'Description',
        deleteConfirm: 'Delete this charge?',
        deleteCategoryConfirm: 'Delete this category?',
        categoryInUse: 'Cannot delete — category has charges.',
        noCharges: 'No charges found.',
        allCategories: 'All Categories',
        saveCharge: 'Save Charge',
        updateCharge: 'Update Charge',
        manageCategories: 'Manage Categories',
    },
    reports: {
        title: 'Reports',
        monthlyExpenseReport: 'Monthly Expense Report',
        monthlyExpenseDesc: 'Breakdown of all expenses by month and category.',
        subcontractorSummary: 'Subcontractor Summary',
        subcontractorSummaryDesc: 'All subcontractors with billed amounts, payments, and balances.',
        cashFlowStatement: 'Cash Flow Statement',
        cashFlowStatementDesc: 'Monthly cash in vs cash out with running balance.',
        viewReport: 'View Report',
        backToReports: 'Back to Reports',
        grandTotal: 'Grand Total',
        monthTotal: 'Month Total',
        contract: 'Contract',
        billed: 'Billed',
        paid: 'Paid',
        balance: 'Balance',
        projectStatement: 'Project Statement',
        projectStatementDesc: 'Full project ledger with opening balance, credits, debits, and closing balance.',
        openingBalance: 'Opening Balance',
        closingBalance: 'Closing Balance',
        debit: 'Debit',
        credit: 'Credit',
        totalDebit: 'Total Debit',
        totalCredit: 'Total Credit',
        description: 'Description',
        selectProject: 'Select a project to view statement',
    },
    users: {
        title: 'Users',
        addUser: '+ Add User',
        editUser: 'Edit User',
        createUser: 'Create User',
        updateUser: 'Update User',
        newPassword: 'New Password',
        newPasswordDesc: 'Leave blank to keep current password',
        deleteConfirm: 'Delete this user?',
        admin: 'Admin',
        manager: 'Manager',
        accountant: 'Accountant',
        viewer: 'Viewer',
    },
    import: {
        title: 'Import Data',
        description: 'Upload the ARUSHA SITE.xlsx file to import historical data. The system will map data from all sheets into the appropriate tables.',
        whatGetsImported: 'What gets imported:',
        accountsSheets: 'ACCOUNTS + WORKS sheets \u2192 Expenses',
        subcontractorSheets: 'baraka Doli + Baraka NJIRO \u2192 Subcontractors, Contracts, Payments',
        cashSheets: 'CASH IN - CASH OUT \u2192 Cash Inflows',
        excelFile: 'Excel File',
        choosePlaceholder: 'Choose .xlsx file',
        importButton: 'Import Data',
    },
    profile: {
        title: 'Profile',
        profileInfo: 'Profile Information',
        profileInfoDesc: "Update your account's profile information and email address.",
        updatePassword: 'Update Password',
        updatePasswordDesc: 'Ensure your account is using a long, random password to stay secure.',
        deleteAccount: 'Delete Account',
        deleteAccountDesc: 'Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.',
        deleteAccountConfirmTitle: 'Are you sure you want to delete your account?',
        deleteAccountConfirmDesc: 'Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.',
        emailUnverified: 'Your email address is unverified.',
        resendVerification: 'Click here to re-send the verification email.',
        verificationSent: 'A new verification link has been sent to your email address.',
        saved: 'Saved.',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
    },
};

// ─── Swahili ─────────────────────────────────────────────────────
const sw: Translations = {
    nav: {
        dashboard: 'Dashibodi',
        expenses: 'Matumizi',
        projects: 'Miradi',
        subcontractors: 'Wakandarasi',
        cashFlow: 'Mtiririko wa Pesa',
        charges: 'Gharama',
        reports: 'Ripoti',
        users: 'Watumiaji',
        importData: 'Ingiza Data',
        admin: 'Msimamizi',
    },
    common: {
        save: 'Hifadhi',
        cancel: 'Ghairi',
        delete: 'Futa',
        edit: 'Hariri',
        view: 'Angalia',
        filter: 'Chuja',
        clear: 'Safisha',
        search: 'Tafuta',
        actions: 'Vitendo',
        name: 'Jina',
        email: 'Barua pepe',
        phone: 'Simu',
        date: 'Tarehe',
        notes: 'Maelezo',
        status: 'Hali',
        total: 'Jumla',
        records: 'rekodi',
        noDataYet: 'Hakuna data bado',
        profile: 'Wasifu',
        logOut: 'Toka',
        downloadPdf: 'Pakua PDF',
        downloadExcel: 'Pakua Excel',
        success: 'Imefanikiwa',
        error: 'Hitilafu',
        password: 'Nywila',
        confirmPassword: 'Thibitisha Nywila',
        role: 'Jukumu',
        location: 'Mahali',
        budget: 'Bajeti',
        siteManager: 'Msimamizi wa Eneo',
        poweredBy: 'Imetengenezwa na',
        copyright: '\u00A9 2026 Wildedge Safaris Limited',
    },
    auth: {
        welcomeBack: 'Karibu tena',
        signInSubtitle: 'Ingia kwenye akaunti yako kuendelea',
        signIn: 'Ingia',
        rememberMe: 'Nikumbuke',
        forgotPassword: 'Umesahau nywila?',
        emailLabel: 'Barua pepe',
        passwordLabel: 'Nywila',
        constructionProjectMgmt: 'Usimamizi wa Miradi ya Ujenzi',
        nameLabel: 'Jina',
        registerTitle: 'Jisajili',
        register: 'Jisajili',
        alreadyRegistered: 'Tayari umesajiliwa?',
        forgotPasswordTitle: 'Umesahau Nywila',
        forgotPasswordDesc: 'Umesahau nywila yako? Hakuna shida. Tuambie barua pepe yako na tutakutumia kiungo cha kubadilisha nywila ambacho kitakuruhusu kuchagua nywila mpya.',
        emailResetLink: 'Tuma Kiungo cha Kubadilisha Nywila',
        confirmPasswordTitle: 'Thibitisha Nywila',
        confirmPasswordDesc: 'Hii ni eneo salama la programu. Tafadhali thibitisha nywila yako kabla ya kuendelea.',
        confirm: 'Thibitisha',
        verifyEmailTitle: 'Uthibitisho wa Barua Pepe',
        verifyEmailDesc: 'Asante kwa kujisajili! Kabla ya kuanza, tafadhali thibitisha barua pepe yako kwa kubonyeza kiungo tulichokutumia. Ikiwa hukupokea barua pepe, tutafurahi kukutumia nyingine.',
        verificationLinkSent: 'Kiungo kipya cha uthibitisho kimetumwa kwenye barua pepe uliyotoa wakati wa usajili.',
        resendVerification: 'Tuma Tena Barua ya Uthibitisho',
        resetPasswordTitle: 'Badilisha Nywila',
        resetPassword: 'Badilisha Nywila',
    },
    dashboard: {
        title: 'Dashibodi',
        spentThisMonth: 'Matumizi Mwezi Huu',
        totalSpent: 'Jumla Matumizi',
        totalReceived: 'Jumla Iliyopokelewa',
        cashBalance: 'Salio la Pesa',
        monthlySpendingTrend: 'Mwenendo wa Matumizi kwa Mwezi',
        spendingByCategory: 'Matumizi kwa Kategoria',
        subcontractorBalances: 'Salio za Wakandarasi',
        recentExpenses: 'Matumizi ya Hivi Karibuni',
        viewAll: 'Angalia yote',
        billed: 'Iliyodaiwa',
        paid: 'Iliyolipwa',
        balance: 'Salio',
    },
    expenses: {
        title: 'Matumizi',
        addExpense: '+ Ongeza Matumizi',
        editExpense: 'Hariri Matumizi',
        searchPlaceholder: 'Tafuta maelezo...',
        allProjects: 'Miradi Yote',
        allCategories: 'Kategoria Zote',
        from: 'Kuanzia',
        to: 'Hadi',
        description: 'Maelezo',
        category: 'Kategoria',
        project: 'Mradi',
        qty: 'Idadi',
        unit: 'Kipimo',
        price: 'Bei',
        subtotal: 'Jumla Ndogo',
        unitPriceTzs: 'Bei ya Kipimo (TZS)',
        noExpenses: 'Hakuna matumizi yaliyopatikana.',
        deleteConfirm: 'Futa matumizi haya?',
        saveExpense: 'Hifadhi Matumizi',
        updateExpense: 'Sasisha Matumizi',
    },
    projects: {
        title: 'Miradi',
        newProject: 'Mradi Mpya',
        editProject: 'Hariri Mradi',
        projectName: 'Jina la Mradi',
        startDate: 'Tarehe ya Kuanza',
        endDate: 'Tarehe ya Mwisho',
        budgetTzs: 'Bajeti (TZS)',
        spent: 'Imetumika',
        remaining: 'Iliyobaki',
        progress: 'Maendeleo',
        noProjects: 'Hakuna miradi bado.',
        deleteConfirm: 'Futa mradi huu?',
        createProject: 'Unda Mradi',
        updateProject: 'Sasisha Mradi',
        viewAllExpenses: 'Angalia Matumizi Yote',
        active: 'Inaendelea',
        onHold: 'Imesimamishwa',
        completed: 'Imekamilika',
    },
    subcontractors: {
        title: 'Wakandarasi',
        addSubcontractor: '+ Ongeza Mkandarasi',
        editSubcontractor: 'Hariri Mkandarasi',
        totalBilled: 'Jumla Iliyodaiwa',
        totalPaid: 'Jumla Iliyolipwa',
        balanceOwed: 'Deni Lililobaki',
        contracts: 'Mikataba',
        addContract: '+ Ongeza Mkataba',
        addPayment: '+ Ongeza Malipo',
        recordPayment: 'Rekodi Malipo',
        workDescription: 'Maelezo ya Kazi',
        billedAmountTzs: 'Kiasi cha Deni (TZS)',
        amountTzs: 'Kiasi (TZS)',
        noSubcontractors: 'Hakuna wakandarasi bado.',
        deleteConfirm: 'Futa?',
        update: 'Sasisha',
        pending: 'Inasubiri',
        inProgress: 'Inaendelea',
        completed: 'Imekamilika',
    },
    cashFlow: {
        title: 'Mtiririko wa Pesa',
        totalReceived: 'Jumla Iliyopokelewa',
        totalSpent: 'Jumla Matumizi',
        balance: 'Salio',
        monthlySummary: 'Muhtasari wa Mwezi',
        month: 'Mwezi',
        cashIn: 'Pesa Iliyoingia',
        cashOut: 'Pesa Iliyotoka',
        net: 'Faida',
        cashInflows: 'Pesa Zilizoingia',
        recordCashIn: '+ Rekodi Pesa Iliyoingia',
        recordCashReceived: 'Rekodi Pesa Iliyopokelewa',
        source: 'Chanzo',
        sourcePlaceholder: 'mfano Wildedge Safaris Ltd',
        amount: 'Kiasi',
        deleteConfirm: 'Futa?',
    },
    charges: {
        title: 'Gharama za Kifedha',
        addCharge: '+ Ongeza Gharama',
        editCharge: 'Hariri Gharama',
        categories: 'Kategoria',
        addCategory: '+ Ongeza Kategoria',
        categoryName: 'Jina la Kategoria',
        amount: 'Kiasi (TZS)',
        description: 'Maelezo',
        deleteConfirm: 'Futa gharama hii?',
        deleteCategoryConfirm: 'Futa kategoria hii?',
        categoryInUse: 'Haiwezi kufutwa — kategoria ina gharama.',
        noCharges: 'Hakuna gharama zilizopatikana.',
        allCategories: 'Kategoria Zote',
        saveCharge: 'Hifadhi Gharama',
        updateCharge: 'Sasisha Gharama',
        manageCategories: 'Simamia Kategoria',
    },
    reports: {
        title: 'Ripoti',
        monthlyExpenseReport: 'Ripoti ya Matumizi ya Mwezi',
        monthlyExpenseDesc: 'Uchambuzi wa matumizi yote kwa mwezi na kategoria.',
        subcontractorSummary: 'Muhtasari wa Wakandarasi',
        subcontractorSummaryDesc: 'Wakandarasi wote na madeni, malipo, na salio.',
        cashFlowStatement: 'Taarifa ya Mtiririko wa Pesa',
        cashFlowStatementDesc: 'Pesa iliyoingia na iliyotoka kwa mwezi pamoja na salio.',
        viewReport: 'Angalia Ripoti',
        backToReports: 'Rudi kwenye Ripoti',
        grandTotal: 'Jumla Kuu',
        monthTotal: 'Jumla ya Mwezi',
        contract: 'Mkataba',
        billed: 'Iliyodaiwa',
        paid: 'Iliyolipwa',
        balance: 'Salio',
        projectStatement: 'Taarifa ya Mradi',
        projectStatementDesc: 'Leja kamili ya mradi na salio la kufungua, mikopo, madeni, na salio la kufunga.',
        openingBalance: 'Salio la Kufungua',
        closingBalance: 'Salio la Kufunga',
        debit: 'Deni',
        credit: 'Mkopo',
        totalDebit: 'Jumla Deni',
        totalCredit: 'Jumla Mkopo',
        description: 'Maelezo',
        selectProject: 'Chagua mradi kuangalia taarifa',
    },
    users: {
        title: 'Watumiaji',
        addUser: '+ Ongeza Mtumiaji',
        editUser: 'Hariri Mtumiaji',
        createUser: 'Unda Mtumiaji',
        updateUser: 'Sasisha Mtumiaji',
        newPassword: 'Nywila Mpya',
        newPasswordDesc: 'Acha tupu kutunza nywila ya sasa',
        deleteConfirm: 'Futa mtumiaji huyu?',
        admin: 'Msimamizi',
        manager: 'Meneja',
        accountant: 'Mhasibu',
        viewer: 'Mtazamaji',
    },
    import: {
        title: 'Ingiza Data',
        description: 'Pakia faili la ARUSHA SITE.xlsx kuingiza data ya zamani. Mfumo utapanga data kutoka kwenye kurasa zote kwenye jedwali husika.',
        whatGetsImported: 'Kinachoingia:',
        accountsSheets: 'ACCOUNTS + WORKS \u2192 Matumizi',
        subcontractorSheets: 'baraka Doli + Baraka NJIRO \u2192 Wakandarasi, Mikataba, Malipo',
        cashSheets: 'CASH IN - CASH OUT \u2192 Pesa Zilizoingia',
        excelFile: 'Faili la Excel',
        choosePlaceholder: 'Chagua faili la .xlsx',
        importButton: 'Ingiza Data',
    },
    profile: {
        title: 'Wasifu',
        profileInfo: 'Taarifa za Wasifu',
        profileInfoDesc: 'Sasisha taarifa za wasifu na barua pepe ya akaunti yako.',
        updatePassword: 'Sasisha Nywila',
        updatePasswordDesc: 'Hakikisha akaunti yako inatumia nywila ndefu na ya nasibu ili kuwa salama.',
        deleteAccount: 'Futa Akaunti',
        deleteAccountDesc: 'Akaunti yako ikifutwa, rasilimali na data zote zitafutwa kabisa. Kabla ya kufuta akaunti yako, tafadhali pakua data yoyote unayotaka kuhifadhi.',
        deleteAccountConfirmTitle: 'Una uhakika unataka kufuta akaunti yako?',
        deleteAccountConfirmDesc: 'Akaunti yako ikifutwa, rasilimali na data zote zitafutwa kabisa. Tafadhali weka nywila yako kuthibitisha kufuta akaunti yako.',
        emailUnverified: 'Barua pepe yako haijathibitishwa.',
        resendVerification: 'Bonyeza hapa kutuma tena barua ya uthibitisho.',
        verificationSent: 'Kiungo kipya cha uthibitisho kimetumwa kwenye barua pepe yako.',
        saved: 'Imehifadhiwa.',
        currentPassword: 'Nywila ya Sasa',
        newPassword: 'Nywila Mpya',
    },
};

// ─── Context ─────────────────────────────────────────────────────
type Language = 'en' | 'sw';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const translations: Record<Language, Translations> = { en, sw };

const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => {},
    t: en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        const stored = localStorage.getItem('language');
        return (stored === 'sw' ? 'sw' : 'en');
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
