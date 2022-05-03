"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const orderedSchema = new mongoose_1.Schema({
    client: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    deliveryMan: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    address: {
        type: String,
    },
    products: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
            }
        }
    ],
    menus: [
        {
            menu: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Menu",
            },
            quantity: {
                type: Number,
            }
        }
    ],
    total: {
        type: Number,
    },
    step: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 0
    }
}, {
    collection: "ordered",
    timestamps: true,
    versionKey: false
});
exports.OrderedModel = mongoose_1.default.model("Ordered", orderedSchema);
//# sourceMappingURL=ordered.model.js.map