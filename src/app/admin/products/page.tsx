"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Link from "next/link";
import { CustomPagination } from "@/components/ui/customPagination";

const ProductsPage = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 16;

  useEffect(() => {
    fetchProducts();
  }, [search, currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `/api/products/?page=${currentPage}&limit=${productsPerPage}&search=${search}`,
        { method: "GET" }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } else {
        setError("Failed to load products");
      }
    } catch (error) {
      setError("An error occurred while fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (confirm("Are you sure you want to delete this product?")) {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Product successfully deleted");
          fetchProducts();
        } else {
          throw new Error("Delete failed");
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handlePageChange = (page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!products || products.length === 0) return <div className="p-4 text-center">No products found</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/addProduct">
          <Button>Add New Product</Button>
        </Link>
      </div>
      
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setCurrentPage(1);
            setSearch(e.target.value);
          }}
          className="pl-10"
        />
      </div>
      
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <div className="w-16 h-16">
                      <img
                        src={product.img || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-[300px]">
                    {product.name}
                  </TableCell>
                  <TableCell>
                    <span className="text-green-600 font-bold">
                      ₹{product?.price?.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.stockQuantity > 10 ? "default" : "destructive"}>
                      {product.stockQuantity} in stock
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/admin/products/edit/${product._id}`}>
                        <Button size="icon">
                          <FaEdit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(product._id)}
                      >
                        <FaTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsPage;