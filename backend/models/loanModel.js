import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  tenure: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'paid'],
    default: 'active'
  },
  description: String
}, {
  timestamps: true
});

const Loan = mongoose.model('Loan', loanSchema);
export default Loan;