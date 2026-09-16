import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Client, ClientProject, LumpsumPayment, AdditionalItem, KaragirAssignment, CourierCharge } from '../../types';

interface ClientState {
  items: Client[];
}

const initialState: ClientState = {
  items: [
    {
      id: 'c_ritik',
      clientName: 'Ritik Jain',
      businessName: 'Pakshal Jewellers',
      address: '01 - Chennai (Main)\n02 - Mumbai',
      phoneNumber: '91 8939668241',
      emailId: 'ritik.jain@pakshaljewellers.com',
      createdAt: '2026-02-18T00:00:00Z',
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
              date: '2026-03-02T00:00:00Z',
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
              date: '2026-02-27T00:00:00Z',
              notes: '180 Courier Slip'
            }
          ],
          otherExpenses: 0,
          assignedKaragirId: 'k_nainesh',
          assignedKaragirProjectId: 'kp_nainesh_1',
          createdAt: '2026-02-18T00:00:00Z',
          karagirAssignments: [
            {
              id: 'ka_r1_1',
              karagirId: 'k_nainesh',
              karagirName: 'Nainesh Madve',
              allottedDies: 2,
              status: 'Delivered',
              completionDate: '2026-03-02T00:00:00Z',
              totalAmount: 10000,
              advancePayment: 0,
              lumpsumPayments: [
                { id: 'klp_n1_1_1', date: '2026-02-19T00:00:00Z', amount: 4000, notes: 'Advance paid to Karagir' },
                { id: 'klp_n1_1_2', date: '2026-03-02T00:00:00Z', amount: 6000, notes: 'Pending amount cleared' }
              ],
              totalPaid: 10000,
              pendingPayment: 0,
              createdAt: '2026-02-19T00:00:00Z'
            }
          ]
        },
        {
          id: 'p_ritik_2',
          projectName: 'Banubali Chain Die Bulk (Lot 2)',
          dieDetails: {
            totalDies: 28,
            designs: 'Banubali Chain Die',
            sizes: '01 - Chennai (Main)\n02 - Mumbai',
            dieType: 'Bahubali Chain Die'
          },
          totalAmount: 228000,
          advancePayment: 90000,
          lumpsumPayments: [
            { id: 'lp_r2_1', date: '2026-05-16T00:00:00Z', amount: 17640, notes: '+ 17640 (16-05-26)' },
            { id: 'lp_r2_2', date: '2026-05-19T00:00:00Z', amount: 50000, notes: '+ 50,000 (19-05-26)' },
            { id: 'lp_r2_3', date: '2026-05-19T00:00:00Z', amount: 28500, notes: '+ 28,500 (19-05-26)' },
            { id: 'lp_r2_4', date: '2026-05-22T00:00:00Z', amount: 21500, notes: '+ 21,500 (22-05-26)' },
            { id: 'lp_r2_5', date: '2026-06-01T00:00:00Z', amount: 20000, notes: '+ 20,000 (01-06-26)' }
          ],
          pendingPayment: 360,
          totalPaid: 227640,
          courierCharges: 2100,
          courierChargesList: [
            {
              id: 'cc_r2_1',
              senderName: 'Himesh',
              courierService: 'DTDC Courier',
              amount: 540,
              date: '2026-04-21T00:00:00Z',
              notes: '1) 8 Dies (21-04-2026)'
            },
            {
              id: 'cc_r2_2',
              senderName: 'Himesh',
              courierService: 'DTDC Courier',
              amount: 540,
              date: '2026-04-23T00:00:00Z',
              notes: '2) 7 Dies (23-04-2026)'
            },
            {
              id: 'cc_r2_3',
              senderName: 'Himesh',
              courierService: 'Maruti Courier',
              amount: 480,
              date: '2026-05-14T00:00:00Z',
              notes: '1) 7 Dies (14-05-2026) Dipak Patil'
            },
            {
              id: 'cc_r2_4',
              senderName: 'Chaitanya',
              courierService: 'Maruti Courier',
              amount: 540,
              date: '2026-05-22T00:00:00Z',
              notes: '1) 7 Dies (20-05-2026) Jatin Ambhire'
            }
          ],
          otherExpenses: 0,
          createdAt: '2026-03-30T00:00:00Z',
          karagirAssignments: [
            {
              id: 'ka_r2_1',
              karagirId: 'k_nainesh',
              karagirName: 'Nainesh Madve',
              allottedDies: 14,
              status: 'Delivered',
              completionDate: '2026-05-17T00:00:00Z',
              totalAmount: 80000,
              advancePayment: 0,
              lumpsumPayments: [
                { id: 'klp_n2_1', date: '2026-03-31T00:00:00Z', amount: 20000, notes: '1) 20000 (31-03-26)' },
                { id: 'klp_n2_2', date: '2026-04-23T00:00:00Z', amount: 20000, notes: '2) 20000 (23-04-26)' },
                { id: 'klp_n2_3', date: '2026-05-17T00:00:00Z', amount: 40000, notes: '3) 40000 (17-05-26)' }
              ],
              totalPaid: 80000,
              pendingPayment: 0,
              createdAt: '2026-03-31T00:00:00Z'
            },
            {
              id: 'ka_r2_2',
              karagirId: 'k_dipak',
              karagirName: 'Dipak Patil',
              allottedDies: 7,
              status: 'Delivered',
              completionDate: '2026-05-25T00:00:00Z',
              totalAmount: 35000,
              advancePayment: 0,
              lumpsumPayments: [
                { id: 'klp_d2_1', date: '2026-03-31T00:00:00Z', amount: 20000, notes: '20000 (31-03-2026)' },
                { id: 'klp_d2_2', date: '2026-05-13T00:00:00Z', amount: 5000, notes: '+ 5000 (13-05-2026)' },
                { id: 'klp_d2_3', date: '2026-05-25T00:00:00Z', amount: 10000, notes: '+ 10000 (25-05-26)' }
              ],
              totalPaid: 35000,
              pendingPayment: 0,
              createdAt: '2026-03-31T00:00:00Z'
            },
            {
              id: 'ka_r2_3',
              karagirId: 'k_jatin',
              karagirName: 'Jatin Ambhire',
              allottedDies: 7,
              status: 'Delivered',
              completionDate: '2026-05-25T00:00:00Z',
              totalAmount: 47000,
              advancePayment: 0,
              lumpsumPayments: [
                { id: 'klp_j2_1', date: '2026-05-08T00:00:00Z', amount: 10000, notes: '10000 (08-05-2026)' },
                { id: 'klp_j2_2', date: '2026-05-21T00:00:00Z', amount: 20000, notes: '+ 20000 (21-05-2026)' },
                { id: 'klp_j2_3', date: '2026-05-25T00:00:00Z', amount: 17000, notes: '+ 17,000 (25-05-26)' }
              ],
              totalPaid: 47000,
              pendingPayment: 0,
              createdAt: '2026-05-08T00:00:00Z'
            }
          ]
        }
      ]
    }
  ],
};

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    addClient: (state, action: PayloadAction<Client>) => {
      state.items.push(action.payload);
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteClient: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setClients: (state, action: PayloadAction<Client[]>) => {
      state.items = action.payload;
    },
    mergeClients: (state, action: PayloadAction<Client[]>) => {
      const newItems = action.payload.filter(
        newItem => !state.items.some(item => item.id === newItem.id)
      );
      state.items = [...state.items, ...newItems];
    },
    // Project operations
    addClientProject: (state, action: PayloadAction<{ clientId: string; project: ClientProject }>) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client) {
        if (!client.projects) client.projects = [];
        client.projects.push(action.payload.project);
      }
    },
    updateClientProject: (state, action: PayloadAction<{ clientId: string; project: ClientProject }>) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client && client.projects) {
        const index = client.projects.findIndex(p => p.id === action.payload.project.id);
        if (index !== -1) {
          client.projects[index] = action.payload.project;
        }
      }
    },
    deleteClientProject: (state, action: PayloadAction<{ clientId: string; projectId: string }>) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client && client.projects) {
        client.projects = client.projects.filter(p => p.id !== action.payload.projectId);
      }
    },
    addClientLumpsum: (state, action: PayloadAction<{ clientId: string; projectId: string; payment: LumpsumPayment }>) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client && client.projects) {
        const project = client.projects.find(p => p.id === action.payload.projectId);
        if (project) {
          project.lumpsumPayments.push(action.payload.payment);
          project.totalPaid = project.advancePayment + project.lumpsumPayments.reduce((acc, p) => acc + p.amount, 0);
          project.pendingPayment = Math.max(0, project.totalAmount - project.totalPaid);
        }
      }
    },
    addClientProjectAdditionalItem: (
      state, 
      action: PayloadAction<{ clientId: string; projectId: string; item: AdditionalItem }>
    ) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client && client.projects) {
        const project = client.projects.find(p => p.id === action.payload.projectId);
        if (project) {
          if (!project.additionalItems) {
            project.additionalItems = [];
          }
          project.additionalItems.push(action.payload.item);
          // Increase total Amount by clientRate * quantity
          project.totalAmount += action.payload.item.clientRate * action.payload.item.quantity;
          // Recalculate pending
          project.pendingPayment = Math.max(0, project.totalAmount - project.totalPaid);
        }
      }
    },
    deleteClientProjectAdditionalItem: (
      state,
      action: PayloadAction<{ clientId: string; projectId: string; itemId: string }>
    ) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client && client.projects) {
        const project = client.projects.find(p => p.id === action.payload.projectId);
        if (project && project.additionalItems) {
          const itemIndex = project.additionalItems.findIndex(item => item.id === action.payload.itemId);
          if (itemIndex !== -1) {
            const item = project.additionalItems[itemIndex];
            // Decrease total Amount
            project.totalAmount = Math.max(0, project.totalAmount - item.clientRate * item.quantity);
            // Remove item
            project.additionalItems.splice(itemIndex, 1);
            // Recalculate pending
            project.pendingPayment = Math.max(0, project.totalAmount - project.totalPaid);
          }
        }
      }
    },
    addKaragirAssignment: (
      state,
      action: PayloadAction<{ clientId: string; projectId: string; assignment: KaragirAssignment }>
    ) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client && client.projects) {
        const project = client.projects.find(p => p.id === action.payload.projectId);
        if (project) {
          if (!project.karagirAssignments) {
            project.karagirAssignments = [];
          }
          // Prevent duplicates
          if (!project.karagirAssignments.some(ka => ka.karagirId === action.payload.assignment.karagirId)) {
            project.karagirAssignments.push(action.payload.assignment);
          }
        }
      }
    },
    updateKaragirAssignment: (
      state,
      action: PayloadAction<{ clientId: string; projectId: string; assignmentId: string; updates: Partial<KaragirAssignment> }>
    ) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client && client.projects) {
        const project = client.projects.find(p => p.id === action.payload.projectId);
        if (project && project.karagirAssignments) {
          const assignment = project.karagirAssignments.find(ka => ka.id === action.payload.assignmentId);
          if (assignment) {
            Object.assign(assignment, action.payload.updates);
            // Recalculate totals if wages or payment details modified
            assignment.totalPaid = assignment.advancePayment + (assignment.lumpsumPayments || []).reduce((acc, p) => acc + p.amount, 0);
            assignment.pendingPayment = Math.max(0, assignment.totalAmount - assignment.totalPaid);
          }
        }
      }
    },
    updateClientProjectImage: (
      state,
      action: PayloadAction<{ clientId: string; projectId: string; projectImage: string }>
    ) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client && client.projects) {
        const project = client.projects.find(p => p.id === action.payload.projectId);
        if (project) {
          project.projectImage = action.payload.projectImage;
          if (!project.projectImages) {
            project.projectImages = [];
          }
          if (!project.projectImages.includes(action.payload.projectImage)) {
            project.projectImages.push(action.payload.projectImage);
          }
        }
      }
    },
    addClientProjectImage: (
      state,
      action: PayloadAction<{ clientId: string; projectId: string; image: string }>
    ) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client && client.projects) {
        const project = client.projects.find(p => p.id === action.payload.projectId);
        if (project) {
          if (!project.projectImages) {
            project.projectImages = [];
          }
          project.projectImages.push(action.payload.image);
          if (!project.projectImage) {
            project.projectImage = action.payload.image;
          }
        }
      }
    },
    deleteClientProjectImage: (
      state,
      action: PayloadAction<{ clientId: string; projectId: string; index: number }>
    ) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client && client.projects) {
        const project = client.projects.find(p => p.id === action.payload.projectId);
        if (project && project.projectImages) {
          project.projectImages.splice(action.payload.index, 1);
          project.projectImage = project.projectImages[0] || undefined;
        }
      }
    },
    addKaragirAssignmentImage: (
      state,
      action: PayloadAction<{ clientId: string; projectId: string; assignmentId: string; image: string }>
    ) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client && client.projects) {
        const project = client.projects.find(p => p.id === action.payload.projectId);
        if (project && project.karagirAssignments) {
          const assignment = project.karagirAssignments.find(ka => ka.id === action.payload.assignmentId);
          if (assignment) {
            if (!assignment.designImages) {
              assignment.designImages = [];
            }
            assignment.designImages.push(action.payload.image);
            if (!assignment.designImage) {
              assignment.designImage = action.payload.image;
            }
          }
        }
      }
    },
    deleteKaragirAssignmentImage: (
      state,
      action: PayloadAction<{ clientId: string; projectId: string; assignmentId: string; index: number }>
    ) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client && client.projects) {
        const project = client.projects.find(p => p.id === action.payload.projectId);
        if (project && project.karagirAssignments) {
          const assignment = project.karagirAssignments.find(ka => ka.id === action.payload.assignmentId);
          if (assignment && assignment.designImages) {
            assignment.designImages.splice(action.payload.index, 1);
            assignment.designImage = assignment.designImages[0] || undefined;
          }
        }
      }
    },
    addCourierCharge: (
      state,
      action: PayloadAction<{ clientId: string; projectId: string; charge: CourierCharge }>
    ) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client && client.projects) {
        const project = client.projects.find(p => p.id === action.payload.projectId);
        if (project) {
          if (!project.courierChargesList) {
            project.courierChargesList = [];
          }
          project.courierChargesList.push(action.payload.charge);
          // Recalculate total courier charges
          project.courierCharges = project.courierChargesList.reduce((sum, c) => sum + c.amount, 0);
        }
      }
    },
    deleteCourierCharge: (
      state,
      action: PayloadAction<{ clientId: string; projectId: string; chargeId: string }>
    ) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client && client.projects) {
        const project = client.projects.find(p => p.id === action.payload.projectId);
        if (project && project.courierChargesList) {
          project.courierChargesList = project.courierChargesList.filter(c => c.id !== action.payload.chargeId);
          // Recalculate total courier charges
          project.courierCharges = project.courierChargesList.reduce((sum, c) => sum + c.amount, 0);
        }
      }
    },
    deleteKaragirAssignment: (
      state,
      action: PayloadAction<{ clientId: string; projectId: string; assignmentId: string }>
    ) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client && client.projects) {
        const project = client.projects.find(p => p.id === action.payload.projectId);
        if (project && project.karagirAssignments) {
          project.karagirAssignments = project.karagirAssignments.filter(
            ka => ka.id !== action.payload.assignmentId
          );
        }
      }
    },
    addKaragirAssignmentLumpsum: (
      state,
      action: PayloadAction<{ clientId: string; projectId: string; assignmentId: string; payment: LumpsumPayment }>
    ) => {
      const client = state.items.find(item => item.id === action.payload.clientId);
      if (client && client.projects) {
        const project = client.projects.find(p => p.id === action.payload.projectId);
        if (project && project.karagirAssignments) {
          const assignment = project.karagirAssignments.find(ka => ka.id === action.payload.assignmentId);
          if (assignment) {
            if (!assignment.lumpsumPayments) {
              assignment.lumpsumPayments = [];
            }
            assignment.lumpsumPayments.push(action.payload.payment);
            assignment.totalPaid = assignment.advancePayment + assignment.lumpsumPayments.reduce((acc, p) => acc + p.amount, 0);
            assignment.pendingPayment = Math.max(0, assignment.totalAmount - assignment.totalPaid);
          }
        }
      }
    }
  },
});

export const { 
  addClient, 
  updateClient, 
  deleteClient, 
  setClients, 
  mergeClients,
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
} = clientSlice.actions;

export default clientSlice.reducer;
