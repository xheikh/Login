import React, { useState } from 'react';
import { User, Task, CoinTransaction } from '../types';
import { DashboardIcon, TasksIcon, PaymentsIcon, NotificationsIcon, LogoutIcon, SunIcon, MoonIcon, SubmitWorkIcon, SupportIcon, CoinHistoryIcon, PaperClipIcon, PlusIcon, SettingsIcon, XIcon } from './icons/Icons';

interface UserDashboardProps {
  onLogout: () => void;
  theme: string;
  toggleTheme: () => void;
  user: User | null;
  tasks: Task[];
  transactions: CoinTransaction[];
  onRequestWithdrawal: (userId: number, amount: number) => void;
  onTaskSubmit: (taskId: number, submission: { notes: string; attachments?: string[]; link?: string; }) => void;
  onChangePassword: (userId: number, currentPass: string, newPass: string) => Promise<string>;
  isMaintenance: boolean;
}

const BalanceCard: React.FC<{ balance: number; onAction: () => void; }> = ({ balance, onAction }) => (
    <div className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-2">
        <div className="text-center">
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">My Balance</p>
            <p className="text-4xl font-bold text-gray-800 dark:text-white my-2">{balance.toFixed(2)} <span className="text-2xl text-primary">PKRs</span></p>
        </div>
        <button onClick={onAction} className={`mt-4 w-full py-2 font-semibold rounded-lg text-white bg-green-500 hover:opacity-90 transition`}>
            Request Payment
        </button>
    </div>
);


const ActionCard: React.FC<{ title: string; value?: string; icon: React.ReactNode; color: string; actionText: string; onAction: () => void; }> = ({ title, value, icon, color, actionText, onAction }) => (
    <div className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-2">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                {value && <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>}
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                {icon}
            </div>
        </div>
        <button onClick={onAction} className={`mt-6 w-full py-2 font-semibold rounded-lg text-white ${color} hover:opacity-90 transition`}>
            {actionText}
        </button>
    </div>
);

const NotificationPopup: React.FC<{ title: string; message: string; onClose: () => void}> = ({ title, message, onClose }) => (
    <div className="fixed top-20 right-6 bg-white dark:bg-secondary-light p-5 rounded-lg shadow-2xl w-80 z-50 animate-fade-in border border-primary">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg text-primary">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
    </div>
);

const WithdrawModal: React.FC<{user: User; onClose: () => void; onWithdraw: (amount: number) => void;}> = ({ user, onClose, onWithdraw }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const handleWithdraw = () => {
        const withdrawAmount = parseFloat(amount);
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        if (withdrawAmount > user.balance) {
            setError('Withdrawal amount cannot exceed your available balance.');
            return;
        }
        onWithdraw(withdrawAmount);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-secondary-light p-8 rounded-lg shadow-xl w-full max-w-md animate-slide-in-up">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Request Payment</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Your current balance is <span className="font-bold text-primary">{user.balance.toFixed(2)} PKRs</span>.</p>
                
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Withdrawal Amount (PKRs)</label>
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => { setAmount(e.target.value); setError(''); }}
                        className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600"
                        placeholder="e.g., 50.00" 
                    />
                </div>

                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

                <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-gray-700 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition">Cancel</button>
                    <button onClick={handleWithdraw} className="px-6 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition">Request Withdrawal</button>
                </div>
            </div>
        </div>
    );
};

const SubmissionModal: React.FC<{ task: Task; onClose: () => void; onSubmit: (taskId: number, data: { notes: string; attachments?: string[]; link?: string; }) => void; }> = ({ task, onClose, onSubmit }) => {
    const [notes, setNotes] = useState('');
    const [link, setLink] = useState('');
    const [attachments, setAttachments] = useState<string[]>([]);
    const [currentAttachment, setCurrentAttachment] = useState('');

    const handleAddAttachment = () => {
        if (currentAttachment.trim() !== '') {
            setAttachments(prev => [...prev, currentAttachment.trim()]);
            setCurrentAttachment('');
        }
    };

    const handleRemoveAttachment = (indexToRemove: number) => {
        setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = () => {
        if (notes.trim() === '') {
            alert('Please provide submission notes.');
            return;
        }
         if (task.submissionType === 'link' && link.trim() === '') {
            alert('Please provide the submission link.');
            return;
        }
        
        const submissionData: { notes: string; attachments?: string[]; link?: string; } = { notes };
        if (task.submissionType === 'file') {
            submissionData.attachments = attachments;
        }
        if (task.submissionType === 'link') {
            submissionData.link = link;
        }
        
        onSubmit(task.id, submissionData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-secondary-light p-8 rounded-lg shadow-xl w-full max-w-lg animate-slide-in-up">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Submit Work for: {task.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Enter the required information for your submission.</p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-gray-300">Submission Notes *</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={4}
                            className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600"
                            placeholder="Add any comments about your work..."
                            required
                        />
                    </div>
                     {task.submissionType === 'link' && (
                         <div>
                            <label htmlFor="link" className="text-sm font-medium text-gray-700 dark:text-gray-300">Submission Link *</label>
                            <input
                                id="link"
                                type="url"
                                value={link}
                                onChange={e => setLink(e.target.value)}
                                className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600"
                                placeholder="https://example.com/your-work"
                                required
                            />
                        </div>
                     )}
                     {task.submissionType === 'file' && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Attachments (add file name)</label>
                            <div className="flex items-center mt-1 gap-2">
                                 <input 
                                    type="text" 
                                    value={currentAttachment} 
                                    onChange={e => setCurrentAttachment(e.target.value)}
                                    className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-secondary-light dark:text-white dark:border-gray-600"
                                    placeholder="e.g., design.zip" 
                                />
                                <button onClick={handleAddAttachment} className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"><PlusIcon className="w-5 h-5"/></button>
                            </div>
                            <ul className="mt-2 space-y-2">
                                {attachments.map((file, index) => (
                                    <li key={index} className="flex items-center justify-between p-2 bg-gray-200 dark:bg-secondary rounded-md text-sm text-gray-700 dark:text-gray-300">
                                        <span className="flex items-center gap-2">
                                            <PaperClipIcon className="w-4 h-4" />
                                            {file}
                                        </span>
                                        <button onClick={() => handleRemoveAttachment(index)} className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                     )}
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-gray-700 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition">Cancel</button>
                    <button onClick={handleSubmit} className="px-6 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition">Submit Work</button>
                </div>
            </div>
        </div>
    );
};


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

const UserSettings: React.FC<{
    user: User;
    onChangePassword: (userId: number, currentPass: string, newPass: string) => Promise<string>;
}> = ({ user, onChangePassword }) => {
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({...prev, [name]: value}));
    };

    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback({ type: '', message: '' });
        if (passwordData.new !== passwordData.confirm) {
            setFeedback({ type: 'error', message: 'New passwords do not match.' });
            return;
        }
        try {
            const message = await onChangePassword(user.id, passwordData.current, passwordData.new);
            setFeedback({ type: 'success', message });
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (error: any) {
            setFeedback({ type: 'error', message: error });
        }
    };
    
    return (
        <div className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6">
             <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Settings</h2>
            {feedback.message && (
                <div className={`p-3 mb-4 text-sm rounded-lg ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {feedback.message}
                </div>
            )}
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
        </div>
    );
};

const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout, theme, toggleTheme, user, tasks, transactions, onRequestWithdrawal, onTaskSubmit, onChangePassword, isMaintenance }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showAdminNotification, setShowAdminNotification] = useState(false);
    const [notification, setNotification] = useState<{title: string, message: string} | null>(null);
    const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
    const [taskToSubmit, setTaskToSubmit] = useState<Task | null>(null);
    const [activeView, setActiveView] = useState('Dashboard');

    if (!user) {
        return <div className="flex items-center justify-center h-screen">Loading user data...</div>;
    }
    
    if (isMaintenance) {
        return (
             <div className="flex flex-col items-center justify-center h-screen text-center p-4 bg-gray-100 dark:bg-secondary-dark">
                <h1 className="text-4xl font-bold text-primary mb-4">Down for Maintenance</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">We are currently performing scheduled maintenance. We should be back online shortly. Thank you for your patience!</p>
            </div>
        );
    }

    const userTasks = tasks.filter(task => task.assignedTo.includes(user.id));
    const activeUserTasksCount = userTasks.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
    const submittableTasks = userTasks.filter(t => t.status === 'Open' || t.status === 'In Progress');

    const handleWithdraw = (amount: number) => {
        onRequestWithdrawal(user.id, amount);
        setWithdrawModalOpen(false);
        setNotification({
            title: 'Request Submitted!',
            message: `Your withdrawal request for ${amount.toFixed(2)} PKRs has been sent for approval.`
        });
        setTimeout(() => setNotification(null), 5000); // Hide after 5 seconds
    }
    
    const handleOpenSubmissionModal = (task: Task) => {
        setTaskToSubmit(task);
        setIsSubmissionModalOpen(true);
    };

    const handleTaskSubmitAction = (taskId: number, submissionData: { notes: string; attachments?: string[]; link?: string; }) => {
        onTaskSubmit(taskId, submissionData);
        setIsSubmissionModalOpen(false);
        setTaskToSubmit(null);
        setNotification({
            title: 'Task Submitted!',
            message: 'Your work has been sent to the admin for review.'
        });
        setTimeout(() => setNotification(null), 5000);
    };


    const navItems = [
        { name: 'Dashboard', icon: <DashboardIcon className="w-6 h-6" /> },
        { name: 'My Tasks', icon: <TasksIcon className="w-6 h-6" /> },
        { name: 'Balance History', icon: <CoinHistoryIcon className="w-6 h-6" /> },
        { name: 'Submit Work', icon: <SubmitWorkIcon className="w-6 h-6" /> },
        { name: 'Support Chat', icon: <SupportIcon className="w-6 h-6" /> },
        { name: 'Settings', icon: <SettingsIcon className="w-6 h-6" /> },
    ];

    const renderContent = () => {
        switch(activeView) {
            case 'Dashboard':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <BalanceCard balance={user.balance} onAction={() => setWithdrawModalOpen(true)} />
                                <ActionCard onAction={() => setActiveView('My Tasks')} title="My Tasks" value={`${activeUserTasksCount} Active`} icon={<TasksIcon className="w-7 h-7 text-white"/>} color="bg-blue-500" actionText="View Tasks" />
                                <ActionCard onAction={() => setActiveView('Submit Work')} title="Submit Work" icon={<SubmitWorkIcon className="w-7 h-7 text-white"/>} color="bg-purple-500" actionText="Go to Submissions" />
                                <ActionCard onAction={() => setActiveView('Support Chat')} title="Support Chat" icon={<SupportIcon className="w-7 h-7 text-white"/>} color="bg-orange-500" actionText="Open Chat" />
                            </div>
                        </div>

                        {/* Right Column (Profile Card) */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6 text-center">
                                <Avatar name={user.fullName} className="w-24 h-24 text-3xl mx-auto -mt-12 border-4 border-white dark:border-secondary" />
                                <h2 className="text-xl font-bold mt-4 text-gray-800 dark:text-white">{user.fullName}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">User ID: #{user.id}</p>
                                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <div className="flex justify-around text-sm">
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-white">{userTasks.filter(t => t.status === 'Completed').length}</p>
                                            <p className="text-gray-500 dark:text-gray-400">Tasks Done</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-white">4.8/5</p>
                                            <p className="text-gray-500 dark:text-gray-400">Rating</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'My Tasks':
                 return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Assigned Tasks</h2>
                        {userTasks.length > 0 ? (
                            userTasks.map(task => (
                                <div key={task.id} className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{task.title}</h3>
                                            <p className="text-sm text-gray-500">{task.projectName}</p>
                                        </div>
                                        <span className="text-lg font-bold text-green-500 mt-2 md:mt-0">{task.reward.toFixed(2)} PKRs</span>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 my-4">
                                        <span>Deadline: <span className="font-semibold text-gray-700 dark:text-gray-300">{task.deadline}</span></span>
                                        <span>Status: <span className="font-semibold text-gray-700 dark:text-gray-300">{task.status}</span></span>
                                        <span>Submission: <span className="font-semibold text-gray-700 dark:text-gray-300 capitalize">{task.submissionType}</span></span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">{task.description}</p>
                                    {(task.status === 'Open' || task.status === 'In Progress') && (
                                        <button onClick={() => handleOpenSubmissionModal(task)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition">
                                            Submit Task
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                             <div className="text-center p-10 bg-white dark:bg-secondary rounded-xl shadow-lg">
                                <h2 className="text-2xl font-bold">No Tasks Assigned</h2>
                                <p className="text-gray-500">You don't have any tasks right now. Check back later!</p>
                            </div>
                        )}
                    </div>
                );
            case 'Balance History':
                 return (
                    <div className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Balance Transaction History</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-secondary-light dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                        <th scope="col" className="px-6 py-3">Description</th>
                                        <th scope="col" className="px-6 py-3">Amount</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.length > 0 ? transactions.map(tx => (
                                        <tr key={tx.id} className="bg-white dark:bg-secondary border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-secondary-light">
                                            <td className="px-6 py-4">{new Date(tx.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{tx.source}</td>
                                            <td className={`px-6 py-4 font-bold ${tx.type === 'Deposit' ? 'text-green-500' : 'text-red-500'}`}>
                                                {tx.type === 'Deposit' ? '+' : '-'}{tx.amount.toFixed(2)} PKRs
                                            </td>
                                            <td className="px-6 py-4">
                                                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    tx.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                    tx.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                }`}>{tx.status}</span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-10 text-gray-500">No transactions yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'Submit Work':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Submit Your Work</h2>
                        <p className="text-gray-500 dark:text-gray-400">Select a task from the list below to submit your completed work for review.</p>
                        {submittableTasks.length > 0 ? (
                            submittableTasks.map(task => (
                                <div key={task.id} className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between md:items-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{task.title}</h3>
                                        <p className="text-sm text-gray-500">{task.projectName}</p>
                                    </div>
                                    <button onClick={() => handleOpenSubmissionModal(task)} className="mt-4 md:mt-0 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition whitespace-nowrap">
                                        Upload Now
                                    </button>
                                </div>
                            ))
                        ) : (
                             <div className="text-center p-10 bg-white dark:bg-secondary rounded-xl shadow-lg">
                                <h2 className="text-2xl font-bold">No Tasks to Submit</h2>
                                <p className="text-gray-500">You have no active tasks that are ready for submission.</p>
                            </div>
                        )}
                    </div>
                );
            case 'Support Chat':
                return <div className="text-center p-10"><h2 className="text-2xl font-bold">Support Chat</h2><p className="text-gray-500">Chat with our support team if you have any questions.</p></div>;
            case 'Settings':
                return <UserSettings user={user} onChangePassword={onChangePassword} />;
            default:
                return <div>Select a view</div>
        }
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-secondary-dark text-gray-800 dark:text-gray-200">
            {showAdminNotification && <NotificationPopup title="New Message from Admin" message="Your recent payment request has been approved. The funds will be transferred within 2-3 business days." onClose={() => setShowAdminNotification(false)} />}
            {notification && <NotificationPopup title={notification.title} message={notification.message} onClose={() => setNotification(null)} />}
            {isWithdrawModalOpen && <WithdrawModal user={user} onClose={() => setWithdrawModalOpen(false)} onWithdraw={handleWithdraw} />}
            {isSubmissionModalOpen && taskToSubmit && <SubmissionModal task={taskToSubmit} onClose={() => setIsSubmissionModalOpen(false)} onSubmit={handleTaskSubmitAction} />}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-secondary shadow-xl z-30 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
                <div className="flex items-center justify-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-2xl font-bold text-primary">EarnEdge</span>
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
                        <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 ml-4 md:ml-0">Welcome, {user.fullName.split(' ')[0]}!</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-secondary-light hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                            {theme === 'light' ? <MoonIcon className="w-5 h-5 text-gray-700" /> : <SunIcon className="w-5 h-5 text-yellow-400" />}
                        </button>
                        <button onClick={() => setShowAdminNotification(!showAdminNotification)} className="relative p-2 rounded-full bg-gray-200 dark:bg-secondary-light hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                            <NotificationsIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                             <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>                         <Avatar name={user.fullName} className="w-10 h-10" />
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-secondary-dark p-6 animate-fade-in">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default UserDashboard;