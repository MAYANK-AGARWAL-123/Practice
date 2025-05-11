const Ticket = require('../models/Ticket');

const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(parseInt(req.params.id));
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    const updatedTicket = await Ticket.update(parseInt(req.params.id), req.body);
    if (!updatedTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const isDeleted = await Ticket.delete(parseInt(req.params.id));
    if (!isDeleted) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resolveTicket = async (req, res) => {
  try {
    const resolvedTicket = await Ticket.resolve(parseInt(req.params.id));
    if (!resolvedTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.status(200).json(resolvedTicket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  resolveTicket
};