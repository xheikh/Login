import React, { useState, useEffect } from 'react';
import { User, Task, CoinTransaction, SubmissionType, AppSettings } from '../types';
import { DashboardIcon, UsersIcon, TasksIcon, PaymentsIcon, NotificationsIcon, SettingsIcon, LogoutIcon, SunIcon, MoonIcon, PlusIcon, EditIcon, DeleteIcon, SearchIcon, CheckCircleIcon, XCircleIcon, ClipboardCheckIcon, PaperClipIcon } from './icons/Icons';

interface AdminDashboardProps {
  onLogout: () => void;
  theme: string;
  toggleTheme: () => void;
  users: User[];
  onDeleteUser: (userId: number) => void;
  onSaveUser: (user: User, reason?: string) => void;
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
  transactions: CoinTransaction[];
  onTransactionUpdate: (transactionId: number, status: 'Completed' | 'Rejected') => void;
  onTaskReview: (taskId: number, isApproved: boolean) => void;
  adminUser: User | null;
  appSettings: AppSettings;
  onAppSettingsChange: (settings: AppSettings) => void;
  onChangePassword: (userId: number, currentPass: string, newPass: string) => Promise<string>;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; onClick?: () => void; }> = ({ title, value, icon, color, onClick }) => (
    <div onClick={onClick} className={`bg-white dark:bg-secondary rounded-xl shadow-lg p-6 flex items-center space-x-4 transition-transform transform hover:scale-105 ${onClick ? 'cursor-pointer' : ''}`}>
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
    </div>
);

const Avatar: React.FC<{ name: string; className?: string; }> = ({ name, className = '' }) => {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-indigo-500', 'bg-pink-500'];
    const colorIndex = (name.charCodeAt(0) + name.length) % colors.length;
    
    return (
        <div className={`rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold ${colors[colorIndex]} ${className}`}>
            {initials}
        </div>
    );
};

const ConfirmationModal: React.FC<{ title: string; message: string; onConfirm: () => void; onCancel: () => void; }> = ({ title, message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-white dark:bg-secondary-light p-8 rounded-lg shadow-xl w-full max-w-md animate-slide-in-up">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <div className="flex justify-end space-x-4">
                <button onClick={onCancel} className="px-6 py-2 text-gray-700 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition">Cancel</button>
                <button onClick={onConfirm} className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition">Confirm</button>
            </div>
        </div>
    </div>
);

const UserModal: React.FC<{ user: User | null; onClose: () => void; onSave: (user: User, reason: string) => void; }> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState<User | null>(user);
    const [initialBalance] = useState(user?.balance);
    const [adjustmentReason, setAdjustmentReason] = useState('Earning/Bonus');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        setFormData(user);
    }, [user]);

    if (!formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const parsedValue = name === 'balance' ? parseFloat(value) : value;
        setFormData(prev => prev ? { ...prev, [name]: parsedValue } : null);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        if (isNewUser) {
            if (!password || password !== confirmPassword) {
                setPasswordError('Passwords do not match or are empty.');
                return;
            }
        }
        if (formData) {
            onSave({ ...formData, password: password || formData.password }, adjustmentReason);
        }
    };

    const isNewUser = !formData.id;
    const balanceChanged = formData.balance !== initialBalance;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-secondary-light p-8 rounded-lg shadow-xl w-full max-w-lg animate-slide-in-up overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{isNewUser ? 'Add New User' : 'Edit User'}</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" required />
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" required />
                        </div>
                    </div>
                    {isNewUser && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" required />
                            </div>
                             <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" required />
                            </div>
                            {passwordError && <p className="text-sm text-red-500 md:col-span-2">{passwordError}</p>}
                        </div>
                    )}
                     <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Balance (PKRs)</label>
                        <input type="number" name="balance" value={formData.balance} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" required step="0.01" />
                    </div>
                    {balanceChanged && !isNewUser && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reason for Balance Change</label>
                            <select name="adjustmentReason" value={adjustmentReason} onChange={(e) => setAdjustmentReason(e.target.value)} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600">
                                <option value="Earning/Bonus">Earning / Bonus</option>
                                <option value="Refund">Refund</option>
                                <option value="Admin Correction">Admin Correction</option>
                            </select>
                        </div>
                    )}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                            <select name="role" value={formData.role} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600">
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Pending">Pending</option>
                                <option value="Blocked">Blocked</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 text-gray-700 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition">{isNewUser ? 'Add User' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TaskModal: React.FC<{ task: Task | null; users: User[]; onClose: () => void; onSave: (task: Task) => void; }> = ({ task, users, onClose, onSave }) => {
    const [formData, setFormData] = useState<Task | null>(task);

    useEffect(() => {
        setFormData(task);
    }, [task]);

    if (!formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        let processedValue: string | number | SubmissionType = value;
        if (type === 'number') {
            processedValue = parseFloat(value);
        }
        
        setFormData(prev => prev ? { ...prev, [name]: processedValue } : null);
    };

    const handleAssignUser = (userId: number) => {
        setFormData(prev => {
            if (!prev) return null;
            const newAssignedTo = prev.assignedTo.includes(userId)
                ? prev.assignedTo.filter(id => id !== userId)
                : [...prev.assignedTo, userId];
            return { ...prev, assignedTo: newAssignedTo };
        });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            onSave(formData);
        }
    };

    const isNewTask = !formData.id;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-secondary-light p-8 rounded-lg shadow-xl w-full max-w-2xl animate-slide-in-up">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{isNewTask ? 'Add New Task' : 'Edit Task'}</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                        <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Task Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" required />
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reward (PKRs)</label>
                            <input type="number" name="reward" value={formData.reward} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" required step="0.01" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Deadline</label>
                            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600">
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Pending Review">Pending Review</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Submission Type</label>
                            <select name="submissionType" value={formData.submissionType} onChange={handleChange} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600">
                                <option value="notes">Notes Only</option>
                                <option value="file">File Attachment</option>
                                <option value="link">Link Submission</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Assign to Users</label>
                         <div className="mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg max-h-32 overflow-y-auto bg-gray-100 dark:bg-secondary-light">
                            {users.filter(u => u.role === 'User').map(user => (
                                <div key={user.id} className="flex items-center p-1">
                                    <input
                                        type="checkbox"
                                        id={`assign-user-${user.id}`}
                                        checked={formData.assignedTo.includes(user.id)}
                                        onChange={() => handleAssignUser(user.id)}
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    />
                                    <label htmlFor={`assign-user-${user.id}`} className="ml-2 text-gray-700 dark:text-gray-300">{user.fullName}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 text-gray-700 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition">Cancel</button>
                        <button type="submit" className="px-6 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition">{isNewTask ? 'Add Task' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ReviewModal: React.FC<{ task: Task | null; users: User[]; onClose: () => void; onReview: (taskId: number, isApproved: boolean) => void; }> = ({ task, users, onClose, onReview }) => {
    if (!task || !task.submission) return null;

    const submittingUser = users.find(u => u.id === task.assignedTo[0]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-secondary-light p-8 rounded-lg shadow-xl w-full max-w-2xl animate-slide-in-up">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Review Task Submission</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Task: <span className="font-semibold">{task.title}</span> | Submitted by: <span className="font-semibold">{submittingUser?.fullName}</span></p>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Submission Notes</label>
                        <div className="mt-1 p-3 w-full bg-gray-100 dark:bg-secondary rounded-lg border border-gray-300 dark:border-gray-600 min-h-[100px]">
                           {task.submission.notes}
                        </div>
                    </div>
                    {task.submission.link && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Submitted Link</label>
                            <div className="mt-1 p-3 w-full bg-gray-100 dark:bg-secondary rounded-lg border border-gray-300 dark:border-gray-600">
                               <a href={task.submission.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{task.submission.link}</a>
                            </div>
                        </div>
                    )}
                    {task.submission.attachments && task.submission.attachments.length > 0 && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Attachments</label>
                             <ul className="mt-1 p-3 space-y-2 w-full bg-gray-100 dark:bg-secondary rounded-lg border border-gray-300 dark:border-gray-600">
                               {task.submission.attachments.map((file, index) => (
                                   <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                       <PaperClipIcon className="w-4 h-4" /> {file}
                                   </li>
                               ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-gray-700 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition">Cancel</button>
                    <button onClick={() => onReview(task.id, false)} className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition">Reject</button>
                    <button onClick={() => onReview(task.id, true)} className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition">Approve & Pay</button>
                </div>
            </div>
        </div>
    );
};

const AdminSettings: React.FC<{
    adminUser: User;
    appSettings: AppSettings;
    onAppSettingsChange: (settings: AppSettings) => void;
    onChangePassword: (userId: number, currentPass: string, newPass: string) => Promise<string>;
}> = ({ adminUser, appSettings, onAppSettingsChange, onChangePassword }) => {
    const [activeTab, setActiveTab] = useState('Account');
    const [settingsData, setSettingsData] = useState(appSettings);
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        // FIX: Safely access 'checked' property for checkboxes.
        const { name, value, type } = e.target;
        setSettingsData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({...prev, [name]: value}));
    };

    const handleSaveAppSettings = () => {
        onAppSettingsChange(settingsData);
        setFeedback({ type: 'success', message: 'Application settings saved successfully!' });
        setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    };
    
    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback({ type: '', message: '' });
        if (passwordData.new !== passwordData.confirm) {
            setFeedback({ type: 'error', message: 'New passwords do not match.' });
            return;
        }
        try {
            const message = await onChangePassword(adminUser.id, passwordData.current, passwordData.new);
            setFeedback({ type: 'success', message });
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (error: any) {
            setFeedback({ type: 'error', message: error });
        }
    };
    
    return (
        <div className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="flex space-x-4">
                    <button onClick={() => setActiveTab('Account')} className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'Account' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>Account</button>
                    <button onClick={() => setActiveTab('Application')} className={`px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'Application' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>Application</button>
                </nav>
            </div>
            {feedback.message && (
                <div className={`p-3 mb-4 text-sm rounded-lg ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {feedback.message}
                </div>
            )}
            {activeTab === 'Account' && (
                <div className="max-w-md">
                    <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                    <form className="space-y-4" onSubmit={handleSavePassword}>
                         <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                            <input type="password" name="current" value={passwordData.current} onChange={handlePasswordChange} required className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" />
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                            <input type="password" name="new" value={passwordData.new} onChange={handlePasswordChange} required className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" />
                        </div>
                         <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                            <input type="password" name="confirm" value={passwordData.confirm} onChange={handlePasswordChange} required className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" />
                        </div>
                        <div className="pt-2">
                             <button type="submit" className="px-6 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition">Save Password</button>
                        </div>
                    </form>
                </div>
            )}
            {activeTab === 'Application' && (
                <div className="max-w-md space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Site Name</label>
                        <input type="text" name="siteName" value={settingsData.siteName} onChange={handleSettingsChange} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Phone Number</label>
                        <input type="tel" name="contactPhone" value={settingsData.contactPhone} onChange={handleSettingsChange} className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Allow New User Registration</label>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="allowRegistration" checked={settingsData.allowRegistration} onChange={handleSettingsChange} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                    </div>
                     <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Maintenance Mode</label>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="maintenanceMode" checked={settingsData.maintenanceMode} onChange={handleSettingsChange} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                    </div>
                    <div className="pt-2">
                        <button onClick={handleSaveAppSettings} className="px-6 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition">Save Settings</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, theme, toggleTheme, users, onDeleteUser, onSaveUser, tasks, onTasksUpdate, transactions, onTransactionUpdate, onTaskReview, adminUser, appSettings, onAppSettingsChange, onChangePassword }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeView, setActiveView] = useState('Dashboard');

    if (!adminUser) {
        return <div>Loading...</div>
    }

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsUserModalOpen(true);
    };

    const handleAddUser = () => {
        setSelectedUser({ id: 0, fullName: '', username: '', email: '', phone: '', balance: 0, status: 'Active', role: 'User', joined: '' });
        setIsUserModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            onDeleteUser(userToDelete.id);
            setUserToDelete(null);
        }
    };

    const handleSaveUser = (userToSave: User, reason: string) => {
        onSaveUser(userToSave, reason);
        setIsUserModalOpen(false);
        setSelectedUser(null);
    }
    
    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    const handleReviewTask = (task: Task) => {
        setSelectedTask(task);
        setIsReviewModalOpen(true);
    };
    
    const handleAddTask = () => {
        setSelectedTask({ id: 0, projectName: '', title: '', description: '', reward: 0, status: 'Open', deadline: new Date().toISOString().split('T')[0], assignedTo: [], submissionType: 'notes' });
        setIsTaskModalOpen(true);
    };
    
    const handleDeleteTask = (taskToDelete: Task) => {
        if(window.confirm(`Are you sure you want to delete the task "${taskToDelete.title}"?`)) {
            onTasksUpdate(tasks.filter(task => task.id !== taskToDelete.id));
        }
    }

    const handleSaveTask = (taskToSave: Task) => {
        if (taskToSave.id === 0) { // New Task
            onTasksUpdate([...tasks, { ...taskToSave, id: Date.now() }]);
        } else { // Existing Task
            onTasksUpdate(tasks.map(task => task.id === taskToSave.id ? taskToSave : task));
        }
        setIsTaskModalOpen(false);
        setSelectedTask(null);
    }

    const handleReviewAction = (taskId: number, isApproved: boolean) => {
        onTaskReview(taskId, isApproved);
        setIsReviewModalOpen(false);
        setSelectedTask(null);
    };

    const filteredUsers = users.filter(user => 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const pendingWithdrawals = transactions.filter(t => t.type === 'Withdrawal' && t.status === 'Pending');
    const allTransactions = [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const navItems = [
        { name: 'Dashboard', icon: <DashboardIcon className="w-6 h-6" /> },
        { name: 'Users', icon: <UsersIcon className="w-6 h-6" /> },
        { name: 'Tasks', icon: <TasksIcon className="w-6 h-6" /> },
        { name: 'Payments', icon: <PaymentsIcon className="w-6 h-6" /> },
        { name: 'Notifications', icon: <NotificationsIcon className="w-6 h-6" /> },
        { name: 'Settings', icon: <SettingsIcon className="w-6 h-6" /> },
    ];
    
    const getStatusClass = (status: User['status']) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Blocked': return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default: return '';
        }
    };
    
    const renderContent = () => {
        switch(activeView) {
            case 'Dashboard':
                 return (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <StatCard onClick={() => setActiveView('Users')} title="Total Users" value={users.length.toString()} icon={<UsersIcon className="w-6 h-6 text-white"/>} color="bg-blue-500" />
                            <StatCard onClick={() => setActiveView('Tasks')} title="Active Tasks" value={tasks.filter(t => t.status === 'Open' || t.status === 'In Progress').length.toString()} icon={<TasksIcon className="w-6 h-6 text-white"/>} color="bg-green-500" />
                            <StatCard onClick={() => setActiveView('Payments')} title="Pending Payments" value={pendingWithdrawals.length.toString()} icon={<PaymentsIcon className="w-6 h-6 text-white"/>} color="bg-yellow-500" />
                            <StatCard title="Total Earnings" value={`PKRs ${users.reduce((acc, u) => acc + u.balance, 0).toLocaleString()}`} icon={<NotificationsIcon className="w-6 h-6 text-white"/>} color="bg-indigo-500" />
                        </div>
                        <div className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                            <p>Dashboard summary and recent activities will be shown here.</p>
                        </div>
                    </>
                );
            case 'Users':
                return (
                    <div className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold mb-4 md:mb-0">User Management</h2>
                            <div className="flex items-center space-x-4 w-full md:w-auto">
                                <div className="relative w-full md:w-64">
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="text" placeholder="Search users..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600" />
                                </div>
                                <button onClick={handleAddUser} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition whitespace-nowrap">
                                    <PlusIcon className="w-5 h-5" /> Add User
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-secondary-light dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">User</th>
                                        <th scope="col" className="px-6 py-3">Balance</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Role</th>
                                        <th scope="col" className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="bg-white dark:bg-secondary border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-secondary-light">
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="flex items-center">
                                                    <Avatar name={user.fullName} className="w-10 h-10" />
                                                    <div className="pl-3">
                                                        <div className="text-base font-semibold">{user.fullName}</div>
                                                        <div className="font-normal text-gray-500">{user.email}</div>
                                                        <div className="font-normal text-gray-500">{user.phone}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white">{user.balance.toFixed(2)} PKRs</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(user.status)}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{user.role}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <button onClick={() => handleEditUser(user)} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-full"><EditIcon className="w-5 h-5"/></button>
                                                    <button onClick={() => setUserToDelete(user)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-gray-600 rounded-full"><DeleteIcon className="w-5 h-5"/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'Tasks':
                return (
                     <div className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold mb-4 md:mb-0">Task Management</h2>
                            <button onClick={handleAddTask} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition whitespace-nowrap">
                                <PlusIcon className="w-5 h-5" /> Add Task
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-secondary-light dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Task / Project</th>
                                        <th scope="col" className="px-6 py-3">Reward</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Deadline</th>
                                        <th scope="col" className="px-6 py-3">Assigned To</th>
                                        <th scope="col" className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map(task => (
                                        <tr key={task.id} className="bg-white dark:bg-secondary border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-secondary-light">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                <div>{task.title}</div>
                                                <div className="text-xs text-gray-500">{task.projectName}</div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">{task.reward.toFixed(2)} PKRs</td>
                                            <td className="px-6 py-4">{task.status}</td>
                                            <td className="px-6 py-4">{task.deadline}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex -space-x-2">
                                                    {task.assignedTo.map(userId => {
                                                        const user = users.find(u => u.id === userId);
                                                        return user ? <Avatar key={user.id} name={user.fullName} className="w-8 h-8 border-2 border-white dark:border-secondary" /> : null;
                                                    })}
                                                    {task.assignedTo.length === 0 && <span className="text-xs italic">Unassigned</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    {task.status === 'Pending Review' ? (
                                                        <button onClick={() => handleReviewTask(task)} className="flex items-center gap-1 px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                                                           <ClipboardCheckIcon className="w-4 h-4"/> Review
                                                        </button>
                                                    ) : (
                                                        <>
                                                        <button onClick={() => handleEditTask(task)} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-600 rounded-full"><EditIcon className="w-5 h-5"/></button>
                                                        <button onClick={() => handleDeleteTask(task)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-gray-600 rounded-full"><DeleteIcon className="w-5 h-5"/></button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'Payments':
                return (
                    <div className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Payment Records</h2>
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-secondary-light dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">User</th>
                                        <th scope="col" className="px-6 py-3">Amount</th>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                        <th scope="col" className="px-6 py-3">Type</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allTransactions.length > 0 ? allTransactions.map(tx => {
                                        const user = users.find(u => u.id === tx.userId);
                                        return (
                                            <tr key={tx.id} className="bg-white dark:bg-secondary border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-secondary-light">
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {user ? user.fullName : `User ID: ${tx.userId}`}
                                                </td>
                                                <td className={`px-6 py-4 font-semibold ${tx.type === 'Deposit' ? 'text-green-500' : 'text-red-500'}`}>{tx.amount.toFixed(2)} PKRs</td>
                                                <td className="px-6 py-4">{new Date(tx.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">{tx.type}</td>
                                                <td className="px-6 py-4">
                                                   <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        tx.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                        tx.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                    }`}>{tx.status}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {tx.status === 'Pending' ? (
                                                        <div className="flex items-center space-x-2">
                                                            <button onClick={() => onTransactionUpdate(tx.id, 'Completed')} className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-gray-600 rounded-full" title="Approve"><CheckCircleIcon className="w-6 h-6"/></button>
                                                            <button onClick={() => onTransactionUpdate(tx.id, 'Rejected')} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-gray-600 rounded-full" title="Reject"><XCircleIcon className="w-6 h-6"/></button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs italic text-gray-400">Handled</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    }) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-10 text-gray-500">No payment records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'Notifications':
                 return <div className="text-center p-10"><h2 className="text-2xl font-bold">Notifications Center</h2><p className="text-gray-500">Send notifications to users.</p></div>;
            case 'Settings':
                return <AdminSettings adminUser={adminUser} appSettings={appSettings} onAppSettingsChange={onAppSettingsChange} onChangePassword={onChangePassword} />;
            default:
                return <div>Select a view</div>
        }
    };


    return (
        <div className="flex h-screen bg-gray-100 dark:bg-secondary-dark text-gray-800 dark:text-gray-200">
            {isUserModalOpen && <UserModal user={selectedUser} onClose={() => setIsUserModalOpen(false)} onSave={handleSaveUser} />}
            {isTaskModalOpen && <TaskModal task={selectedTask} users={users} onClose={() => setIsTaskModalOpen(false)} onSave={handleSaveTask} />}
            {isReviewModalOpen && <ReviewModal task={selectedTask} users={users} onClose={() => setIsReviewModalOpen(false)} onReview={handleReviewAction} />}
            {userToDelete && <ConfirmationModal title="Confirm Deletion" message={`Are you sure you want to delete the user "${userToDelete.fullName}"? This action cannot be undone.`} onConfirm={handleConfirmDelete} onCancel={() => setUserToDelete(null)} />}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-secondary shadow-xl z-30 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
                <div className="flex items-center justify-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-2xl font-bold text-primary">{appSettings.siteName}</span>
                </div>
                <nav className="mt-6">
                    {navItems.map(item => (
                         <button 
                            key={item.name}
                            onClick={() => setActiveView(item.name)}
                            className={`w-full text-left flex items-center px-6 py-3 transition-colors duration-200 ${
                                activeView === item.name 
                                ? 'text-white bg-primary' 
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-secondary-light'
                            }`}
                        >
                           {item.icon} <span className="mx-4">{item.name}</span>
                        </button>
                    ))}
                    <button onClick={onLogout} className="w-full text-left flex items-center px-6 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-secondary-light mt-4"><LogoutIcon className="w-6 h-6" /> <span className="mx-4">Logout</span></button>
                </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center p-6 bg-white dark:bg-secondary border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none md:hidden">
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6H20M4 12H20M4 18H11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 ml-4 md:ml-0">{activeView}</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-secondary-light hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                            {theme === 'light' ? <MoonIcon className="w-5 h-5 text-gray-700" /> : <SunIcon className="w-5 h-5 text-yellow-400" />}
                        </button>
                         <Avatar name={adminUser?.fullName || 'Admin'} className="w-10 h-10" />
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-secondary-dark p-6 animate-fade-in">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
