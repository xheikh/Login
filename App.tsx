import React, { useState, useEffect } from 'react';
import { View, User, Task, CoinTransaction, AppSettings } from './types';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';

const initialUsers: User[] = [
    { id: 1, fullName: 'John Doe', username: 'johndoe', email: 'john.d@example.com', phone: '+11234567890', password: 'johndoe', balance: 1234.56, status: 'Active', role: 'User', joined: '2023-01-15' },
    { id: 2, fullName: 'Jane Smith', username: 'janesmith', email: 'jane.s@example.com', phone: '+1234567891', password: 'janesmith', balance: 580.00, status: 'Active', role: 'User', joined: '2023-02-20' },
    { id: 3, fullName: 'Mike Johnson', username: 'mikej', email: 'mike.j@example.com', phone: '+1345678912', password: 'mikej', balance: 0, status: 'Inactive', role: 'User', joined: '2023-03-10' },
    { id: 4, fullName: 'Admin User', username: 'admin', email: 'admin@earnedge.com', phone: '+1456789123', password: 'admin', balance: 99999, status: 'Active', role: 'Admin', joined: '2023-01-01' },
    { id: 5, fullName: 'Emily Brown', username: 'emilyb', email: 'emily.b@example.com', phone: '+1567891234', password: 'emilyb', balance: 75.20, status: 'Pending', role: 'User', joined: '2023-05-01' },
    { id: 6, fullName: 'Sam Wilson', username: 'samw', email: 'sam.w@example.com', phone: '+1678912345', password: 'samw', balance: 150.00, status: 'Blocked', role: 'User', joined: '2023-06-12' },
];

const initialTasks: Task[] = [
    { id: 1, projectName: 'CRM Update', title: 'Data Entry Project', description: 'Enter 500 records into the new CRM system. Details are in the attached spreadsheet.', reward: 150, status: 'Open', deadline: '2025-08-15', assignedTo: [1, 2], submissionType: 'file' },
    { id: 2, projectName: 'Marketing Campaign', title: 'Social Media Graphics', description: 'Create 10 engaging graphics for our upcoming social media campaign. Submit the link to the Canva project.', reward: 200, status: 'In Progress', deadline: '2025-08-10', assignedTo: [2], submissionType: 'link' },
    { id: 3, projectName: 'Global Outreach', title: 'Content Translation', description: 'Translate 5 blog posts from English to Spanish.', reward: 350, status: 'Completed', deadline: '2025-07-20', assignedTo: [1], submissionType: 'file' },
    { id: 4, projectName: 'Website Launch', title: 'Website Beta Testing', description: 'Perform user testing on the new website beta and report any bugs found in the notes.', reward: 100, status: 'Open', deadline: '2025-08-25', assignedTo: [1], submissionType: 'notes' },
];

const initialTransactions: CoinTransaction[] = [
    { id: 1, userId: 1, type: 'Deposit', source: 'Initial Balance', amount: 1000, date: '2023-01-15', status: 'Completed' },
    { id: 2, userId: 2, type: 'Deposit', source: 'Task Payout: Social Media Graphics', amount: 200, date: '2025-08-11', status: 'Completed' },
    { id: 3, userId: 1, type: 'Withdrawal', source: 'Withdrawal Request', amount: 100, date: '2025-08-12', status: 'Pending' },
    { id: 4, userId: 2, type: 'Withdrawal', source: 'Withdrawal Request', amount: 50, date: '2025-08-13', status: 'Completed' },
    { id: 5, userId: 5, type: 'Deposit', source: 'Welcome Bonus', amount: 75.20, date: '2023-05-01', status: 'Completed' },
    { id: 6, userId: 1, type: 'Deposit', source: 'Task Payout: Content Translation', amount: 334.56, date: '2025-07-21', status: 'Completed' },
    { id: 7, userId: 2, type: 'Withdrawal', source: 'Withdrawal Request', amount: 25, date: '2025-08-15', status: 'Rejected' },
];

const initialAppSettings: AppSettings = {
    siteName: "EarnEdge",
    maintenanceMode: false,
    allowRegistration: true,
    contactPhone: "+1 (800) 555-0123"
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LOGIN);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [transactions, setTransactions] = useState<CoinTransaction[]>(initialTransactions);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings>(initialAppSettings);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const toggleTheme = () => {
    // FIX: Correctly toggle between 'light' and 'dark' themes.
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentView(View.LOGIN);
  };

  const handleLogin = (user: User) => {
    setLoggedInUser(user);
    if (appSettings.maintenanceMode && user.role !== 'Admin') {
        alert("The site is currently down for maintenance. Please check back later.");
        setLoggedInUser(null);
        return;
    }
    if (user.role === 'Admin') {
        setCurrentView(View.ADMIN_DASHBOARD);
    } else {
        setCurrentView(View.USER_DASHBOARD);
    }
  };
  
  const handleUserSignup = (signupData: { fullName: string; username: string; email: string; phone: string; password?: string; }) => {
    const newUser: User = {
        id: Date.now(),
        fullName: signupData.fullName,
        username: signupData.username,
        email: signupData.email,
        phone: signupData.phone,
        password: signupData.password,
        balance: 0,
        status: 'Pending',
        role: 'User',
        joined: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [...prev, newUser]);
  };
  
  const handleChangePassword = (userId: number, currentPass: string, newPass: string): Promise<string> => {
      return new Promise((resolve, reject) => {
          const user = users.find(u => u.id === userId);
          if (!user || user.password !== currentPass) {
              reject("Current password does not match.");
              return;
          }
          const updatedUsers = users.map(u => u.id === userId ? { ...u, password: newPass } : u);
          setUsers(updatedUsers);
          // Also update loggedInUser if it's the current user
          if (loggedInUser && loggedInUser.id === userId) {
              setLoggedInUser(prev => prev ? { ...prev, password: newPass } : null);
          }
          resolve("Password changed successfully.");
      });
  };

  const handleRequestWithdrawal = (userId: number, amount: number) => {
    const newTransaction: CoinTransaction = {
      id: Date.now(),
      userId,
      type: 'Withdrawal',
      source: 'Withdrawal Request',
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleUpdateTransactionStatus = (transactionId: number, newStatus: 'Completed' | 'Rejected') => {
    const updatedTransactions = transactions.map(t => {
      if (t.id === transactionId) {
        if (newStatus === 'Completed' && t.status === 'Pending') {
          setUsers(prevUsers => prevUsers.map(u => 
            u.id === t.userId ? { ...u, balance: u.balance - t.amount } : u
          ));
        }
        return { ...t, status: newStatus };
      }
      return t;
    });
    setTransactions(updatedTransactions);
  };
  
  const handleSaveUserByAdmin = (userToSave: User, reason: string = 'Admin Adjustment') => {
      if (userToSave.id === 0) { // New User
          const newUser = { 
              ...userToSave, 
              id: Date.now(), 
              username: userToSave.username || userToSave.fullName.toLowerCase().replace(/\s/g, ''),
              joined: new Date().toISOString().split('T')[0],
           };
          setUsers(prev => [...prev, newUser]);
          if (newUser.balance > 0) {
              const newTransaction: CoinTransaction = {
                  id: Date.now() + 1,
                  userId: newUser.id,
                  type: 'Deposit',
                  source: 'Initial Balance (Admin)',
                  amount: newUser.balance,
                  date: new Date().toISOString().split('T')[0],
                  status: 'Completed',
              };
              setTransactions(prev => [...prev, newTransaction]);
          }
      } else { // Existing User
          const originalUser = users.find(u => u.id === userToSave.id);
          if (originalUser && originalUser.balance !== userToSave.balance) {
              const diff = userToSave.balance - originalUser.balance;
              const newTransaction: CoinTransaction = {
                  id: Date.now(),
                  userId: userToSave.id,
                  type: diff > 0 ? 'Deposit' : 'Withdrawal',
                  source: reason,
                  amount: Math.abs(diff),
                  date: new Date().toISOString().split('T')[0],
                  status: 'Completed',
              };
              setTransactions(prev => [...prev, newTransaction]);
          }
          setUsers(prev => prev.map(user => user.id === userToSave.id ? userToSave : user));
      }
  };

  const handleDeleteUser = (userToDeleteId: number) => {
      setUsers(users.filter(user => user.id !== userToDeleteId));
  };

    const handleTaskSubmission = (taskId: number, submissionData: { notes: string; attachments?: string[]; link?: string; }) => {
        setTasks(prevTasks => prevTasks.map(task => 
            task.id === taskId ? { 
                ...task, 
                status: 'Pending Review',
                submission: { ...submissionData, submittedAt: new Date().toISOString() }
            } : task
        ));
    };

    const handleTaskReview = (taskId: number, isApproved: boolean) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        if (isApproved) {
            setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
            
            task.assignedTo.forEach(userId => {
                 setUsers(prevUsers => prevUsers.map(u => 
                    u.id === userId ? { ...u, balance: u.balance + task.reward } : u
                ));
                
                const newTransaction: CoinTransaction = {
                    id: Date.now() + userId, // semi-unique id
                    userId: userId,
                    type: 'Deposit',
                    source: `Task Payout: ${task.title}`,
                    amount: task.reward,
                    date: new Date().toISOString().split('T')[0],
                    status: 'Completed',
                };
                setTransactions(prev => [...prev, newTransaction]);
            })

        } else {
            // If rejected, return to 'In Progress' and clear submission
            setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, status: 'In Progress', submission: undefined } : t));
        }
    };


  const renderView = () => {
    if (appSettings.maintenanceMode && loggedInUser?.role !== 'Admin' && currentView !== View.LOGIN) {
        return <UserDashboard onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} user={loggedInUser} tasks={[]} transactions={[]} onRequestWithdrawal={() => {}} onTaskSubmit={() => {}} onChangePassword={handleChangePassword} isMaintenance={true} />;
    }
    switch (currentView) {
      case View.LOGIN:
        return <LoginPage 
                  onNavigateToSignup={() => setCurrentView(View.SIGNUP)} 
                  onLoginSuccess={handleLogin}
                  users={users}
                  appName={appSettings.siteName}
                  allowRegistration={appSettings.allowRegistration}
                />;
      case View.SIGNUP:
        return <SignupPage 
                  onNavigateToLogin={() => setCurrentView(View.LOGIN)} 
                  onSignupSubmit={handleUserSignup}
                />;
      case View.ADMIN_DASHBOARD:
        return <AdminDashboard 
                  onLogout={handleLogout} 
                  theme={theme} 
                  toggleTheme={toggleTheme} 
                  users={users}
                  onDeleteUser={handleDeleteUser}
                  onSaveUser={handleSaveUserByAdmin}
                  tasks={tasks}
                  onTasksUpdate={setTasks}
                  transactions={transactions}
                  onTransactionUpdate={handleUpdateTransactionStatus}
                  onTaskReview={handleTaskReview}
                  adminUser={loggedInUser}
                  appSettings={appSettings}
                  onAppSettingsChange={setAppSettings}
                  onChangePassword={handleChangePassword}
                />;
      case View.USER_DASHBOARD:
        return <UserDashboard 
                  onLogout={handleLogout} 
                  theme={theme} 
                  toggleTheme={toggleTheme}
                  user={loggedInUser}
                  tasks={tasks}
                  transactions={transactions.filter(t => t.userId === loggedInUser?.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
                  onRequestWithdrawal={handleRequestWithdrawal}
                  onTaskSubmit={handleTaskSubmission}
                  onChangePassword={handleChangePassword}
                  isMaintenance={false}
                />;
      default:
        return <LoginPage 
                  onNavigateToSignup={() => setCurrentView(View.SIGNUP)} 
                  onLoginSuccess={handleLogin}
                  users={users}
                  appName={appSettings.siteName}
                  allowRegistration={appSettings.allowRegistration}
                />;
    }
  };

  return <div className="min-h-screen font-sans">{renderView()}</div>;
};

export default App;
