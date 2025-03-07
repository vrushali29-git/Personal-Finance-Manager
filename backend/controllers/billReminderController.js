import BillReminder from '../models/billReminderModel.js';

export const addBill = async (req, res) => {
  try {
    const { name, amount, dueDate, description } = req.body;
    
    if (!name || !amount || !dueDate) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    const bill = await BillReminder.create({
      userId: req.user.id,
      name,
      amount,
      dueDate,
      description
    });

    res.status(201).json(bill);
  } catch (error) {
    console.error('Error in addBill:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getBills = async (req, res) => {
  try {
    const bills = await BillReminder.find({ userId: req.user.id });
    res.json(bills);
  } catch (error) {
    console.error('Error in getBills:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateBillStatus = async (req, res) => {
  try {
    const bill = await BillReminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: req.body.status },
      { new: true }
    );
    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }
    res.json(bill);
  } catch (error) {
    console.error('Error in updateBillStatus:', error);
    res.status(500).json({ error: error.message });
  }
};