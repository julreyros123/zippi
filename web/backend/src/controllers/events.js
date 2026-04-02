const prisma = require('../prisma');

// List all events (soonest first)
const listEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: { creator: { select: { id: true, username: true, nickname: true } } },
      orderBy: { scheduledAt: 'asc' }
    });
    res.status(200).json(events);
  } catch (error) {
    console.error('List Events Error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Create an event
const createEvent = async (req, res) => {
  try {
    const { title, description, emoji, scheduledAt } = req.body;
    if (!title || !scheduledAt) return res.status(400).json({ error: 'title and scheduledAt are required' });
    const event = await prisma.event.create({
      data: {
        title,
        description,
        emoji: emoji || '📅',
        scheduledAt: new Date(scheduledAt),
        creatorId: req.user.id
      },
      include: { creator: { select: { id: true, username: true, nickname: true } } }
    });
    res.status(201).json(event);
  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.creatorId !== req.user.id) return res.status(403).json({ error: 'Not your event' });
    await prisma.event.delete({ where: { id } });
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Delete Event Error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

module.exports = { listEvents, createEvent, deleteEvent };
