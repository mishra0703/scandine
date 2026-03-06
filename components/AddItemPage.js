"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Restaurant02Icon,
  Image03Icon,
  Add01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ItemPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [itemData, setItemData] = useState({});

  useEffect(() => {
    document.title = "Add Item | Admin";

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const dbCategories = await res.json();

        setCategories(dbCategories);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({ ...prev, [name]: value }));
  };

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const uploadResult = await res.json();

    if (!res.ok) {
      throw new Error(uploadResult.error?.message || "Upload failed");
    }

    const imageUrl = uploadResult.secure_url;

    setItemData((prev) => ({
      ...prev,
      image: imageUrl,
    }));

    setImagePreview(imageUrl);

  } catch (error) {
    toast.error("Image upload failed");
  }
};

  const handleSubmit = async (saveAndAddAnother = false) => {
    if (
      !itemData.item_name ||
      !itemData.item_price ||
      !itemData.item_category
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const item_data = {
        name: itemData.item_name,
        price: parseFloat(itemData.item_price),
        category: itemData.item_category,
        description: itemData.item_description || "",
        image: itemData.image || "",
        isVeg: itemData.isVeg ?? true,
        isAvailable: true,
        quantity: itemData.item_qty || "",
        isBestSeller: false,
      };

      const response = await fetch(`/api/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item_data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create item");
      }

      const result = await response.json();
      toast.success("Item added successfully!");

      if (saveAndAddAnother) {
        setItemData({});
        setSelectedCategory("");
        setImagePreview(null);
      } else {
        router.push(`/menu`);
      }
    } catch (error) {
      toast.error(error.message || "Failed to create item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-5 sm:pl-5 sm:pr-10 max-sm:px-5 flex flex-col gap-3">      
      <Toaster position="top-center" />
      <div className="top-section flex justify-between items-center max-sm:flex-col gap-5">
        <div className="title-bar flex flex-col">
          <span className="main-title flex gap-2 items-center text-4xl max-sm:text-3xl poppins font-bold text-[var(--dark-heading)]">
            <HugeiconsIcon size={33} strokeWidth={2} icon={Restaurant02Icon} />
            Add New Item
          </span>
          <span className="sub-tittle text-lg max-sm:text-sm max-sm:font-semibold dm-sans font-meidum text-[var(--light-heading)]">
            Fill the fields to add item to your menu
          </span>
        </div>
        <div className="save-section flex gap-3">
          <button
            type="button"
            onClick={() => {
              handleSubmit(false);
            }}
            className="numans text-green-800 border-green-400 border-2 rounded-xl shadow-xs font-semibold px-3 py-2 focus:outline-none cursor-pointer max-sm:text-xs"
          >
            {isSubmitting ? "Saving..." : "Save Item"}
          </button>
          <button
            type="button"
            onClick={() => {
              handleSubmit(true);
            }}
            className="numans text-white bg-[#008847] rounded-xl shadow-xs font-semibold px-3 py-2 focus:outline-none cursor-pointer max-sm:text-xs"
          >
            Save & Add Another
          </button>
          <button
            type="button"
            onClick={() => {
              setItemData({});
              setSelectedCategory("");
              setImagePreview(null);
            }}
            className="numans text-red-800 border-red-400 border-2 rounded-xl shadow-xs font-semibold px-3 py-2 focus:outline-none cursor-pointer max-sm:text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="content-area w-full sm:h-max max-sm:h-screen mx-auto flex max-sm:flex-col gap-5">
        <div className="item-info-form p-5 sm:w-1/2 max-sm:w-full h-full flex flex-col gap-5 bg-white shadow-md rounded-3xl">
          <div className="item-name flex flex-col gap-2">
            <label
              htmlFor="item-name"
              className="text-xl poppins font-semibold text-[var(--text)]"
            >
              Item Name
            </label>
            <input
              onChange={handleChange}
              value={itemData.item_name ? itemData.item_name : ""}
              name="item_name"
              id="item_name"
              type="text"
              className="sm:w-3/5 h-9 border-2 border-[var(--icon-color)] rounded-[10px] px-3 raleway font-medium focus-visible:outline-none text-[var(--text)]/90 sm:placeholder:text-[var(--dark-heading)]/75
              placeholder:italic  max-sm:placeholder:text-[var(--light-heading)]/50"
              placeholder="'Veg Fried Momos'"
            />
          </div>
          <div className="item-category relative sm:w-3/5 flex flex-col gap-2">
            <label
              htmlFor="item-category"
              className="text-xl poppins font-semibold text-[var(--text)]"
            >
              Item Category
            </label>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="w-full h-9 border-2 border-[var(--icon-color)] rounded-[10px]
    px-3 flex items-center justify-between
    bg-white text-[var(--text)]/90 raleway font-medium
    cursor-pointer"
            >
              <span
                className={
                  selectedCategory ? "" : "italic text-[var(--dark-heading)]/75"
                }
              >
                {selectedCategory || "Select category"}
              </span>

              <HugeiconsIcon
                icon={ArrowDown01Icon}
                className={`transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <ul
                onClick={(e) => e.stopPropagation()}
                className="absolute z-20 mt-5 top-15 w-full bg-white
      border-2 border-[var(--icon-color)]
      rounded-xl shadow-lg overflow-hidden"
              >
                {categories.length === 0 ? (
                  <li className="px-3 py-2 text-[var(--text)]/50 raleway font-medium italic">
                    No categories defined
                  </li>
                ) : (
                  categories.map((item) => (
                    <li
                      key={item}
                      onClick={() => {
                        setSelectedCategory(item);
                        setItemData((prev) => ({
                          ...prev,
                          item_category: item,
                        }));
                        setIsOpen(false);
                      }}
                      className="px-3 py-2 cursor-pointer
            hover:bg-[var(--icon-color)]/10
            text-[var(--text)] raleway font-medium"
                    >
                      {item}
                    </li>
                  ))
                )}
              </ul>
            )}
            <div className="absolute -bottom-10 right-0 flex items-center gap-2">
              {!showAddInput ? (
                <button
                  type="button"
                  onClick={() => setShowAddInput(true)}
                  className="h-9 flex items-center gap-1 px-3
      text-[var(--dark-heading)] raleway font-semibold cursor-pointer"
                >
                  <HugeiconsIcon icon={Add01Icon} size={22} /> Add category
                </button>
              ) : (
                <>
                  <input
                    name="item_category"
                    id="item_category"
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newCategory.trim()) {
                        setCategories((prev) => [...prev, newCategory.trim()]);
                        setSelectedCategory(newCategory.trim());
                        setItemData((prev) => ({
                          ...prev,
                          item_category: newCategory.trim(),
                        }));
                        setNewCategory("");
                        setShowAddInput(false);
                      }
                    }}
                    placeholder="New category"
                    className="h-9 w-40 border-2 border-[var(--icon-color)]
        rounded-[10px] px-2 raleway font-medium
        focus-visible:outline-none"
                    autoFocus
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (!newCategory.trim()) return;
                      setCategories((prev) => [...prev, newCategory.trim()]);
                      setSelectedCategory(newCategory.trim());
                      setItemData((prev) => ({
                        ...prev,
                        item_category: newCategory.trim(),
                      }));
                      setNewCategory("");
                      setShowAddInput(false);
                    }}
                    className="h-9 px-3 rounded-[10px]
        bg-[var(--icon-color)]/20
        raleway font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="item-price flex flex-col gap-2 mt-6">
            <label
              htmlFor="item-price"
              className="text-xl poppins font-semibold text-[var(--text)]"
            >
              Price
            </label>
            <div className="relative w-full">
              <IndianRupee
                size={22}
                strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--dark-heading)] border-r-2 pr-1"
              />
              <input
                onChange={handleChange}
                value={itemData.item_price ? itemData.item_price : ""}
                name="item_price"
                id="item_price"
                type="number"
                min="0"
                inputMode="decimal"
                pattern="[0-9]*"
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                  }
                }}
                className="sm:w-1/4 h-9 border-2 border-[var(--icon-color)] rounded-[10px] pl-10 pr-3 raleway font-medium focus-visible:outline-none text-[var(--text)]/90 sm:placeholder:text-[var(--dark-heading)]/75 placeholder:italic max-sm:placeholder:text-[var(--light-heading)]/50"
                placeholder=" "
              />
            </div>
          </div>
          <div className="item-qty flex flex-col gap-2">
            <label
              htmlFor="item-quantity"
              className="text-xl poppins font-semibold text-[var(--text)]"
            >
              Quantity
            </label>
            <div className="relative w-full">
              <input
                onChange={handleChange}
                value={itemData.item_qty ? itemData.item_qty : ""}
                name="item_qty"
                id="item_qty"
                type="text"
                className="sm:w-1/4 h-9 border-2 border-[var(--icon-color)] rounded-[10px] raleway font-medium focus-visible:outline-none text-[var(--text)]/90 sm:placeholder:text-[var(--dark-heading)]/75 placeholder:italic max-sm:placeholder:text-[var(--light-heading)]/50 px-3"
                placeholder="8 pcs"
              />
            </div>
          </div>
          <div className="item-desc flex flex-col gap-2">
            <label
              htmlFor="item-desc"
              className="text-xl poppins font-semibold text-[var(--text)]"
            >
              Description
            </label>
            <textarea
              onChange={handleChange}
              name="item_description"
              value={itemData.item_description || ""}
              className="sm:w-3/5 h-max border-2 border-[var(--icon-color)] rounded-[10px] px-3 py-0.5 raleway font-medium focus-visible:outline-none text-[var(--text)]/90 sm:placeholder:text-[var(--dark-heading)]/75
              placeholder:italic  max-sm:placeholder:text-[var(--light-heading)]/50 resize-none"
              placeholder="Delicious veg fried momos served with spiciness."
            />
          </div>
        </div>
        <div className="item-data-form p-5 sm:w-1/2 h-full flex flex-col gap-5 bg-white shadow-md rounded-3xl">
          <div className="item-img flex flex-col gap-3">
            <label
              htmlFor="item-name"
              className="text-xl poppins font-semibold text-[var(--text)]"
            >
              Item Image
            </label>
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="w-full h-65 rounded-3xl border-dashed border-2 bg-amber-100 border-[var(--icon-color)]/75 flex flex-col justify-center items-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-3xl"
                  />
                ) : (
                  <>
                    <HugeiconsIcon
                      icon={Image03Icon}
                      size={100}
                      strokeWidth={1}
                      color="var(--card-bg)"
                    />
                    <span className="text-lg raleway font-semibold text-[var(--text)]">
                      Click to upload
                    </span>
                    <span className="text-sm poppins text-[var(--text)]">
                      Recommended: 1:1 ratio , JPG/PNG
                    </span>
                  </>
                )}
              </div>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div className="item-img flex flex-col gap-3 max-sm:mt-3">
            <label
              htmlFor="item-name"
              className="text-xl poppins font-semibold text-[var(--text)]"
            >
              Veg / Non-veg
            </label>

            <ul className="w-1/2 flex gap-3 max-sm:mt-1.5">
              <li className="w-max">
                <input
                  type="radio"
                  id="veg"
                  name="item_type"
                  value="true"
                  checked={itemData.isVeg === true}
                  onChange={() =>
                    setItemData((prev) => ({ ...prev, isVeg: true }))
                  }
                  className="peer hidden"
                />
                <label
                  htmlFor="veg"
                  className="flex cursor-pointer items-center justify-center rounded-lg border-2 px-2 sm:py-1 max-sm:py-0.5
        bg-white text-green-900 raleway font-semibold
        hover:bg-green-200 hover:text-green-900
        peer-checked:bg-green-300 peer-checked:text-green-900 peer-checked:border-green-500 transition-all duration-200 ease-in-out "
                >
                  Veg
                </label>
              </li>
              <li className="w-max">
                <input
                  type="radio"
                  id="nonveg"
                  name="item_type"
                  value="false"
                  checked={itemData.isVeg === false}
                  onChange={() =>
                    setItemData((prev) => ({ ...prev, isVeg: false }))
                  }
                  className="peer hidden"
                />
                <label
                  htmlFor="nonveg"
                  className="flex cursor-pointer items-center justify-center rounded-lg border-2 px-2 sm:py-1 max-sm:py-0.5
        bg-white text-red-900 raleway font-semibold
        hover:bg-red-200 hover:text-red-900
        peer-checked:bg-red-300 peer-checked:text-red-900 peer-checked:border-red-500 transition-all duration-200 ease-in-out"
                >
                  Non-veg
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
