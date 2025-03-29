import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../api/ticketAPI';
import { TicketData } from '../interfaces/TicketData';
import { UserData } from '../interfaces/UserData';
import { retrieveUsers } from '../api/userAPI';

const CreateTicket = () => {
  const [newTicket, setNewTicket] = useState<TicketData | undefined>(
    {
      id: 0,
      name: '',
      description: '',
      status: 'Todo',
      assignedUserId: 1,
      assignedUser: null
    }
  );

  const navigate = useNavigate();

  const [users, setUsers] = useState<UserData[] | undefined>([]);

  const [error, setError] = useState<string>('');

  const getAllUsers = async () => {
    try {
      const data = await retrieveUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to retrieve user info', err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (newTicket) {
      try {
        console.log('Submitting ticket:', newTicket);
        const response = await createTicket(newTicket);
        console.log('Ticket created successfully:', response);
        navigate('/');
      } catch (err) {
        console.error('Failed to create ticket:', err);
        setError('Failed to create ticket. Please try again.');
      }
    }
  }

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
  }

  const handleUserChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-4">Create Ticket</h1>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div>
            <label htmlFor="tName" className="block text-sm font-medium text-gray-700">Ticket Name</label>
            <textarea 
              id="tName"
              name="name"
              value={newTicket?.name || ''}
              onChange={handleTextAreaChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={2}
            />
          </div>
          <div>
            <label htmlFor="tStatus" className="block text-sm font-medium text-gray-700">Status</label>
            <select 
              name="status" 
              id="tStatus"
              value={newTicket?.status || ''}
              onChange={handleTextChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div>
            <label htmlFor="tDescription" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              id="tDescription"
              name="description"
              value={newTicket?.description || ''}
              onChange={handleTextAreaChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={4}
            />
          </div>
          <div>
            <label htmlFor="tUserId" className="block text-sm font-medium text-gray-700">Assign To</label>
            <select
              name="assignedUserId"
              value={newTicket?.assignedUserId || ''}
              onChange={handleUserChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {users ? users.map((user) => (
                <option key={user.id} value={String(user.id)}>
                  {user.username}
                </option>
              )) : (
                <option value="">Loading users...</option>
              )}
            </select>
          </div>
          <button 
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
