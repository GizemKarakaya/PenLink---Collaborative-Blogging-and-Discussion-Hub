const ContactMessage = require('../models/ContactMessage');

// Submit contact message
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const contactMessage = new ContactMessage({
      name,
      email,
      message
    });

    await contactMessage.save();
    res.status(201).json({ 
      message: 'Contact message submitted successfully',
      id: contactMessage._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all contact messages (Admin only)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ submissionDate: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single message (Admin only)
exports.getMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete message (Admin only)
exports.deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

