import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, UserPlus, Edit, Trash2, CheckCircle, XCircle, Search, Filter, ChevronDown } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useAuthStore, User, UserRole } from '../../stores/authStore';

interface AddAdminFormProps {
  onSubmit: (admin: Omit<User, 'id'>) => void;
  onClose: () => void;
  isLoading: boolean;
  currentUser: User | null;
}

const provinces = [
  'Kinshasa',
  'Nord-Kivu',
  'Sud-Kivu',
  'Kongo-Central',
  'Kwilu',
  'Kasaï',
  'Kasaï-Central',
  'Kasaï-Oriental',
  'Lomami',
  'Sankuru',
  'Maniema',
  'Tshopo',
  'Bas-Uele',
  'Haut-Uele',
  'Ituri',
  'Nord-Ubangi',
  'Sud-Ubangi',
  'Mongala',
  'Équateur',
  'Tshuapa',
  'Mai-Ndombe',
  'Kwango',
  'Tanganyika',
  'Haut-Lomami',
  'Lualaba',
  'Haut-Katanga'
];

const AddAdminForm: React.FC<AddAdminFormProps> = ({ onSubmit, onClose, isLoading, currentUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(currentUser?.role === 'provincial_admin' ? 'provincial_admin' : 'provincial_admin');
  const [province, setProvince] = useState(currentUser?.role === 'provincial_admin' && currentUser.province ? currentUser.province : '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !role) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    if (role === 'provincial_admin' && !province) {
      setError('La province est obligatoire pour un administrateur provincial.');
      return;
    }
    onSubmit({ name, email, role, province: role === 'provincial_admin' ? province : undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rôle</label>
        <select
            id="role"
            value={role}
            onChange={(e) => {
              const selectedRole = e.target.value as UserRole;
              setRole(selectedRole);
              if (selectedRole === 'provincial_admin' && currentUser?.role === 'provincial_admin' && currentUser.province) {
                setProvince(currentUser.province);
              } else {
                setProvince('');
              }
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
          {currentUser?.role === 'super_admin' && <option value="super_admin">Super Administrateur</option>}
          {(currentUser?.role === 'super_admin' || currentUser?.role === 'national_admin') && <option value="national_admin">Administrateur National</option>}
          {currentUser?.role === 'provincial_admin' && <option value="provincial_admin">Administrateur Provincial</option>}
        </select>
      </div>
      {role === 'provincial_admin' && (
        <div>
          <label htmlFor="province" className="block text-sm font-medium text-gray-700">Province</label>
          <select
            id="province"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            disabled={currentUser?.role === 'provincial_admin' && !!currentUser.province}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Sélectionner une province</option>
            {provinces.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
        <Button type="submit" isLoading={isLoading}>Ajouter</Button>
      </div>
    </form>
  );
};

const AdminsManagementPage: React.FC = () => {
  const { user: currentUser, login, logout } = useAuthStore(); // Assuming login/logout are exposed for mock user management
  const [admins, setAdmins] = useState<User[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Mock function to simulate fetching admins
  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const storedUsers = localStorage.getItem('mock_users');
      if (storedUsers) {
        setAdmins(JSON.parse(storedUsers));
      } else {
        // Initialize with some mock users if none exist
        const initialMockUsers: User[] = [
          {
            id: '1',
            name: 'Admin National',
            email: 'admin@senasem.cd',
            role: 'national_admin',
          },
          {
            id: '2',
            name: 'Admin Kinshasa',
            email: 'kinshasa@senasem.cd',
            role: 'provincial_admin',
            province: 'Kinshasa',
          },
          {
            id: '3',
            name: 'Super Admin',
            email: 'super@senasem.cd',
            role: 'super_admin',
          },
        ];
        localStorage.setItem('mock_users', JSON.stringify(initialMockUsers));
        setAdmins(initialMockUsers);
      }
    } catch (err) {
      setErrorMessage('Erreur lors du chargement des administrateurs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (newAdmin: Omit<User, 'id'>) => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      // Simulate API call to add admin
      await new Promise(resolve => setTimeout(resolve, 500));
      const adminToAdd: User = { ...newAdmin, id: (admins.length + 1).toString() };
      const updatedAdmins = [...admins, adminToAdd];
      localStorage.setItem('mock_users', JSON.stringify(updatedAdmins));
      setAdmins(updatedAdmins);
      setSuccessMessage('Administrateur ajouté avec succès!');
      setIsAddModalOpen(false);
    } catch (err) {
      setErrorMessage('Erreur lors de l\'ajout de l\'administrateur.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) return;
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedAdmins = admins.filter(admin => admin.id !== adminId);
      localStorage.setItem('mock_users', JSON.stringify(updatedAdmins));
      setAdmins(updatedAdmins);
      setSuccessMessage('Administrateur supprimé avec succès!');
    } catch (err) {
      setErrorMessage('Erreur lors de la suppression de l\'administrateur.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'Super Administrateur';
      case 'national_admin': return 'Administrateur National';
      case 'provincial_admin': return 'Administrateur Provincial';
      default: return role;
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Administrateurs</h1>
          <p className="text-gray-500 mt-1">Gérez les comptes administrateurs et leurs permissions</p>
        </div>
        <div className="mt-4 md:mt-0">
          {currentUser?.role === 'super_admin' && (
            <Button
              leftIcon={<UserPlus className="w-4 h-4" />}
              size="md"
              onClick={() => setIsAddModalOpen(true)}
            >
              Ajouter un Administrateur
            </Button>
          )}
        </div>
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <CheckCircle className="inline w-5 h-5 mr-2" />
          {successMessage}
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <XCircle className="inline w-5 h-5 mr-2" />
          {errorMessage}
        </motion.div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Liste des Administrateurs</h2>
          {/* Future search/filter for admins */}
        </div>
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Chargement des administrateurs...</div>
        ) : admins.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Aucun administrateur trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Province</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getRoleDisplayName(admin.role)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.province || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {currentUser?.role === 'super_admin' && admin.role !== 'super_admin' && (
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={<Trash2 className="w-4 h-4" />}
                          onClick={() => handleDeleteAdmin(admin.id)}
                        >
                          Supprimer
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Ajouter un nouvel Administrateur"
      >
        <AddAdminForm
          onSubmit={handleAddAdmin}
          onClose={() => setIsAddModalOpen(false)}
          isLoading={isLoading}
          currentUser={currentUser}
        />
      </Modal>
    </div>
  );
};

export default AdminsManagementPage;