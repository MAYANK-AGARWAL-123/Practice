const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../db.json');

class Ticket {
  static async findAll() {
    try {
      const data = await fs.readFile(DB_PATH, 'utf8');
      return JSON.parse(data).tickets;
    } catch (error) {
      throw new Error('Failed to read tickets');
    }
  }

  static async saveAll(tickets) {
    try {
      await fs.writeFile(DB_PATH, JSON.stringify({ tickets }, null, 2));
    } catch (error) {
      throw new Error('Failed to save tickets');
    }
  }

  static async findById(id) {
    const tickets = await this.findAll();
    return tickets.find(ticket => ticket.id === id);
  }

  static async create(newTicket) {
    const tickets = await this.findAll();
    const id = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1;
    const ticket = { 
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...newTicket 
    };
    tickets.push(ticket);
    await this.saveAll(tickets);
    return ticket;
  }

  static async update(id, updatedTicket) {
    const tickets = await this.findAll();
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      tickets[index] = { 
        ...tickets[index], 
        ...updatedTicket,
        updatedAt: new Date().toISOString() 
      };
      await this.saveAll(tickets);
      return tickets[index];
    }
    return null;
  }

  static async delete(id) {
    const tickets = await this.findAll();
    const filteredTickets = tickets.filter(t => t.id !== id);
    if (filteredTickets.length !== tickets.length) {
      await this.saveAll(filteredTickets);
      return true;
    }
    return false;
  }

  static async resolve(id) {
    const tickets = await this.findAll();
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      tickets[index].status = 'resolved';
      tickets[index].resolvedAt = new Date().toISOString();
      await this.saveAll(tickets);
      return tickets[index];
    }
    return null;
  }
}

module.exports = Ticket;