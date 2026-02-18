<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Monthly Expenses Report</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        h1 { font-size: 18px; margin-bottom: 5px; }
        h2 { font-size: 14px; color: #555; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
        th { background: #f5f5f5; font-weight: bold; }
        .right { text-align: right; }
        .total { font-weight: bold; background: #f0f0f0; }
        .grand { font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <h1>Monthly Expenses Report</h1>
    <p>Generated: {{ now()->format('d M Y') }}</p>

    @foreach($data as $month => $items)
        <h2>{{ \Carbon\Carbon::parse($month . '-01')->format('F Y') }}</h2>
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th class="right">Amount (TZS)</th>
                </tr>
            </thead>
            <tbody>
                @php $monthTotal = 0; @endphp
                @foreach($items as $item)
                    <tr>
                        <td>{{ $categories[$item->category] ?? ucfirst($item->category) }}</td>
                        <td class="right">{{ number_format($item->total) }}</td>
                    </tr>
                    @php $monthTotal += $item->total; @endphp
                @endforeach
                <tr class="total">
                    <td>Month Total</td>
                    <td class="right">{{ number_format($monthTotal) }}</td>
                </tr>
            </tbody>
        </table>
    @endforeach

    <p class="grand">Grand Total: <strong>TZS {{ number_format($grandTotal) }}</strong></p>
</body>
</html>
