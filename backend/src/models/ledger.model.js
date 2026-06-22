const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        index: true,
        immutable: true,
        required: [true, "Ledger must be associated with a account"]
    },
    amount: {
        type: Number,
        immutable: true,
        required: [true, "Amount is required for creating a ledger entry"]
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        index: true,
        immutable: true,
        required: [true, "Ledger must be associated with a transaction"]
    },
    type: {
        type: String,
        enum: {
            values: ["CREDIT", "DEBIT"],
            message: "Type can be either CREDIT or DEBIT"
        },
        immutable: true,
        required: [true, "Ledger type is required"]
    }
}, {
    timestamps: true
});

function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);
ledgerSchema.pre('findOneAndDelete', preventLedgerModification);
ledgerSchema.pre('findOneAndReplace', preventLedgerModification);
ledgerSchema.pre('updateMany', preventLedgerModification);

const ledgerModel = mongoose.model("ledger", ledgerSchema);

module.exports = ledgerModel;