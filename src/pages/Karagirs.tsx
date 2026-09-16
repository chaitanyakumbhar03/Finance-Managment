import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  addKaragir, 
  updateKaragir, 
  deleteKaragir,
  addKaragirProject,
  updateKaragirProject,
  deleteKaragirProject,
  addKaragirLumpsum
} from '../store/slices/karagirSlice';
import { addKaragirAssignmentLumpsum } from '../store/slices/clientSlice';
import { Karagir, KaragirProject, DieType, LumpsumPayment, AdditionalItem } from '../types';
import { generateId, cn } from '../utils';
import { 
  Folder, 
  FolderPlus, 
  Search, 
  Plus, 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Briefcase, 
  Calendar, 
  Trash2, 
  Edit2, 
  X, 
  IndianRupee,
  Link2,
  Users,
  CheckCircle,
  HelpCircle,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const Karagirs: React.FC = () => {
  const dispatch = useDispatch();
  const karagirs = useSelector((state: RootState) => state.karagirs.items);
  const clients = useSelector((state: RootState) => state.clients.items);

  // Selector navigation states
  const [selectedKaragirId, setSelectedKaragirId] = React.useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null);

  // Search filter
  const [searchTerm, setSearchTerm] = React.useState('');

  // Dialog overlays
  const [isKaragirModalOpen, setIsKaragirModalOpen] = React.useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = React.useState(false);
  const [isLumpsumModalOpen, setIsLumpsumModalOpen] = React.useState(false);

  // Editing context
  const [editingKaragir, setEditingKaragir] = React.useState<Karagir | null>(null);
  const [editingProject, setEditingProject] = React.useState<KaragirProject | null>(null);

  // Select item helpers
  const selectedKaragir = karagirs.find(k => k.id === selectedKaragirId);

  // Get all assignments for this Karagir across all client projects
  const karagirProjects = React.useMemo(() => {
    if (!selectedKaragirId) return [];
    
    const list: Array<{
      id: string;
      projectName: string;
      clientName: string;
      businessName: string;
      totalAmount: number;
      advancePayment: number;
      lumpsumPayments: LumpsumPayment[];
      totalPaid: number;
      pendingPayment: number;
      dieDetails: {
        totalDies: number;
        designs: string;
        sizes: string;
        dieType: DieType;
      };
      additionalItems?: AdditionalItem[];
      createdAt: string;
    }> = [];

    clients.forEach(client => {
      client.projects?.forEach(proj => {
        // Look up by karagirAssignments list
        const matchAssignment = proj.karagirAssignments?.find(ka => ka.karagirId === selectedKaragirId);
        if (matchAssignment) {
          list.push({
            id: proj.id,
            projectName: `${client.clientName} - ${proj.projectName}`,
            clientName: client.clientName,
            businessName: client.businessName,
            totalAmount: matchAssignment.totalAmount,
            advancePayment: matchAssignment.advancePayment,
            lumpsumPayments: matchAssignment.lumpsumPayments || [],
            totalPaid: matchAssignment.totalPaid,
            pendingPayment: matchAssignment.pendingPayment,
            dieDetails: proj.dieDetails,
            additionalItems: proj.additionalItems,
            createdAt: matchAssignment.createdAt
          });
        } else if (proj.assignedKaragirId === selectedKaragirId) {
          // Fallback legacy linked projects
          const legacyKaragirProj = selectedKaragir?.projects?.find(kp => kp.id === proj.id);
          list.push({
            id: proj.id,
            projectName: `${client.clientName} - ${proj.projectName}`,
            clientName: client.clientName,
            businessName: client.businessName,
            totalAmount: legacyKaragirProj?.totalAmount || proj.totalAmount * 0.7,
            advancePayment: legacyKaragirProj?.advancePayment || 0,
            lumpsumPayments: legacyKaragirProj?.lumpsumPayments || [],
            totalPaid: legacyKaragirProj?.totalPaid || 0,
            pendingPayment: legacyKaragirProj?.pendingPayment || 0,
            dieDetails: proj.dieDetails,
            additionalItems: proj.additionalItems,
            createdAt: proj.createdAt
          });
        }
      });
    });

    // Add any completely custom projects created standalone in karagirSlice
    selectedKaragir?.projects?.forEach(kp => {
      if (!list.some(p => p.id === kp.id)) {
        list.push({
          id: kp.id,
          projectName: kp.projectName,
          clientName: 'Local Karagir Direct',
          businessName: 'No linked client',
          totalAmount: kp.totalAmount,
          advancePayment: kp.advancePayment,
          lumpsumPayments: kp.lumpsumPayments || [],
          totalPaid: kp.totalPaid,
          pendingPayment: kp.pendingPayment,
          dieDetails: kp.dieDetails,
          additionalItems: [],
          createdAt: kp.createdAt
        });
      }
    });

    return list;
  }, [selectedKaragirId, clients, selectedKaragir]);

  const selectedProject = karagirProjects.find(p => p.id === selectedProjectId);

  const dieTypes: DieType[] = [
    'Bahubali Chain Die',
    'Emboss Die',
    'Thappa Die',
    'Coin Die',
    'Bar Minting Die',
    'Lakshmi Die',
    'Bangle Die',
    'Hook Type Die',
    'Prong Die (Stone Holding)',
    'Other'
  ];

  // Karagir Folder CRUD
  const handleKaragirSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const karagirData: Karagir = {
      id: editingKaragir?.id || generateId(),
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      projects: editingKaragir?.projects || [],
      createdAt: editingKaragir?.createdAt || new Date().toISOString(),
    };

    if (editingKaragir) {
      dispatch(updateKaragir(karagirData));
      toast.success('Karagir folder updated');
    } else {
      dispatch(addKaragir(karagirData));
      toast.success('Karagir folder initialized');
    }
    setIsKaragirModalOpen(false);
    setEditingKaragir(null);
  };

  const handleKaragirDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete Karagir folder "${name}"? This deletes all their micro-projects!`)) {
      dispatch(deleteKaragir(id));
      if (selectedKaragirId === id) {
        setSelectedKaragirId(null);
        setSelectedProjectId(null);
      }
      toast.success('Deleted folder successfully');
    }
  };

  // Karagir Projects CRUD
  const handleProjectSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedKaragirId) return;

    const formData = new FormData(e.currentTarget);
    const totalAmount = Number(formData.get('totalAmount'));
    const advancePayment = Number(formData.get('advancePayment'));
    const totalDies = Number(formData.get('totalDies'));
    const designs = formData.get('designs') as string;
    const sizes = formData.get('sizes') as string;
    const dieType = formData.get('dieType') as DieType;

    const lumpsums = editingProject?.lumpsumPayments || [];
    const totalPaid = advancePayment + lumpsums.reduce((sum, item) => sum + item.amount, 0);
    const pendingPayment = Math.max(0, totalAmount - totalPaid);

    const projectData: KaragirProject = {
      id: editingProject?.id || generateId(),
      projectName: formData.get('projectName') as string,
      clientProjectId: editingProject?.clientProjectId,
      dieDetails: {
        totalDies,
        designs,
        sizes,
        dieType
      },
      totalAmount,
      advancePayment,
      lumpsumPayments: lumpsums,
      pendingPayment,
      totalPaid,
      createdAt: editingProject?.createdAt || new Date().toISOString(),
    };

    if (editingProject) {
      dispatch(updateKaragirProject({ karagirId: selectedKaragirId, project: projectData }));
      toast.success('Project details updated');
    } else {
      dispatch(addKaragirProject({ karagirId: selectedKaragirId, project: projectData }));
      toast.success('Added new project in karagir ledger');
    }

    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleProjectDelete = (projectId: string, name: string) => {
    if (!selectedKaragirId) return;
    if (window.confirm(`Are you sure you want to delete assignment project "${name}"?`)) {
      dispatch(deleteKaragirProject({ karagirId: selectedKaragirId, projectId }));
      if (selectedProjectId === projectId) {
        setSelectedProjectId(null);
      }
      toast.success('Assignment deleted');
    }
  };

  // Add Karagir Lumpsum Payment
  const handleLumpsumSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedKaragirId || !selectedProjectId || !selectedProject) return;

    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get('amount'));
    const notes = formData.get('notes') as string;
    const date = formData.get('date') as string;

    const payment: LumpsumPayment = {
      id: generateId(),
      date: date || new Date().toISOString(),
      amount,
      notes
    };

    // Sync payout inside Client multi-user assignment or stand-alone slice
    let linkedClientId = '';
    const foundClient = clients.find(c => {
      const pMatch = c.projects?.find(p => p.id === selectedProjectId);
      if (pMatch) {
        linkedClientId = c.id;
        return true;
      }
      return false;
    });

    if (foundClient && linkedClientId) {
      const clientProj = foundClient.projects?.find(p => p.id === selectedProjectId);
      const assignment = clientProj?.karagirAssignments?.find(ka => ka.karagirId === selectedKaragirId);
      if (assignment) {
        dispatch(addKaragirAssignmentLumpsum({
          clientId: linkedClientId,
          projectId: selectedProjectId as string,
          assignmentId: assignment.id,
          payment
        }));
        setIsLumpsumModalOpen(false);
        toast.success(`Wage installment of ₹${amount} logged inside ${assignment.karagirName}'s ledger successfully`);
        return;
      }
    }

    // Standalone fallback
    dispatch(addKaragirLumpsum({ karagirId: selectedKaragirId, projectId: selectedProjectId, payment }));
    setIsLumpsumModalOpen(false);
    toast.success('Lumpsum payouts to Karagir ₹' + amount + ' logged');
  };

  const filteredKaragirs = karagirs.filter(k => 
    k.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold text-text flex items-center gap-2">
            <Users className="text-primary" /> Karagirs (Artisans) Ledger
          </h2>
          <p className="text-xs text-text-muted mt-1">Manage folders, address properties, pending wages, and lumpsum disbursement ledgers.</p>
        </div>

        <div className="flex gap-2">
          {selectedKaragirId && (
            <button
              onClick={() => {
                if (selectedProjectId) {
                  setSelectedProjectId(null);
                } else {
                  setSelectedKaragirId(null);
                }
              }}
              className="flex items-center px-4 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-background transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" /> Back
            </button>
          )}

          <button
            onClick={() => {
              setEditingKaragir(null);
              setIsKaragirModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-primary text-background font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            <FolderPlus size={18} className="mr-2" /> New Karagir Folder
          </button>
        </div>
      </div>

      {/* SEARCH / BREADCRUMBS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border">
        <div className="flex items-center space-x-2 text-sm text-text-muted">
          <span 
            className="hover:text-primary cursor-pointer transition-colors font-medium text-xs sm:text-sm"
            onClick={() => { setSelectedKaragirId(null); setSelectedProjectId(null); }}
          >
            Root (Karagirs)
          </span>
          {selectedKaragir && (
            <>
              <span>/</span>
              <span 
                className={cn("hover:text-primary cursor-pointer transition-colors font-medium text-xs sm:text-sm", !selectedProjectId && "text-primary")}
                onClick={() => setSelectedProjectId(null)}
              >
                {selectedKaragir.name}
              </span>
            </>
          )}
          {selectedProject && (
            <>
              <span>/</span>
              <span className="text-primary font-bold text-xs sm:text-sm">
                {selectedProject.projectName}
              </span>
            </>
          )}
        </div>

        {!selectedKaragirId && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Search karagir folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none text-text"
            />
          </div>
        )}
      </div>

      {/* MAIN BODY SWITCH */}
      {!selectedKaragirId ? (
        /* SCREEN 1: GRID OF KARAGIR FOLDERS */
        <div>
          {filteredKaragirs.length === 0 ? (
            <div className="text-center py-12 bg-surface rounded-xl border border-dashed border-border">
              <Folder className="mx-auto text-text-muted mb-4 opacity-35" size={48} />
              <p className="text-sm text-text-muted">No artisan folder registers found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredKaragirs.map((karagir) => {
                const projectCount = karagir.projects?.length || 0;
                return (
                  <div
                    key={karagir.id}
                    onClick={() => setSelectedKaragirId(karagir.id)}
                    className="group relative bg-surface hover:bg-background border border-border hover:border-primary/50 p-4 rounded-xl flex flex-col justify-between cursor-pointer transition-all shadow-sm"
                  >
                    <div className="mb-4">
                      <div className="w-10 h-8 bg-amber-500/15 group-hover:bg-amber-500/25 text-amber-500 rounded-tr-md rounded-bl-sm rounded-br-sm relative flex items-center justify-center">
                        <Folder size={18} />
                        <span className="absolute -top-1.5 left-0 w-5 h-2 bg-amber-500/15 group-hover:bg-amber-500/25 rounded-t-sm"></span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-text truncate group-hover:text-primary transition-colors text-sm">
                        {karagir.name}
                      </h4>
                      <p className="text-[10px] text-text-muted truncate mt-0.5">
                        {karagir.address || 'Address unmapped'}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-border/50 text-[10px] text-text-muted">
                      <span>{projectCount} projects</span>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setEditingKaragir(karagir);
                            setIsKaragirModalOpen(true);
                          }}
                          className="p-1 hover:text-primary rounded text-text-muted"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleKaragirDelete(karagir.id, karagir.name)}
                          className="p-1 hover:text-red-400 rounded text-text-muted"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : !selectedProjectId ? (
        /* SCREEN 2: ALL PROJECT LEDGERS WITHIN ARTISAN FILE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Info Card */}
          <div className="bg-surface p-6 rounded-xl border border-border h-fit space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-primary uppercase tracking-wider flex items-center gap-2">
              Artisan Profile Map
            </h3>

            <div className="space-y-3.5 text-xs pt-2">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-text-muted" />
                <div>
                  <p className="text-[10px] text-text-muted">Base Workspace / Address</p>
                  <p className="text-text leading-relaxed font-semibold">{selectedKaragir?.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={16} className="text-text-muted" />
                <div>
                  <p className="text-[10px] text-text-muted">Contact Phone</p>
                  <p className="text-text font-semibold">{selectedKaragir?.phoneNumber}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/70 flex gap-2">
              <button
                onClick={() => {
                  setEditingKaragir(selectedKaragir!);
                  setIsKaragirModalOpen(true);
                }}
                className="flex-1 py-1.5 bg-background border border-border text-xs font-semibold rounded-lg hover:border-primary transition-colors hover:text-primary flex items-center justify-center gap-1.5"
              >
                <Edit2 size={11} /> Update Profile
              </button>
            </div>
          </div>

          {/* Assigned sub-projects */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-text text-sm uppercase tracking-wider text-primary">Project Work Assignments</h3>
              <span className="text-[10px] text-text-muted italic bg-surface border border-border px-2 py-1 rounded">
                Managed in Clients Folder
              </span>
            </div>

            {(karagirProjects.length === 0) ? (
              <div className="text-center py-12 bg-surface/50 rounded-xl border border-dashed border-border">
                <Briefcase className="mx-auto text-text-muted mb-3 opacity-35" size={32} />
                <p className="text-xs text-text-muted">No assignments folder logged inside {selectedKaragir?.name}.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {karagirProjects.map((proj) => {
                  const isLinkedToClient = proj.clientName !== 'Local Karagir Direct';
                  return (
                    <div
                      key={proj.id}
                      onClick={() => setSelectedProjectId(proj.id)}
                      className="group bg-surface hover:bg-background border border-border hover:border-primary/50 p-5 rounded-xl cursor-pointer transition-all shadow-sm relative flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start">
                        <span className="p-2.5 bg-amber-500/10 text-amber-500 rounded-lg">
                          <Folder size={16} />
                        </span>
                        {isLinkedToClient && (
                          <span className="text-[9px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-bold uppercase flex items-center gap-1">
                            <Link2 size={10} /> {proj.clientName}
                          </span>
                        )}
                      </div>

                      <div className="mt-4">
                        <h4 className="font-bold text-sm text-text leading-snug group-hover:text-primary transition-colors">{proj.projectName}</h4>
                        <div className="flex gap-2 text-[10px] text-text-muted mt-1 font-mono">
                          <span>{proj.dieDetails?.totalDies} dies</span>
                          <span>•</span>
                          <span>{proj.dieDetails?.sizes}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-5 pt-3 border-t border-border/50 text-[11px]">
                        <div>
                          <p className="text-[9px] text-text-muted">Wages Promised</p>
                          <p className="font-bold text-text">₹{proj.totalAmount}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-text-muted">Unpaid Balance</p>
                          <p className="font-bold text-red-400">₹{proj.pendingPayment}</p>
                        </div>
                      </div>

                      {/* actions overlay */}
                      <div 
                        className="absolute right-4 top-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {!isLinkedToClient && (
                          <>
                            <button
                              onClick={() => {
                                // Find matching local project to edit
                                const originalLocalProj = selectedKaragir?.projects?.find(kp => kp.id === proj.id);
                                if (originalLocalProj) {
                                  setEditingProject(originalLocalProj);
                                  setIsProjectModalOpen(true);
                                }
                              }}
                              className="p-1 hover:text-primary text-text-muted rounded"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => handleProjectDelete(proj.id, proj.projectName)}
                              className="p-1 hover:text-red-400 text-text-muted rounded"
                            >
                              <Trash2 size={12} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SCREEN 3: SPECIFIC ASSIGNMENT IN DEPTH SHEET */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Column Spec */}
          <div className="bg-surface p-6 rounded-xl border border-border h-fit space-y-4 shadow-sm text-xs">
            <div className="flex justify-between items-center border-b border-border/50 pb-2">
              <h4 className="font-bold text-primary uppercase tracking-wider">Specifications</h4>
              {selectedProject.clientName === 'Local Karagir Direct' && (
                <button
                  onClick={() => {
                    const originalLocalProj = selectedKaragir?.projects?.find(kp => kp.id === selectedProject.id);
                    if (originalLocalProj) {
                      setEditingProject(originalLocalProj);
                      setIsProjectModalOpen(true);
                    }
                  }}
                  className="p-1.5 hover:text-primary text-text-muted bg-background border border-border rounded-lg"
                >
                  <Edit2 size={12} />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[9px] text-text-muted font-bold uppercase">Assign Name</p>
                <p className="text-text font-extrabold text-sm mt-0.5">{selectedProject.projectName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] text-text-muted font-bold uppercase">Dies qty</p>
                  <p className="text-text font-bold text-sm mt-0.5">{selectedProject.dieDetails?.totalDies || 0}</p>
                </div>
                <div>
                  <p className="text-[9px] text-text-muted font-bold uppercase">Work Type</p>
                  <p className="text-text font-bold mt-0.5">{selectedProject.dieDetails?.dieType}</p>
                </div>
              </div>

              <div>
                <p className="text-[9px] text-text-muted font-semibold uppercase">Sizes Spec</p>
                <div className="flex flex-wrap gap-1 mt-1 font-mono">
                  {selectedProject.dieDetails?.sizes ? (
                    selectedProject.dieDetails.sizes.split(',').map(s => s.trim()).filter(Boolean).map((sz, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold text-[10px]">
                        {sz}
                      </span>
                    ))
                  ) : (
                    <span className="text-text-muted italic text-[11px]">Not defined</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[9px] text-text-muted font-semibold uppercase">Patterns/Designs Desc</p>
                <p className="text-text font-sans mt-0.5 leading-relaxed">{selectedProject.dieDetails?.designs || 'N/A'}</p>
              </div>

              <div className="pt-2 border-t border-border/40 text-[10px] text-text-muted flex items-center justify-between">
                <span>Created Date:</span>
                <span>{new Date(selectedProject.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Ledger boards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm grid grid-cols-3 gap-4">
              <div className="p-4 bg-background border border-border rounded-xl flex flex-col justify-between">
                <span className="text-[9px] text-text-muted font-bold uppercase">Promised Rate</span>
                <span className="text-2xl font-black text-text mt-2">₹{selectedProject.totalAmount}</span>
              </div>
              <div className="p-4 bg-background border border-border rounded-xl flex flex-col justify-between">
                <span className="text-[9px] text-text-muted font-bold uppercase text-green-400">Total Paid</span>
                <span className="text-2xl font-black text-green-400 mt-2">₹{selectedProject.totalPaid}</span>
              </div>
              <div className="p-4 bg-background border border-border rounded-xl flex flex-col justify-between">
                <span className="text-[9px] text-text-muted font-bold uppercase text-red-500">Wages Pending</span>
                <span className="text-2xl font-black text-red-500 mt-2">₹{selectedProject.pendingPayment}</span>
              </div>
            </div>

            {/* Payout records */}
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-text text-sm flex items-center gap-1.5">
                    <DollarSign size={16} className="text-green-400" /> Wages & Payout Installments
                  </h3>
                  <p className="text-[10px] text-text-muted">Disbursements paid to the artisan on this specific project folder.</p>
                </div>

                <button
                  onClick={() => setIsLumpsumModalOpen(true)}
                  disabled={selectedProject.pendingPayment <= 0}
                  className="flex items-center px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 font-bold rounded-lg text-xs hover:bg-green-500/20 disabled:opacity-40"
                >
                  <Plus size={14} className="mr-1" /> Log Wages Paid
                </button>
              </div>

              {selectedProject.lumpsumPayments.length === 0 ? (
                <div className="text-center py-10 bg-background border border-dashed border-border rounded-xl text-xs text-text-muted">
                  No disbursement records logged. Balance remains ₹{selectedProject.pendingPayment}.
                </div>
              ) : (
                <div className="border border-border rounded-xl bg-background overflow-hidden overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-surface text-text-muted uppercase text-[9px] font-bold border-b border-border">
                      <tr>
                        <th className="px-5 py-3">Paid Date</th>
                        <th className="px-5 py-3">Amount Released</th>
                        <th className="px-5 py-3">Memo / Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-text">
                      {selectedProject.lumpsumPayments.map((p) => (
                        <tr key={p.id}>
                          <td className="px-5 py-3 font-semibold text-[10px]">{new Date(p.date).toLocaleDateString()}</td>
                          <td className="px-5 py-3 font-bold text-green-400">₹{p.amount}</td>
                          <td className="px-5 py-3 text-text-muted">{p.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Post-Launch Process Additions */}
            {selectedProject.additionalItems && selectedProject.additionalItems.length > 0 && (
              <div className="bg-surface p-6 rounded-xl border border-border shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-text text-sm flex items-center gap-1.5 text-amber-500">
                    <Briefcase size={16} /> Process Additions & Extra Wages
                  </h3>
                  <p className="text-[10px] text-text-muted">Extra items and specifications added to this ongoing die process post-launch, along with your wages.</p>
                </div>

                <div className="border border-border rounded-xl bg-background overflow-hidden overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-surface text-text-muted uppercase text-[9px] font-bold border-b border-border">
                      <tr>
                        <th className="px-4 py-3">Date Added</th>
                        <th className="px-4 py-3">Specification Details</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3">Wages Rate</th>
                        <th className="px-4 py-3">Total Extra Wages</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-text">
                      {selectedProject.additionalItems.map((item) => (
                        <tr key={item.id} className="hover:bg-surface/30">
                          <td className="px-4 py-3 font-semibold text-[10px] whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-text text-xs">{item.name}</div>
                            <div className="flex gap-2 text-[10px] text-text-muted mt-0.5 font-mono">
                              <span>Size: <span className="text-text">{item.size || 'N/A'}</span></span>
                              <span>•</span>
                              <span>Design: <span className="text-text">{item.design || 'N/A'}</span></span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-text">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 font-semibold text-amber-500">
                            ₹{item.karagirRate || 0}
                          </td>
                          <td className="px-4 py-3 font-bold text-amber-500">
                            ₹{(item.karagirRate || 0) * item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALS DIALOGS */}

      {/* 1. NEW KARAGIR */}
      {isKaragirModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface w-full max-w-sm rounded-2xl shadow-xl border border-border">
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h3 className="text-sm font-bold text-text">
                {editingKaragir ? 'Edit Karagir Profile Details' : 'Initialize Karagir Name Folder'}
              </h3>
              <button onClick={() => setIsKaragirModalOpen(false)} className="text-text-muted hover:text-text">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleKaragirSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-text-muted font-semibold">Artisan / Karagir Name</label>
                <input required name="name" placeholder="e.g. Ramesh Suthar" defaultValue={editingKaragir?.name} className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary" />
              </div>

              <div className="space-y-1">
                <label className="text-text-muted font-semibold">Address Spec</label>
                <textarea required name="address" placeholder="e.g. Surat, Gujarat workshop" defaultValue={editingKaragir?.address} className="w-full px-4 py-2 h-16 bg-background border border-border rounded-lg outline-none text-text focus:border-primary resize-none" />
              </div>

              <div className="space-y-1">
                <label className="text-text-muted font-semibold">Contact Phone number</label>
                <input required name="phoneNumber" placeholder="e.g. 9811223344" defaultValue={editingKaragir?.phoneNumber} className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary" />
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setIsKaragirModalOpen(false)} className="flex-1 py-1.5 bg-background border border-border text-text-muted font-bold rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-1.5 bg-primary text-background font-bold rounded-lg hover:opacity-90">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. PROJECT ASSIGNMENT */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl border border-border">
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h3 className="text-sm font-bold text-text">
                {editingProject ? 'Edit Assignment Specs' : 'Assign Project Folder for ' + selectedKaragir?.name}
              </h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-text-muted hover:text-text">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-text-muted font-semibold">Assignment / Project Name</label>
                <input required name="projectName" placeholder="e.g. Traditional Lakshmi Coins" defaultValue={editingProject?.projectName} className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary" />
              </div>

              <div className="border border-border p-3 rounded-xl bg-background space-y-3">
                <h4 className="text-primary font-bold text-[10px] uppercase">Work Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-text-muted font-semibold">Die Type</label>
                    <select name="dieType" defaultValue={editingProject?.dieDetails?.dieType} className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg outline-none text-text">
                      {dieTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-text-muted font-semibold">Wages Set (₹)</label>
                    <input required type="number" name="totalAmount" placeholder="Charge" defaultValue={editingProject?.totalAmount} className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg outline-none text-text focus:border-primary text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-text-muted font-semibold">Total Dies qty</label>
                    <input required type="number" name="totalDies" placeholder="Size units" defaultValue={editingProject?.dieDetails?.totalDies} className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg outline-none text-text focus:border-primary text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-text-muted font-semibold">Sizes specified</label>
                    <input required name="sizes" placeholder="e.g. 15mm, 35mm" defaultValue={editingProject?.dieDetails?.sizes} className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg outline-none text-text focus:border-primary text-xs" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-text-muted font-semibold font-mono">Designs / Motif text</label>
                  <input name="designs" placeholder="Mesh, elephant pattern" defaultValue={editingProject?.dieDetails?.designs} className="w-full px-4 py-1.5 bg-surface border border-border rounded-lg outline-none text-text focus:border-primary font-mono text-xs" />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="flex-1 py-1.5 bg-background border border-border text-text-muted font-bold rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 py-1.5 bg-primary text-background font-bold rounded-lg hover:opacity-95">{editingProject ? 'Apply Specs' : 'Log Assignment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. WAGES PAID/LUMSPSUM FOR KARAGIR */}
      {isLumpsumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface w-full max-w-sm rounded-2xl shadow-xl border border-border">
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h3 className="text-xs font-bold text-text uppercase text-green-400">
                Release Wage Installment
              </h3>
              <button onClick={() => setIsLumpsumModalOpen(false)} className="text-text-muted hover:text-text">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleLumpsumSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-text-muted font-semibold font-mono">Disburse Date</label>
                <input required type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary font-mono" />
              </div>

              <div className="space-y-1">
                <label className="text-text-muted font-semibold">Payment Amount Released (₹)</label>
                <input required type="number" name="amount" max={selectedProject?.pendingPayment || 999999} min={1} placeholder="Enter release amount" className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-green-400 font-bold focus:border-primary text-sm" />
              </div>

              <div className="space-y-1">
                <label className="text-text-muted font-semibold">Log Memo</label>
                <input name="notes" placeholder="e.g. Paid in cash, wages installment 1" className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsLumpsumModalOpen(false)} className="flex-1 py-1.5 bg-background border border-border text-text-muted rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="flex-1 py-1.5 bg-green-500/25 border border-green-500/30 text-green-400 font-bold rounded-lg hover:bg-green-500/35">Confirm Payout</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Karagirs;
