"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FiUpload } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { categories } from "@/constants/contsants";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    category: "",
    hide: false,
    image: null,
    imagePreview: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCheckboxChange = () => {
    setProduct({ ...product, hide: !product.hide });
  };

  const handleCategoryChange = (value) => {
    setProduct({ ...product, category: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({
        ...product,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const removeImage = () => {
    setProduct({
      ...product,
      image: null,
      imagePreview: null,
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!product.name) errors.name = "Product name is required";
    if (!product.price) errors.price = "Price is required";
    if (!product.category) errors.category = "Category is required";
    if (!product.stockQuantity)
      errors.stockQuantity = "Stock quantity is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description || "");
    formData.append("price", product.price);
    formData.append("stockQuantity", product.stockQuantity);
    formData.append("category", product.category);
    formData.append("hide", product.hide);

    if (product.image) {
      formData.append("file", product.image);
    }

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Product created successfully");
        // Reset form
        setProduct({
          name: "",
          description: "",
          price: "",
          stockQuantity: "",
          category: "",
          hide: false,
          image: null,
          imagePreview: null,
        });
      } else {
        toast.error(data.msg || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => document.getElementById("image").click()}
              >
                <FiUpload className="mr-2" /> Upload Image
              </Button>
              <span>
                {product.image ? "1 file selected" : "No file selected"}
              </span>
            </div>
            {product.imagePreview && (
              <div className="mt-4 relative inline-block">
                <img
                  src={product.imagePreview}
                  alt="Product preview"
                  className="w-32 h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="name">Product Name*</Label>
            <Input
              id="name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              className={formErrors.name ? "border-red-500" : ""}
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Price (₹)*</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={product.price}
              onChange={handleInputChange}
              className={formErrors.price ? "border-red-500" : ""}
            />
            {formErrors.price && (
              <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
            )}
          </div>

          <div>
            <Label htmlFor="stockQuantity">Stock Quantity*</Label>
            <Input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              min="0"
              value={product.stockQuantity}
              onChange={handleInputChange}
              className={formErrors.stockQuantity ? "border-red-500" : ""}
            />
            {formErrors.stockQuantity && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.stockQuantity}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category*</Label>
            <Select
              value={product.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger
                className={formErrors.category ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="Fruits">Fruits</SelectItem>
                <SelectItem value="Vegetables">Vegetables</SelectItem>
                <SelectItem value="Dairy">Dairy</SelectItem>
                <SelectItem value="Bakery">Bakery</SelectItem>
                <SelectItem value="Meat">Meat</SelectItem>
                <SelectItem value="Seafood">Seafood</SelectItem>
                <SelectItem value="Snacks">Snacks</SelectItem>
                <SelectItem value="Beverages">Beverages</SelectItem>
                <SelectItem value="Frozen">Frozen</SelectItem>
                <SelectItem value="Household">Household</SelectItem>
                <SelectItem value="Other">Other</SelectItem> */}

                {categories.map((item) => (
                  <SelectItem value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.category && (
              <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
            )}
          </div>

          <div className="col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hide"
            checked={product.hide}
            onCheckedChange={handleCheckboxChange}
          />
          <label htmlFor="hide" className="text-sm font-medium">
            Hide product from store
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Adding Product..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
