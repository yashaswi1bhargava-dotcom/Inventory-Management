import { useEffect, useState } from 'react';
import { UserPlus, Trash2, Pencil } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { usersApi } from '../services/api';
import type { User } from '../types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = () => {
    usersApi.list()
      .then(({ data }) => setUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => {
    setEditUser(null);
    setForm({ name: '', email: '', password: '', role: 'user' });
    setError('');
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editUser) {
        const updateData: Partial<User> = { name: form.name, email: form.email, role: form.role as User['role'] };
        await usersApi.update(editUser.user_id, updateData);
      } else {
        await usersApi.create(form);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(typeof message === 'string' ? message : 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Delete user "${user.name}"?`)) return;
    try {
      await usersApi.delete(user.user_id);
      fetchUsers();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      alert(typeof message === 'string' ? message : 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage team members and their roles"
        actions={
          <button onClick={openCreate} className="btn-primary">
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        }
      />

      <div className="card overflow-hidden !p-0">
        {users.length === 0 ? (
          <EmptyState
            icon={<UserPlus className="h-8 w-8" />}
            title="No users yet"
            description="Create your first team member to get started."
            action={<button onClick={openCreate} className="btn-primary">Add User</button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b table-header">
                <tr className="text-xs font-medium uppercase tracking-wider text-navy-secondary">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {users.map((user) => (
                  <tr key={user.user_id} className="table-row">
                    <td className="px-6 py-4 font-medium text-navy">{user.name}</td>
                    <td className="px-6 py-4 text-navy-secondary">{user.email}</td>
                    <td className="px-6 py-4"><Badge status={user.role} /></td>
                    <td className="px-6 py-4"><Badge status={user.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(user)} className="icon-btn">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(user)} className="icon-btn-warning">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editUser ? 'Edit User' : 'Create User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border alert-error">{error}</div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-secondary">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-secondary">Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
          </div>
          {!editUser && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-secondary">Password</label>
              <input required type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy-secondary">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving...' : editUser ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
