"use client";

import React, { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowDown01Icon,
  PencilEdit01Icon,
  Delete02Icon,
  OrganicFoodIcon,
  ChickenThighsIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { IndianRupee } from "lucide-react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import toast, { Toaster } from "react-hot-toast";

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemName: "",
    itemImage: "",
    itemPrice: null,
    itemCategory: "",
    itemDescription: "",
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    itemId: null,
    itemName: "",
    itemImage: "",
    itemPrice: null,
    itemCategory: "",
    itemQuantity: "",
    itemDescription: "",
  });
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      const MenuItems = await res.json();

      setItems(MenuItems);
    } catch (err) {
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Menu Management | Admin";

    fetchItems();
  }, []);

  useEffect(() => {
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
    setEditModal((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = new FormData();
      data.append("file", file);
      data.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        },
      );

      const uploadResult = await res.json();

      if (!res.ok) {
        throw new Error(uploadResult.error?.message || "Upload failed");
      }

      const imageUrl = uploadResult.secure_url;

      setEditModal((prev) => ({ ...prev, itemImage: imageUrl }));

      setImagePreview(imageUrl);
    } catch (error) {
      toast.error("Image upload failed");
    }
  };

  const updateItem = async () => {
    try {
      setIsUpdating(true);

      const payload = {
        id: editModal.itemId,
        name: editModal.itemName,
        price: editModal.itemPrice,
        category: editModal.itemCategory,
        quantity: editModal.itemQuantity,
        description: editModal.itemDescription,
        image: editModal.itemImage,
      };

      const response = await fetch("/api/items", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error("Failed to update item");
        return;
      }

      await fetchItems();

      setEditModal({
        isOpen: false,
        itemId: null,
        itemName: "",
        itemImage: "",
        itemPrice: null,
        itemCategory: "",
        itemQuantity: "",
        itemDescription: "",
      });
    } catch (error) {
      toast.error("Error updating item:");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = (id, name, image, price, category, description) => {
    const item = items.find((item) => item._id === id);
    setDeleteModal({
      isOpen: true,
      itemId: id,
      itemName: name,
      itemImage: image,
      itemPrice: price,
      itemCategory: category,
      itemDescription: description,
    });
  };

  const handleBestSeller = async (id, currentStatus) => {
    try {
      const payload = {
        id: id,
        isBestSeller: !currentStatus,
      };

      const response = await fetch("/api/items", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error("Failed to update best seller status");
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isBestSeller: !currentStatus } : item,
        ),
      );

      toast.success("Item added to BestSeller");
    } catch (error) {
      toast.error("Error updating best seller status");
    }
  };

  const confirmDelete = async () => {
    const id = deleteModal.itemId;

    try {
      const response = await fetch(`/api/items?id=${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setItems(items.filter((item) => item._id !== id));
        setDeleteModal({ isOpen: false, itemId: null });
      } else {
        toast.error("Error deleting item");
      }
    } catch (error) {
      toast.error("Error deleting item");
    }
  };

  const cancelDelete = () => {
    setDeleteModal({
      isOpen: false,
      itemId: null,
      itemName: "",
      itemImage: "",
      itemPrice: null,
      itemCategory: "",
      itemDescription: "",
    });
  };

  const handleEdit = (id) => {
    const itemToEdit = items.find((item) => item._id === id);
    if (itemToEdit) {
      setImagePreview(null);
      setShowAddInput(false);
      setNewCategory("");

      setEditModal({
        isOpen: true,
        itemId: itemToEdit._id,
        itemName: itemToEdit.name,
        itemImage: itemToEdit.image,
        itemPrice: itemToEdit.price,
        itemCategory: itemToEdit.category,
        itemQuantity: itemToEdit.quantity,
        itemDescription: itemToEdit.description,
      });
      setSelectedCategory(itemToEdit.category);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Toaster position="top-center" />

      <div className="flex flex-col gap-5 sm:px-10 max-sm:px-5 mt-7 mb-10">
        {deleteModal.isOpen && (
          <div className="delete-modal fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-lg max-sm:w-9/10 rounded-3xl bg-[#FFF6EB] shadow-xl border-3 border-[var(--icon-color)] py-2 px-5 max-sm:px-2 flex flex-col gap-3">
              <div className="w-full flex justify-center py-1.5 poppins font-bold max-sm:text-base text-xl text-[var(--heading)] ">
                Are you sure want to delete this item ?
              </div>
              <hr className="text-[var(--dark-heading)] border-1" />
              <div className="item-container flex items-center border-3 border-[var(--dark-heading)] rounded-3xl">
                <div className="img-part w-3/10 h-30 overflow-hidden rounded-l-3xl border-r-2 border-[var(--light-heading)]">
                  <img
                    src={deleteModal.itemImage || "/default_food.jfif"}
                    alt=""
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="info-part w-7/10 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="name-price flex justify-between px-3">
                      <span className="name raleway font-bold text-xl max-sm:text-base text-[var(--text)]">
                        {deleteModal.itemName}
                      </span>
                      <span className="price raleway font-bold text-xl max-sm:text-lg text-[var(--dark-heading)]">
                        ₹ {deleteModal.itemPrice}
                      </span>
                    </div>
                    <span className="category px-3 text-sm max-sm:text-xs text-[var(--text)]/75 poppins font-semibold">
                      {deleteModal.itemCategory}
                    </span>
                  </div>
                  <span className="description px-3 text-xs max-sm:text-[10px] text-[var(--dark-heading)]/50 montserrat font-semibold">
                    {deleteModal.itemDescription}
                  </span>
                </div>
              </div>
              <span className="category flex justify-center text-base max-sm:text-sm text-[var(--dark-heading)] poppins font-semibold">
                This action cannot be undone
              </span>
              <hr className="text-[var(--dark-heading)] border-1" />
              <div className="Edit-Delete flex px-5 py-1.5 justify-between">
                <button
                  onClick={() => cancelDelete()}
                  className="flex gap-1 text-[var(--text)] text-lg max-sm:text-base items-center poppins p-1 px-3 border-[var(--icon-color)] border-2 rounded-3xl hover:bg-[var(--icon-color)] transition-all duration-300 ease-in-out hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete()}
                  className="flex gap-1 text-[var(--text)] text-lg max-sm:text-base items-center poppins p-1 px-3 border-[var(--icon-color)] border-2 rounded-3xl hover:bg-[var(--icon-color)] transition-all duration-300 ease-in-out hover:text-white cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {editModal.isOpen && (
          <div className="edit-modal fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-1/2 sm:h-max max-sm:w-9/10 rounded-3xl bg-[#FFF6EB] shadow-xl border-3 border-[var(--icon-color)] px-0 max-sm:px-0 flex flex-col overflow-hidden">
              <div className="w-full flex justify-start py-2 max-sm:py-1.5 poppins font-bold max-sm:text-2xl text-3xl text-[var(--heading)] px-5 text-white bg-[var(--icon-color)]/90 ">
                Edit Item
              </div>
              <div className="item-container flex max-sm:flex-col border-y-3 border-[var(--dark-heading)]">
                <div className="img-part flex flex-col gap-1 items-center justify-start py-5 max-sm:py-2 w-35/100 sm:border-r-2 border-[var(--light-heading)] max-sm:w-full">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="img w-60 h-50 max-sm:w-30 max-sm:h-30 overflow-hidden rounded-3xl">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt={editModal.itemName}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <>
                          <img
                            src={editModal.itemImage || "/default_food.jfif"}
                            alt={editModal.itemName}
                            className="object-cover w-full h-full"
                          />
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
                  <span className="text-sm max-sm:text-xs poppins text-[var(--text)] font-semibold mt-1">
                    Click to update new Image
                  </span>
                  <span className="text-xs max-sm:text-[10px] poppins text-[var(--text)]">
                    (Recommended: 1:1 ratio , JPG/PNG)
                  </span>
                </div>
                <div className="info-part max-sm:w-full w-65/100 items-center flex flex-col gap-1 px-5 py-3 max-sm:py-2">
                  <div className="item-info-form w-full flex flex-col gap-3">
                    <div className="item-name flex flex-col gap-2">
                      <label
                        htmlFor="item-name"
                        className="text-xl max-sm:text-sm poppins font-semibold text-[var(--text)]"
                      >
                        Item Name
                      </label>
                      <input
                        onChange={handleChange}
                        value={editModal.itemName}
                        name="itemName"
                        id="itemName"
                        type="text"
                        className="sm:w-full h-9 max-sm:h-7 max-sm:text-sm border-2 border-[var(--icon-color)] rounded-[10px] px-3 raleway font-medium focus-visible:outline-none text-[var(--text)]/90 sm:placeholder:text-[var(--dark-heading)]/75
                                placeholder:italic  max-sm:placeholder:text-[var(--light-heading)]/50"
                        placeholder="'Veg Fried Momos'"
                      />
                    </div>
                    <div className="item-category relative sm:w-full flex flex-col gap-2">
                      <label
                        htmlFor="item-category"
                        className="text-xl max-sm:text-sm poppins font-semibold text-[var(--text)]"
                      >
                        Item Category
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="w-full h-9 max-sm:h-7 max-sm:text-sm border-2 border-[var(--icon-color)] rounded-[10px]
                      px-3 flex items-center justify-between text-[var(--text)]/90 raleway font-medium
                      cursor-pointer"
                      >
                        <span
                          className={
                            selectedCategory
                              ? ""
                              : "italic text-[var(--dark-heading)]/75"
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
                                  setEditModal((prev) => ({
                                    ...prev,
                                    itemCategory: item,
                                  }));
                                  setIsOpen(false);
                                }}
                                className="px-3 py-2 max-sm:py-1 cursor-pointer
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
                            className="h-9 max-sm:h-8 max-sm:text-sm flex items-center gap-1 px-3
                        text-[var(--dark-heading)] raleway font-semibold cursor-pointer"
                          >
                            <HugeiconsIcon icon={Add01Icon} size={22} /> Add
                            category
                          </button>
                        ) : (
                          <>
                            <input
                              name="itemCategory"
                              id="itemCategory"
                              type="text"
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && newCategory.trim()) {
                                  setCategories((prev) => [
                                    ...prev,
                                    newCategory.trim(),
                                  ]);
                                  setSelectedCategory(newCategory.trim());
                                  setEditModal((prev) => ({
                                    ...prev,
                                    itemCategory: newCategory.trim(),
                                  }));
                                  setNewCategory("");
                                  setShowAddInput(false);
                                }
                              }}
                              placeholder="New category"
                              className="h-9 max-sm:h-7 max-sm:text-sm w-40 border-2 border-[var(--icon-color)]
                          rounded-[10px] px-2 raleway font-medium
                          focus-visible:outline-none"
                              autoFocus
                            />

                            <button
                              type="button"
                              onClick={() => {
                                if (!newCategory.trim()) return;
                                setCategories((prev) => [
                                  ...prev,
                                  newCategory.trim(),
                                ]);
                                setSelectedCategory(newCategory.trim());
                                setEditModal((prev) => ({
                                  ...prev,
                                  itemCategory: newCategory.trim(),
                                }));
                                setNewCategory("");
                                setShowAddInput(false);
                              }}
                              className="h-9 max-sm:h-7 px-3 rounded-[10px]
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
                        className="text-xl max-sm:text-sm poppins font-semibold text-[var(--text)]"
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
                          value={editModal.itemPrice}
                          name="itemPrice"
                          id="itemPrice"
                          type="number"
                          min="0"
                          inputMode="decimal"
                          pattern="[0-9]*"
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                              e.preventDefault();
                            }
                          }}
                          className="sm:w-1/2 h-9 max-sm:h-7 max-sm:text-sm border-2 border-[var(--icon-color)] rounded-[10px] pl-10 pr-3 raleway font-medium focus-visible:outline-none text-[var(--text)]/90 sm:placeholder:text-[var(--dark-heading)]/75 placeholder:italic max-sm:placeholder:text-[var(--light-heading)]/50"
                          placeholder=" "
                        />
                      </div>
                    </div>
                    <div className="item-qty flex flex-col gap-2">
                      <label
                        htmlFor="item-quantity"
                        className="text-xl max-sm:text-sm poppins font-semibold text-[var(--text)]"
                      >
                        Quantity
                      </label>
                      <div className="relative w-full">
                        <input
                          onChange={handleChange}
                          value={editModal.itemQuantity}
                          name="itemQuantity"
                          id="itemQuantity"
                          type="text"
                          className="sm:w-1/2 h-9 max-sm:h-7 max-sm:text-sm border-2 border-[var(--icon-color)] rounded-[10px] raleway font-medium focus-visible:outline-none text-[var(--text)]/90 sm:placeholder:text-[var(--dark-heading)]/75 placeholder:italic max-sm:placeholder:text-[var(--light-heading)]/50 px-3"
                          placeholder="8 pcs"
                        />
                      </div>
                    </div>
                    <div className="item-desc flex flex-col gap-2">
                      <label
                        htmlFor="item-desc"
                        className="text-xl max-sm:text-sm poppins font-semibold text-[var(--text)]"
                      >
                        Description
                      </label>
                      <textarea
                        onChange={handleChange}
                        name="itemDescription"
                        value={editModal.itemDescription}
                        className="sm:w-full h-max max-sm:text-sm resize-none border-2 border-[var(--icon-color)] rounded-[10px] px-3 py-0.5 raleway font-medium focus-visible:outline-none text-[var(--text)]/90 sm:placeholder:text-[var(--dark-heading)]/75
                                placeholder:italic  max-sm:placeholder:text-[var(--light-heading)]/50"
                        placeholder="Delicious veg fried momos served with spiciness."
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="action-btns w-full flex justify-end gap-3 py-4 max-sm:py-2.5 px-5">
                <button
                  onClick={() => setEditModal({ ...editModal, isOpen: false })}
                  className="flex gap-1 text-[var(--text)] text-lg max-sm:text-base items-center poppins p-1 px-3 border-[var(--icon-color)] border-2 rounded-3xl transition-all duration-300 ease-in-out  cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateItem();
                  }}
                  className="flex gap-1 text-lg max-sm:text-base items-center poppins p-1 px-3 border-[var(--icon-color)]/30 hover:border-[var(--dark-heading)] border-2 rounded-3xl bg-[var(--icon-color)] transition-all duration-300 ease-in-out text-white cursor-pointer"
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="w-full flex max-sm:flex-col max-sm:gap-8 justify-between items-center">
          <div className="page-title flex flex-col gap-1">
            <span className="text-3xl raleway font-black tracking-wide text-[var(--text)]">
              Menu Management
            </span>
            <span className="text-sm max-sm:text-xs text-[var(--heading)] poppins">
              Manage your restaurant menu items and availability
            </span>
          </div>
          <div className="add-item">
            <Link href="/item">
              <button className="w-max flex justify-center items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--btn2-color)] text-white numans font-semibold shadow-md cursor-pointer">
                <HugeiconsIcon icon={Add01Icon} size={22} strokeWidth={2.5} />
                Add Item
              </button>
            </Link>
          </div>
        </div>
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <div className="sm:px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-sm:gap-8 max-sm:gap-1 mt-8 max-sm:mx-auto">
          {loading ? (
            <span className="text-center col-span-4 text-lg text-[var(--text)] poppins">
              Loading...
            </span>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item._id} className="item-card w-80 flex-col">
                <div className="image-part w-full h-50 rounded-t-4xl overflow-hidden relative z-0">
                  <img
                    src={item.image || "/default_food.jfif"}
                    className="object-top w-full h-full object-cover relative z-0"
                    alt={item.name}
                  />
                  <div className="black-overlay absolute inset-0 z-20 bg-black/25" />
                  <button
                    onClick={() =>
                      handleBestSeller(item._id, item.isBestSeller)
                    }
                    className="absolute top-3 right-3 z-30 cursor-pointer transition-transform duration-200 hover:scale-110"
                  >
                    <HugeiconsIcon
                      icon={StarIcon}
                      size={28}
                      strokeWidth={2}
                      className={`transition-all duration-300 ${
                        item.isBestSeller
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-white fill-white/30"
                      }`}
                    />
                  </button>
                </div>
                <div className="item-info bg-[var(--bg)] w-full h-50 rounded-b-4xl shadow-md">
                  <div className="name-price flex justify-between px-3 py-1">
                    <span className="flex flex-col gap-1 text-lg text-[var(--text)] montserrat font-semibold">
                      <span>{item.name}</span>
                      <span className="text-sm raleway">({item.quantity})</span>
                    </span>
                    <span className="text-xl text-[var(--dark-heading)] poppins font-semibold">
                      ₹ {item.price}
                    </span>
                  </div>
                  <div className="category flex px-3 justify-between items-center">
                    <span className="text-xs text-[var(--text)]/75 numans font-semibold">
                      {item.category}
                    </span>
                    <span
                      className={`flex gap-0.5 px-2 py-1.5 rounded-2xl ${
                        item.isVeg
                          ? "text-green-900 bg-green-400"
                          : "text-red-900 bg-red-300"
                      }`}
                    >
                      <HugeiconsIcon
                        size={16}
                        strokeWidth={2}
                        icon={item.isVeg ? OrganicFoodIcon : ChickenThighsIcon}
                      />
                      <span className="text-xs font-bold montserrat">
                        {item.isVeg ? "Veg" : "Non-veg"}
                      </span>
                    </span>
                  </div>
                  <div className="Desc flex px-3 py-1.5">
                    <span className="text-xs text-[var(--text)] numans font-semibold">
                      {item.description ? item.description : null}
                    </span>
                  </div>
                  <div className="Edit-Delete flex px-3 py-2.5 justify-between">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="flex gap-1 text-[var(--text)] text-lg items-center poppins p-1 px-3 border-[var(--icon-color)] border-2 rounded-3xl hover:bg-[var(--icon-color)] transition-all duration-300 ease-in-out hover:text-white cursor-pointer"
                    >
                      <HugeiconsIcon icon={PencilEdit01Icon} size={20} /> Edit
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(
                          item._id,
                          item.name,
                          item.image,
                          item.price,
                          item.category,
                          item.description,
                        )
                      }
                      className="flex gap-1 text-[var(--text)] text-lg items-center poppins p-1 px-3 border-[var(--icon-color)] border-2 rounded-3xl hover:bg-[var(--icon-color)] transition-all duration-300 ease-in-out hover:text-white cursor-pointer"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={20} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <span className="text-center col-span-4 text-lg text-[var(--text)] poppins">
              No items found.
            </span>
          )}
        </div>
      </div>
    </>
  );
}
