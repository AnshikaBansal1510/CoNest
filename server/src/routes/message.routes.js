import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { Conversation, Message } from '../models/Message.js';

const router = express.Router();


// POST /api/messages/conversations
router.post('/conversations', protect, async (req, res) => {
  try {
    const { recipientId, listingId } = req.body;

    if (!recipientId)
      return res.status(400).json({ message: 'recipientId is required' });

    if (recipientId === req.user._id.toString())
      return res.status(400).json({ message: 'Cannot message yourself' });

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
      ...(listingId ? { listing: listingId } : {}),
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId],
        listing: listingId || null,
      });
    }

    await conversation.populate('participants', 'name avatar');

    if (conversation.listing) {
      await conversation.populate('listing', 'title photos');
    }

    res.status(201).json({ conversation });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// GET all conversations
router.get('/conversations', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name avatar')
      .populate('listing', 'title photos')
      .sort({ lastMessageAt: -1 });

    res.json({ conversations });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// GET messages in conversation
router.get('/conversations/:conversationId', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation)
      return res.status(404).json({ message: 'Conversation not found' });

    const isParticipant = conversation.participants
      .map(p => p.toString())
      .includes(req.user._id.toString());

    if (!isParticipant)
      return res.status(403).json({ message: 'Not authorized' });

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 30);
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      conversation: req.params.conversationId,
    })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        sender: { $ne: req.user._id },
        read: false,
      },
      { read: true }
    );

    res.json({
      messages: messages.reverse(),
      page,
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// SEND message
router.post('/conversations/:conversationId/messages', protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim())
      return res.status(400).json({ message: 'Message text is required' });

    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation)
      return res.status(404).json({ message: 'Conversation not found' });

    const isParticipant = conversation.participants
      .map(p => p.toString())
      .includes(req.user._id.toString());

    if (!isParticipant)
      return res.status(403).json({ message: 'Not authorized' });

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      text: text.trim(),
    });

    conversation.lastMessage = text.trim().slice(0, 60);
    conversation.lastMessageAt = new Date();

    await conversation.save();

    await message.populate('sender', 'name avatar');

    res.status(201).json({ message });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// UNREAD COUNT
router.get('/unread/count', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    }).select('_id');

    const ids = conversations.map(c => c._id);

    const count = await Message.countDocuments({
      conversation: { $in: ids },
      sender: { $ne: req.user._id },
      read: false,
    });

    res.json({ unreadCount: count });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


export default router;