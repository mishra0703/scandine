import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    cafeName: {
      type: String,
      default: "ScanDine",
    },

    isOpen: {
      type: Boolean,
      default: true,
    },

    contactNumber: {
      type: String,
      default: "",
    },

    whatsappNumber: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    instagramLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.models?.Settings ||
  mongoose.model("Settings", SettingsSchema);
