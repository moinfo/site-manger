<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Cash Flow Report</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        h1 { font-size: 18px; margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
        th { background: #f5f5f5; font-weight: bold; }
        .right { text-align: right; }
        .total { font-weight: bold; background: #f0f0f0; }
        .summary { margin-top: 20px; font-size: 14px; }
    </style>
</head>
<body>
    <h1>Cash Flow Report</h1>
    <p>Generated: {{ now()->format('d M Y') }}</p>

    <h2>Cash Inflows</h2>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Source</th>
                <th class="right">Amount (TZS)</th>
                <th>Notes</th>
            </tr>
        </thead>
        <tbody>
            @foreach($inflows as $inflow)
                <tr>
                    <td>{{ $inflow->date->format('d M Y') }}</td>
                    <td>{{ $inflow->source }}</td>
                    <td class="right">{{ number_format($inflow->amount) }}</td>
                    <td>{{ $inflow->notes }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="summary">
        <p>Total Cash In: <strong>TZS {{ number_format($totalIn) }}</strong></p>
        <p>Total Cash Out: <strong>TZS {{ number_format($totalOut) }}</strong></p>
        <p>Balance: <strong>TZS {{ number_format($balance) }}</strong></p>
    </div>
</body>
</html>
