import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  addClient, 
  updateClient, 
  deleteClient,
  addClientProject,
  updateClientProject,
  deleteClientProject,
  addClientLumpsum,
  addClientProjectAdditionalItem,
  deleteClientProjectAdditionalItem,
  addKaragirAssignment,
  deleteKaragirAssignment,
  addKaragirAssignmentLumpsum,
  updateKaragirAssignment,
  updateClientProjectImage,
  addClientProjectImage,
  deleteClientProjectImage,
  addKaragirAssignmentImage,
  deleteKaragirAssignmentImage,
  addCourierCharge,
  deleteCourierCharge
} from '../store/slices/clientSlice';
import { 
  addKaragirProject, 
  updateKaragirProject, 
  deleteKaragirProject,
  addKaragirLumpsum,
  addKaragirProjectAdditionalItem,
  deleteKaragirProjectAdditionalItem
} from '../store/slices/karagirSlice';
import { Client, ClientProject, DieType, LumpsumPayment, AdditionalItem, KaragirAssignment, CourierCharge } from '../types';
import { generateId, cn } from '../utils';
import { 
  Folder, 
  FolderPlus, 
  Search, 
  Plus, 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  DollarSign, 
  Briefcase, 
  Truck, 
  Calendar, 
  Trash2, 
  Edit2, 
  X, 
  CheckCircle,
  HelpCircle,
  Layers,
  Sparkles,
  Link2,
  UserPlus,
  ChevronDown,
  ChevronUp,
  UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const ImageUpload: React.FC<{
  image?: string;
  onImageChange: (base64: string | undefined) => void;
  label: string;
}> = ({ image, onImageChange, label }) => {
  const [isDragActive, setIsDragActive] = React.useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, WEBP, etc.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageChange(result);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = () => {
    setIsDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-text-muted font-bold text-[11px] uppercase tracking-wider block">{label}</label>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-all min-h-[140px] cursor-pointer",
          isDragActive ? "border-primary bg-primary/5 shadow-inner" : "border-border hover:border-primary bg-surface/50 hover:bg-surface/80"
        )}
      >
        {image ? (
          <div className="relative group w-full flex flex-col items-center justify-center">
            <img
              src={image}
              alt="Design Visual Preview"
              referrerPolicy="no-referrer"
              className="max-h-24 max-w-full rounded-lg object-contain shadow-md border border-border"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onImageChange(undefined);
              }}
              className="absolute -top-1 -right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors"
              title="Remove Visual"
            >
              <X size={10} />
            </button>
            <p className="text-[9px] text-text-muted mt-2 font-mono">Drag of select new image to replace</p>
          </div>
        ) : (
          <div className="text-center space-y-2 pointer-events-none">
            <div className="mx-auto w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Plus size={14} />
            </div>
            <div>
              <p className="text-[10px] font-black text-text">Drag & Drop Image file</p>
              <p className="text-[9px] text-text-muted">or click to browse local files</p>
            </div>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          onChange={onFileChange}
        />
      </div>
    </div>
  );
};

const MultiImageUpload: React.FC<{
  images: string[];
  onImagesChange: (updated: string[]) => void;
  label: string;
}> = ({ images, onImagesChange, label }) => {
  const [isDragActive, setIsDragActive] = React.useState(false);

  const processFiles = (files: FileList) => {
    const promises = Array.from(files).filter(file => file.type.startsWith('image/')).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(results => {
      onImagesChange([...images, ...results]);
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = () => {
    setIsDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (idx: number) => {
    const updated = [...images];
    updated.splice(idx, 1);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-text-muted font-bold text-[11px] uppercase tracking-wider block">{label}</label>
      
      {images && images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-background flex items-center justify-center">
              <img src={img} alt={`drawing-${idx}`} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors"
                title="Delete drawing"
              >
                <X size={8} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-all min-h-[110px] cursor-pointer",
          isDragActive ? "border-primary bg-primary/5 shadow-inner" : "border-border hover:border-primary bg-surface/50 hover:bg-surface/80"
        )}
      >
        <div className="text-center space-y-1.5 pointer-events-none">
          <div className="mx-auto w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Plus size={12} />
          </div>
          <div>
            <p className="text-[10px] font-black text-text">Drag & Drop drawings / visual drafts</p>
            <p className="text-[9px] text-text-muted">or click to upload multiple images</p>
          </div>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          onChange={onFileChange}
        />
      </div>
    </div>
  );
};

const Clients: React.FC = () => {
  const dispatch = useDispatch();
  const clients = useSelector((state: RootState) => state.clients.items);
  const karagirs = useSelector((state: RootState) => state.karagirs.items);

  // Navigation / Folder selection states
  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = React.useState('');

  // Modals / Form Dialogs
  const [isClientModalOpen, setIsClientModalOpen] = React.useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = React.useState(false);
  const [isLumpsumModalOpen, setIsLumpsumModalOpen] = React.useState(false);
  const [isAdditionalItemModalOpen, setIsAdditionalItemModalOpen] = React.useState(false);
  const [isAssignKaragirModalOpen, setIsAssignKaragirModalOpen] = React.useState(false);
  const [isKaragirLumpsumModalOpen, setIsKaragirLumpsumModalOpen] = React.useState(false);
  const [selectedKaragirAssignmentId, setSelectedKaragirAssignmentId] = React.useState<string | null>(null);
  
  // Tag / badges for sizes
  const [sizeTags, setSizeTags] = React.useState<string[]>([]);

  // Editing state
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);
  const [editingProject, setEditingProject] = React.useState<ClientProject | null>(null);

  // Design visuals and assignment details editing
  const [projectImage, setProjectImage] = React.useState<string | undefined>(undefined);
  const [projectImages, setProjectImages] = React.useState<string[]>([]);
  const [assignmentImage, setAssignmentImage] = React.useState<string | undefined>(undefined);
  const [assignmentImages, setAssignmentImages] = React.useState<string[]>([]);
  const [isEditAssignmentModalOpen, setIsEditAssignmentModalOpen] = React.useState(false);
  const [editingAssignment, setEditingAssignment] = React.useState<KaragirAssignment | null>(null);
  const [lightboxImage, setLightboxImage] = React.useState<string | null>(null);
  const [isCourierModalOpen, setIsCourierModalOpen] = React.useState(false);

  // Fetch selected entities
  const selectedClient = clients.find(c => c.id === selectedClientId);
  const selectedProject = selectedClient?.projects?.find(p => p.id === selectedProjectId);

  React.useEffect(() => {
    if (editingProject) {
      const initialSizes = editingProject.dieDetails?.sizes 
        ? editingProject.dieDetails.sizes.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      setSizeTags(initialSizes);
      setProjectImage(editingProject.projectImage);
      setProjectImages(editingProject.projectImages || (editingProject.projectImage ? [editingProject.projectImage] : []));
    } else {
      setSizeTags([]);
      setProjectImage(undefined);
      setProjectImages([]);
    }
  }, [editingProject, isProjectModalOpen]);

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

  // Client CRUD
  const handleClientSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const clientData: Client = {
      id: editingClient?.id || generateId(),
      clientName: formData.get('clientName') as string,
      businessName: formData.get('businessName') as string,
      address: formData.get('address') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      emailId: formData.get('emailId') as string,
      projects: editingClient?.projects || [],
      createdAt: editingClient?.createdAt || new Date().toISOString(),
    };

    if (editingClient) {
      dispatch(updateClient(clientData));
      toast.success('Client folder updated');
    } else {
      dispatch(addClient(clientData));
      toast.success('Client folder created successfully');
    }
    setIsClientModalOpen(false);
    setEditingClient(null);
  };

  const handleClientDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete client folder "${name}"? This deletes all nested projects!`)) {
      dispatch(deleteClient(id));
      if (selectedClientId === id) {
        setSelectedClientId(null);
        setSelectedProjectId(null);
      }
      toast.success('Client folder deleted');
    }
  };

  // Project CRUD
  const handleProjectSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClientId) return;

    const formData = new FormData(e.currentTarget);
    const totalAmount = Number(formData.get('totalAmount'));
    const advancePayment = Number(formData.get('advancePayment'));
    const courierCharges = Number(formData.get('courierCharges'));
    const otherExpenses = Number(formData.get('otherExpenses'));
    const totalDies = Number(formData.get('totalDies'));
    const designs = formData.get('designs') as string;
    const sizes = formData.get('sizes') as string;
    const dieType = formData.get('dieType') as DieType;
    const assignedKaragirId = formData.get('assignedKaragirId') as string;
    const karagirTotalAmount = Number(formData.get('karagirTotalAmount') || '0');

    const lumpsums = editingProject?.lumpsumPayments || [];
    const totalPaid = advancePayment + lumpsums.reduce((sum, current) => sum + current.amount, 0);
    const pendingPayment = Math.max(0, totalAmount - totalPaid);

    const projectId = editingProject?.id || generateId();

    const projectData: ClientProject = {
      id: projectId,
      projectName: formData.get('projectName') as string,
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
      courierCharges,
      courierChargesList: editingProject?.courierChargesList || [],
      otherExpenses,
      projectImage: projectImage || projectImages[0] || undefined,
      projectImages: projectImages,
      assignedKaragirId: assignedKaragirId || undefined,
      karagirAssignments: editingProject?.karagirAssignments || [],
      additionalItems: editingProject?.additionalItems || [],
      createdAt: editingProject?.createdAt || new Date().toISOString(),
    };

    // Save project in Client folder
    if (editingProject) {
      dispatch(updateClientProject({ clientId: selectedClientId, project: projectData }));
      toast.success('Project updated');
    } else {
      dispatch(addClientProject({ clientId: selectedClientId, project: projectData }));
      toast.success('New project folder created inside ' + selectedClient?.clientName);
    }

    // Handshake Sync with Karagir folder if assigned
    if (assignedKaragirId) {
      const selectedKaragir = karagirs.find(k => k.id === assignedKaragirId);
      if (selectedKaragir) {
        // Prepare Karagir project record
        const karagirProjectData = {
          id: projectId, // keep ID synced
          projectName: projectData.projectName,
          clientProjectId: projectId,
          dieDetails: projectData.dieDetails,
          totalAmount: karagirTotalAmount,
          advancePayment: 0, // initially zero, can update inside karagir
          pendingPayment: karagirTotalAmount,
          lumpsumPayments: [],
          totalPaid: 0,
          createdAt: projectData.createdAt
        };

        // Add or Update in Karagir
        const existingKaragirProj = selectedKaragir.projects?.find(p => p.id === projectId);
        if (existingKaragirProj) {
          dispatch(updateKaragirProject({ 
            karagirId: assignedKaragirId, 
            project: {
              ...existingKaragirProj,
              projectName: projectData.projectName,
              dieDetails: projectData.dieDetails,
              // don't overwrite custom Karagir payments unless desired, but match basic details
            } 
          }));
        } else {
          dispatch(addKaragirProject({ karagirId: assignedKaragirId, project: karagirProjectData }));
        }
      }
    }

    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleProjectDelete = (projectId: string, name: string) => {
    if (!selectedClientId) return;
    if (window.confirm(`Are you sure you want to delete project folder "${name}"?`)) {
      dispatch(deleteClientProject({ clientId: selectedClientId, projectId }));
      // Clean up linked karagir project if any
      const proj = selectedClient?.projects?.find(p => p.id === projectId);
      if (proj?.assignedKaragirId) {
        dispatch(deleteKaragirProject({ karagirId: proj.assignedKaragirId, projectId }));
      }
      if (selectedProjectId === projectId) {
        setSelectedProjectId(null);
      }
      toast.success('Project deleted successfully');
    }
  };

  // Add Lumpsum Payment
  const handleLumpsumSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClientId || !selectedProjectId || !selectedProject) return;

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

    dispatch(addClientLumpsum({ clientId: selectedClientId, projectId: selectedProjectId, payment }));
    setIsLumpsumModalOpen(false);
    toast.success('Lumpsum payment of ₹' + amount + ' recorded');
  };

  // Additional Items handlers
  const handleAdditionalItemSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClientId || !selectedProjectId || !selectedProject) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get('itemName') as string;
    const size = formData.get('itemSize') as string;
    const design = formData.get('itemDesign') as string;
    const quantity = Number(formData.get('itemQuantity') || '1');
    const clientRate = Number(formData.get('clientRate') || '0');
    const karagirRate = Number(formData.get('karagirRate') || '0');

    const newItem: AdditionalItem = {
      id: generateId(),
      name,
      size,
      design,
      clientRate,
      karagirRate,
      quantity,
      createdAt: new Date().toISOString(),
    };

    dispatch(addClientProjectAdditionalItem({
      clientId: selectedClientId,
      projectId: selectedProjectId,
      item: newItem
    }));

    if (selectedProject.assignedKaragirId) {
      dispatch(addKaragirProjectAdditionalItem({
        karagirId: selectedProject.assignedKaragirId,
        projectId: selectedProjectId,
        item: newItem
      }));
    }

    setIsAdditionalItemModalOpen(false);
    toast.success(`Successfully added "${name}" into the ongoing die process`);
  };

  const handleAdditionalItemDelete = (itemId: string, name: string) => {
    if (!selectedClientId || !selectedProjectId || !selectedProject) return;
    if (window.confirm(`Are you sure you want to delete addition "${name}"? This updates total rates & balances.`)) {
      dispatch(deleteClientProjectAdditionalItem({
        clientId: selectedClientId,
        projectId: selectedProjectId,
        itemId
      }));

      if (selectedProject.assignedKaragirId) {
        dispatch(deleteKaragirProjectAdditionalItem({
          karagirId: selectedProject.assignedKaragirId,
          projectId: selectedProjectId,
          itemId
        }));
      }

      toast.success(`Successfully removed "${name}"`);
    }
  };

  // Assign Karagir and wages handlers
  const handleAssignKaragirSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClientId || !selectedProjectId || !selectedProject) return;

    const formData = new FormData(e.currentTarget);
    const karagirId = formData.get('karagirId') as string;
    const totalAmount = Number(formData.get('totalWages') || '0');
    const advancePayment = Number(formData.get('advancePayment') || '0');
    const allottedDies = Number(formData.get('allottedDies') || '0');
    const completionDate = (formData.get('completionDate') as string) || undefined;
    const status = (formData.get('status') as any) || 'Pending';

    if (!karagirId) {
      toast.error('Please select a Karagir');
      return;
    }

    const linkedK = karagirs.find(k => k.id === karagirId);
    if (!linkedK) return;

    // Check that we aren't overidentifying allotted dies if we can validate
    const existingAllocated = (selectedProject.karagirAssignments || []).reduce((acc, a) => acc + (a.allottedDies || 0), 0);
    const totalProjectDies = selectedProject.dieDetails?.totalDies || 0;
    if (existingAllocated + allottedDies > totalProjectDies) {
      toast.error(`Exceeds project die limits! Only ${totalProjectDies - existingAllocated} dies available out of ${totalProjectDies} total.`);
      // Let it go through or warn, warning keeps data integrity! Let's allow but notify.
    }

    const newAssignment: KaragirAssignment = {
      id: generateId(),
      karagirId,
      karagirName: linkedK.name,
      allottedDies,
      status,
      completionDate,
      designImage: assignmentImage || assignmentImages[0] || undefined,
      designImages: assignmentImages,
      totalAmount,
      advancePayment,
      lumpsumPayments: [],
      totalPaid: advancePayment,
      pendingPayment: Math.max(0, totalAmount - advancePayment),
      createdAt: new Date().toISOString()
    };

    dispatch(addKaragirAssignment({
      clientId: selectedClientId,
      projectId: selectedProjectId,
      assignment: newAssignment
    }));

    setIsAssignKaragirModalOpen(false);
    setAssignmentImage(undefined);
    setAssignmentImages([]);
    toast.success(`Assigned ${linkedK.name} to this project with ${allottedDies} dies successfully.`);
  };

  const handleEditAssignmentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClientId || !selectedProjectId || !editingAssignment) return;

    const formData = new FormData(e.currentTarget);
    const totalAmount = Number(formData.get('totalWages') || '0');
    const advancePayment = Number(formData.get('advancePayment') || '0');
    const allottedDies = Number(formData.get('allottedDies') || '0');
    const completionDate = (formData.get('completionDate') as string) || undefined;
    const status = (formData.get('status') as any) || 'Pending';

    dispatch(updateKaragirAssignment({
      clientId: selectedClientId,
      projectId: selectedProjectId,
      assignmentId: editingAssignment.id,
      updates: {
        totalAmount,
        advancePayment,
        allottedDies,
        status,
        completionDate,
        designImage: assignmentImage || assignmentImages[0] || editingAssignment.designImage,
        designImages: assignmentImages.length > 0 ? assignmentImages : (editingAssignment.designImages || (editingAssignment.designImage ? [editingAssignment.designImage] : []))
      }
    }));

    setIsEditAssignmentModalOpen(false);
    setEditingAssignment(null);
    setAssignmentImage(undefined);
    setAssignmentImages([]);
    toast.success(`Successfully updated assignment details for ${editingAssignment.karagirName}.`);
  };

  const handleCourierSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClientId || !selectedProjectId) return;
    const formData = new FormData(e.currentTarget);
    const senderName = formData.get('senderName') as string;
    const courierService = formData.get('courierService') as string;
    const trackingNumber = (formData.get('trackingNumber') as string) || undefined;
    const amount = Number(formData.get('amount') || '0');
    const date = (formData.get('date') as string) || new Date().toISOString();
    const notes = (formData.get('notes') as string) || undefined;

    const charge: CourierCharge = {
      id: generateId(),
      senderName,
      courierService,
      trackingNumber,
      amount,
      date,
      notes
    };

    dispatch(addCourierCharge({ clientId: selectedClientId, projectId: selectedProjectId, charge }));
    setIsCourierModalOpen(false);
    toast.success(`Courier/Shipping charge of ₹${amount} recorded!`);
  };

  const handleCourierDelete = (chargeId: string) => {
    if (!selectedClientId || !selectedProjectId) return;
    if (window.confirm('Are you sure you want to delete this courier charge?')) {
      dispatch(deleteCourierCharge({ clientId: selectedClientId, projectId: selectedProjectId, chargeId }));
      toast.success('Courier charge removed');
    }
  };

  const handleKaragirAssignmentRemove = (assignmentId: string, karagirName: string) => {
    if (!selectedClientId || !selectedProjectId) return;
    if (window.confirm(`Are you sure you want to remove assignment for "${karagirName}"? This resets their recorded wages and payouts.`)) {
      dispatch(deleteKaragirAssignment({
        clientId: selectedClientId,
        projectId: selectedProjectId,
        assignmentId
      }));
      toast.success(`Removed assignment for ${karagirName}`);
    }
  };

  const handleKaragirLumpsumSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClientId || !selectedProjectId || !selectedProject || !selectedKaragirAssignmentId) return;

    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get('amount') || '0');
    const notes = formData.get('notes') as string;
    const date = formData.get('date') as string;

    const newPayment: LumpsumPayment = {
      id: generateId(),
      date: date || new Date().toISOString(),
      amount,
      notes
    };

    dispatch(addKaragirAssignmentLumpsum({
      clientId: selectedClientId,
      projectId: selectedProjectId,
      assignmentId: selectedKaragirAssignmentId,
      payment: newPayment
    }));

    setIsKaragirLumpsumModalOpen(false);
    setSelectedKaragirAssignmentId(null);
    toast.success(`Recorded payout of ₹${amount} successfully.`);
  };

  // Filters
  const filteredClients = clients.filter(c => 
    c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold text-text flex items-center gap-2">
            <Layers className="text-primary" /> Clients Directory
          </h2>
          <p className="text-xs text-text-muted mt-1">Manage files, client properties, project files, and dynamic billing folders.</p>
        </div>
        
        <div className="flex gap-2">
          {selectedClientId && (
            <button
              onClick={() => {
                if (selectedProjectId) {
                  setSelectedProjectId(null);
                } else {
                  setSelectedClientId(null);
                }
              }}
              className="flex items-center px-4 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-background transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" /> Back
            </button>
          )}

          <button
            onClick={() => {
              setEditingClient(null);
              setIsClientModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-primary text-background font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            <FolderPlus size={18} className="mr-2" /> New Client Folder
          </button>
        </div>
      </div>

      {/* SEARCH / BREADCRUMBS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border">
        {/* Breadcrumb navigation */}
        <div className="flex items-center space-x-2 text-sm text-text-muted">
          <span 
            className="hover:text-primary cursor-pointer transition-colors font-medium"
            onClick={() => { setSelectedClientId(null); setSelectedProjectId(null); }}
          >
            Root
          </span>
          {selectedClient && (
            <>
              <span>/</span>
              <span 
                className={cn("hover:text-primary cursor-pointer transition-colors font-medium", !selectedProjectId && "text-primary")}
                onClick={() => setSelectedProjectId(null)}
              >
                {selectedClient.clientName}
              </span>
            </>
          )}
          {selectedProject && (
            <>
              <span>/</span>
              <span className="text-primary font-bold">
                {selectedProject.projectName}
              </span>
            </>
          )}
        </div>

        {!selectedClientId && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Search folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none text-text"
            />
          </div>
        )}
      </div>

      {/* VIEW ENGINE */}
      {!selectedClientId ? (
        /* SCREEN 1: CLIENT FOLDERS GRID */
        <div>
          {filteredClients.length === 0 ? (
            <div className="text-center py-12 bg-surface rounded-xl border border-dashed border-border">
              <Folder className="mx-auto text-text-muted mb-4 opacity-35" size={48} />
              <p className="text-sm text-text-muted">No client folders found. Create one now!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredClients.map((client) => {
                const projectCount = client.projects?.length || 0;
                return (
                  <div
                    key={client.id}
                    className="group relative bg-surface hover:bg-background border border-border hover:border-primary/50 p-4 rounded-xl flex flex-col justify-between cursor-pointer transition-all shadow-sm"
                    onClick={() => setSelectedClientId(client.id)}
                  >
                    {/* Folder Icon with Tab */}
                    <div className="mb-4">
                      <div className="w-10 h-8 bg-primary/20 group-hover:bg-primary/30 text-primary rounded-tr-md rounded-bl-sm rounded-br-sm relative flex items-center justify-center">
                        <Folder size={20} />
                        <span className="absolute -top-1.5 left-0 w-5 h-2 bg-primary/20 group-hover:bg-primary/30 rounded-t-sm"></span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-text truncate group-hover:text-primary transition-colors text-sm">
                        {client.clientName}
                      </h4>
                      <p className="text-[11px] text-text-muted truncate mt-0.5">
                        {client.businessName || 'No business specified'}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-border/50 text-[10px] text-text-muted">
                      <span>{projectCount} projects</span>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setEditingClient(client);
                            setIsClientModalOpen(true);
                          }}
                          className="p-1 hover:text-primary rounded"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleClientDelete(client.id, client.clientName)}
                          className="p-1 hover:text-red-400 rounded"
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
        /* SCREEN 2: PROJECTS INSIDE CLIENT FOLDER */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Client Folder Meta Panel */}
          <div className="bg-surface p-6 rounded-xl border border-border h-fit space-y-4 shadow-sm">
            <h3 className="font-bold text-lg text-primary flex items-center gap-2">
              <FolderPlus size={20} /> Client Info
            </h3>
            
            <div className="space-y-3.5 text-sm pt-2">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-text-muted" />
                <div>
                  <p className="text-[10px] text-text-muted">Address</p>
                  <p className="text-text text-xs leading-relaxed">{selectedClient?.address}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-text-muted" />
                <div>
                  <p className="text-[10px] text-text-muted">Phone Number</p>
                  <p className="text-text text-xs">{selectedClient?.phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} className="text-text-muted" />
                <div>
                  <p className="text-[10px] text-text-muted">Email ID</p>
                  <p className="text-text text-xs">{selectedClient?.emailId || 'Mailing address not set'}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/80 flex gap-2">
              <button
                onClick={() => {
                  setEditingClient(selectedClient!);
                  setIsClientModalOpen(true);
                }}
                className="flex-1 py-1.5 bg-background border border-border rounded-lg text-xs font-semibold hover:border-primary transition-colors hover:text-primary flex items-center justify-center gap-1.5"
              >
                <Edit2 size={12} /> Edit Client
              </button>
            </div>
          </div>

          {/* Project Folders Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-text text-base">Project Folders</h3>
              
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsProjectModalOpen(true);
                }}
                className="flex items-center px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 font-semibold rounded-lg text-xs hover:bg-primary/30 transition-all"
              >
                <Plus size={14} className="mr-1.5" /> New Project Folder
              </button>
            </div>

            {(!selectedClient?.projects || selectedClient.projects.length === 0) ? (
              <div className="text-center py-12 bg-surface/50 rounded-xl border border-dashed border-border">
                <Briefcase className="mx-auto text-text-muted mb-3 opacity-30" size={36} />
                <p className="text-xs text-text-muted">No projects found for this client. Create one above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedClient.projects.map((proj) => {
                  const remains = proj.pendingPayment;
                  return (
                    <div
                      key={proj.id}
                      onClick={() => setSelectedProjectId(proj.id)}
                      className="group bg-surface hover:bg-background border border-border hover:border-primary/50 p-5 rounded-xl cursor-pointer transition-all shadow-sm relative flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start">
                        <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
                          <Folder size={18} />
                        </div>
                        <span className={cn(
                          "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase",
                          remains === 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                        )}>
                          {remains === 0 ? 'Fully Paid' : 'Pending'}
                        </span>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-bold text-sm text-text group-hover:text-primary transition-colors leading-snug">{proj.projectName}</h4>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-text-muted">
                          <span>{proj.dieDetails?.totalDies || 0} Dies</span>
                          <span>•</span>
                          <span>{proj.dieDetails?.dieType}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-5 pt-3 border-t border-border/50 text-[11px]">
                        <div>
                          <p className="text-[9px] text-text-muted">Total Bill</p>
                          <p className="font-bold text-text">₹{proj.totalAmount}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-text-muted">Pending Balance</p>
                          <p className={cn("font-bold", remains === 0 ? "text-green-400" : "text-red-400")}>
                            ₹{remains}
                          </p>
                        </div>
                      </div>

                      {/* Floating actions */}
                      <div 
                        className="absolute right-4 top-4 flex gap-1 group-hover:opacity-100 opacity-0 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setEditingProject(proj);
                            setIsProjectModalOpen(true);
                          }}
                          className="p-1 hover:text-primary rounded text-text-muted"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleProjectDelete(proj.id, proj.projectName)}
                          className="p-1 hover:text-red-400 rounded text-text-muted"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SCREEN 3: EXPLICIT DETAILED VIEW OF SELECTED PROJECT */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* COLUMN 1: Die details & Specs Sheet */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-surface p-6 rounded-xl border border-border space-y-4 shadow-sm">
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Specifications</h4>
                <button
                  onClick={() => {
                    setEditingProject(selectedProject!);
                    setIsProjectModalOpen(true);
                  }}
                  className="p-1.5 text-text-muted hover:text-primary rounded-lg transition-colors bg-background border border-border"
                  title="Edit Specifications"
                >
                  <Edit2 size={12} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <p className="text-[10px] text-text-muted font-semibold uppercase">Project Name</p>
                  <p className="text-text font-bold text-sm mt-0.5">{selectedProject.projectName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-text-muted font-semibold uppercase">Total Dies</p>
                    <p className="text-text font-bold text-sm mt-0.5">{selectedProject.dieDetails?.totalDies || 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted font-semibold uppercase">Die Type</p>
                    <p className="text-text font-semibold text-xs mt-0.5">{selectedProject.dieDetails?.dieType}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-text-muted font-semibold uppercase">Designs Spec</p>
                  <p className="text-text leading-relaxed font-mono mt-0.5">{selectedProject.dieDetails?.designs || 'Not defined'}</p>
                </div>

                <div>
                  <p className="text-[10px] text-text-muted font-semibold uppercase">Sizes Specs</p>
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

                <div className="pt-2 border-t border-border/40">
                  <p className="text-[10px] text-text-muted font-semibold uppercase">Created At</p>
                  <p className="text-text mt-0.5 flex items-center gap-1.5">
                    <Calendar size={12} /> {new Date(selectedProject.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Project Drawings Portfolio */}
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <h4 className="font-bold text-[11px] text-primary uppercase tracking-wider flex items-center gap-1.5 matches-glow">
                  <Sparkles size={13} /> Drawings Portfolio
                </h4>
                <div className="relative overflow-hidden bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 rounded text-[10px] font-black flex items-center gap-1 cursor-pointer">
                  <Plus size={11} /> Upload Drawing
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const result = event.target?.result as string;
                          dispatch(addClientProjectImage({
                            clientId: selectedClientId!,
                            projectId: selectedProjectId!,
                            image: result
                          }));
                          toast.success('Added drawing visual reference!');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>

              {(() => {
                const drawings = selectedProject.projectImages || (selectedProject.projectImage ? [selectedProject.projectImage] : []);
                if (drawings.length === 0) {
                  return (
                    <div className="bg-background/25 border border-dashed border-border p-6 rounded-lg text-center text-text-muted text-[11px]">
                      No drawings uploaded yet. Click above to add blueprint graphics.
                    </div>
                  );
                }

                return (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      {drawings.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg border border-border bg-background overflow-hidden group">
                          <img 
                            src={img} 
                            alt={`Blueprint draft ${idx + 1}`} 
                            className="w-full h-full object-contain p-1 cursor-zoom-in hover:scale-105 transition-transform"
                            onClick={() => setLightboxImage(img)}
                            referrerPolicy="no-referrer"
                          />
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to remove this drawing sheet?')) {
                                dispatch(deleteClientProjectImage({
                                  clientId: selectedClientId!,
                                  projectId: selectedProjectId!,
                                  index: idx
                                }));
                                toast.success('Drawing removed');
                              }
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-all border border-border shadow-xs"
                            title="Delete Drawing"
                          >
                            <X size={8} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <span className="block text-[8px] text-text-muted font-mono leading-none text-center">
                      Click drawings to zoom in Lightbox • Hover to delete
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Courier & Shipping Charges */}
            <div className="bg-surface p-6 rounded-xl border border-border space-y-4 shadow-sm">
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <h4 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Truck size={14} /> Shipping & Couriers
                </h4>
                <button
                  type="button"
                  onClick={() => setIsCourierModalOpen(true)}
                  className="flex items-center gap-1 text-[10px] font-black text-primary hover:underline bg-primary/10 px-2 py-1 rounded"
                >
                  <Plus size={11} /> Add Dispatch
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-background p-3 rounded-lg border border-border">
                  <p className="text-[10px] text-text-muted font-bold">Total Courier Cost</p>
                  <p className="text-xs font-black text-primary mt-1">₹{selectedProject.courierCharges || 0}</p>
                </div>
                <div className="bg-background p-3 rounded-lg border border-border">
                  <p className="text-[10px] text-text-muted font-bold">Other Material Expenses</p>
                  <p className="text-xs font-semibold text-text mt-1">₹{selectedProject.otherExpenses || 0}</p>
                </div>
              </div>

              {/* List of dispatches */}
              {(() => {
                const list = selectedProject.courierChargesList || [];
                if (list.length === 0) {
                  return (
                    <div className="text-[10px] text-text-muted p-3 bg-background border border-border rounded-lg text-center italic">
                      No multiple dispatches recorded. Click "+ Add Dispatch" to expense courier slips.
                    </div>
                  );
                }

                return (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {list.map((item) => (
                      <div key={item.id} className="p-2.5 bg-background border border-border rounded-lg flex flex-col gap-1 relative group text-[10px]">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-black text-text uppercase text-[9px] tracking-wide">{item.courierService}</span>
                            {item.trackingNumber && (
                              <span className="block font-mono text-[8px] text-text-muted mt-0.5">AWB: {item.trackingNumber}</span>
                            )}
                          </div>
                          <span className="font-black text-amber-500 font-mono text-xs">₹{item.amount}</span>
                        </div>

                        <div className="flex justify-between items-center text-[8px] text-text-muted border-t border-border/30 pt-1.5 mt-1">
                          <span>Sender: <strong className="text-text font-black">{item.senderName}</strong></span>
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>

                        {item.notes && (
                          <div className="bg-surface/50 text-[8px] text-text-muted px-2 py-1 rounded border border-border/30 mt-1 italic leading-tight">
                            {item.notes}
                          </div>
                        )}

                        <button
                          onClick={() => handleCourierDelete(item.id)}
                          className="absolute right-2 top-2 p-1 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity border border-border bg-surface hover:bg-red-500/10 rounded"
                          title="Delete dispatch charge"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Workflow handoff / Karagir Assign status */}
            <div className="bg-surface p-6 rounded-xl border border-border space-y-4 shadow-sm">
              <div className="flex justify-between items-center bg-surface pb-1.5 border-b border-border/50">
                <h4 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Link2 size={13} /> Linked Karagirs & Wages
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAssignKaragirModalOpen(true)}
                  className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline bg-primary/10 px-2 py-1 rounded"
                >
                  <UserPlus size={11} /> Assign Karagir
                </button>
              </div>

              {(() => {
                const assignments: KaragirAssignment[] = selectedProject.karagirAssignments || [];
                const legacyKaragirId = selectedProject.assignedKaragirId;
                let finalAssignments: KaragirAssignment[] = [...assignments];

                if (legacyKaragirId && !finalAssignments.some(a => a.karagirId === legacyKaragirId)) {
                  const kItem = karagirs.find(k => k.id === legacyKaragirId);
                  if (kItem) {
                    const kp = kItem.projects?.find(p => p.id === selectedProject.id);
                    finalAssignments.push({
                      id: 'legacy-assignment',
                      karagirId: legacyKaragirId,
                      karagirName: kItem.name,
                      allottedDies: selectedProject.dieDetails?.totalDies || 0,
                      status: 'In Progress',
                      totalAmount: kp?.totalAmount || 0,
                      advancePayment: kp?.advancePayment || 0,
                      lumpsumPayments: kp?.lumpsumPayments || [],
                      totalPaid: kp?.totalPaid || 0,
                      pendingPayment: kp?.pendingPayment || 0,
                      createdAt: selectedProject.createdAt
                    });
                  }
                }

                if (finalAssignments.length === 0) {
                  return (
                    <div className="text-center py-6 bg-background rounded-lg border border-dashed border-border">
                      <p className="text-xs text-text-muted">No artisans linked to this project yet.</p>
                      <button 
                        onClick={() => setIsAssignKaragirModalOpen(true)}
                        className="mt-2 text-xs text-primary font-bold hover:underline flex items-center gap-1 mx-auto"
                      >
                        <UserPlus size={11} /> Assign One Now
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {finalAssignments.map((ka) => (
                      <div key={ka.id} className="p-4 bg-background border border-border rounded-xl space-y-3 relative group shadow-sm hover:border-primary/30 transition-all">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-black text-text block">{ka.karagirName}</span>
                              <span className="px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-black text-[9px] uppercase tracking-wide">
                                {ka.allottedDies || 0} Dies
                              </span>
                            </div>
                            <span className="text-[9px] text-text-muted font-mono block">Linked: {new Date(ka.createdAt || new Date()).toLocaleDateString()}</span>
                            
                            {ka.completionDate && (
                              <div className="flex items-center gap-1 text-[9px] text-amber-500 font-bold">
                                <Calendar size={10} />
                                <span>Target: {new Date(ka.completionDate).toLocaleDateString()}</span>
                              </div>
                            )}

                            {/* Status badge */}
                            <span className={cn(
                              "inline-block px-1.5 py-0.25 rounded font-bold text-[8px] border uppercase mt-1",
                              ka.status === 'Pending' && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                              ka.status === 'In Progress' && "bg-primary/10 text-primary border-primary/20",
                              ka.status === 'Completed' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                              ka.status === 'Delivered' && "bg-sky-500/10 text-sky-500 border-sky-500/20",
                              !ka.status && "bg-primary/10 text-primary border-primary/25"
                            )}>
                              {ka.status || 'In Progress'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <button
                              title="Edit specifications"
                              onClick={() => {
                                setEditingAssignment(ka);
                                setAssignmentImage(ka.designImage);
                                setAssignmentImages(ka.designImages || (ka.designImage ? [ka.designImage] : []));
                                setIsEditAssignmentModalOpen(true);
                              }}
                              className="p-1 hover:text-primary hover:bg-surface text-text-muted border border-border rounded transition-all"
                            >
                              <Edit2 size={11} />
                            </button>
                            <button
                              title="Pay Installment"
                              onClick={() => {
                                setSelectedKaragirAssignmentId(ka.id);
                                setIsKaragirLumpsumModalOpen(true);
                              }}
                              className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded font-bold hover:bg-green-500/20 transition-all flex items-center gap-1"
                            >
                              ₹ Pay
                            </button>
                            <button
                              title="Remove Karagir"
                              onClick={() => handleKaragirAssignmentRemove(ka.id, ka.karagirName)}
                              className="p-1 hover:text-red-400 text-text-muted transition-colors border border-border rounded hover:bg-red-500/5"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>

                        {/* Split Design visuals given to each karagir */}
                        {(() => {
                          const designImages = ka.designImages || (ka.designImage ? [ka.designImage] : []);
                          if (designImages.length === 0) return null;
                          return (
                            <div className="bg-surface/30 p-2.5 rounded-lg border border-border space-y-1.5">
                              <p className="text-[8px] text-text-muted uppercase font-bold tracking-wider">Design blueprint sheets</p>
                              <div className="flex flex-wrap gap-2">
                                {designImages.map((img, dIdx) => (
                                  <div 
                                    key={dIdx}
                                    onClick={() => setLightboxImage(img)}
                                    className="w-12 h-12 rounded-lg border border-border bg-background flex items-center justify-center overflow-hidden cursor-zoom-in shrink-0 relative group/thumb hover:border-primary transition-colors"
                                  >
                                    <img src={img} alt={`Segment design ${dIdx + 1}`} className="w-full h-full object-contain p-0.5 group-hover/thumb:scale-110 transition-transform" referrerPolicy="no-referrer" />
                                    <div className="absolute inset-0 bg-black/40 text-[7px] text-white font-black text-center flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                                      ZOOM
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-border/50 text-[10px] font-bold text-center">
                          <div className="bg-surface/50 p-1.5 rounded">
                            <p className="text-[8px] text-text-muted uppercase font-semibold">Wages</p>
                            <p className="text-text font-bold">₹{ka.totalAmount}</p>
                          </div>
                          <div className="bg-surface/50 p-1.5 rounded">
                            <p className="text-[8px] text-text-muted uppercase font-semibold">Advance</p>
                            <p className="text-primary font-bold">₹{ka.advancePayment}</p>
                          </div>
                          <div className="bg-surface/50 p-1.5 rounded">
                            <p className="text-[8px] text-text-muted uppercase font-semibold">Paid</p>
                            <p className="text-green-400 font-bold">₹{ka.totalPaid}</p>
                          </div>
                          <div className="bg-surface/50 p-1.5 rounded">
                            <p className="text-[8px] text-text-muted uppercase font-semibold">Balance</p>
                            <p className="text-red-400 font-bold">₹{ka.pendingPayment}</p>
                          </div>
                        </div>

                        {/* Expandable Installment ledger for this Karagir */}
                        {ka.lumpsumPayments && ka.lumpsumPayments.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-dashed border-border/50 space-y-1.5">
                            <p className="text-[8px] text-text-muted uppercase font-bold tracking-wider">Installments payout</p>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                              {ka.lumpsumPayments.map((p) => (
                                <div key={p.id} className="flex justify-between items-center text-[10px] bg-surface/30 px-2 py-1 rounded">
                                  <span className="text-text-muted font-mono">{new Date(p.date).toLocaleDateString()}</span>
                                  <span className="font-bold text-green-400">₹{p.amount}</span>
                                  <span className="text-text-muted truncate max-w-[80px]" title={p.notes}>{p.notes || 'No remarks'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* COLUMN 2 & 3: Ledger & Cash ledger */}
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Ledger Board */}
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-background rounded-xl border border-border flex flex-col justify-between">
                <span className="text-[10px] text-text-muted font-bold uppercase">Bill Set Rate</span>
                <span className="text-2xl font-black text-text mt-2">₹{selectedProject.totalAmount}</span>
              </div>
              <div className="p-4 bg-background rounded-xl border border-border flex flex-col justify-between">
                <span className="text-[10px] text-text-muted font-bold uppercase font-sans text-primary">Advance Set</span>
                <span className="text-2xl font-black text-primary mt-2">₹{selectedProject.advancePayment}</span>
              </div>
              <div className="p-4 bg-background rounded-xl border border-border flex flex-col justify-between">
                <span className="text-[10px] text-text-muted font-bold uppercase text-green-400">Total Paid</span>
                <span className="text-2xl font-black text-green-400 mt-2">₹{selectedProject.totalPaid}</span>
              </div>
              <div className="p-4 bg-background rounded-xl border border-border flex flex-col justify-between">
                <span className="text-[10px] text-text-muted font-bold uppercase text-red-400">Balance Pending</span>
                <span className="text-2xl font-black text-red-400 mt-2">₹{selectedProject.pendingPayment}</span>
              </div>
            </div>

            {/* Lumpsum ledger lists */}
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-text text-base flex items-center gap-2">
                    <DollarSign size={18} className="text-green-400" /> Installments & Lumpsum Ledger
                  </h3>
                  <p className="text-[10px] text-text-muted mt-0.5">Keep log of incremental payments made by client for this project.</p>
                </div>

                <button
                  onClick={() => setIsLumpsumModalOpen(true)}
                  disabled={selectedProject.pendingPayment <= 0}
                  className="flex items-center px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 font-bold rounded-lg text-xs hover:bg-green-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus size={14} className="mr-1.5" /> Record Lumpsum
                </button>
              </div>

              <div className="border border-border rounded-xl bg-background overflow-hidden overflow-x-auto">
                <table className="w-full text-left font-sans text-xs flex-col">
                  <thead className="bg-surface text-text-muted uppercase text-[10px] font-semibold border-b border-border">
                    <tr>
                      <th className="px-5 py-3">Receipt Date</th>
                      <th className="px-5 py-3">Received Amount</th>
                      <th className="px-5 py-3">Remarks / Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-text">
                    {/* Task 01: Always show Advance at top of Ledger Box */}
                    <tr className="hover:bg-surface/30 bg-primary/5 font-semibold">
                      <td className="px-5 py-3 font-mono text-[10px] text-text-muted">
                        {new Date(selectedProject.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 font-bold text-primary">
                        ₹{selectedProject.advancePayment}
                      </td>
                      <td className="px-5 py-3 text-text font-semibold flex items-center gap-1.5">
                        <Sparkles size={11} className="text-amber-500" /> Advance Set Amount (Initial Deposit)
                      </td>
                    </tr>
                    {selectedProject.lumpsumPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-surface/30">
                        <td className="px-5 py-3 font-medium text-[10px] text-text-muted">
                          {new Date(p.date).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3 font-bold text-green-400">
                          ₹{p.amount}
                        </td>
                        <td className="px-5 py-3 text-text-muted">
                          {p.notes || 'No remarks recorded'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Post-Launch Process Additions Card */}
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h3 className="font-bold text-text text-base flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-500" /> Ongoing Process Additions
                  </h3>
                  <p className="text-[10px] text-text-muted mt-0.5">Add extra items, designs, or rate modifications requested after launching the project.</p>
                </div>

                <button
                  onClick={() => setIsAdditionalItemModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-primary text-background font-black rounded-lg text-xs hover:opacity-95 transition-opacity self-start sm:self-auto"
                >
                  <Plus size={14} className="mr-1.5" /> Add Process Addition / Die
                </button>
              </div>

              {(!selectedProject.additionalItems || selectedProject.additionalItems.length === 0) ? (
                <div className="text-center py-10 bg-background rounded-xl border border-dashed border-border text-xs text-text-muted">
                  No post-launch process additions recorded. If the client requests an extra item or size modification after a few days, record it here to sync costs and artisan wages.
                </div>
              ) : (
                <div className="border border-border rounded-xl bg-background overflow-hidden overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs">
                    <thead className="bg-surface text-text-muted uppercase text-[10px] font-semibold border-b border-border">
                      <tr>
                        <th className="px-4 py-3">Date Added</th>
                        <th className="px-4 py-3">Specs (Name / Size / Design)</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3">Client Rate</th>
                        <th className="px-4 py-3">Artisan Wages (Karagir)</th>
                        <th className="px-4 py-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-text">
                      {selectedProject.additionalItems.map((item) => (
                        <tr key={item.id} className="hover:bg-surface/30">
                          <td className="px-4 py-3 font-medium text-[10px] whitespace-nowrap">
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
                          <td className="px-4 py-3">
                            <div className="font-semibold text-green-400">₹{item.clientRate}</div>
                            {item.quantity > 1 && (
                              <div className="text-[9px] text-text-muted font-mono">Total: ₹{item.clientRate * item.quantity}</div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {selectedProject.assignedKaragirId ? (
                              <>
                                <div className="font-semibold text-amber-500">₹{item.karagirRate || 0}</div>
                                {item.quantity > 1 && (
                                  <div className="text-[9px] text-text-muted font-mono">Total: ₹{(item.karagirRate || 0) * item.quantity}</div>
                                )}
                              </>
                            ) : (
                              <span className="text-[10px] text-text-muted italic">No linked Karagir</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleAdditionalItemDelete(item.id, item.name)}
                              className="p-1 hover:text-red-400 text-text-muted transition-colors rounded"
                              title="Delete Item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL WINDOWS FOR CRUD OVERLAY */}
      
      {/* 1. NEW/EDIT CLIENT MODAL */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl border border-border">
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h3 className="text-base font-bold text-text">
                {editingClient ? 'Edit Client Folder Properties' : 'Initialize Client Name Folder'}
              </h3>
              <button onClick={() => setIsClientModalOpen(false)} className="text-text-muted hover:text-text">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleClientSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-text-muted font-medium">Client Name (Folder Primary Name)</label>
                <input required name="clientName" placeholder="e.g. Rahul Sharma" defaultValue={editingClient?.clientName} className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary" />
              </div>

              <div className="space-y-1.5">
                <label className="text-text-muted font-medium">Business / Shop Name</label>
                <input required name="businessName" placeholder="e.g. Ambika Jewellers" defaultValue={editingClient?.businessName} className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary" />
              </div>

              <div className="space-y-1.5">
                <label className="text-text-muted font-medium">Address Spec</label>
                <textarea required name="address" placeholder="Store street address" defaultValue={editingClient?.address} className="w-full px-4 py-2 h-20 bg-background border border-border rounded-lg outline-none text-text focus:border-primary resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-text-muted font-medium">Phone Number</label>
                  <input required name="phoneNumber" placeholder="e.g. 9876543210" defaultValue={editingClient?.phoneNumber} className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-text-muted font-medium">Email Address</label>
                  <input type="email" name="emailId" placeholder="e.g. sharma@gmail.com" defaultValue={editingClient?.emailId} className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsClientModalOpen(false)} className="flex-1 py-2 bg-background border border-border text-text-muted font-semibold rounded-lg hover:bg-surface/50">
                  Cancel File
                </button>
                <button type="submit" className="flex-1 py-2 bg-primary text-background font-black rounded-lg">
                  {editingClient ? 'Complete Changes' : 'Create Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. NEW/EDIT PROJECT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl border border-border my-8">
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h3 className="text-base font-bold text-text">
                {editingProject ? 'Edit Project Specifications' : 'Initialize Project Folder inside ' + selectedClient?.clientName}
              </h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-text-muted hover:text-text">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-text-muted font-medium">Project Name</label>
                <input required name="projectName" placeholder="e.g. Diwali Coins 2026" defaultValue={editingProject?.projectName} className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary" />
              </div>

              <div className="border border-border rounded-xl p-4 space-y-3 bg-background">
                <h4 className="text-text font-bold text-[11px] uppercase tracking-wider text-primary">Die Specifications</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-text-muted font-medium">Select Die Type</label>
                    <select name="dieType" defaultValue={editingProject?.dieDetails?.dieType} className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-text outline-none text-xs">
                      {dieTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-muted font-medium">Total Dies Qty</label>
                    <input required type="number" name="totalDies" placeholder="e.g. 5" defaultValue={editingProject?.dieDetails?.totalDies} className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg outline-none text-text focus:border-primary" />
                  </div>
                  {/* Task 04: Sizes specifications interactive badge tag-input */}
                  <div className="space-y-1.5 col-span-2 md:col-span-1">
                    <label className="text-text-muted font-medium font-mono text-[10px]">Sizes (type size + click Enter)</label>
                    <div className="flex flex-wrap gap-1 p-1 bg-surface border border-border rounded-lg focus-within:border-primary min-h-[34px] items-center">
                      {sizeTags.map((tag, i) => (
                        <span key={i} className="inline-flex items-center gap-1 font-mono text-[9px] font-bold px-1.5 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded">
                          {tag}
                          <button
                            type="button"
                            onClick={() => setSizeTags(sizeTags.filter((_, idx) => idx !== i))}
                            className="text-primary hover:text-red-400 p-0.5 font-bold outline-none cursor-pointer"
                          >
                            <X size={8} />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder={sizeTags.length === 0 ? "e.g. 12mm" : "Add..."}
                        className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-text min-w-[50px] px-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const val = e.currentTarget.value.trim().replace(/,/g, '');
                            if (val && !sizeTags.includes(val)) {
                              setSizeTags([...sizeTags, val]);
                            }
                            e.currentTarget.value = '';
                          }
                        }}
                        onBlur={(e) => {
                          const val = e.currentTarget.value.trim().replace(/,/g, '');
                          if (val && !sizeTags.includes(val)) {
                            setSizeTags([...sizeTags, val]);
                          }
                          e.currentTarget.value = '';
                        }}
                      />
                    </div>
                    <input type="hidden" name="sizes" value={sizeTags.join(', ')} />
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <label className="text-text-muted font-medium">Design Names / Codes</label>
                  <input required name="designs" placeholder="e.g. floral leaf, lord ganesh mesh, concentric grid lines" defaultValue={editingProject?.dieDetails?.designs} className="w-full px-4 py-1.5 bg-surface border border-border rounded-lg outline-none text-text focus:border-primary" />
                </div>
              </div>

              <div className="border border-border rounded-xl p-4 space-y-3 bg-background">
                <h4 className="text-text font-bold text-[11px] uppercase tracking-wider text-primary">Client financial rates</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-text-muted font-medium">Total Amount set</label>
                    <input required type="number" name="totalAmount" placeholder="Rate for project" defaultValue={editingProject?.totalAmount} className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg outline-none text-text focus:border-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-muted font-medium">Advance payment</label>
                    <input required type="number" name="advancePayment" placeholder="Deposit" defaultValue={editingProject?.advancePayment || 0} className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg outline-none text-text focus:border-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-muted font-medium">Courier Charges</label>
                    <input type="number" name="courierCharges" placeholder="Fees" defaultValue={editingProject?.courierCharges || 0} className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg outline-none text-text focus:border-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-muted font-medium">Other Expenses</label>
                    <input type="number" name="otherExpenses" placeholder="Fees" defaultValue={editingProject?.otherExpenses || 0} className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg outline-none text-text focus:border-primary" />
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-xl p-4 bg-background">
                <MultiImageUpload
                  images={projectImages}
                  onImagesChange={setProjectImages}
                  label="Master Project Design Visuals / Blueprint References (Multiple Support)"
                />
              </div>

              <div className="border border-border rounded-xl p-4 space-y-3 bg-background">
                <h4 className="text-text font-bold text-[11px] uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Layers size={12} /> Handoff / Assign Karagir (Optional)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-text-muted font-medium">Assigned Karagir</label>
                    <select name="assignedKaragirId" defaultValue={editingProject?.assignedKaragirId || ''} className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-text outline-none text-xs">
                      <option value="">-- No Karagir Assigned --</option>
                      {karagirs.map(k => (
                        <option key={k.id} value={k.id}>{k.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-text-muted font-medium">Total wages set to Karagir</label>
                    {(() => {
                      const linkedK = karagirs.find(k => k.id === editingProject?.assignedKaragirId);
                      const linkedKp = linkedK?.projects?.find(p => p.id === editingProject?.id);
                      return (
                        <input 
                          type="number" 
                          name="karagirTotalAmount" 
                          placeholder="Karagir charges amount" 
                          defaultValue={linkedKp?.totalAmount || 0} 
                          className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg outline-none text-text focus:border-primary" 
                        />
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="flex-1 py-2 bg-background border border-border text-text-muted font-semibold rounded-lg hover:bg-surface/50">
                  Cancel Project
                </button>
                <button type="submit" className="flex-1 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary/90">
                  {editingProject ? 'Complete Specifications' : 'Initialize Project Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. NEW LUMPSUM MODAL */}
      {isLumpsumModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface w-full max-w-sm rounded-2xl shadow-xl border border-border">
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h3 className="text-xs font-bold text-text uppercase tracking-wider text-green-400">
                Record Lumpsum Installment
              </h3>
              <button onClick={() => setIsLumpsumModalOpen(false)} className="text-text-muted hover:text-text">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleLumpsumSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-text-muted font-medium">Payment Date</label>
                <input required type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary text-xs" />
              </div>

              <div className="space-y-1.5">
                <label className="text-text-muted font-medium">Lumpsum Amount (₹)</label>
                <input required type="number" name="amount" max={selectedProject?.pendingPayment || 999999} min={1} placeholder="Enter paid amount" className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary font-bold text-green-400 text-sm" />
              </div>

              <div className="space-y-1.5">
                <label className="text-text-muted font-medium">Remarks / Description</label>
                <input name="notes" placeholder="e.g. Paid in cash, GooglePay ref number" className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsLumpsumModalOpen(false)} className="flex-1 py-1.5 bg-background border border-border text-text-muted font-semibold rounded-lg hover:bg-surface/50">
                  Cancel Payment
                </button>
                <button type="submit" className="flex-1 py-1.5 bg-green-500/20 border border-green-500/30 text-green-400 font-bold rounded-lg hover:bg-green-500/30">
                  Record Lumpsum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. POST-LAUNCH PROCESS ADDITION MODAL */}
      {isAdditionalItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl border border-border">
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h3 className="text-sm font-bold text-text uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                <Sparkles size={16} /> Add Die Process Addition
              </h3>
              <button onClick={() => setIsAdditionalItemModalOpen(false)} className="text-text-muted hover:text-text">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdditionalItemSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-text-muted font-medium">Item Name / Process Part</label>
                <input required name="itemName" placeholder="e.g. Peacock Center Emblem, Outer Frame Die" className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-text-muted font-medium">Size Spec</label>
                  <input required name="itemSize" placeholder="e.g. 15mm, 20-Gauge" className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-text-muted font-medium">Quantity</label>
                  <input required type="number" min={1} defaultValue={1} name="itemQuantity" placeholder="e.g. 1" className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-text-muted font-medium">Design Specification / Pattern</label>
                <input required name="itemDesign" placeholder="e.g. Fine border lines, standard lakshmi motif" className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary" />
              </div>

              <div className="border border-border/80 rounded-xl p-4 bg-background/50 space-y-3.5">
                <h4 className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Financial Pricing & Wages</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-text-muted font-medium">Client Charge Rate (₹)</label>
                    <input required type="number" min={0} name="clientRate" placeholder="Price for client" className="w-full px-3.5 py-1.5 bg-surface border border-border rounded-lg outline-none text-text focus:border-primary font-semibold text-green-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-muted font-medium">Artisan Wage Rate (Karagir) (₹)</label>
                    {selectedProject.assignedKaragirId ? (
                      <input required type="number" min={0} name="karagirRate" placeholder="Wages for Karagir" className="w-full px-3.5 py-1.5 bg-surface border border-border rounded-lg outline-none text-text focus:border-primary font-semibold text-amber-500" />
                    ) : (
                      <div className="w-full px-3.5 py-1.5 bg-surface/50 border border-border rounded-lg text-text-muted text-[10px] italic flex items-center h-8">
                        No Karagir linked
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAdditionalItemModalOpen(false)} className="flex-1 py-1.5 bg-background border border-border text-text-muted font-semibold rounded-lg hover:bg-surface/50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-1.5 bg-primary text-background font-black rounded-lg">
                  Add Addition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. ASSIGN MULTIPLE KARAGIRS MODAL */}
      {isAssignKaragirModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl border border-border">
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h3 className="text-sm font-bold text-text uppercase tracking-wider text-primary flex items-center gap-1.5 ">
                <UserCheck size={16} /> Link Artisan (Karagir) & Distribute Dies
              </h3>
              <button 
                onClick={() => {
                  setIsAssignKaragirModalOpen(false);
                  setAssignmentImage(undefined);
                }} 
                className="text-text-muted hover:text-text"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAssignKaragirSubmit} className="p-5 space-y-4 text-xs max-h-[85vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-text-muted font-medium">Select Artisan (Karagir)</label>
                <select name="karagirId" required className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text outline-none focus:border-primary">
                  <option value="">-- Choose Karagir Folder --</option>
                  {karagirs.map(k => (
                    <option key={k.id} value={k.id}>{k.name} ({k.phoneNumber || 'no contact'})</option>
                  ))}
                </select>
              </div>

              {/* Dynamic Dies distribution tracker alerts */}
              {(() => {
                const totalDies = selectedProject?.dieDetails?.totalDies || 0;
                const alreadyAllotted = (selectedProject?.karagirAssignments || []).reduce((sum, a) => sum + (a.allottedDies || 0), 0);
                const remainingDies = Math.max(0, totalDies - alreadyAllotted);
                return (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-text-muted font-medium block">
                        Allot Dies Quantity <span className="text-primary font-mono font-bold">({remainingDies} available)</span>
                      </label>
                      <input 
                        required 
                        type="number" 
                        min={1} 
                        max={totalDies}
                        name="allottedDies" 
                        defaultValue={remainingDies || 1}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary font-bold" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-text-muted font-medium block">Expected Completion Date</label>
                      <input 
                        type="date" 
                        name="completionDate" 
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary text-xs" 
                      />
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-text-muted font-medium">Artisan Wage Rate (Wages) (₹)</label>
                  <input required type="number" min={0} name="totalWages" placeholder="e.g. 5000" className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary font-bold text-amber-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-text-muted font-medium">Advance Paid (₹)</label>
                  <input required type="number" min={0} defaultValue={0} name="advancePayment" placeholder="e.g. 1000" className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary font-bold text-green-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-text-muted font-medium">Assignment Execution Status</label>
                <select name="status" defaultValue="In Progress" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text outline-none focus:border-primary font-semibold">
                  <option value="Pending">Pending Setup / On-Hold</option>
                  <option value="In Progress">In Progress / Handed Over</option>
                  <option value="Completed">Completed Tooling</option>
                  <option value="Delivered">Delivered & Closed</option>
                </select>
              </div>

              <div className="border border-border rounded-xl p-3 bg-background">
                <MultiImageUpload
                  images={assignmentImages}
                  onImagesChange={setAssignmentImages}
                  label="Specific Visual Design Segments Allocated (Multiple Support)"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsAssignKaragirModalOpen(false);
                    setAssignmentImage(undefined);
                    setAssignmentImages([]);
                  }} 
                  className="flex-1 py-1.5 bg-background border border-border text-text-muted font-semibold rounded-lg hover:bg-surface/50"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-1.5 bg-primary text-background font-black rounded-lg">
                  Assign & Allot Dies
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5.5. EDIT KARAGIR ASSIGNMENT DETAILS MODAL */}
      {isEditAssignmentModalOpen && editingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface w-full max-w-lg rounded-2xl shadow-xl border border-border">
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h3 className="text-sm font-bold text-text uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Edit2 size={14} /> Edit Assignment: {editingAssignment.karagirName}
              </h3>
              <button 
                onClick={() => {
                  setIsEditAssignmentModalOpen(false);
                  setEditingAssignment(null);
                  setAssignmentImage(undefined);
                }} 
                className="text-text-muted hover:text-text"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditAssignmentSubmit} className="p-5 space-y-4 text-xs max-h-[85vh] overflow-y-auto">
              {(() => {
                const totalDies = selectedProject?.dieDetails?.totalDies || 0;
                const alreadyAllotted = (selectedProject?.karagirAssignments || [])
                  .filter(a => a.id !== editingAssignment.id)
                  .reduce((sum, a) => sum + (a.allottedDies || 0), 0);
                const maxAvailable = Math.max(0, totalDies - alreadyAllotted);
                return (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-text-muted font-medium block">
                        Allotted Dies Qty <span className="text-primary font-mono font-bold">({maxAvailable} available)</span>
                      </label>
                      <input 
                        required 
                        type="number" 
                        min={1} 
                        max={totalDies}
                        name="allottedDies" 
                        defaultValue={editingAssignment.allottedDies} 
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary font-bold" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-text-muted font-medium block">Expected Completion Date</label>
                      <input 
                        type="date" 
                        name="completionDate" 
                        defaultValue={editingAssignment.completionDate ? editingAssignment.completionDate.split('T')[0] : ''}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary text-xs" 
                      />
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-text-muted font-medium">Artisan Wage Rate (Wages) (₹)</label>
                  <input required type="number" min={0} name="totalWages" defaultValue={editingAssignment.totalAmount} className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary font-bold text-amber-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-text-muted font-medium">Advance Paid (₹)</label>
                  <input required type="number" min={0} name="advancePayment" defaultValue={editingAssignment.advancePayment} className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary font-bold text-green-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-text-muted font-medium">Assignment Execution Status</label>
                <select name="status" defaultValue={editingAssignment.status} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text outline-none focus:border-primary font-semibold">
                  <option value="Pending">Pending Setup / On-Hold</option>
                  <option value="In Progress">In Progress / Handed Over</option>
                  <option value="Completed">Completed Tooling</option>
                  <option value="Delivered">Delivered & Closed</option>
                </select>
              </div>

              <div className="border border-border rounded-xl p-3 bg-background">
                <MultiImageUpload
                  images={assignmentImages}
                  onImagesChange={setAssignmentImages}
                  label="Specific Visual Design Segments Allocated (Multiple Support)"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditAssignmentModalOpen(false);
                    setEditingAssignment(null);
                    setAssignmentImage(undefined);
                    setAssignmentImages([]);
                  }} 
                  className="flex-1 py-1.5 bg-background border border-border text-text-muted font-semibold rounded-lg hover:bg-surface/50"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-1.5 bg-primary text-background font-black rounded-lg">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. PAY RECURRING INSTALLMENT TO KARAGIR MODAL */}
      {isKaragirLumpsumModalOpen && selectedKaragirAssignmentId && (
        (() => {
          const assignment = selectedProject?.karagirAssignments?.find(ka => ka.id === selectedKaragirAssignmentId)
            || (selectedProject?.assignedKaragirId === selectedKaragirAssignmentId ? {
                karagirName: karagirs.find(k => k.id === selectedProject?.assignedKaragirId)?.name || 'Linked Artisan',
                pendingPayment: 999999
            } : null);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
              <div className="bg-surface w-full max-w-sm rounded-2xl shadow-xl border border-border">
                <div className="flex justify-between items-center p-5 border-b border-border">
                  <h3 className="text-[11px] font-bold text-text uppercase tracking-wider text-green-400">
                    Settle Wages Payout to {assignment?.karagirName}
                  </h3>
                  <button onClick={() => { setIsKaragirLumpsumModalOpen(false); setSelectedKaragirAssignmentId(null); }} className="text-text-muted hover:text-text">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleKaragirLumpsumSubmit} className="p-5 space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-text-muted font-medium">Payout Date</label>
                    <input required type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary text-xs" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-text-muted font-medium font-sans">Payment Installment Amount (₹)</label>
                    <input required type="number" min={1} max={assignment?.pendingPayment || 999999} name="amount" placeholder="Enter payout amount" className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary font-bold text-green-400 text-sm" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-text-muted font-medium">Remarks / Details</label>
                    <input name="notes" placeholder="e.g. UPI, cash, phonepe ref" className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary" />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => { setIsKaragirLumpsumModalOpen(false); setSelectedKaragirAssignmentId(null); }} className="flex-1 py-1.5 bg-background border border-border text-text-muted font-semibold rounded-lg hover:bg-surface/50">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-1.5 bg-green-500/20 border border-green-500/30 text-green-400 font-bold rounded-lg hover:bg-green-500/30">
                      Record Installment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        })()
      )}

      {/* 8. RECORD MULTIPLE COURIER / SHIPPING CHARGES MODAL */}
      {isCourierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface w-full max-w-sm rounded-2xl shadow-xl border border-border">
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h3 className="text-xs font-black text-text uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Truck size={14} /> Record Courier / Dispatch Charge
              </h3>
              <button onClick={() => setIsCourierModalOpen(false)} className="text-text-muted hover:text-text">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCourierSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-text-muted font-black uppercase text-[9px] tracking-wider">Sender Member (from Die Makes)</label>
                <input 
                  required 
                  type="text" 
                  name="senderName" 
                  placeholder="e.g., Ramesh, Amit, Suresh" 
                  list="diemakes-members"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary text-xs" 
                />
                <datalist id="diemakes-members">
                  <option value="Ramesh Soni" />
                  <option value="Amit Mehta" />
                  <option value="Suresh Chheda" />
                  <option value="Chaitanya" />
                </datalist>
              </div>

              <div className="space-y-1.5">
                <label className="text-text-muted font-black uppercase text-[9px] tracking-wider">Courier Service Provider</label>
                <select name="courierService" required className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text outline-none focus:border-primary font-bold text-xs">
                  <option value="DTDC Courier">DTDC Courier</option>
                  <option value="Maruti Courier">Maruti Courier</option>
                  <option value="Anjani Courier">Anjani Courier</option>
                  <option value="Blue Dart">Blue Dart Express</option>
                  <option value="Shree Tirupati">Shree Tirupati Courier</option>
                  <option value="Professional Courier">The Professional Couriers</option>
                  <option value="Other / Hand Delivery">Other / Hand Delivery</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-text-muted font-black uppercase text-[9px] tracking-wider">Amount Paid (₹)</label>
                  <input required type="number" min={1} name="amount" placeholder="Charges amount" className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary font-bold text-amber-500 font-mono text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-text-muted font-black uppercase text-[9px] tracking-wider">Dispatch Date</label>
                  <input required type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary text-xs" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-text-muted font-black uppercase text-[9px] tracking-wider">AWB / Tracking Slip Number (Optional)</label>
                <input name="trackingNumber" placeholder="e.g., AWB50392102" className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary text-xs font-mono" />
              </div>

              <div className="space-y-1.5">
                <label className="text-text-muted font-black uppercase text-[9px] tracking-wider">Remarks / Material Sent</label>
                <input name="notes" placeholder="e.g., Sent 2 large Emboss dies via air" className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none text-text focus:border-primary text-xs" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsCourierModalOpen(false)} className="flex-1 py-1.5 bg-background border border-border text-text-muted font-semibold rounded-lg hover:bg-surface/50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-1.5 bg-primary text-background font-black rounded-lg">
                  Record Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. FULLSCREEN LIGHTBOX VISUAL VIEW */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          {/* Close indicator */}
          <button 
            onClick={() => setLightboxImage(null)} 
            className="absolute top-4 right-4 text-white hover:text-primary p-2 bg-white/10 hover:bg-white/25 rounded-full transition-all"
            title="Close Design View"
          >
            <X size={24} />
          </button>
          
          <div className="max-w-[90vw] max-h-[80vh] flex items-center justify-center pointer-events-none select-none">
            <img 
              src={lightboxImage} 
              alt="Expanded design layout" 
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full rounded-lg object-contain shadow-2xl border border-white/10" 
            />
          </div>
          
          <span className="text-white/40 text-[9px] uppercase font-mono tracking-widest mt-4 text-center">
            Click anywhere on overlay to close visualizer
          </span>
        </div>
      )}
    </div>
  );
};

export default Clients;
