const express = require('express');
const router = express.Router();
const {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  resolveTicket
} = require('../controllers/ticketsController');
const validateTicketData = require('../middlewares/dataCheckMiddleware');

router.get('/', getAllTickets);
router.get('/:id', getTicketById);
router.post('/', validateTicketData, createTicket);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);
router.patch('/:id/resolve', resolveTicket);

module.exports = router;