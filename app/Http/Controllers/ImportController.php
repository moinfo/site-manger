<?php

namespace App\Http\Controllers;

use App\Models\CashInflow;
use App\Models\Contract;
use App\Models\Material;
use App\Models\Payment;
use App\Models\Project;
use App\Models\Subcontractor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class ImportController extends Controller
{
    public function index()
    {
        return Inertia::render('Import/Index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        $spreadsheet = IOFactory::load($request->file('file')->getPathname());

        // Create default project
        $project = Project::firstOrCreate(
            ['name' => 'Arusha Site'],
            ['location' => 'Arusha', 'start_date' => '2025-07-21', 'status' => 'active']
        );

        $counts = [
            'expenses' => 0,
            'cash_inflows' => 0,
            'subcontractors' => 0,
            'contracts' => 0,
            'payments' => 0,
        ];

        // Import ACCOUNTS sheet
        $counts['expenses'] += $this->importExpenses($spreadsheet, 'ACCOUNTS', $project);

        // Import WORKS sheet
        $counts['expenses'] += $this->importExpenses($spreadsheet, 'WORKS', $project);

        // Import CASH IN - CASH OUT
        $counts['cash_inflows'] = $this->importCashFlow($spreadsheet, $project);

        // Import subcontractor data
        $subCounts = $this->importSubcontractors($spreadsheet, $project);
        $counts['subcontractors'] = $subCounts['subcontractors'];
        $counts['contracts'] = $subCounts['contracts'];
        $counts['payments'] = $subCounts['payments'];

        $message = sprintf(
            'Import complete: %d expenses, %d cash inflows, %d subcontractors, %d contracts, %d payments.',
            $counts['expenses'], $counts['cash_inflows'], $counts['subcontractors'],
            $counts['contracts'], $counts['payments']
        );

        return redirect()->route('import.index')->with('success', $message);
    }

    private function importExpenses($spreadsheet, string $sheetName, Project $project): int
    {
        if (!$spreadsheet->sheetNameExists($sheetName)) return 0;

        $sheet = $spreadsheet->getSheetByName($sheetName);
        $count = 0;
        $currentDate = null;

        foreach ($sheet->getRowIterator() as $row) {
            $cells = [];
            foreach ($row->getCellIterator() as $cell) {
                $cells[$cell->getColumn()] = $cell->getValue();
            }

            // Try to detect date from column A or B
            $dateVal = $cells['A'] ?? $cells['B'] ?? null;
            $parsedDate = $this->parseDate($dateVal);
            if ($parsedDate) {
                $currentDate = $parsedDate;
                continue;
            }

            // Check if this is a data row (has description in B and subtotal in F)
            $description = trim($cells['B'] ?? '');
            $subtotal = $cells['F'] ?? null;

            if (empty($description) || !is_numeric($subtotal) || $subtotal <= 0 || !$currentDate) {
                continue;
            }

            // Skip header rows and total rows
            if (in_array(strtoupper($description), ['DESCRIPTON', 'DESCRIPTION', 'DATE'])) {
                continue;
            }

            $qty = is_numeric($cells['C'] ?? null) ? (float) $cells['C'] : 1;
            $unit = is_string($cells['D'] ?? null) ? trim($cells['D']) : null;
            $price = is_numeric($cells['E'] ?? null) ? (float) $cells['E'] : (float) $subtotal;

            Material::create([
                'project_id' => $project->id,
                'date' => $currentDate,
                'description' => strtoupper($description),
                'quantity' => $qty,
                'unit' => $unit,
                'unit_price' => $price,
                'subtotal' => (float) $subtotal,
                'category' => $this->guessCategory($description),
            ]);
            $count++;
        }

        return $count;
    }

    private function importCashFlow($spreadsheet, Project $project): int
    {
        if (!$spreadsheet->sheetNameExists('CASH IN - CASH OUT')) return 0;

        $sheet = $spreadsheet->getSheetByName('CASH IN - CASH OUT');
        $count = 0;

        foreach ($sheet->getRowIterator() as $row) {
            $cells = [];
            foreach ($row->getCellIterator() as $cell) {
                $cells[$cell->getColumn()] = $cell->getValue();
            }

            $date = $this->parseDate($cells['A'] ?? null);
            $source = trim($cells['B'] ?? '');
            $amount = $cells['C'] ?? null;

            if (!$date || empty($source) || !is_numeric($amount) || $amount <= 0) {
                continue;
            }

            if (stripos($source, 'Balance') !== false || stripos($source, 'Total') !== false) {
                continue;
            }

            CashInflow::create([
                'project_id' => $project->id,
                'date' => $date,
                'source' => $source,
                'amount' => (float) $amount,
            ]);
            $count++;
        }

        return $count;
    }

    private function importSubcontractors($spreadsheet, Project $project): array
    {
        $counts = ['subcontractors' => 0, 'contracts' => 0, 'payments' => 0];

        // Import Baraka from both sheets
        $baraka = Subcontractor::firstOrCreate(['name' => 'Baraka']);
        $counts['subcontractors'] = 1;

        // baraka Doli sheet
        if ($spreadsheet->sheetNameExists('baraka Doli')) {
            $sheet = $spreadsheet->getSheetByName('baraka Doli');
            $contracts = [
                ['desc' => 'Main House Construction', 'billed' => 10500000, 'status' => 'completed'],
                ['desc' => 'Main House Plaster', 'billed' => 4500000, 'status' => 'in_progress'],
                ['desc' => 'Power House', 'billed' => 6000000, 'status' => 'completed'],
            ];

            foreach ($contracts as $c) {
                $contract = Contract::create([
                    'subcontractor_id' => $baraka->id,
                    'project_id' => $project->id,
                    'description' => $c['desc'],
                    'billed_amount' => $c['billed'],
                    'status' => $c['status'],
                ]);
                $counts['contracts']++;

                // Parse payments from sheet
                foreach ($sheet->getRowIterator() as $row) {
                    $cells = [];
                    foreach ($row->getCellIterator() as $cell) {
                        $cells[$cell->getColumn()] = $cell->getValue();
                    }

                    $date = $this->parseDate($cells['B'] ?? null);
                    $amount = $cells['D'] ?? $cells['F'] ?? null;

                    if ($date && is_numeric($amount) && $amount > 0) {
                        Payment::create([
                            'contract_id' => $contract->id,
                            'date' => $date,
                            'amount' => (float) $amount,
                        ]);
                        $counts['payments']++;
                    }
                }
                break; // Only parse payments once to avoid duplicates
            }
        }

        return $counts;
    }

    private function parseDate($value): ?string
    {
        if (empty($value)) return null;

        // Numeric Excel date
        if (is_numeric($value) && $value > 40000 && $value < 60000) {
            try {
                $date = ExcelDate::excelToDateTimeObject($value);
                return $date->format('Y-m-d');
            } catch (\Exception $e) {
                return null;
            }
        }

        // String date
        if (is_string($value)) {
            try {
                return Carbon::parse($value)->format('Y-m-d');
            } catch (\Exception $e) {
                return null;
            }
        }

        // DateTime object
        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d');
        }

        return null;
    }

    private function guessCategory(string $description): string
    {
        $desc = strtolower($description);

        $map = [
            'cement' => ['cement', 'twiga', 'simba'],
            'paint' => ['paint', 'emulsion', 'wallputty', 'wall putty', 'silky', 'roller brush', 'p brush', 'brush', 'making tape', 'karamala', 'varnish', 'primer'],
            'timber' => ['timber', 'mbao', 'plywood', 'playwood', 'camp(', 'msasa', 'door', 'louver'],
            'electrical' => ['electric', 'plug', 'cable', 'wire', 'switch', 'socket', 'luku', 'bulb', 'lamp'],
            'plumbing' => ['pipe', 'tap', 'plumb', 'elbow', 'toilet', 'basin', 'tank', 'water', 'septic'],
            'steel' => ['steel', 'iron', 'belestir', 'nails', 'bolt', 'nut', 'binding wire', 'hoop'],
            'transport' => ['transport', 'trip', 'petrol', 'diesel', 'fuel', 'motorcycle'],
            'labor' => ['labor', 'labour', 'fundi', 'mason', 'electrician', 'advance payment', 'allowance', 'wages'],
            'sand_aggregate' => ['sand', 'aggregate', 'gravel', 'kokoto', 'mawe'],
            'hardware' => ['connector', 'screw', 'hinge', 'lock', 'handle', 'tool', 'rope', 'manila'],
        ];

        foreach ($map as $category => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($desc, $keyword)) {
                    return $category;
                }
            }
        }

        return 'other';
    }
}
