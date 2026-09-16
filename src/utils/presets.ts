import { Client, Karagir } from '../types';

// PRESET 1: Mughal Royal Antique Bridal Collection
// This includes larger amounts, multiple luxury hand-carved projects with complex payment tracking.
export const IMP_MUGHAL_BRIDAL_CLIENTS: Client[] = [
  {
    id: 'c_m1',
    clientName: 'Rajputana Heritage Jewellers',
    businessName: 'Rajputana Heritage',
    address: 'Johari Bazaar, Jaipur, Rajasthan',
    phoneNumber: '9829012345',
    emailId: 'heritage@rajputanajewel.com',
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    projects: [
      {
        id: 'pm1_1',
        projectName: 'Maharani Polki Choker Unit',
        dieDetails: {
          totalDies: 4,
          designs: 'Vintage Kundan floral frame with center leaf dropdown',
          sizes: '45mm width, 60mm curve',
          dieType: 'Thappa Die'
        },
        totalAmount: 75000,
        advancePayment: 25000,
        lumpsumPayments: [
          { id: 'lm1_1_1', date: new Date(Date.now() - 86400000 * 25).toISOString(), amount: 20000, notes: 'Design blueprint approval payment' },
          { id: 'lm1_1_2', date: new Date(Date.now() - 86400000 * 10).toISOString(), amount: 15000, notes: 'Carving midway check-in' }
        ],
        pendingPayment: 15000,
        totalPaid: 60000,
        courierCharges: 1400,
        otherExpenses: 800,
        assignedKaragirId: 'k_m1',
        assignedKaragirProjectId: 'pm1_1',
        createdAt: new Date(Date.now() - 86400000 * 35).toISOString(),
      },
      {
        id: 'pm1_2',
        projectName: 'Nawabi Chandbali Master Die',
        dieDetails: {
          totalDies: 2,
          designs: 'Double crescent moon drop with fine granulated border',
          sizes: '35mm, 42mm length',
          dieType: 'Emboss Die'
        },
        totalAmount: 38000,
        advancePayment: 15000,
        lumpsumPayments: [
          { id: 'lm1_2_1', date: new Date(Date.now() - 86400000 * 5).toISOString(), amount: 15000, notes: 'Settlement on mold casting' }
        ],
        pendingPayment: 8000,
        totalPaid: 30000,
        courierCharges: 700,
        otherExpenses: 200,
        assignedKaragirId: 'k_m2',
        assignedKaragirProjectId: 'pm1_2',
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      }
    ]
  },
  {
    id: 'c_m2',
    clientName: 'Zaveri Heritage & Sons',
    businessName: 'Zaveri Mansion',
    address: 'Mansa Road, Mumbai, Maharashtra',
    phoneNumber: '9819123456',
    emailId: 'exports@zaverimansion.com',
    createdAt: new Date(Date.now() - 86400000 * 28).toISOString(),
    projects: [
      {
        id: 'pm2_1',
        projectName: 'Imperial Nakshi Gokhru Kada',
        dieDetails: {
          totalDies: 3,
          designs: 'Elephant trumpeting motif running pattern',
          sizes: 'Size 2.4, 2.6',
          dieType: 'Bangle Die'
        },
        totalAmount: 62000,
        advancePayment: 25000,
        lumpsumPayments: [
          { id: 'lm2_1_1', date: new Date(Date.now() - 86400000 * 8).toISOString(), amount: 20000, notes: 'Die matching session approved' }
        ],
        pendingPayment: 17000,
        totalPaid: 45000,
        courierCharges: 1100,
        otherExpenses: 400,
        assignedKaragirId: 'k_m3',
        assignedKaragirProjectId: 'pm2_1',
        createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      }
    ]
  },
  {
    id: 'c_m3',
    clientName: 'Kalyan Devji Fine Ornaments',
    businessName: 'KGD Group',
    address: 'MG Road, Thrissur, Kerala',
    phoneNumber: '9446123456',
    emailId: 'procurement@kalyandevjiplus.com',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    projects: [
      {
        id: 'pm3_1',
        projectName: 'Sovereign Lakshmi Haram',
        dieDetails: {
          totalDies: 16,
          designs: 'Coin chain featuring 8 distinct forms of Lakshmi (Ashta Lakshmi)',
          sizes: '22mm standard coin face',
          dieType: 'Lakshmi Die'
        },
        totalAmount: 115000,
        advancePayment: 50000,
        lumpsumPayments: [
          { id: 'lm3_1_1', date: new Date(Date.now() - 86400000 * 12).toISOString(), amount: 40000, notes: 'Completed half batch molds check' },
          { id: 'lm3_1_2', date: new Date(Date.now() - 86400000 * 3).toISOString(), amount: 25000, notes: 'Final batch testing passed' }
        ],
        pendingPayment: 0,
        totalPaid: 115000,
        courierCharges: 2500,
        otherExpenses: 1200,
        assignedKaragirId: 'k_m1',
        assignedKaragirProjectId: 'pm3_1',
        createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
      }
    ]
  }
];

export const IMP_MUGHAL_BRIDAL_KARAGIRS: Karagir[] = [
  {
    id: 'k_m1',
    name: 'Rajesh Kumar (Gold-Carver Spec)',
    address: 'Surat craft cluster, Gujarat',
    phoneNumber: '9988776655',
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    projects: [
      {
        id: 'pm1_1',
        projectName: 'Maharani Polki Choker Unit',
        clientProjectId: 'pm1_1',
        dieDetails: {
          totalDies: 4,
          designs: 'Vintage Kundan floral frame with center leaf dropdown',
          sizes: '45mm width, 60mm curve',
          dieType: 'Thappa Die'
        },
        totalAmount: 28000, // Artisan wage
        advancePayment: 10000,
        lumpsumPayments: [
          { id: 'klm1_1_1', date: new Date(Date.now() - 86400000 * 25).toISOString(), amount: 10000, notes: 'Design detailing milestone' }
        ],
        pendingPayment: 8000,
        totalPaid: 20000,
        createdAt: new Date(Date.now() - 86400000 * 35).toISOString(),
      },
      {
        id: 'pm3_1',
        projectName: 'Sovereign Lakshmi Haram',
        clientProjectId: 'pm3_1',
        dieDetails: {
          totalDies: 16,
          designs: 'Coin chain featuring 8 distinct forms of Lakshmi (Ashta Lakshmi)',
          sizes: '22mm standard coin face',
          dieType: 'Lakshmi Die'
        },
        totalAmount: 48000, // Artisan wage
        advancePayment: 20000,
        lumpsumPayments: [
          { id: 'klm1_2_1', date: new Date(Date.now() - 86400000 * 11).toISOString(), amount: 20000, notes: '8 coins master embossing done' },
          { id: 'klm1_2_2', date: new Date(Date.now() - 86400000 * 2).toISOString(), amount: 8000, notes: 'Full batch dispatched' }
        ],
        pendingPayment: 0,
        totalPaid: 48000,
        createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
      }
    ]
  },
  {
    id: 'k_m2',
    name: 'Amit Singh (Jaipur Die Specialist)',
    address: 'Pink City Gali, Jaipur, Rajasthan',
    phoneNumber: '9911223344',
    createdAt: new Date(Date.now() - 86400000 * 40).toISOString(),
    projects: [
      {
        id: 'pm1_2',
        projectName: 'Nawabi Chandbali Master Die',
        clientProjectId: 'pm1_2',
        dieDetails: {
          totalDies: 2,
          designs: 'Double crescent moon drop with fine granulated border',
          sizes: '35mm, 42mm length',
          dieType: 'Emboss Die'
        },
        totalAmount: 14500,
        advancePayment: 5000,
        lumpsumPayments: [
          { id: 'klm2_1_1', date: new Date(Date.now() - 86400000 * 4).toISOString(), amount: 5000, notes: 'Crescent tooling completed' }
        ],
        pendingPayment: 4500,
        totalPaid: 10000,
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      }
    ]
  },
  {
    id: 'k_m3',
    name: 'Karan Solanki (Repoussé Master)',
    address: 'Ambawadi Road, Ahmedabad, Gujarat',
    phoneNumber: '9825001122',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    projects: [
      {
        id: 'pm2_1',
        projectName: 'Imperial Nakshi Gokhru Kada',
        clientProjectId: 'pm2_1',
        dieDetails: {
          totalDies: 3,
          designs: 'Elephant trumpeting motif running pattern',
          sizes: 'Size 2.4, 2.6',
          dieType: 'Bangle Die'
        },
        totalAmount: 22000,
        advancePayment: 8000,
        lumpsumPayments: [
          { id: 'klm3_1_1', date: new Date(Date.now() - 86400000 * 7).toISOString(), amount: 10000, notes: 'Fine chasing and detailing finished' }
        ],
        pendingPayment: 4000,
        totalPaid: 18000,
        createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      }
    ]
  }
];


// PRESET 2: Lightweight Modern Precision CNC & Laser Series
// Highly profitable, automated tooling, short delivery cycles, huge margins
export const IMP_CNC_MODERN_CLIENTS: Client[] = [
  {
    id: 'c_c1',
    clientName: 'CaratLane Labs & Retail',
    businessName: 'CaratLane Direct',
    address: 'Indiranagar Double Road, Bangalore, Karnataka',
    phoneNumber: '9008123456',
    emailId: 'operations@caratpanel.com',
    createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    projects: [
      {
        id: 'pc1_1',
        projectName: 'Prong Pavé Eternity Band Spec',
        dieDetails: {
          totalDies: 6,
          designs: 'Micro claw settings for 1.2mm round diamonds in row',
          sizes: '6, 7, 8 ring scales',
          dieType: 'Prong Die (Stone Holding)'
        },
        totalAmount: 32000,
        advancePayment: 15000,
        lumpsumPayments: [
          { id: 'lc1_1_1', date: new Date(Date.now() - 86400000 * 10).toISOString(), amount: 12000, notes: 'V-prong test approvals passed' },
          { id: 'lc1_1_2', date: new Date(Date.now() - 86400000 * 2).toISOString(), amount: 5000, notes: 'Complete delivery dispatch' }
        ],
        pendingPayment: 0,
        totalPaid: 32000,
        courierCharges: 350,
        otherExpenses: 100,
        assignedKaragirId: 'k_c1',
        assignedKaragirProjectId: 'pc1_1',
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      },
      {
        id: 'pc1_2',
        projectName: 'Geometric Hexagon Drops',
        dieDetails: {
          totalDies: 2,
          designs: 'Nested multi-level geometric hollow hexagon',
          sizes: '15mm drop, 1mm thickness',
          dieType: 'Emboss Die'
        },
        totalAmount: 18000,
        advancePayment: 8000,
        lumpsumPayments: [],
        pendingPayment: 10000,
        totalPaid: 8000,
        courierCharges: 250,
        otherExpenses: 50,
        assignedKaragirId: 'k_c2',
        assignedKaragirProjectId: 'pc1_2',
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      }
    ]
  },
  {
    id: 'c_c2',
    clientName: 'BlueStone Tech Jewel',
    businessName: 'BlueStone Retail',
    address: 'Whitefield Main Road, Bangalore, Karnataka',
    phoneNumber: '9124567890',
    emailId: 'tech-molds@bluestone.com',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    projects: [
      {
        id: 'pc2_1',
        projectName: 'Sleek Hoop Locking Slider',
        dieDetails: {
          totalDies: 4,
          designs: 'Inner clicks precision clasp mechanism',
          sizes: '1.5mm wire, 12mm loop',
          dieType: 'Hook Type Die'
        },
        totalAmount: 26000,
        advancePayment: 10000,
        lumpsumPayments: [
          { id: 'lc2_1_1', date: new Date(Date.now() - 86400000 * 3).toISOString(), amount: 10000, notes: 'Clasp mechanism locking test certified' }
        ],
        pendingPayment: 6000,
        totalPaid: 20000,
        courierCharges: 400,
        otherExpenses: 0,
        assignedKaragirId: 'k_c1',
        assignedKaragirProjectId: 'pc2_1',
        createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
      }
    ]
  }
];

export const IMP_CNC_MODERN_KARAGIRS: Karagir[] = [
  {
    id: 'k_c1',
    name: 'Vikram Rao (CNC Precision Artisan)',
    address: 'Vytila Engineering Hub, Kochi, Kerala',
    phoneNumber: '9447012345',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    projects: [
      {
        id: 'pc1_1',
        projectName: 'Prong Pavé Eternity Band Spec',
        clientProjectId: 'pc1_1',
        dieDetails: {
          totalDies: 6,
          designs: 'Micro claw settings for 1.2mm round diamonds in row',
          sizes: '6, 7, 8 ring scales',
          dieType: 'Prong Die (Stone Holding)'
        },
        totalAmount: 11000, // Artisan charges (laser time is passive, low manual work)
        advancePayment: 4000,
        lumpsumPayments: [
          { id: 'kcl1_1_1', date: new Date(Date.now() - 86400000 * 10).toISOString(), amount: 5000, notes: 'Laser test blocks approval' },
          { id: 'kcl1_1_2', date: new Date(Date.now() - 86400000 * 2).toISOString(), amount: 2000, notes: 'Hand polishing of claw nests completed' }
        ],
        pendingPayment: 0,
        totalPaid: 11000,
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      },
      {
        id: 'pc2_1',
        projectName: 'Sleek Hoop Locking Slider',
        clientProjectId: 'pc2_1',
        dieDetails: {
          totalDies: 4,
          designs: 'Inner clicks precision clasp mechanism',
          sizes: '1.5mm wire, 12mm loop',
          dieType: 'Hook Type Die'
        },
        totalAmount: 9000,
        advancePayment: 3000,
        lumpsumPayments: [
          { id: 'kcl1_2_1', date: new Date(Date.now() - 86400000 * 3).toISOString(), amount: 3000, notes: 'Spring stress test finished' }
        ],
        pendingPayment: 3000,
        totalPaid: 6000,
        createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
      }
    ]
  },
  {
    id: 'k_c2',
    name: 'Rahul More (High-Speed Spark Specialist)',
    address: 'GIDC Industrial Estate, Rajkot, Gujarat',
    phoneNumber: '9176332255',
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    projects: [
      {
        id: 'pc1_2',
        projectName: 'Geometric Hexagon Drops',
        clientProjectId: 'pc1_2',
        dieDetails: {
          totalDies: 2,
          designs: 'Nested multi-level geometric hollow hexagon',
          sizes: '15mm drop, 1mm thickness',
          dieType: 'Emboss Die'
        },
        totalAmount: 5500,
        advancePayment: 2000,
        lumpsumPayments: [],
        pendingPayment: 3500,
        totalPaid: 2000,
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      }
    ]
  }
];


// PRESET 3: Baseline Normal Reset Data
export const IMP_BASELINE_CLIENTS: Client[] = [
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
];

export const IMP_BASELINE_KARAGIRS: Karagir[] = [
  {
    id: 'k_nainesh',
    name: 'Nainesh Madve',
    address: 'Osar',
    phoneNumber: '91 8999748057',
    createdAt: '2026-02-18T00:00:00Z',
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
          { id: 'klp_n1_1_s1', date: '2026-02-19T00:00:00Z', amount: 4000, notes: 'Advance paid to Karagir' },
          { id: 'klp_n1_1_s2', date: '2026-03-02T00:00:00Z', amount: 6000, notes: 'Full amount cleared' }
        ],
        pendingPayment: 0,
        totalPaid: 10000,
        createdAt: '2026-02-19T00:00:00Z'
      },
      {
        id: 'kp_nainesh_2',
        projectName: 'Banubali Chain Die Bulk (Lot 2) - Ritik Jain',
        clientProjectId: 'p_ritik_2',
        dieDetails: {
          totalDies: 14,
          designs: 'Banubali Chain Die',
          sizes: 'Standard',
          dieType: 'Bahubali Chain Die'
        },
        totalAmount: 80000,
        advancePayment: 0,
        lumpsumPayments: [
          { id: 'klp_n2_s1', date: '2026-03-31T00:00:00Z', amount: 20000, notes: '1) 20000 (31-03-26)' },
          { id: 'klp_n2_s2', date: '2026-04-23T00:00:00Z', amount: 20000, notes: '2) 20000 (23-04-26)' },
          { id: 'klp_n2_s3', date: '2026-05-17T00:00:00Z', amount: 40000, notes: '3) 40000 (17-05-26)' }
        ],
        pendingPayment: 0,
        totalPaid: 80000,
        createdAt: '2026-03-31T00:00:00Z'
      }
    ]
  },
  {
    id: 'k_dipak',
    name: 'Dipak Patil',
    address: 'Vasgoan',
    phoneNumber: '91 9545213759',
    createdAt: '2026-03-30T00:00:00Z',
    projects: [
      {
        id: 'kp_dipak_1',
        projectName: 'Banubali Chain Die Bulk (Lot 2) - Ritik Jain',
        clientProjectId: 'p_ritik_2',
        dieDetails: {
          totalDies: 7,
          designs: 'Banubali Chain Die',
          sizes: 'Standard',
          dieType: 'Bahubali Chain Die'
        },
        totalAmount: 35000,
        advancePayment: 0,
        lumpsumPayments: [
          { id: 'klp_d2_s1', date: '2026-03-31T00:00:00Z', amount: 20000, notes: '20000 (31-03-2026)' },
          { id: 'klp_d2_s2', date: '2026-05-13T00:00:00Z', amount: 5000, notes: '+ 5000 (13-05-2026)' },
          { id: 'klp_d2_s3', date: '2026-05-25T00:00:00Z', amount: 10000, notes: '+ 10000 (25-05-26)' }
        ],
        pendingPayment: 0,
        totalPaid: 35000,
        createdAt: '2026-03-31T00:00:00Z'
      }
    ]
  },
  {
    id: 'k_jatin',
    name: 'Jatin Ambhire',
    address: 'Gungwada',
    phoneNumber: '91 7030191547',
    createdAt: '2026-05-01T00:00:00Z',
    projects: [
      {
        id: 'kp_jatin_1',
        projectName: 'Banubali Chain Die Bulk (Lot 2) - Ritik Jain',
        clientProjectId: 'p_ritik_2',
        dieDetails: {
          totalDies: 7,
          designs: 'Banubali Chain Die',
          sizes: 'Standard',
          dieType: 'Bahubali Chain Die'
        },
        totalAmount: 47000,
        advancePayment: 0,
        lumpsumPayments: [
          { id: 'klp_j2_s1', date: '2026-05-08T00:00:00Z', amount: 10000, notes: '10000 (08-05-2026)' },
          { id: 'klp_j2_s2', date: '2026-05-21T00:00:00Z', amount: 20000, notes: '+ 20000 (21-05-2026)' },
          { id: 'klp_j2_s3', date: '2026-05-25T00:00:00Z', amount: 17000, notes: '+ 17,000 (25-05-26)' }
        ],
        pendingPayment: 0,
        totalPaid: 47000,
        createdAt: '2026-05-08T00:00:00Z'
      }
    ]
  }
];
