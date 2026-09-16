import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setClients } from '../store/slices/clientSlice';
import { setKaragirs } from '../store/slices/karagirSlice';
import {
  IMP_MUGHAL_BRIDAL_CLIENTS,
  IMP_MUGHAL_BRIDAL_KARAGIRS,
  IMP_CNC_MODERN_CLIENTS,
  IMP_CNC_MODERN_KARAGIRS,
  IMP_BASELINE_CLIENTS,
  IMP_BASELINE_KARAGIRS
} from '../utils/presets';
import toast from 'react-hot-toast';
import { 
  Folder,
  Layers,
  IndianRupee, 
  TrendingUp, 
  TrendingDown,
  ShoppingBag,
  Truck,
  DollarSign,
  PieChart as PieIcon,
  Award,
  BookOpen,
  BarChart3,
  Sparkles,
  Zap,
  RefreshCw,
  Trash2,
  Lightbulb,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { formatCurrency, cn } from '../utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const clients = useSelector((state: RootState) => state.clients.items);
  const karagirs = useSelector((state: RootState) => state.karagirs.items);

  const injectPreset = (type: 'mughal' | 'cnc' | 'baseline' | 'clear') => {
    switch (type) {
      case 'mughal':
        dispatch(setClients(IMP_MUGHAL_BRIDAL_CLIENTS));
        dispatch(setKaragirs(IMP_MUGHAL_BRIDAL_KARAGIRS));
        toast.success('Injected Rajputana Mughal Bridal portfolio! 👑');
        break;
      case 'cnc':
        dispatch(setClients(IMP_CNC_MODERN_CLIENTS));
        dispatch(setKaragirs(IMP_CNC_MODERN_KARAGIRS));
        toast.success('Injected Lightweight CNC Precision portfolio! ⚡');
        break;
      case 'baseline':
        dispatch(setClients(IMP_BASELINE_CLIENTS));
        dispatch(setKaragirs(IMP_BASELINE_KARAGIRS));
        toast.success('Restored default jewelry baseline! 🔄');
        break;
      case 'clear':
        dispatch(setClients([]));
        dispatch(setKaragirs([]));
        toast.error('Cleared database slate for manual testing! 🚫');
        break;
    }
  };

  // Profit & aggregates memo
  const reporting = React.useMemo(() => {
    let totalClientRevenue = 0;
    let totalClientPaid = 0;
    let totalKaragirWages = 0;
    let totalKaragirPaid = 0;
    let totalCourierCharges = 0;
    let totalOtherExpenses = 0;
    let totalDies = 0;
    let totalProjectsNum = 0;

    const folderDetails: Array<{
      clientName: string;
      projectName: string;
      dieType: string;
      diesQty: number;
      revenue: number;
      paid: number;
      pending: number;
      karagirCost: number;
      karagirPaid: number;
      courier: number;
      others: number;
      netProfit: number;
      netPaidProfit: number;
      margin: number;
    }> = [];

    clients.forEach(c => {
      if (c.projects) {
        c.projects.forEach(p => {
          totalClientRevenue += p.totalAmount;
          totalClientPaid += p.totalPaid;
          totalCourierCharges += p.courierCharges || 0;
          totalOtherExpenses += p.otherExpenses || 0;
          totalDies += p.dieDetails?.totalDies || 0;
          totalProjectsNum += 1;

          // Find associated Karagir cost
          let karagirCost = 0;
          let karagirPaid = 0;
          if (p.assignedKaragirId) {
            const index = karagirs.find(k => k.id === p.assignedKaragirId);
            const kp = index?.projects?.find(proj => proj.id === p.id);
            if (kp) {
              karagirCost = kp.totalAmount;
              karagirPaid = kp.totalPaid;
            }
          }

          totalKaragirWages += karagirCost;
          totalKaragirPaid += karagirPaid;

          const totalCost = karagirCost + (p.courierCharges || 0) + (p.otherExpenses || 0);
          const netProfit = p.totalAmount - totalCost;
          const netPaidProfit = p.totalPaid - karagirPaid - (p.courierCharges || 0) - (p.otherExpenses || 0);
          const margin = p.totalAmount > 0 ? (netProfit / p.totalAmount) * 100 : 0;

          folderDetails.push({
            clientName: c.clientName,
            projectName: p.projectName,
            dieType: p.dieDetails?.dieType,
            diesQty: p.dieDetails?.totalDies || 0,
            revenue: p.totalAmount,
            paid: p.totalPaid,
            pending: p.pendingPayment,
            karagirCost,
            karagirPaid,
            courier: p.courierCharges || 0,
            others: p.otherExpenses || 0,
            netProfit,
            netPaidProfit,
            margin
          });
        });
      }
    });

    const totalExpenses = totalKaragirWages + totalCourierCharges + totalOtherExpenses;
    const totalPotentialProfit = totalClientRevenue - totalExpenses;
    const totalRealizedProfit = totalClientPaid - totalKaragirPaid - totalCourierCharges - totalOtherExpenses;

    // Aggregate Karagir performance summary
    const karagirMetrics = karagirs.map(k => {
      let activeJobsCount = 0;
      let totalDiesHandled = 0;
      let totalWagesAmount = 0;
      let totalWagesPaid = 0;
      
      clients.forEach(c => {
        if (c.projects) {
          c.projects.forEach(p => {
            if (p.assignedKaragirId === k.id) {
              activeJobsCount += 1;
              totalDiesHandled += p.dieDetails?.totalDies || 0;
              
              const kp = k.projects?.find(proj => proj.id === p.id);
              if (kp) {
                totalWagesAmount += kp.totalAmount;
                totalWagesPaid += kp.totalPaid;
              }
            }
          });
        }
      });
      
      const totalWagesPending = totalWagesAmount - totalWagesPaid;
      
      return {
        id: k.id,
        name: k.name,
        address: k.address,
        activeJobsCount,
        totalDiesHandled,
        totalWagesAmount,
        totalWagesPaid,
        totalWagesPending,
        paymentRatio: totalWagesAmount > 0 ? (totalWagesPaid / totalWagesAmount) * 100 : 0
      };
    }).filter(m => m.activeJobsCount > 0 || m.totalWagesAmount > 0); // show only active/involved ones

    return {
      totalClientRevenue,
      totalClientPaid,
      totalKaragirWages,
      totalKaragirPaid,
      totalCourierCharges,
      totalOtherExpenses,
      totalExpenses,
      totalPotentialProfit,
      totalRealizedProfit,
      totalDies,
      totalProjectsNum,
      folderDetails,
      karagirMetrics
    };
  }, [clients, karagirs]);

  // Generate smart dynamic insights
  const insights = React.useMemo(() => {
    const list: Array<{ id: string; type: 'success' | 'warning' | 'info'; text: string; label: string }> = [];
    const totalOutstanding = reporting.totalClientRevenue - reporting.totalClientPaid;
    const margin = reporting.totalClientRevenue > 0 ? (reporting.totalPotentialProfit / reporting.totalClientRevenue) * 100 : 0;

    if (reporting.totalProjectsNum === 0) {
      list.push({
        id: 'empty',
        type: 'info',
        label: 'Empty Sandbox Slate',
        text: 'The billing engine holds zero active folders. Preload pre-calculated portfolios using Mughal Bridal or CNC Laser controls above.'
      });
      return list;
    }

    // Profitability insight
    if (margin >= 45) {
      list.push({
        id: 'margin_high',
        type: 'success',
        label: 'Stellar Net Profit Margin',
        text: `Your overall margin is exceptionally strong at ${margin.toFixed(0)}%. Specialty handcrafted thappas and custom settings are generating highly optimized returns.`
      });
    } else if (margin >= 30) {
      list.push({
        id: 'margin_healthy',
        type: 'success',
        label: 'Healthy Profit Margin',
        text: `Operating at a healthy ${margin.toFixed(0)}% net margin. Keep active dispatch costs and gold casting expenses under 10% to stay optimized.`
      });
    } else {
      list.push({
        id: 'margin_tight',
        type: 'warning',
        label: 'Tight Profit Margin Warning',
        text: `Current net profit margin has contracted to ${margin.toFixed(0)}%. Consider revising design specifications rate sheets or adjusting custom wage weights to preserve revenue.`
      });
    }

    // Outstanding invoices insight
    if (totalOutstanding > 30000) {
      list.push({
        id: 'outstanding_high',
        type: 'warning',
        label: 'High Outstanding Balance Alert',
        text: `Total accounts receivable stood at ₹${totalOutstanding.toLocaleString('en-IN')}. Prioritize dispatch holds or secure higher advances for upcoming tooling runs.`
      });
    } else if (totalOutstanding > 0) {
      list.push({
        id: 'outstanding_active',
        type: 'info',
        label: 'Active Receivables Flow',
        text: `Outstanding invoice volume of ₹${totalOutstanding.toLocaleString('en-IN')} is perfectly within standard manufacturer credit boundaries.`
      });
    } else {
      list.push({
        id: 'clean_ledger',
        type: 'success',
        label: '100% Cash Flow Realization',
        text: `Excellent ledger performance! All completed dispatch files and artisan tooling outputs have been completely settled by client files.`
      });
    }

    // Artisan workload insight
    const pendingWages = reporting.totalKaragirWages - reporting.totalKaragirPaid;
    if (pendingWages > 15000) {
      list.push({
        id: 'artisan_payout_pending',
        type: 'warning',
        label: 'Artisan Wage Backlogs',
        text: `You have ₹${pendingWages.toLocaleString('en-IN')} in pending artisan wages. Schedule direct dispatches or secure milestone completions.`
      });
    } else if (reporting.karagirMetrics.length > 0) {
      const activeArtisans = reporting.karagirMetrics.filter(m => m.activeJobsCount > 0).length;
      list.push({
        id: 'artisan_flow',
        type: 'info',
        label: 'Artisan Workshop Hub',
        text: `Currently active workshops involve ${activeArtisans} specialized karagirs. Labor allocations and payment ratios are fully settled.`
      });
    }

    return list;
  }, [reporting]);

  // Chart configs
  const profitOverviewData = {
    labels: ['Potential Future (Booked)', 'Realized (In Hand)'],
    datasets: [
      {
        label: 'Revenue',
        data: [reporting.totalClientRevenue, reporting.totalClientPaid],
        backgroundColor: 'rgba(235, 194, 68, 0.6)',
        borderColor: '#EBC244',
        borderWidth: 1,
      },
      {
        label: 'Expenses (Wages/Other)',
        data: [reporting.totalExpenses, (reporting.totalKaragirPaid + reporting.totalCourierCharges + reporting.totalOtherExpenses)],
        backgroundColor: 'rgba(239, 68, 68, 0.4)',
        borderColor: '#ef4444',
        borderWidth: 1,
      },
      {
        label: 'Net Profits',
        data: [reporting.totalPotentialProfit, reporting.totalRealizedProfit],
        backgroundColor: 'rgba(34, 197, 94, 0.6) ',
        borderColor: '#22c55e',
        borderWidth: 1,
      }
    ]
  };

  const expenseBreakdownData = {
    labels: ['Karagir Wages', 'Courier Charges', 'Other Expenses'],
    datasets: [
      {
        data: [reporting.totalKaragirWages, reporting.totalCourierCharges, reporting.totalOtherExpenses],
        backgroundColor: ['rgba(59, 130, 246, 0.6)', 'rgba(168, 85, 247, 0.6)', 'rgba(236, 72, 153, 0.6)'],
        borderColor: ['#3b82f6', '#a855f7', '#ec4899'],
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#FFFFFF',
          font: { size: 10 }
        },
      },
    },
    scales: {
      y: {
        ticks: { color: '#A0A0A0', font: { size: 9 } },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      x: {
        ticks: { color: '#A0A0A0', font: { size: 9 } },
        grid: { color: 'rgba(255,255,255,0.05)' }
      }
    }
  };

  const [activeFilter, setActiveFilter] = React.useState<'all' | 'pending' | 'settled' | 'high_margin'>('all');

  const filteredFolders = React.useMemo(() => {
    switch (activeFilter) {
      case 'pending':
        return reporting.folderDetails.filter(f => f.pending > 0);
      case 'settled':
        return reporting.folderDetails.filter(f => f.pending === 0);
      case 'high_margin':
        return reporting.folderDetails.filter(f => f.margin >= 40);
      default:
        return reporting.folderDetails;
    }
  }, [reporting.folderDetails, activeFilter]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="border-b border-border pb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text flex items-center gap-2">
            <TrendingUp className="text-primary" /> Dynamic Business Profit Intelligence
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Detailed cost breakdowns, courier logs, micro-folder receipts, and overall profitability.
          </p>
        </div>

        {/* Quick Demo Controller Panel */}
        <div className="bg-surface/60 border border-border/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center gap-3.5 text-[11px] lg:max-w-2xl">
          <div className="flex items-center gap-1.5 text-primary font-bold uppercase tracking-widest text-[10px]">
            <Sparkles size={13} className="animate-pulse text-primary" /> Data Sandbox Controls:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => injectPreset('mughal')}
              className="flex items-center gap-1 px-3 py-1.5 cursor-pointer bg-primary/10 border border-primary/20 text-primary rounded-lg font-extrabold hover:bg-primary hover:text-background active:scale-95 transition-all"
              title="Loads high-value royal bridal chains and thappa dies with elaborate wages"
            >
              👑 Mughal Bridal Kit
            </button>
            <button
              onClick={() => injectPreset('cnc')}
              className="flex items-center gap-1 px-3 py-1.5 cursor-pointer bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg font-extrabold hover:bg-blue-500 hover:text-black active:scale-95 transition-all"
              title="Loads modern micro-precision laser settings and eternity bands"
            >
              <Zap size={11} /> CNC Laser Series
            </button>
            <button
              onClick={() => injectPreset('baseline')}
              className="flex items-center gap-1 px-3 py-1.5 cursor-pointer bg-surface border border-border text-text rounded-lg font-bold hover:bg-white hover:text-black active:scale-95 transition-all"
              title="Restores default jewelry sample setup"
            >
              <RefreshCw size={11} /> Standard Reset
            </button>
            <button
              onClick={() => injectPreset('clear')}
              className="flex items-center gap-1 px-2.5 py-1.5 cursor-pointer bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg font-bold hover:bg-red-500 hover:text-white active:scale-95 transition-all"
              title="Clears all client and artisan folders to test clean state"
            >
              <Trash2 size={11} /> Clear All
            </button>
          </div>
        </div>
      </div>

      {/* CORE FINANCIAL SCOREBOARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface p-5 rounded-xl border border-border sm:gradient-glow flex items-center">
          <div className="p-3 rounded-lg bg-primary/10 text-primary mr-4">
            <IndianRupee size={22} />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-bold uppercase">Total Booked Volume</p>
            <p className="text-xl font-extrabold text-text mt-0.5">{formatCurrency(reporting.totalClientRevenue)}</p>
            <p className="text-[9px] text-green-400 mt-1">₹{reporting.totalClientPaid} realized in cash</p>
          </div>
        </div>

        <div className="bg-surface p-5 rounded-xl border border-border flex items-center">
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400 mr-4">
            <ShoppingBag size={22} />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-bold uppercase">Total Expenses Set</p>
            <p className="text-xl font-extrabold text-text mt-0.5">{formatCurrency(reporting.totalExpenses)}</p>
            <div className="text-[9px] text-text-muted mt-1 flex gap-2">
              <span>Wages: ₹{reporting.totalKaragirWages}</span>
              <span>Courier: ₹{reporting.totalCourierCharges}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface p-5 rounded-xl border border-border flex items-center bg-gradient-to-r from-green-500/5 to-transparent">
          <div className="p-3 rounded-lg bg-green-500/10 text-green-400 mr-4">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-bold uppercase">Potential Net Profit</p>
            <p className="text-xl font-black text-green-400 mt-0.5">{formatCurrency(reporting.totalPotentialProfit)}</p>
            <p className="text-[9px] text-text-muted mt-1">
              Margin: {reporting.totalClientRevenue > 0 ? ((reporting.totalPotentialProfit / reporting.totalClientRevenue) * 100).toFixed(0) : 0}%
            </p>
          </div>
        </div>

        <div className="bg-surface p-5 rounded-xl border border-border flex items-center bg-gradient-to-r from-primary/5 to-transparent">
          <div className="p-3 rounded-lg bg-primary/10 text-primary mr-4">
            <Award size={22} />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-bold uppercase">Realized Cash Profit</p>
            <p className="text-xl font-black text-primary mt-0.5">{formatCurrency(reporting.totalRealizedProfit)}</p>
            <p className="text-[9px] text-text-muted mt-1">Real cash in-hand post expenses</p>
          </div>
        </div>
      </div>

      {/* GENUINE ADVISORY DYNAMIC ANALYTICS BAR */}
      <div className="bg-surface p-5 rounded-xl border border-border shadow-sm space-y-3">
        <div className="flex items-center gap-1.5 font-bold text-xs uppercase text-text border-b border-border/40 pb-2">
          <Lightbulb size={14} className="text-primary animate-pulse" /> Live Business Operations Insights
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((ins) => (
            <div 
              key={ins.id} 
              className={cn(
                "p-3.5 rounded-xl border flex gap-3.5 transition-colors",
                ins.type === 'success' && "bg-green-500/5 border-green-500/20 text-green-300",
                ins.type === 'warning' && "bg-red-500/5 border-red-500/20 text-red-300",
                ins.type === 'info' && "bg-blue-500/5 border-blue-500/20 text-blue-300"
              )}
            >
              <div className="mt-0.5 shrink-0">
                {ins.type === 'success' && <CheckCircle2 size={16} className="text-green-400" />}
                {ins.type === 'warning' && <AlertCircle size={16} className="text-red-400" />}
                {ins.type === 'info' && <Lightbulb size={16} className="text-blue-400" />}
              </div>
              <div>
                <h4 className="font-extrabold text-[10px] tracking-wider uppercase opacity-90">{ins.label}</h4>
                <p className="text-[10.5px] opacity-85 mt-1.5 leading-relaxed">{ins.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHART DIAGRAM PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface p-6 rounded-xl border border-border h-80">
          <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <BarChart3 size={14} className="text-primary" /> Revenue, Cost & Profit Ledger Comparison
          </h3>
          <div className="h-64">
            <Bar data={profitOverviewData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl border border-border h-80">
          <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <PieIcon size={14} /> Expenses Weightage Breakdown
          </h3>
          <div className="h-56 flex items-center justify-center">
            <Doughnut 
              data={expenseBreakdownData} 
              options={{
                ...chartOptions, 
                scales: undefined,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#FFFFFF', font: { size: 9 }, boxWidth: 10 }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* REQUIREMENT 4: DYNAMIC MULTI-FOLDER PROFITABILITY BREAKDOWNS */}
      <div className="bg-surface p-6 rounded-xl border border-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-text flex items-center gap-1.5">
              <BookOpen size={16} className="text-primary" /> Folder Profitability Spec Sheet
            </h3>
            <p className="text-[10.5px] text-text-muted mt-0.5">
              Realtime revenue, design parameters, courier expenses, and custom net earnings generated from each project.
            </p>
          </div>
          
          {/* Interactive Filtering Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-background p-1 rounded-lg border border-border self-start sm:self-center">
            {(['all', 'pending', 'settled', 'high_margin'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-3 py-1 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider",
                  activeFilter === filter
                    ? "bg-primary text-background shadow-lg"
                    : "text-text-muted hover:text-text hover:bg-surface/50"
                )}
              >
                {filter === 'all' && 'All Folders'}
                {filter === 'pending' && 'Outstanding'}
                {filter === 'settled' && 'Fully Settled'}
                {filter === 'high_margin' && 'High Margin (≥40%)'}
              </button>
            ))}
          </div>
        </div>

        {filteredFolders.length === 0 ? (
          <div className="text-center py-10 bg-background rounded-lg border border-dashed border-border text-xs text-text-muted">
            No matching folder records found. Change filters or register a new project folder in Clients!
          </div>
        ) : (
          <div className="border border-border rounded-xl bg-background overflow-hidden overflow-x-auto text-[11px]">
            <table className="w-full text-left font-sans">
              <thead className="bg-surface/50 text-text-muted uppercase text-[9px] font-bold border-b border-border">
                <tr>
                  <th className="px-5 py-3">Client Folder / Project Name</th>
                  <th className="px-5 py-3">Dies spec</th>
                  <th className="px-5 py-3 text-right">Revenue & Realization</th>
                  <th className="px-5 py-3 text-right">Artisan Wages</th>
                  <th className="px-5 py-3 text-right">Courier / Expenses</th>
                  <th className="px-5 py-3 text-right">Total Net Profit</th>
                  <th className="px-5 py-3 text-right">Liquid Profit</th>
                  <th className="px-5 py-3 text-center">Net Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text">
                {filteredFolders.map((f, i) => {
                  const payProgress = f.revenue > 0 ? Math.round((f.paid / f.revenue) * 100) : 0;
                  return (
                    <tr key={i} className="hover:bg-surface/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-bold text-text mb-0.5 flex items-center gap-1.5">
                          <Folder size={12} className="text-primary" /> {f.projectName}
                        </div>
                        <div className="text-[9.5px] text-text-muted">Client File: {f.clientName}</div>
                      </td>
                      <td className="px-5 py-3 font-mono text-[10px]">
                        <span className="bg-surface px-2 py-0.5 rounded text-[9.5px] font-bold text-primary border border-border">
                          {f.diesQty}x
                        </span>
                        <div className="text-[9.5px] text-text-muted mt-1 truncate max-w-[150px]" title={f.dieType}>
                          {f.dieType}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="font-bold text-text">₹{f.revenue}</div>
                        <div className="text-[9.5px] text-green-400 font-semibold mb-1">Paid: ₹{f.paid}</div>
                        {/* Visual Progress Bar */}
                        <div className="w-24 ml-auto bg-surface h-1.5 rounded-full overflow-hidden border border-border flex">
                          <div 
                            className="bg-gradient-to-r from-primary to-green-400 h-full rounded-full" 
                            style={{ width: `${Math.min(100, payProgress)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="font-bold text-red-400">₹{f.karagirCost}</div>
                        <div className="text-[9.5px] text-text-muted">Disbursed: ₹{f.karagirPaid}</div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="text-text font-mono">₹{f.courier} <span className="text-[9px] text-text-muted">(Ship)</span></div>
                        <div className="text-[9.5px] text-text-muted mt-0.5">₹{f.others} <span className="text-[9px] text-text-muted">(Misc)</span></div>
                      </td>
                      <td className="px-5 py-3 text-right font-black text-green-400 font-mono text-xs">
                        ₹{f.netProfit}
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-primary text-xs">
                        ₹{f.netPaidProfit}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded text-[9.5px] font-extrabold shadow-sm border",
                          f.margin >= 40 
                            ? "bg-green-500/10 text-green-400 border-green-500/20" 
                            : f.margin >= 20 
                              ? "bg-primary/10 text-primary border-primary/20" 
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                        )}>
                          {f.margin.toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ARTISAN WORKLOAD & PERFORMANCE ANALYTICS */}
      <div className="bg-surface p-6 rounded-xl border border-border shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-text flex items-center gap-1.5">
            <Layers size={16} className="text-primary" /> Active Artisan (Karagir) Allocation Hub
          </h3>
          <p className="text-[10.5px] text-text-muted mt-0.5">
            Overview of currently allocated tooling works, progress on their accumulated wage files, and payout settlement ratios.
          </p>
        </div>

        {reporting.karagirMetrics.length === 0 ? (
          <div className="text-center py-8 bg-background rounded-lg border border-dashed border-border text-xs text-text-muted">
            No artisan assignments identified across current active folders. Go to Clients and assign Karagirs!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {reporting.karagirMetrics.map((m) => (
              <div key={m.id} className="bg-background p-4 rounded-xl border border-border space-y-3 hover:border-primary/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-black text-text uppercase tracking-tight">{m.name}</h4>
                    <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[8.5px] font-extrabold rounded uppercase tracking-wider">
                      {m.activeJobsCount} Folders
                    </span>
                  </div>
                  <p className="text-[9px] text-text-muted mt-0.5 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-green-400" /> {m.address}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/50">
                    <div>
                      <p className="text-[8px] text-text-muted uppercase">Handled Dies</p>
                      <p className="text-sm font-bold text-text font-mono">{m.totalDiesHandled} dies</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-text-muted uppercase">Wages Pending</p>
                      <span className={cn(
                        "text-sm font-bold font-mono",
                        m.totalWagesPending > 0 ? "text-red-400" : "text-green-400"
                      )}>
                        ₹{m.totalWagesPending}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-[8px] text-text-muted font-bold">
                    <span>Wage Settled Ratio</span>
                    <span className="text-primary">{m.paymentRatio.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden border border-border">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-300" 
                      style={{ width: `${m.paymentRatio}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[8px] text-text-muted mt-1 font-mono">
                    <span>Paid: ₹{m.totalWagesPaid}</span>
                    <span>Total: ₹{m.totalWagesAmount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
