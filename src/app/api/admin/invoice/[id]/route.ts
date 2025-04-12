import { NextRequest, NextResponse } from "next/server";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Admin from "../../../../../../models/Admin";
import { connectDB } from "../../../../../../db";
import Order from "../../../../../../models/Order";
import "../../../../../../models/Product";
import "../../../../../../models/User";
import "../../../../../../models/Address";

connectDB();

const generateInvoiceId = () => {
  return "INV-" + Math.floor(1000000 + Math.random() * 9000000);
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const adminId = req.headers.get("x-admin-id");
    if (!adminId) {
      return NextResponse.json(
        { success: false, msg: "Please provide Admin Id" },
        { status: 400 }
      );
    }
    const admin = await Admin.findById(adminId);
    if (!admin || (admin.role !== "Admin" && admin.role !== "SuperAdmin")) {
      return NextResponse.json(
        { success: false, msg: "Unauthorized" },
        { status: 401 }
      );
    }
    const checkOrder = await Order.findById(id).populate([
      "productDetails.product",
      "user",
      "shippingAddress",
      "exchangeReason",
    ]);
    if (!checkOrder) {
      return NextResponse.json(
        { success: false, msg: "Order not found" },
        { status: 404 }
      );
    }
    if (!checkOrder.invoiceId) {
      checkOrder.invoiceId = generateInvoiceId();
    }
    const check = await checkOrder.save();

    // Resolve the promises for product details
    const resolvedProductDetails = await Promise.all(
      check.productDetails.map(async (detail: any) => {
        const product = detail.product;
        const sizeDetail = product.sizes.find(
          (size: any) => String(size._id) === String(detail.size)
        );
        return {
          ...detail.toObject(),
          sizeDetail,
        };
      })
    );

    const companyDetails = {
      name: "Shreya Collection",
      address: "Hyderabad, Rangareddy, Telangana, 500048",
    };

    // Create a new PDF document
    const doc = new jsPDF();

    // Set font
    doc.setFont("helvetica");

    // Add invoice header
    doc.setFontSize(24);
    doc.setTextColor(44, 62, 80); // #2c3e50
    doc.text("Invoice", doc.internal.pageSize.width / 2, 20, {
      align: "center",
    });

    // Add invoice details and company info
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51); // #333333

    doc.text(`Invoice Number: ${check.invoiceId || "N/A"}`, 15, 40);
    doc.text(`Order Number: ${check.orderId || "N/A"}`, 15, 45);
    doc.text(
      `Date: ${
        check.createdAt ? new Date(check.createdAt).toLocaleDateString() : "N/A"
      }`,
      15,
      50
    );

    doc.text(
      `Payment Method: ${check.paymentMethod || "Not specified"}`,
      doc.internal.pageSize.width - 15,
      40,
      { align: "right" }
    );

    // From (Company details)
    doc.setFontSize(11);
    doc.text("From:", 15, 60);
    doc.setFontSize(10);
    doc.text(companyDetails.name, 15, 67);
    doc.text(companyDetails.address, 15, 74);

    // To (Customer details)
    doc.setFontSize(11);
    doc.text("To:", doc.internal.pageSize.width - 15, 60, { align: "right" });
    doc.setFontSize(10);
    doc.text(
      check.user?.name || "Customer Name",
      doc.internal.pageSize.width - 15,
      67,
      { align: "right" }
    );
    doc.text(
      check.user?.email || "Customer Email",
      doc.internal.pageSize.width - 15,
      72,
      { align: "right" }
    );
    doc.text(
      check.shippingAddress?.mobile || "Customer Phone",
      doc.internal.pageSize.width - 15,
      77,
      { align: "right" }
    );
    doc.text(
      check.shippingAddress?.address || "Address not available",
      doc.internal.pageSize.width - 15,
      82,
      { align: "right" }
    );

    // Add order items table
    const tableData = resolvedProductDetails.map((item: any) => [
      item.product?.name || "Product Name",
      item.count || 0,
      `${(item.sizeDetail?.offerPrice || 0).toFixed(2)}`,
      `${((item.count || 0) * (item.sizeDetail?.offerPrice || 0)).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 90,
      head: [["Item", "Quantity", "Price (Rs.)", "Total (Rs.)"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [242, 242, 242],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      foot: [["", "", "Total:", `Rs. ${(check.payablePrice || 0).toFixed(2)}`]],
      footStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
    });

    // Add footer
    const finalY = (doc as any).lastAutoTable.finalY || 220;
    doc.setFontSize(9);
    doc.setTextColor(119, 119, 119); // #777777
    doc.text(
      "Thank you for your business!",
      doc.internal.pageSize.width / 2,
      finalY + 20,
      { align: "center" }
    );

    // Generate PDF buffer
    const pdfBuffer = doc.output("arraybuffer");

    // Return the PDF buffer as a response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${check.invoiceId}.pdf`,
      },
    });
  } catch (error) {
    console.error("Error to download invoice", error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error" },
      { status: 500 }
    );
  }
};
