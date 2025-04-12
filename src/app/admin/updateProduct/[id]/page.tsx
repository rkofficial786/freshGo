"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FiUpload } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/features/catogary";
import toast from "react-hot-toast";
import { ColorVariantSelector } from "../../addProduct/Colorsvarianet";
import { CategorySelector } from "../../addProduct/Selector";
import axios from "axios";
import RulesSelector from "../RulesSelector";
import { getProductsById } from "@/lib/features/products";

const UpdateProduct = ({ params }) => {
  const { id } = params;
  const dispatch = useDispatch<any>();

  const [product, setProduct] = useState<any>({
    name: "",
    description: "",
    actualPrice: "",
    offerPrice: "",
    stock: "",
    width: "",
    height: "",
    material: [],
    blousePiece: "",
    washCare: "",
    note: "",
    sku: "",
    featureProduct: false,
    bestsellerProduct: false,
    latestProduct: false,
    color: "",
    rating: "",
    ratedBy: "",
    categories: [],
    colors: [],
    returnRules: [],
    sizes: [],
    additionalFields: {},
    // shippingPrice: "",
  });

  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [rules, setRules] = useState<any>([]);
  const [rating, setRating] = useState(0);
  const [ratedBy, setRatedBy] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdditionalFieldModalOpen, setIsAdditionalFieldModalOpen] =
    useState(false);
  const [editingSizeIndex, setEditingSizeIndex] = useState(null);
  const [sizeError, setSizeError] = useState("");
  const [newSize, setNewSize] = useState({
    size: "",
    stock: "",
    offerPrice: "",
    _id: "",
    comboPrice: "",
    shippingPrice: {},
  });
  const [newField, setNewField] = useState({ key: "", value: "" });
  const [showShippingInputs, setShowShippingInputs] = useState(false);
  const [newShippingEntry, setNewShippingEntry] = useState({
    key: "",
    value: "",
  });
  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          dispatch(getProductsById(id)),
          dispatch(getAllCategories()),
        ]);

        if (productResponse.payload.success) {
          const fetchedProduct = productResponse.payload.product;
          setProduct({
            ...fetchedProduct,
            categories: fetchedProduct.categories.map((cat) => cat._id),
            additionalFields:
              typeof fetchedProduct.additionalFields === "object"
                ? fetchedProduct.additionalFields
                : {},
          });
          setRating(fetchedProduct.rating.star);
          setRatedBy(fetchedProduct.rating.ratedBy);
          setExistingImages(fetchedProduct.img);
        } else {
          toast.error("Failed to fetch product");
        }

        if (categoriesResponse.payload.success) {
          setCategories(categoriesResponse.payload.categories);
        } else {
          toast.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while fetching data");
      }
    };

    fetchProductAndCategories();
    fetchRules();
  }, [id, dispatch]);

  const handleAddShippingPrice = () => {
    if (newShippingEntry.key && newShippingEntry.value) {
      setNewSize((prev) => ({
        ...prev,
        shippingPrice: {
          ...prev.shippingPrice,
          [newShippingEntry.key]: newShippingEntry.value,
        },
      }));
      setNewShippingEntry({ key: "", value: "" });
    } else {
      toast.error("Please fill both key and value for shipping price");
    }
  };

  const handleRemoveShippingPrice = (key) => {
    const updatedShippingPrice = { ...newSize.shippingPrice };
    delete updatedShippingPrice[key];
    setNewSize((prev) => ({
      ...prev,
      shippingPrice: updatedShippingPrice,
    }));
  };

  // Function to edit shipping price entry
  const handleEditShippingPrice = (key, value) => {
    setNewShippingEntry({ key, value: value.toString() });
    handleRemoveShippingPrice(key);
    setShowShippingInputs(true);
  };

  const fetchRules = async () => {
    try {
      const response = await axios.get("/api/rules");
      setRules(response.data.rules);
    } catch (error) {
      toast.error("Failed to fetch rules");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCheckboxChange = (name) => {
    setProduct({ ...product, [name]: !product[name] });
  };

  const handleMaterialChange = (e) => {
    setProduct({ ...product, material: e.target.value.split(",") });
  };

  const handleCategoryChange = (selectedCategories) => {
    setProduct({ ...product, categories: selectedCategories });
  };

  const handleColorVariantsChange = (newVariants) => {
    setProduct((prev) => ({ ...prev, colors: newVariants }));
  };

  const handleImageUpload = (e: any) => {
    const files = Array.from(e.target.files) as File[];
    setNewImages((prevImages) => [...prevImages, ...files]);
  };

  const removeExistingImage = (imgPath: string) => {
    setExistingImages((prevImages) =>
      prevImages.filter((img) => img !== imgPath)
    );
  };

  const removeNewImage = (index: number) => {
    setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleRatingChange = (e) => {
    setRating(Number(e.target.value));
  };

  const handleRatedByChange = (e) => {
    setRatedBy(Number(e.target.value));
  };

  const handleAddSize = () => {
    // First check if all required fields are filled
    const requiredFields = ["size", "stock", "offerPrice", "comboPrice"];
    const hasAllFields = requiredFields.every((field) => {
      // Special check for shippingPrice - must have at least one price
      if (field === "shippingPrice") {
        return Object.keys(newSize[field]).length > 0;
      }
      return newSize[field];
    });

    if (hasAllFields) {
      if (editingSizeIndex !== null) {
        // Editing existing size - keep the _id if it exists
        setProduct((prevProduct) => ({
          ...prevProduct,
          sizes: prevProduct.sizes.map((size, index) =>
            index === editingSizeIndex
              ? {
                  ...newSize,
                  _id: size._id, // Preserve the existing _id
                }
              : size
          ),
        }));
        setEditingSizeIndex(null);
      } else {
        // Check for duplicate size
        if (product.sizes.some((size) => size.size === newSize.size)) {
          setSizeError("This size is already present.");
          return;
        }

        // Adding new size - omit _id field
        const { _id, ...sizeWithoutId } = newSize;
        setProduct((prevProduct) => ({
          ...prevProduct,
          sizes: [...prevProduct.sizes, sizeWithoutId],
        }));
      }

      // Reset form
      setNewSize({
        size: "",
        stock: "",
        offerPrice: "",
        comboPrice: "",
        _id: "",
        shippingPrice: {},
      });
      setSizeError("");
      setIsModalOpen(false);
    } else {
      toast.error(
        "Please fill all size details including at least one shipping price"
      );
    }
  };

  const removeSize = (index: number) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      sizes: prevProduct.sizes.filter((_, i) => i !== index),
    }));
  };

  const handleAddAdditionalField = () => {
    if (newField.key && newField.value) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        additionalFields: {
          ...prevProduct.additionalFields,
          [newField.key]: newField.value,
        },
      }));
      setNewField({ key: "", value: "" });
      setIsAdditionalFieldModalOpen(false);
    } else {
      toast.error("Please fill both key and value");
    }
  };

  const removeAdditionalField = (keyToRemove) => {
    setProduct((prevProduct) => {
      const updatedFields = { ...prevProduct.additionalFields };
      delete updatedFields[keyToRemove];
      return { ...prevProduct, additionalFields: updatedFields };
    });
  };

  const formatShippingPrices = (shippingPrice: any) => {
    return Object?.entries(shippingPrice)
      .map(([key, value]) => `${key}: ₹${value}`)
      .join(", ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData: any = new FormData();

    Object.keys(product).forEach((key) => {
      if (
        key === "categories" ||
        key === "sizes" ||
        key === "additionalFields" ||
        Array.isArray(product[key])
      ) {
        formData.append(key, JSON.stringify(product[key]));
      } else if (key !== "images") {
        formData.append(key, product[key]);
      }
    });

    formData.delete("rating");
    formData.append("rating", rating);
    formData.append("ratedBy", ratedBy);
    formData.append("existingImages", JSON.stringify(existingImages));

    newImages.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        body: formData,
        headers: {
          "x-admin-id": "your-admin-id-here", // Replace with actual admin ID
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        toast.success("Product updated successfully");
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Update Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <Label>Existing Images</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {existingImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`Product ${index}`}
                    className="w-24 h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <Label className="mt-4">Add New Images</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                id="newImages"
                type="file"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => document.getElementById("newImages").click()}
              >
                <FiUpload className="mr-2" /> Upload New Images
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {newImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New ${index}`}
                    className="w-24 h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              name="sku"
              value={product.sku}
              onChange={handleInputChange}
              required
            />
          </div>
          {/* <div>
            <Label htmlFor="shippingPrice">Shipping Price</Label>
            <Input
              id="shippingPrice"
              name="shippingPrice"
              type="number"
              value={product.shippingPrice}
              onChange={handleInputChange}
              required
            />
          </div> */}
          <div>
            <Label htmlFor="actualPrice">Actual Price</Label>
            <Input
              id="actualPrice"
              name="actualPrice"
              type="number"
              value={product.actualPrice}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="rating">Stars</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={rating}
              onChange={handleRatingChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="ratedBy">Rated By</Label>
            <Input
              id="ratedBy"
              name="ratedBy"
              type="number"
              value={ratedBy}
              onChange={handleRatedByChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              name="color"
              value={product.color}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label>Color Variants</Label>
            <ColorVariantSelector
              onChange={handleColorVariantsChange}
              value={product.colors}
              currentProductId={product._id}
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="rules">Return Rules</Label>
            <RulesSelector
              rules={rules}
              selectedRules={product.returnRules}
              onChange={(selectedRules) =>
                setProduct({ ...product, returnRules: selectedRules })
              }
            />
          </div>

          <div>
            <Label htmlFor="material">Materials (comma-separated)</Label>
            <Input
              id="material"
              name="material"
              value={product.material.join(",")}
              onChange={handleMaterialChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="washCare">Wash Care</Label>
            <Input
              id="washCare"
              name="washCare"
              value={product.washCare}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              name="note"
              value={product.note}
              onChange={handleInputChange}
            />
          </div>
          <CategorySelector
            categories={categories}
            selectedCategories={product.categories}
            onChange={handleCategoryChange}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featureProduct"
              checked={product.featureProduct}
              onCheckedChange={() => handleCheckboxChange("featureProduct")}
            />
            <label htmlFor="featureProduct">Feature Product</label>
          </div>
          {/* <div className="flex items-center space-x-2">
            <Checkbox
              id="bestsellerProduct"
              checked={product.bestsellerProduct}
              onCheckedChange={() => handleCheckboxChange("bestsellerProduct")}
            />
            <label htmlFor="bestsellerProduct">Bestseller Product</label>
          </div> */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="latestProduct"
              checked={product.latestProduct}
              onCheckedChange={() => handleCheckboxChange("latestProduct")}
            />
            <label htmlFor="latestProduct">Latest Product</label>
          </div>
        </div>

        <div>
          <Label>Sizes</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {product?.sizes.map((size, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded">
                size: {size.size} - Stock: {size.stock}, Price:{" "}
                {size.offerPrice}, Combo Price:{size?.comboPrice}
                {/* {size?.shippingPrice &&
                  formatShippingPrices(size?.shippingPrice)} */}
                <button
                  type="button"
                  onClick={() => {
                    setNewSize(size);
                    setEditingSizeIndex(index);
                    setIsModalOpen(true);
                  }}
                  className="ml-2 text-blue-500"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="ml-2 text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button type="button" className="mt-2">
                {editingSizeIndex !== null ? "Edit Size" : "Add Size"}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>
                  {editingSizeIndex !== null ? "Edit Size" : "Add Size"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Select
                    onValueChange={(value) => {
                      setNewSize({ ...newSize, size: value });
                      setSizeError("");
                    }}
                    value={newSize.size}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "M",
                        "L",
                        "XL",
                        "XXL",
                        "3XL",
                        "4XL",
                        "5XL",
                        "6XL",
                        "Others",
                        "Freesize",
                      ].map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {sizeError && (
                    <p className="text-red-500 mt-1">{sizeError}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newSize.stock}
                    onChange={(e) =>
                      setNewSize({ ...newSize, stock: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="offerPrice">Offer Price</Label>
                  <Input
                    id="offerPrice"
                    type="number"
                    value={newSize.offerPrice}
                    onChange={(e) =>
                      setNewSize({ ...newSize, offerPrice: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="comboPrice">Combo Price</Label>
                  <Input
                    id="comboPrice"
                    type="number"
                    value={newSize.comboPrice}
                    onChange={(e) =>
                      setNewSize({ ...newSize, comboPrice: e.target.value })
                    }
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label>Shipping Prices</Label>
                  <div className="space-y-2">
                    {newSize?.shippingPrice &&
                      Object?.entries(newSize?.shippingPrice).map(
                        ([key, value]: any) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 bg-gray-100 p-2 rounded"
                          >
                            <span>
                              {key}: {value}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleEditShippingPrice(key, value)
                              }
                              className="text-blue-500 ml-2"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveShippingPrice(key)}
                              className="text-red-500 ml-2"
                            >
                              Remove
                            </button>
                          </div>
                        )
                      )}
                  </div>

                  <Button
                    type="button"
                    onClick={() => setShowShippingInputs(true)}
                    className="mt-2"
                  >
                    Add Shipping Price
                  </Button>

                  {showShippingInputs && (
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="shippingKey">Quantity</Label>
                        <Input
                          id="shippingKey"
                          value={newShippingEntry.key}
                          onChange={(e) =>
                            setNewShippingEntry((prev) => ({
                              ...prev,
                              key: e.target.value,
                            }))
                          }
                          placeholder="e.g., 1,2 "
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingValue">Price</Label>
                        <Input
                          id="shippingValue"
                          type="number"
                          value={newShippingEntry.value}
                          onChange={(e) =>
                            setNewShippingEntry((prev) => ({
                              ...prev,
                              value: e.target.value,
                            }))
                          }
                          placeholder="Enter price"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" onClick={handleAddShippingPrice}>
                          Add
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowShippingInputs(false);
                            setNewShippingEntry({ key: "", value: "" });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div> */}
                <Button type="button" onClick={handleAddSize}>
                  {editingSizeIndex !== null ? "Update Size" : "Add Size"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Additional Fields Modal */}
        <div>
          <Label>Additional Fields</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(product.additionalFields).map(
              ([key, value]: any) => (
                <div key={key} className="bg-gray-100 p-2 rounded">
                  {key}: {value}
                  <button
                    type="button"
                    onClick={() => removeAdditionalField(key)}
                    className="ml-2 text-red-500"
                  >
                    ×
                  </button>
                </div>
              )
            )}
          </div>
          <Dialog
            open={isAdditionalFieldModalOpen}
            onOpenChange={setIsAdditionalFieldModalOpen}
          >
            <DialogTrigger asChild>
              <Button type="button" className="mt-2">
                Add Additional Field
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Add Additional Field</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fieldKey">Field Key</Label>
                  <Input
                    id="fieldKey"
                    value={newField.key}
                    onChange={(e) =>
                      setNewField({ ...newField, key: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="fieldValue">Field Value</Label>
                  <Input
                    id="fieldValue"
                    value={newField.value}
                    onChange={(e) =>
                      setNewField({ ...newField, value: e.target.value })
                    }
                  />
                </div>
                <Button type="button" onClick={handleAddAdditionalField}>
                  Add Field
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Button type="submit" className="w-full">
          Update Product
        </Button>
      </form>
    </div>
  );
};

export default UpdateProduct;
