import nodemailer from "nodemailer";

export const sendInvoiceEmail = async ({ userEmail, order }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 🧮 Calculate total
    const total = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // 📦 Generate rows
    const itemsHTML = order.items
        .map(
            (item) => `
        <tr>
            <td>${item.title}</td>
            <td>${item.quantity}</td>
            <td>৳ ${item.price}</td>
            <td>৳ ${item.price * item.quantity}</td>
        </tr>
    `
        )
        .join("");

    // ✉️ Send email
    await transporter.sendMail({
        from: `"My Shop" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "🧾 Order Invoice",

        html: `
        <div style="font-family: Arial; padding: 20px;">
            <h2>Order Invoice 🧾</h2>
            <p>Thank you for your purchase!</p>

            <table width="100%" border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">
                <thead>
                    <tr style="background:#f3f3f3;">
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>

            <h3 style="margin-top:20px;">Total: ৳ ${total}</h3>

            <p style="margin-top:20px;">Thanks for shopping with us ❤️</p>
        </div>
        `,
    });
};