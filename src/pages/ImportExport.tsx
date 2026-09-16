import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setClients, mergeClients } from '../store/slices/clientSlice';
import { setKaragirs, mergeKaragirs } from '../store/slices/karagirSlice';
import { Client, Karagir } from '../types';
import { 
  exportToCSV, 
  exportToExcel, 
  parseCSV, 
  parseExcel, 
  downloadSampleCSV 
} from '../utils/dataUtils';
import { FileDown, FileUp, Download, AlertCircle, Share2, RefreshCw, LogIn, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { setSpreadsheetId, setLastSync, setSyncing } from '../store/slices/sheetsSlice';

const ImportExport: React.FC = () => {
  const dispatch = useDispatch();
  const clients = useSelector((state: RootState) => state.clients.items);
  const karagirs = useSelector((state: RootState) => state.karagirs.items);
  const { spreadsheetId, lastSync, isSyncing } = useSelector((state: RootState) => state.sheets);
  const [importType, setImportType] = React.useState<'clients' | 'karagirs'>('clients');
  const [mergeOption, setMergeOption] = React.useState<'replace' | 'merge'>('merge');
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = React.useState(false);

  React.useEffect(() => {
    checkGoogleAuth();
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setIsGoogleAuthenticated(true);
        toast.success('Google Account connected successfully!');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const checkGoogleAuth = async () => {
    try {
      const res = await fetch('/api/auth/status');
      const data = await res.json();
      setIsGoogleAuthenticated(data.isAuthenticated);
    } catch (error) {
      console.error('Failed to check auth status:', error);
    }
  };

  const handleGoogleConnect = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();
      window.open(url, 'google_auth_popup', 'width=600,height=700');
    } catch (error) {
      toast.error('Failed to get auth URL');
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsGoogleAuthenticated(false);
      toast.success('Disconnected from Google Account');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  // Flattening helpers for export
  const getFlattenedClients = () => {
    const list: any[] = [];
    clients.forEach(c => {
      if (!c.projects || c.projects.length === 0) {
        list.push({
          clientId: c.id,
          clientName: c.clientName,
          businessName: c.businessName,
          address: c.address,
          phoneNumber: c.phoneNumber,
          emailId: c.emailId,
          projectId: '',
          projectName: '',
          dieType: '',
          totalDies: 0,
          designs: '',
          sizes: '',
          totalAmount: 0,
          advancePayment: 0,
          pendingPayment: 0,
          totalPaid: 0,
          courierCharges: 0,
          otherExpenses: 0,
          assignedKaragirId: ''
        });
      } else {
        c.projects.forEach(p => {
          list.push({
            clientId: c.id,
            clientName: c.clientName,
            businessName: c.businessName,
            address: c.address,
            phoneNumber: c.phoneNumber,
            emailId: c.emailId,
            projectId: p.id,
            projectName: p.projectName,
            dieType: p.dieDetails?.dieType || '',
            totalDies: p.dieDetails?.totalDies || 0,
            designs: p.dieDetails?.designs || '',
            sizes: p.dieDetails?.sizes || '',
            totalAmount: p.totalAmount,
            advancePayment: p.advancePayment,
            pendingPayment: p.pendingPayment,
            totalPaid: p.totalPaid,
            courierCharges: p.courierCharges,
            otherExpenses: p.otherExpenses,
            assignedKaragirId: p.assignedKaragirId || ''
          });
        });
      }
    });
    return list;
  };

  const getFlattenedKaragirs = () => {
    const list: any[] = [];
    karagirs.forEach(k => {
      if (!k.projects || k.projects.length === 0) {
        list.push({
          karagirId: k.id,
          name: k.name,
          address: k.address,
          phoneNumber: k.phoneNumber,
          projectId: '',
          projectName: '',
          dieType: '',
          totalDies: 0,
          designs: '',
          sizes: '',
          totalAmount: 0,
          advancePayment: 0,
          pendingPayment: 0,
          totalPaid: 0
        });
      } else {
        k.projects.forEach(p => {
          list.push({
            karagirId: k.id,
            name: k.name,
            address: k.address,
            phoneNumber: k.phoneNumber,
            projectId: p.id,
            projectName: p.projectName,
            dieType: p.dieDetails?.dieType || '',
            totalDies: p.dieDetails?.totalDies || 0,
            designs: p.dieDetails?.designs || '',
            sizes: p.dieDetails?.sizes || '',
            totalAmount: p.totalAmount,
            advancePayment: p.advancePayment,
            pendingPayment: p.pendingPayment,
            totalPaid: p.totalPaid
          });
        });
      }
    });
    return list;
  };

  const handleSync = async (direction: 'push' | 'pull') => {
    if (!spreadsheetId) {
      toast.error('Please enter a Spreadsheet ID');
      return;
    }

    dispatch(setSyncing(true));
    try {
      const res = await fetch('/api/sheets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheetId,
          direction,
          clients: direction === 'push' ? getFlattenedClients() : [],
          karagirs: direction === 'push' ? getFlattenedKaragirs() : [],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (direction === 'pull') {
        toast.error('Pulling from custom flat structure requires matching app spec. Seeding is recommended.');
      } else {
        toast.success('Data pushed to Google Sheets successfully');
      }
      
      dispatch(setLastSync(new Date().toLocaleString()));
    } catch (error: any) {
      toast.error(error.message || 'Sync failed');
    } finally {
      dispatch(setSyncing(false));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    toast.error('Direct importing has been deprecated to prevent corrupting nested folder hierarchies. Please manage inside Clients & Karagirs sections.');
    e.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-text">Data Management</h2>

      {/* Google Sheets Sync Section */}
      <div className="bg-surface p-6 rounded-xl shadow-sm border border-border space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-primary">
            <Share2 size={24} />
            <h3 className="text-lg font-bold text-text">Google Sheets Sync</h3>
          </div>
          {isGoogleAuthenticated ? (
            <button 
              onClick={handleGoogleLogout}
              className="flex items-center text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut size={14} className="mr-1" />
              Disconnect
            </button>
          ) : (
            <button 
              onClick={handleGoogleConnect}
              className="flex items-center px-4 py-2 bg-primary text-background rounded-lg text-sm font-bold hover:opacity-90 transition-all"
            >
              <LogIn size={18} className="mr-2" />
              Connect Google Account
            </button>
          )}
        </div>

        {isGoogleAuthenticated && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Spreadsheet ID</label>
                <input 
                  type="text"
                  value={spreadsheetId}
                  onChange={(e) => dispatch(setSpreadsheetId(e.target.value))}
                  placeholder="Enter Google Spreadsheet ID"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary"
                />
                <p className="text-[10px] text-text-muted">
                  Found in URL: https://docs.google.com/spreadsheets/d/<span className="text-primary">SPREADSHEET_ID</span>/edit
                </p>
              </div>

              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-text">Sync Options</h4>
                  {lastSync && (
                    <span className="text-[10px] text-text-muted">Last sync: {lastSync}</span>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleSync('push')}
                    disabled={isSyncing}
                    className="flex items-center justify-center px-4 py-2 bg-surface border border-border rounded-lg text-sm text-text hover:bg-background transition-colors disabled:opacity-50"
                  >
                    <FileDown size={18} className="mr-2" />
                    Push to Sheets (App → Sheet)
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-background p-4 rounded-lg border border-border space-y-3">
              <h4 className="font-medium text-text text-sm">How it works</h4>
              <ul className="text-xs text-text-muted space-y-2 list-disc pl-4">
                <li>Connect your Google account to authorize access.</li>
                <li>Create a new Google Sheet and copy its ID from the URL.</li>
                <li><strong>Push:</strong> Updates the sheet with your current flat database layout for robust backups.</li>
                <li>Two tabs will be created: "Clients" and "Karagirs".</li>
              </ul>
              {isSyncing && (
                <div className="flex items-center justify-center pt-4 text-primary animate-pulse">
                  <RefreshCw size={20} className="animate-spin mr-2" />
                  <span className="text-sm font-medium">Syncing data...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-border space-y-6 animate-fadeIn">
          <div className="flex items-center space-x-3 text-primary">
            <FileDown size={24} />
            <h3 className="text-lg font-bold text-text">Export Flattened Ledger</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-lg border border-border">
              <h4 className="font-medium text-text mb-2">Flattened Client-Project Directory</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => exportToCSV(getFlattenedClients(), 'flattened_clients_data')}
                  className="flex-1 px-3 py-2 bg-surface border border-border rounded-md text-sm text-text hover:bg-background transition-colors"
                >
                  Download CSV
                </button>
                <button 
                  onClick={() => exportToExcel(getFlattenedClients(), 'flattened_clients_data')}
                  className="flex-1 px-3 py-2 bg-surface border border-border rounded-md text-sm text-text hover:bg-background transition-colors"
                >
                  Download Excel
                </button>
              </div>
            </div>

            <div className="p-4 bg-background rounded-lg border border-border">
              <h4 className="font-medium text-text mb-2">Flattened Karagir Wages Ledger</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => exportToCSV(getFlattenedKaragirs(), 'flattened_karagirs_data')}
                  className="flex-1 px-3 py-2 bg-surface border border-border rounded-md text-sm text-text hover:bg-background transition-colors"
                >
                  Download CSV
                </button>
                <button 
                  onClick={() => exportToExcel(getFlattenedKaragirs(), 'flattened_karagirs_data')}
                  className="flex-1 px-3 py-2 bg-surface border border-border rounded-md text-sm text-text hover:bg-background transition-colors"
                >
                  Download Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Import Section */}
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-border space-y-6">
          <div className="flex items-center space-x-3 text-primary">
            <FileUp size={24} />
            <h3 className="text-lg font-bold text-text">Directory Seed Controls</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start p-3 bg-primary/10 rounded-lg border border-primary/20">
              <AlertCircle className="text-primary mr-2 flex-shrink-0" size={18} />
              <p className="text-xs text-text">
                To guarantee safe nested project trees, you can seed perfect predefined business mock folders with complex test records instantly!
              </p>
            </div>

            <button 
              onClick={() => {
                const dummyClients: Client[] = [
                  {
                    id: 'c_ritik',
                    clientName: 'Ritik Jain',
                    businessName: 'Pakshal Jewellers',
                    address: '01 - Chennai (Main)\n02 - Mumbai',
                    phoneNumber: '91 8939668241',
                    emailId: 'ritik.jain@pakshaljewellers.com',
                    createdAt: new Date().toISOString(),
                    projects: [
                      {
                        id: 'p_ritik_1',
                        projectName: 'Banubali Chain Die (Lot 1)',
                        dieDetails: {
                          totalDies: 2,
                          designs: 'Banubali Chain Die',
                          sizes: 'Standard',
                          dieType: 'Bahubali Chain Die'
                        },
                        totalAmount: 14000,
                        advancePayment: 4000,
                        lumpsumPayments: [
                          {
                            id: 'lp_r1_1',
                            date: new Date().toISOString(),
                            amount: 10000,
                            notes: 'Clearance of client balance'
                          }
                        ],
                        pendingPayment: 0,
                        totalPaid: 14000,
                        courierCharges: 180,
                        courierChargesList: [
                          {
                            id: 'cc_r1_1',
                            senderName: 'Jidnyam',
                            courierService: 'Other / Hand Delivery',
                            amount: 180,
                            date: new Date().toISOString(),
                            notes: '180 Courier Slip'
                          }
                        ],
                        otherExpenses: 0,
                        assignedKaragirId: 'k_nainesh',
                        assignedKaragirProjectId: 'kp_nainesh_1',
                        createdAt: new Date().toISOString(),
                        karagirAssignments: [
                          {
                            id: 'ka_r1_1',
                            karagirId: 'k_nainesh',
                            karagirName: 'Nainesh Madve',
                            allottedDies: 2,
                            status: 'Delivered',
                            completionDate: new Date().toISOString(),
                            totalAmount: 10000,
                            advancePayment: 0,
                            lumpsumPayments: [
                              { id: 'klp_n1_1_1', date: new Date().toISOString(), amount: 4000, notes: 'Advance paid to Karagir' },
                              { id: 'klp_n1_1_2', date: new Date().toISOString(), amount: 6000, notes: 'Pending amount cleared' }
                            ],
                            totalPaid: 10000,
                            pendingPayment: 0,
                            createdAt: new Date().toISOString()
                          }
                        ]
                      }
                    ]
                  }
                ];
                const dummyKaragirs: Karagir[] = [
                  {
                    id: 'k_nainesh',
                    name: 'Nainesh Madve',
                    address: 'Osar',
                    phoneNumber: '91 8999748057',
                    createdAt: new Date().toISOString(),
                    projects: [
                      {
                        id: 'kp_nainesh_1',
                        projectName: 'Banubali Chain Die (Lot 1) - Ritik Jain',
                        clientProjectId: 'p_ritik_1',
                        dieDetails: {
                          totalDies: 2,
                          designs: 'Banubali Chain Die',
                          sizes: 'Standard',
                          dieType: 'Bahubali Chain Die'
                        },
                        totalAmount: 10000,
                        advancePayment: 0,
                        lumpsumPayments: [
                          { id: 'klp_n1_1_s1', date: new Date().toISOString(), amount: 4000, notes: 'Advance paid to Karagir' },
                          { id: 'klp_n1_1_s2', date: new Date().toISOString(), amount: 6000, notes: 'Full amount cleared' }
                        ],
                        pendingPayment: 0,
                        totalPaid: 10000,
                        createdAt: new Date().toISOString()
                      }
                    ]
                  }
                ];
                dispatch(setClients(dummyClients));
                dispatch(setKaragirs(dummyKaragirs));
                toast.success('Directory records seeded successfully!');
              }}
              className="w-full px-4 py-3 bg-primary text-background rounded-lg hover:opacity-90 transition-colors text-sm font-bold"
            >
              Seed Predefined Test Folders (Reset)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExport;
