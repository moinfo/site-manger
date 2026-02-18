<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Project Statement</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        h1 { font-size: 18px; margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
        th { background: #f5f5f5; font-weight: bold; }
        .right { text-align: right; }
        .total { font-weight: bold; background: #f0f0f0; }
        .summary { margin-top: 10px; font-size: 13px; }
        .positive { color: #2e7d32; }
        .negative { color: #c62828; }
    </style>
</head>
<body>
    <h1>Project Statement{{ $projectName ? ': ' . $projectName : '' }}</h1>
    <p>Generated: {{ now()->format('d M Y') }}</p>

    <div class="summary">
        <p>Opening Balance: <strong>TZS {{ number_format($openingBalance) }}</strong></p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th class="right">Debit (TZS)</th>
                <th class="right">Credit (TZS)</th>
                <th class="right">Balance (TZS)</th>
            </tr>
        </thead>
        <tbody>
            <tr class="total">
                <td colspan="2">Opening Balance</td>
                <td></td>
                <td></td>
                <td class="right">{{ number_format($openingBalance) }}</td>
            </tr>
            @foreach($transactions as $t)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($t['date'])->format('d M Y') }}</td>
                    <td>{{ $t['description'] }}</td>
                    <td class="right">{{ $t['debit'] > 0 ? number_format($t['debit']) : '' }}</td>
                    <td class="right">{{ $t['credit'] > 0 ? number_format($t['credit']) : '' }}</td>
                    <td class="right {{ $t['balance'] >= 0 ? 'positive' : 'negative' }}">{{ number_format($t['balance']) }}</td>
                </tr>
            @endforeach
            <tr class="total">
                <td colspan="2">Closing Balance</td>
                <td class="right">{{ number_format($totalDebit) }}</td>
                <td class="right">{{ number_format($totalCredit) }}</td>
                <td class="right {{ $closingBalance >= 0 ? 'positive' : 'negative' }}">{{ number_format($closingBalance) }}</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
