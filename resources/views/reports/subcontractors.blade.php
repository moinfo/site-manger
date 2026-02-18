<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Subcontractors Report</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        h1 { font-size: 18px; margin-bottom: 5px; }
        h2 { font-size: 14px; color: #555; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
        th { background: #f5f5f5; font-weight: bold; }
        .right { text-align: right; }
        .total { font-weight: bold; background: #f0f0f0; }
    </style>
</head>
<body>
    <h1>Subcontractors Report</h1>
    <p>Generated: {{ now()->format('d M Y') }}</p>

    @foreach($subcontractors as $sub)
        <h2>{{ $sub->name }}</h2>
        @if($sub->phone)<p>Phone: {{ $sub->phone }}</p>@endif

        <table>
            <thead>
                <tr>
                    <th>Contract</th>
                    <th class="right">Billed (TZS)</th>
                    <th class="right">Paid (TZS)</th>
                    <th class="right">Balance (TZS)</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($sub->contracts as $contract)
                    @php $paid = $contract->payments->sum('amount'); @endphp
                    <tr>
                        <td>{{ $contract->description }}</td>
                        <td class="right">{{ number_format($contract->billed_amount) }}</td>
                        <td class="right">{{ number_format($paid) }}</td>
                        <td class="right">{{ number_format($contract->billed_amount - $paid) }}</td>
                        <td>{{ ucfirst($contract->status) }}</td>
                    </tr>
                @endforeach
                <tr class="total">
                    <td>Total</td>
                    <td class="right">{{ number_format($sub->contracts->sum('billed_amount')) }}</td>
                    <td class="right">{{ number_format($sub->payments->sum('amount')) }}</td>
                    <td class="right">{{ number_format($sub->contracts->sum('billed_amount') - $sub->payments->sum('amount')) }}</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    @endforeach
</body>
</html>
