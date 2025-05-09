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

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  mrp: string;
  stockQuantity: string;
  unit: string;
  sku: string;
  category: string;
  isFeatured: boolean;
  hide: boolean;
  image: File | null;
  imagePreview: string | null;
}

interface FormErrors {
  name?: string;
  price?: string;
  mrp?: string;
  stockQuantity?: string;
  unit?: string;
  category?: string;
  sku?: string;
}

const unitOptions = [
  "item",
  "kg",
  "g",
  "lb",
  "oz",
  "l",
  "ml",
  "dozen",
  "piece",
  "pack",
  "box",
  "bottle",
  "can",
];

const AddProduct = () => {
  const [product, setProduct] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    mrp: "",
    stockQuantity: "",
    unit: "",
    sku: "",
    category: "",
    isFeatured: false,
    hide: false,
    image: null,
    imagePreview: null,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCheckboxChange = (name: "hide" | "isFeatured") => {
    setProduct({ ...product, [name]: !product[name] });
  };

  const handleCategoryChange = (value: string) => {
    setProduct({ ...product, category: value });
  };

  const handleUnitChange = (value: string) => {
    setProduct({ ...product, unit: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setProduct({
        ...product,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const removeImage = () => {
    if (product.imagePreview) {
      URL.revokeObjectURL(product.imagePreview);
    }
    setProduct({
      ...product,
      image: null,
      imagePreview: null,
    });
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!product.name) errors.name = "Product name is required";
    if (!product.price) errors.price = "Price is required";
    if (!product.mrp) errors.mrp = "MRP is required";
    if (parseFloat(product.price) > parseFloat(product.mrp)) 
      errors.price = "Price cannot be higher than MRP";
    if (!product.unit) errors.unit = "Unit is required";
    if (!product.category) errors.category = "Category is required";
    if (!product.stockQuantity) errors.stockQuantity = "Stock quantity is required";
    if (!product.sku) errors.sku = "SKU is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description || "");
    formData.append("price", product.price);
    formData.append("mrp", product.mrp);
    formData.append("stockQuantity", product.stockQuantity);
    formData.append("unit", product.unit);
    formData.append("sku", product.sku);
    formData.append("category", product.category);
    formData.append("isFeatured", String(product.isFeatured));
    formData.append("hide", String(product.hide));

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
          mrp: "",
          stockQuantity: "",
          unit: "",
          sku: "",
          category: "",
          isFeatured: false,
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
                onClick={() => document.getElementById("image")?.click()}
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
            <Label htmlFor="sku">SKU (Stock Keeping Unit)*</Label>
            <Input
              id="sku"
              name="sku"
              value={product.sku}
              onChange={handleInputChange}
              className={formErrors.sku ? "border-red-500" : ""}
            />
            {formErrors.sku && (
              <p className="text-red-500 text-sm mt-1">{formErrors.sku}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Selling Price (₹)*</Label>
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
            <Label htmlFor="mrp">MRP (₹)*</Label>
            <Input
              id="mrp"
              name="mrp"
              type="number"
              step="0.01"
              min="0"
              value={product.mrp}
              onChange={handleInputChange}
              className={formErrors.mrp ? "border-red-500" : ""}
            />
            {formErrors.mrp && (
              <p className="text-red-500 text-sm mt-1">{formErrors.mrp}</p>
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
            <Label htmlFor="unit">Unit*</Label>
            <Select
              value={product.unit}
              onValueChange={handleUnitChange}
            >
              <SelectTrigger
                className={formErrors.unit ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((unit) => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.unit && (
              <p className="text-red-500 text-sm mt-1">{formErrors.unit}</p>
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
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
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

        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFeatured"
              checked={product.isFeatured}
              onCheckedChange={() => handleCheckboxChange("isFeatured")}
            />
            <label htmlFor="isFeatured" className="text-sm font-medium">
              Feature this product (display on homepage)
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hide"
              checked={product.hide}
              onCheckedChange={() => handleCheckboxChange("hide")}
            />
            <label htmlFor="hide" className="text-sm font-medium">
              Hide product from store
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Adding Product..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;