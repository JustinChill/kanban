import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { retrieveTickets, deleteTicket } from '../api/ticketAPI';
import ErrorPage from './ErrorPage';
import Swimlane from '../components/Swimlane';
import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';
import { useAuth } from '../context/AuthContext';
import '../styles/Board.css';

const boardStates = ['Todo', 'In Progress', 'Done'];

const Board = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      console.log('Fetching tickets in Board component...');
      const data = await retrieveTickets();
      console.log('Tickets fetched:', data);
      setTickets(data);
    } catch (err) {
      console.error('Failed to retrieve tickets:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteIndvTicket = async (ticketId: number) : Promise<ApiMessage> => {
    try {
      const data = await deleteTicket(ticketId);
      fetchTickets();
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  useEffect(() => {
    console.log('Board useEffect - isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      fetchTickets();
    }
  }, [isAuthenticated]);

  if (error) {
    return <ErrorPage />;
  }

  if (!isAuthenticated) {
    return (
      <div className="login-notice">
        <h1>Login to create & view tickets</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="board-container">
        <div className="loading-message">
          <h1>Loading tickets...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="board-container">
      <div className="board-header">
        <h1>Kanban Board</h1>
        <Link to="/login" className="logout-button">Logout</Link>
      </div>
      <div className="board">
        <Link to="/create" className="create-ticket-button">
          New Ticket
        </Link>
        <div className="board-display">
          {boardStates.map((state) => (
            <Swimlane
              key={state}
              title={state}
              tickets={tickets.filter((ticket) => ticket.status === state)}
              deleteTicket={deleteIndvTicket}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
