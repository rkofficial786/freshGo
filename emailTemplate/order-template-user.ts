export const orderUserTemplate = (order: any) =>`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #2c3e50;
            margin: 0;
        }
        .order-info {
            margin-bottom: 20px;
        }
        .order-info p {
            margin: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmation</h1>
        </div>
        <div class="order-info">
            <p><strong>Order Number:</strong> ${order.orderId}</p>
            <p><strong>Date:</strong> ${order.orderDate}</p>
            <p><strong>Payment Method:</strong> COD</p>
        </div>
        <div class="order-info">
            <p><strong>Shipping Address:</strong></p>
            <p>${order.user.defaultAddress.name}<br>
            ${order.user.defaultAddress.address}<br>
            ${order.user.defaultAddress.state} ${order.user.defaultAddress.zipCode}<br>
            ${order.user.defaultAddress.country}</p>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map((item:any) => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price.toFixed(2)}</td>
                    <td>₹${item.total.toFixed(2)}</td>
                </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3"><strong>Total Amount</strong></td>
                    <td><strong>₹${order.totalAmount}</strong></td>
                </tr>
            </tfoot>
        </table>
        <div class="footer">
            <p>Thank you for your order! If you have any questions, please contact our customer support.</p>
        </div>
    </div>
</body>
</html>
`;