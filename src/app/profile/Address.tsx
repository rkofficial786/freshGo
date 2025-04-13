"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  MapPin,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  Home,
  Briefcase,
  ClipboardList,
} from "lucide-react";
import toast from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

import {
  getAllAddress,
  makeDefaultAddress,
  updateAddress,
  deleteAddress,
  AddNewAddress,
} from "@/lib/features/address";
import { getUserDetails } from "@/lib/features/auth";

const ShippingAddresses: React.FC = () => {
  const dispatch = useDispatch<any>();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialAddressState: any = {
    address: "",
    mobile: "",
    country: "India",
    state: "",
    name: "",
    city: "",
    addressType: "Home",
    zipCode: "",
  };

  const [newAddress, setNewAddress] = useState<any>(initialAddressState);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const callGetAllAddress = async () => {
    try {
      const { payload } = await dispatch(getUserDetails());

      if (payload.success) {
        setAddresses(payload?.user?.address);

        if (payload?.user?.defaultAddress) {
          setDefaultAddress(payload?.user?.defaultAddress?._id);
        }
      } else {
        toast.error(payload.msg || "Failed to load addresses");
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    callGetAllAddress();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { payload } = await dispatch(getAllAddress());
      if (payload.success) {
        setAddresses(payload.addresses);
      } else {
        toast.error(payload.msg || "Failed to fetch addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to fetch addresses");
    }
  };

  const handleNewAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleAddressSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Simple validation
      if (
        !newAddress.name ||
        !newAddress.address ||
        !newAddress.mobile ||
        !newAddress.zipCode
      ) {
        toast.error("Please fill all required fields");
        setIsSubmitting(false);
        return;
      }

      let payload;
      if (editingAddress) {
        payload = await dispatch(
          updateAddress({
            id: editingAddress._id,
            address: newAddress,
          })
        );
      } else {
        payload = await dispatch(AddNewAddress(newAddress));
      }

      if (payload.payload.success) {
        toast.success(payload.payload.msg || "Address saved successfully");
        setNewAddress(initialAddressState);
        setIsAddressModalOpen(false);
        fetchAddresses();
      } else {
        toast.error(payload.payload.msg || "Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const { payload } = await dispatch(deleteAddress(id));
      if (payload.success) {
        toast.success(payload.msg || "Address deleted successfully");
        fetchAddresses();
      } else {
        toast.error(payload.msg || "Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const { payload } = await dispatch(
        makeDefaultAddress({
          addressId: id,
        })
      );
      if (payload.success) {
        toast.success(payload.msg || "Default address updated");
        setDefaultAddress(id);
        callGetAllAddress();
      } else {
        toast.error(payload.msg || "Failed to update default address");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to set default address");
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setNewAddress({
      name: address.name,
      address: address.address,
      mobile: address.mobile,
      country: address.country,
      state: address.state,
      city: address.city || "",
      addressType: address.addressType,
      zipCode: address.zipCode,
    });
    setIsAddressModalOpen(true);
  };

  // Function to get address type icon
  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case "Home":
        return <Home className="w-4 h-4" />;
      case "Work":
        return <Briefcase className="w-4 h-4" />;
      default:
        return <ClipboardList className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 bg-gray-50">
        <CardTitle className="text-xl font-semibold text-gray-900">
          Shipping Addresses
        </CardTitle>
        <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => {
                setEditingAddress(null);
                setNewAddress(initialAddressState);
              }}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {editingAddress
                  ? "Edit your shipping address details below."
                  : "Enter your new shipping address details."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-gray-700">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newAddress.name}
                  onChange={handleNewAddressChange}
                  className="col-span-3 border-gray-200 focus:border-black focus:ring-black"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right text-gray-700">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={newAddress.address}
                  onChange={handleNewAddressChange}
                  className="col-span-3 border-gray-200 focus:border-black focus:ring-black"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mobile" className="text-right text-gray-700">
                  Mobile <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mobile"
                  name="mobile"
                  value={newAddress.mobile}
                  onChange={handleNewAddressChange}
                  className="col-span-3 border-gray-200 focus:border-black focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right text-gray-700">
                  State <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={newAddress.state}
                  onChange={handleNewAddressChange}
                  className="col-span-3 border-gray-200 focus:border-black focus:ring-black"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right text-gray-700">
                  Country
                </Label>
                <Select
                  name="country"
                  value={newAddress.country}
                  onValueChange={(value) =>
                    handleSelectChange("country", value)
                  }
                >
                  <SelectTrigger className="col-span-3 border-gray-200 focus:border-black focus:ring-black">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    {/* Add more countries as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="zipCode" className="text-right text-gray-700">
                  Pin Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={newAddress.zipCode}
                  onChange={handleNewAddressChange}
                  className="col-span-3 border-gray-200 focus:border-black focus:ring-black"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="addressType"
                  className="text-right text-gray-700"
                >
                  Type
                </Label>
                <Select
                  name="addressType"
                  value={newAddress.addressType}
                  onValueChange={(value) =>
                    handleSelectChange("addressType", value)
                  }
                >
                  <SelectTrigger className="col-span-3 border-gray-200 focus:border-black focus:ring-black">
                    <SelectValue placeholder="Address Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddressSubmit}
                className="bg-black text-white hover:bg-gray-800"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : editingAddress
                  ? "Update Address"
                  : "Add Address"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-6">
        {addresses.length === 0 ? (
          <div className="text-center py-16 flex flex-col justify-center items-center">
            <MapPin className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-base font-medium text-gray-900">
              No addresses found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first shipping address.
            </p>
            <Button
              onClick={() => setIsAddressModalOpen(true)}
              className="mt-6 bg-black hover:bg-gray-800 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Address
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <Card
                key={addr?._id}
                className={`p-4 border hover:shadow-md transition-shadow ${
                  addr?._id === defaultAddress
                    ? "bg-gray-50 border-black"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{addr.name}</h3>
                      {addr._id === defaultAddress && (
                        <Badge className="bg-black text-white hover:bg-gray-800">
                          Default
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 text-xs text-gray-600 border-gray-200"
                      >
                        {getAddressTypeIcon(addr.addressType)}{" "}
                        {addr.addressType}
                      </Badge>
                    </div>
                    <p className="text-gray-700">{addr.address}</p>
                    <p className="text-gray-700">
                      {addr.city} {addr.state}, {addr.country} - {addr.zipCode}
                    </p>
                    <p className="text-gray-700">Phone: {addr.mobile}</p>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={addr?._id === defaultAddress}
                      onCheckedChange={() => handleSetDefaultAddress(addr?._id)}
                    />
                    <Label className="text-sm text-gray-700 cursor-pointer">
                      Default
                    </Label>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAddress(addr)}
                      className="text-gray-600 hover:text-gray-900 border-gray-200 hover:border-gray-900"
                    >
                      <Edit className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAddress(addr?._id)}
                      className="text-red-600 hover:text-red-700 border-gray-200 hover:border-red-200"
                    >
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingAddresses;
