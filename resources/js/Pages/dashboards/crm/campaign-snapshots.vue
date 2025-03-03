<script>
import Layout from "@/Layouts/main.vue";
import PageHeader from "@/Components/page-header.vue";
import GridJs from './gridjs.vue';
import { ref, computed } from 'vue';
import { useForm, router } from '@inertiajs/vue3';
import Swal from 'sweetalert2';

const SAMPLE_DATA = {
  yearly: {
    "2023": {
      emails_sent: 120000,
      emails_opened: 84000,
      clicks: 25200,
      entries: 18900,
      leads: 3780,
      click_rate: 30,
      conversion_rate: 20
    },
    "2024": {
      emails_sent: 150000,
      emails_opened: 105000,
      clicks: 31500,
      entries: 23625,
      leads: 4725,
      click_rate: 35,
      conversion_rate: 25
    }
  },
  quarterly: {
    "Q1 2024": {
      emails_sent: 37500,
      emails_opened: 26250,
      clicks: 7875,
      entries: 5906,
      leads: 1181,
      click_rate: 33,
      conversion_rate: 22
    },
    "Q4 2023": {
      emails_sent: 35000,
      emails_opened: 24500,
      clicks: 7350,
      entries: 5512,
      leads: 1102,
      click_rate: 31,
      conversion_rate: 21
    },
    "Q3 2023": {
      emails_sent: 32500,
      emails_opened: 22750,
      clicks: 6825,
      entries: 5118,
      leads: 1023,
      click_rate: 29,
      conversion_rate: 19
    }
  },
  monthly: {
    "Jan 2024": {
      emails_sent: 12500,
      emails_opened: 8750,
      clicks: 2625,
      entries: 1968,
      leads: 393,
      click_rate: 34,
      conversion_rate: 23
    },
    "Dec 2023": {
      emails_sent: 11800,
      emails_opened: 8260,
      clicks: 2478,
      entries: 1858,
      leads: 371,
      click_rate: 32,
      conversion_rate: 22
    },
    "Nov 2023": {
      emails_sent: 11200,
      emails_opened: 7840,
      clicks: 2352,
      entries: 1764,
      leads: 352,
      click_rate: 30,
      conversion_rate: 21
    }
  },
  weekly: {
    "Week 1 Jan 2024": {
      emails_sent: 3125,
      emails_opened: 2187,
      clicks: 656,
      entries: 492,
      leads: 98,
      click_rate: 35,
      conversion_rate: 24
    },
    "Week 4 Dec 2023": {
      emails_sent: 2950,
      emails_opened: 2065,
      clicks: 619,
      entries: 464,
      leads: 92,
      click_rate: 33,
      conversion_rate: 23
    },
    "Week 3 Dec 2023": {
      emails_sent: 2800,
      emails_opened: 1960,
      clicks: 588,
      entries: 441,
      leads: 88,
      click_rate: 31,
      conversion_rate: 22
    }
  }
};

export default {
  components: {
    Layout,
    PageHeader,
    GridJs
  },
  props: {
    snapshots: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedComparison: 'daily',
      comparisonPeriods: [
        { value: 'wow', label: 'WoW' },
        { value: 'mom', label: 'MoM' },
        { value: 'qoq', label: 'QoQ' },
        { value: 'yoy', label: 'YoY' }
      ],
      selectedSnapshot: null,
      comparisonSnapshot: null,
      showComparison: false,
      searchQuery: '',
      showEditModal: false,
      form: useForm({
        name: '',
        notes: ''
      }),
      editForm: { 
        id: null
      },
      showDeleteModal: false,
      snapshotToDelete: null,
      isDeleting: false,
      monthOrder: {
        'January': 1,
        'February': 2,
        'March': 3,
        'April': 4,
        'May': 5,
        'June': 6,
        'July': 7,
        'August': 8,
        'September': 9,
        'October': 10,
        'November': 11,
        'December': 12
      },
      sortColumn: null,
      sortDirection: 'asc',
    }
  },
  created() {
    // console.log('Snapshots received:', this.snapshots);
  },
  watch: {
    selectedSnapshot(newVal) {
      if (!newVal) {
        this.selectedComparison = 'daily';
      }
      this.showComparison = false;
      this.comparisonSnapshot = null;
    },
    searchQuery(newVal) {
      // console.log('Search query:', newVal);
      // console.log('Filtered snapshots:', this.filteredSnapshots);
    },
    showComparison(newVal) {
      if (!newVal) {
        this.comparisonSnapshot = null;
      }
    },
    comparisonSnapshot: {
      handler(newVal) {
        if (newVal) {
          // console.log('Comparison snapshot changed:', newVal);
        }
      },
      deep: true
    }
  },
  computed: {
    filteredSnapshots() {
      let filtered = this.snapshots || [];
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(snapshot => {
          return (
            (snapshot.name && snapshot.name.toLowerCase().includes(query)) ||
            (snapshot.campaign_name && snapshot.campaign_name.toLowerCase().includes(query)) ||
            (snapshot.notes && snapshot.notes.toLowerCase().includes(query)) ||
            (snapshot.period_type && snapshot.period_type.toLowerCase().includes(query))
          );
        });
      }
      
      return filtered;
    },
    periodData() {
      if (!this.selectedSnapshot) return [];
      const data = SAMPLE_DATA[this.selectedSnapshot.period_type] || {};
      
      const periods = Object.keys(data).sort((a, b) => {
        return new Date(b) - new Date(a);
      });
      
      const filteredData = {};
      periods.forEach(period => {
        if (this.shouldIncludePeriod(period)) {
          filteredData[period] = data[period];
        }
      });
      
      return filteredData;
    },
    gridData() {
      return this.formatGridData();
    },
    sortedGridData() {
      if (!this.gridData.length) return [];
      
      const data = [...this.gridData];
      if (!this.sortColumn) return data;

      return data.sort((a, b) => {
        let aVal = a[this.sortColumn];
        let bVal = b[this.sortColumn];
        
        // Special handling for period column
        if (this.sortColumn === 'period') {
          // Convert date ranges to comparable values
          const getDateValue = (dateStr) => {
            // Handle different date formats
            if (dateStr.includes('-')) {
              // For date ranges like "March 31-April 6"
              const startDate = dateStr.split('-')[0].trim();
              const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                                 'July', 'August', 'September', 'October', 'November', 'December'];
              
              // Extract month and day
              const monthMatch = monthNames.findIndex(month => startDate.includes(month));
              const dayMatch = startDate.match(/\d+/);
              
              if (monthMatch !== -1 && dayMatch) {
                // Convert to numeric value (month * 100 + day) for comparison
                return (monthMatch + 1) * 100 + parseInt(dayMatch[0]);
              }
            } else if (dateStr.includes('/')) {
              // For "MM/DD" format
              const [month, day] = dateStr.split('/').map(Number);
              return month * 100 + day;
            } else {
              // For month names (e.g., "January", "February")
              const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                                 'July', 'August', 'September', 'October', 'November', 'December'];
              const monthIndex = monthNames.findIndex(month => dateStr === month);
              if (monthIndex !== -1) {
                return (monthIndex + 1) * 100; // Multiply by 100 to maintain consistent sorting with daily values
              }
            }
            return 0;
          };

          aVal = getDateValue(aVal);
          bVal = getDateValue(bVal);
        }
        
        // Handle numeric columns
        if (['delivered', 'email_click_thru', 'entries', 'leads'].includes(this.sortColumn)) {
          aVal = parseFloat(aVal) || 0;
          bVal = parseFloat(bVal) || 0;
        }
        
        // Handle percentage columns
        if (['click_thru_rate', 'conversion_rate'].includes(this.sortColumn)) {
          aVal = parseFloat(aVal.replace('%', '')) || 0;
          bVal = parseFloat(bVal.replace('%', '')) || 0;
        }

        if (this.sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    },
    combinedGridData() {
      if (!this.showComparison || !this.comparisonSnapshot) {
        return this.sortedGridData;
      }

      // Get data from both snapshots
      const mainData = this.selectedSnapshot?.metrics_data?.dailyMetrics || {};
      const comparisonData = this.comparisonSnapshot?.metrics_data?.dailyMetrics || {};

      // Process data based on comparison type
      let processedData = [];
      
      switch (this.selectedComparison) {
        case 'daily':
          const mainDaily = this.aggregateByDay(mainData);
          const comparisonDaily = this.aggregateByDay(comparisonData);
          processedData = this.combineMetrics(mainDaily, comparisonDaily);
          break;
          
        case 'weekly':
          const mainWeekly = this.aggregateByWeek(mainData);
          const comparisonWeekly = this.aggregateByWeek(comparisonData);
          processedData = this.combineMetrics(mainWeekly, comparisonWeekly);
          break;
          
        case 'monthly':
          const mainMonthly = this.aggregateByMonth(mainData);
          const comparisonMonthly = this.aggregateByMonth(comparisonData);
          processedData = this.combineMetrics(mainMonthly, comparisonMonthly);
          break;
          
        case 'yearly':
          const mainYearly = this.aggregateByYear(mainData);
          const comparisonYearly = this.aggregateByYear(comparisonData);
          processedData = this.combineMetrics(mainYearly, comparisonYearly);
          break;
      }

      return processedData;
    }
  },
  methods: {
    formatNumber(value) {
      return new Intl.NumberFormat().format(value || 0);
    },

    formatPercentage(value) {
      return (value || 0).toFixed(2);
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    getPercentageClass(value) {
      if (!value) return 'secondary';
      if (value >= 75) return 'success';
      if (value >= 50) return 'primary';
      if (value >= 25) return 'warning';
      return 'danger';
    },

    getPeriodVariant(period) {
      const variants = {
        daily: 'info',
        weekly: 'primary',
        monthly: 'success',
        quarterly: 'warning',
        yearly: 'danger'
      };
      return variants[period] || 'secondary';
    },

    getSnapshotVariant(snapshot) {
      const variants = {
        daily: 'primary',
        weekly: 'success',
        monthly: 'info',
        quarterly: 'warning',
        yearly: 'danger'
      };
      return variants[snapshot.period_type] || 'secondary';
    },

    exportData() {
      if (!this.selectedSnapshot) return;
      
      const data = this.showComparison ? this.combinedGridData : this.formatGridData();
      let csvContent = '';
      
      const periodLabel = this.getPeriodLabel(this.selectedComparison);
      const headers = [
        periodLabel,
        this.showComparison ? 'Delivered (A vs B)' : 'Delivered',
        this.showComparison ? 'Email Click-Thru (A vs B)' : 'Email Click-Thru',
        this.showComparison ? 'Click-Thru Rate % (A vs B)' : 'Click-Thru Rate (%)',
        this.showComparison ? 'Entries (A vs B)' : 'Entries',
        this.showComparison ? 'Leads (A vs B)' : 'Leads',
        this.showComparison ? 'Conversion Rate % (A vs B)' : 'Conversion Rate (%)',
        'Trend Status',
        'Trend Details'
      ];
      
      csvContent += headers.join(',') + '\n';
      
      // Add data rows
      data.forEach(row => {
        const trendStatus = row.trend?.status || 'n/a';
        const trendDetails = row.trend?.details?.replace(/,/g, ';') || 'n/a'; // Replace commas with semicolons to avoid CSV issues
        
        const rowData = [
          row.period,
          row.delivered,
          row.email_click_thru,
          row.click_thru_rate,
          row.entries,
          row.leads,
          row.conversion_rate,
          trendStatus,
          trendDetails
        ];
        csvContent += rowData.join(',') + '\n';
      });
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      // Generate filename based on snapshot and period type
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${this.selectedSnapshot.name}_${this.selectedComparison}_metrics_${timestamp}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    getPeriodLabel(periodType) {
      const labels = {
        daily: 'Date',
        weekly: 'Week',
        monthly: 'Month',
        yearly: 'Year'
      };
      return labels[periodType] || 'Period';
    },

    selectSnapshot(snapshot) {
      this.showComparison = false;
      this.comparisonSnapshot = null;
      this.selectedSnapshot = snapshot;
    },

    confirmDelete(snapshot) {
      Swal.fire({
        title: 'Are you sure?',
        text: `You won't be able to revert this!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleDelete(snapshot);
        }
      });
    },

    showSuccessAlert(message) {
      Swal.fire({
        title: 'Success!',
        text: message,
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
    },

    showErrorAlert(message) {
      Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonColor: "#34c38f",
        confirmButtonText: 'Ok'
      });
    },

    async handleDelete(snapshot) {
      try {
        await router.delete(route('campaign-snapshots.destroy', snapshot.id), {
          preserveScroll: true,
          onSuccess: () => {
            this.showSuccessAlert('Snapshot deleted successfully');
            if (this.selectedSnapshot?.id === snapshot.id) {
              this.selectedSnapshot = null;
            }
          },
          onError: (errors) => {
            console.error('Error deleting snapshot:', errors);
            this.showErrorAlert(errors.message || 'Failed to delete snapshot');
          }
        });
      } catch (error) {
        console.error('Error deleting snapshot:', error);
        this.showErrorAlert(error.response?.data?.message || 'Failed to delete snapshot');
      }
    },

    getComparisonLabel(comparison) {
      switch (comparison) {
        case 'wow':
          return 'Week over Week';
        case 'mom':
          return 'Month over Month';
        case 'qoq':
          return 'Quarter over Quarter';
        case 'yoy':
          return 'Year over Year';
        default:
          return 'All Periods';
      }
    },

    shouldIncludePeriod(period) {
      switch (this.selectedComparison) {
        case 'wow':
          return period.includes('Week');
        case 'mom':
          return !period.includes('Week') && !period.includes('Q');
        case 'qoq':
          return period.includes('Q');
        case 'yoy':
          return period.length === 4;
        default:
          return true;
      }
    },

    calculateTrend(current, previous) {
      if (!previous) return { status: 'neutral', details: 'No previous data for comparison' };
      
      // Calculate percentage change
      const calculateChange = (currentVal, previousVal) => {
        if (!previousVal) return 0;
        return ((currentVal - previousVal) / previousVal) * 100;
      };

      // Calculate changes for key metrics
      const changes = {
        clicks: calculateChange(current.email_click_thru, previous.email_click_thru),
        conversion: calculateChange(
          (current.leads / current.entries) * 100,
          (previous.leads / previous.entries) * 100
        ),
        leads: calculateChange(current.leads, previous.leads),
        entries: calculateChange(current.entries, previous.entries)
      };

      // Updated weighted calculation:
      // - 30% weight to leads change
      // - 25% weight to conversion rate change
      // - 25% weight to entries change
      // - 20% weight to click-through change
      const weightedChange = (
        changes.leads * 0.30 +      // Reduced from 40% to 30%
        changes.conversion * 0.25 + // Reduced from 35% to 25%
        changes.entries * 0.25 +    // Added entries at 25%
        changes.clicks * 0.20       // Reduced from 25% to 20%
      );

      // Create detailed trend message
      const details = [
        `Leads: ${changes.leads.toFixed(1)}%`,
        `Entries: ${changes.entries.toFixed(1)}%`,
        `Conversion: ${changes.conversion.toFixed(1)}%`,
        `Clicks: ${changes.clicks.toFixed(1)}%`
      ].join(' | ');

      if (weightedChange > 5) return { status: 'up', details };
      if (weightedChange < -5) return { status: 'down', details };
      return { status: 'neutral', details: `Small changes (${weightedChange.toFixed(1)}%) | ${details}` };
    },

    formatTrend(trend) {
      if (!trend) return '';
      
      const icons = {
        up: '<i class="ri-arrow-up-line text-success"></i>',
        down: '<i class="ri-arrow-down-line text-danger"></i>',
        neutral: '<i class="ri-minus-line text-warning"></i>'
      };

      return `
        <div class="d-flex align-items-center">
          <span class="me-2">${icons[trend.status]}</span>
          <span class="small text-muted me-2">
            ${trend.status === 'neutral' ? 'No significant change' : trend.status === 'up' ? 'Improved' : 'Declined'}
          </span>
          <i class="ri-information-line text-muted cursor-pointer" 
             v-b-tooltip.hover.left 
             title="${trend.details}">
          </i>
        </div>
      `;
    },

    editSnapshot(snapshot) {
      this.form.name = snapshot.name;
      this.form.notes = snapshot.notes || '';
      this.editForm.id = snapshot.id;
      this.showEditModal = true;
    },

    async updateSnapshot() {
      this.form.put(route('campaign-snapshots.update', this.editForm.id), {
        preserveScroll: true,
        onSuccess: () => {
          this.showEditModal = false;
          this.resetEditForm();
        },
        onError: () => {
          console.error('Failed to update snapshot');
        }
      });
    },

    resetEditForm() {
      this.form.reset();
      this.editForm.id = null;
    },

    aggregateByDay(dailyMetrics) {
      return Object.entries(dailyMetrics)
        .map(([dateKey, data]) => {
          const metrics = data.metrics;
          return {
            period: `${data.monthDate}/${data.dayDate}`,
            delivered: metrics.totalDelivered || 0,
            email_click_thru: metrics.totalClicks || 0,
            click_thru_rate: this.formatPercentage(metrics.clickThruRate * 100),
            entries: metrics.entries || 0,
            leads: Math.round(metrics.totalLeads || 0),
            conversion_rate: this.formatPercentage(metrics.conversion * 100)
          };
        })
        .sort((a, b) => {
          const [aMonth, aDay] = a.period.split('/').map(Number);
          const [bMonth, bDay] = b.period.split('/').map(Number);
          return bMonth === aMonth ? bDay - aDay : bMonth - aMonth;
        });
    },

    aggregateByMonth(dailyMetrics) {
      const monthlyData = {};
      
      Object.entries(dailyMetrics).forEach(([dateKey, data]) => {
        const monthKey = data.monthDate;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            delivered: 0,
            clicks: 0,
            entries: 0,
            leads: 0
          };
        }
        
        const metrics = data.metrics;
        monthlyData[monthKey].delivered += metrics.totalDelivered || 0;
        monthlyData[monthKey].clicks += metrics.totalClicks || 0;
        monthlyData[monthKey].entries += metrics.entries || 0;
        monthlyData[monthKey].leads += metrics.totalLeads || 0;
      });

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      return Object.entries(monthlyData)
        .map(([month, data]) => ({
          period: monthNames[Number(month) - 1],
          delivered: Math.round(data.delivered),
          email_click_thru: Math.round(data.clicks),
          click_thru_rate: this.formatPercentage((data.clicks / data.delivered) * 100),
          entries: Math.round(data.entries),
          leads: Math.round(data.leads),
          conversion_rate: this.formatPercentage((data.leads / data.entries) * 100)
        }))
        .sort((a, b) => this.monthOrder[b.period] - this.monthOrder[a.period]);
    },

    aggregateByYear(dailyMetrics) {
      const yearlyData = {
        delivered: 0,
        clicks: 0,
        entries: 0,
        leads: 0
      };
      
      Object.entries(dailyMetrics).forEach(([dateKey, data]) => {
        const metrics = data.metrics;
        yearlyData.delivered += metrics.totalDelivered || 0;
        yearlyData.clicks += metrics.totalClicks || 0;
        yearlyData.entries += metrics.entries || 0;
        yearlyData.leads += metrics.totalLeads || 0;
      });

      return [{
        period: '2025',
        delivered: Math.round(yearlyData.delivered),
        email_click_thru: Math.round(yearlyData.clicks),
        click_thru_rate: this.formatPercentage((yearlyData.clicks / yearlyData.delivered) * 100),
        entries: Math.round(yearlyData.entries),
        leads: Math.round(yearlyData.leads),
        conversion_rate: this.formatPercentage((yearlyData.leads / yearlyData.entries) * 100)
      }];
    },

    aggregateByWeek(dailyMetrics) {
      const weeklyData = {};
      
      // Sort dates chronologically first
      const sortedDates = Object.entries(dailyMetrics)
        .sort(([, a], [, b]) => {
          const dateA = new Date(2025, a.monthDate - 1, a.dayDate);
          const dateB = new Date(2025, b.monthDate - 1, b.dayDate);
          return dateA - dateB;
        });

      let currentWeekStart = null;
      let currentWeekEnd = null;

      // Process each day's metrics
      sortedDates.forEach(([dateKey, data], index) => {
        const currentDate = new Date(2025, data.monthDate - 1, data.dayDate);
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Start a new week if:
        // 1. This is the first entry
        // 2. Current date is after the current week's end
        // 3. There's a gap in the dates (campaign break)
        if (!currentWeekStart || currentDate > currentWeekEnd || 
            (index > 0 && currentDate - new Date(2025, sortedDates[index-1][1].monthDate - 1, sortedDates[index-1][1].dayDate) > 24 * 60 * 60 * 1000)) {
          
          currentWeekStart = new Date(currentDate);
          currentWeekEnd = new Date(currentDate);
          
          // If first day and not Monday, make it a partial week
          if (index === 0 && dayOfWeek !== 1) {
            // End on next Sunday
            currentWeekEnd.setDate(currentWeekEnd.getDate() + (7 - dayOfWeek));
          } else {
            // Regular week - go to next Sunday
            const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
            currentWeekEnd.setDate(currentWeekEnd.getDate() + daysToSunday);
          }

          // Don't go beyond our data
          const lastDate = new Date(2025, sortedDates[sortedDates.length - 1][1].monthDate - 1, sortedDates[sortedDates.length - 1][1].dayDate);
          if (currentWeekEnd > lastDate) {
            currentWeekEnd = new Date(lastDate);
          }
        }
        
        // Format the week range
        const weekRange = this.formatDateRange(currentWeekStart, currentWeekEnd);
        
        if (!weeklyData[weekRange]) {
          weeklyData[weekRange] = {
            startDate: currentWeekStart,
            delivered: 0,
            clicks: 0,
            entries: 0,
            leads: 0
          };
        }
        
        const metrics = data.metrics;
        weeklyData[weekRange].delivered += metrics.totalDelivered || 0;
        weeklyData[weekRange].clicks += metrics.totalClicks || 0;
        weeklyData[weekRange].entries += metrics.entries || 0;
        weeklyData[weekRange].leads += metrics.totalLeads || 0;
      });

      // Convert to array and calculate rates
      return Object.entries(weeklyData)
        .map(([weekRange, data]) => ({
          period: weekRange,
          delivered: Math.round(data.delivered),
          email_click_thru: Math.round(data.clicks),
          click_thru_rate: this.formatPercentage((data.clicks / data.delivered) * 100),
          entries: Math.round(data.entries),
          leads: Math.round(data.leads),
          conversion_rate: this.formatPercentage((data.leads / data.entries) * 100)
        }))
        .sort((a, b) => {
          // Sort by start date in descending order
          const aStart = new Date(weeklyData[a.period].startDate);
          const bStart = new Date(weeklyData[b.period].startDate);
          return bStart - aStart;
        });
    },

    formatDateRange(startDate, endDate) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      // Format as "February 1-7" or "February 23-March 1"
      if (startDate.getMonth() === endDate.getMonth()) {
        // Same month
        return `${monthNames[startDate.getMonth()]} ${startDate.getDate()}-${endDate.getDate()}`;
      } else {
        // Different months
        return `${monthNames[startDate.getMonth()]} ${startDate.getDate()}-${monthNames[endDate.getMonth()]} ${endDate.getDate()}`;
      }
    },

    formatGridData(snapshot = null) {
      const targetSnapshot = snapshot || this.selectedSnapshot;
      if (!targetSnapshot?.metrics_data?.dailyMetrics) {
        return [];
      }
      
      try {
        const dailyMetrics = targetSnapshot.metrics_data.dailyMetrics;
        let data;

        switch (this.selectedComparison) {
          case 'daily':
            data = this.aggregateByDay(dailyMetrics);
            break;
          case 'weekly':
            data = this.aggregateByWeek(dailyMetrics);
            break;
          case 'monthly':
            data = this.aggregateByMonth(dailyMetrics);
            break;
          case 'yearly':
            data = this.aggregateByYear(dailyMetrics);
            break;
          default:
            data = [];
        }

        // Add trends by comparing with previous periods
        return data.map((period, index) => ({
          ...period,
          trend: this.calculateTrend(
            period,
            index < data.length - 1 ? data[index + 1] : null
          )
        }));
      } catch (error) {
        console.error('Error formatting grid data:', error);
        return [];
      }
    },

    handleSort({ column, direction }) {
      this.sortColumn = column;
      this.sortDirection = direction;
    },

    compareSnapshots(mainRow, comparisonRow) {
      const calculateDiff = (current, previous) => {
        // Convert string numbers to actual numbers
        current = parseFloat(String(current).replace(/[^0-9.-]+/g, ''));
        previous = parseFloat(String(previous).replace(/[^0-9.-]+/g, ''));
        return ((current - previous) / previous * 100).toFixed(1);
      };

      const differences = {
        delivered: calculateDiff(mainRow.delivered, comparisonRow.delivered),
        clicks: calculateDiff(mainRow.email_click_thru, comparisonRow.email_click_thru),
        entries: calculateDiff(mainRow.entries, comparisonRow.entries),
        leads: calculateDiff(mainRow.leads, comparisonRow.leads),
        conversion: calculateDiff(
          parseFloat(mainRow.conversion_rate), 
          parseFloat(comparisonRow.conversion_rate)
        )
      };

      const details = [
        `Delivered: ${differences.delivered}%`,
        `Clicks: ${differences.clicks}%`,
        `Entries: ${differences.entries}%`,
        `Leads: ${differences.leads}%`,
        `Conversion: ${differences.conversion}%`
      ].join(' | ');

      const avgDiff = Object.values(differences).reduce((a, b) => a + parseFloat(b), 0) / 5;

      return {
        status: avgDiff > 0 ? 'up' : avgDiff < 0 ? 'down' : 'neutral',
        details
      };
    },

    combineMetrics(mainData, comparisonData) {
      if (!mainData.length || !comparisonData.length) {
        // console.log('No data to compare');
        return [];
      }

      // console.log('Main data:', mainData);
      // console.log('Comparison data:', comparisonData);

      // Create a map of all unique periods
      const allPeriods = new Set([
        ...mainData.map(d => d.period),
        ...comparisonData.map(d => d.period)
      ]);

      return Array.from(allPeriods).map(period => {
        const mainRow = mainData.find(d => d.period === period);
        const compRow = comparisonData.find(d => d.period === period);

        // If we have data from both snapshots
        if (mainRow && compRow) {
          return {
            period,
            delivered: `${mainRow.delivered || 0} vs ${compRow.delivered || 0}`,
            email_click_thru: `${mainRow.email_click_thru || 0} vs ${compRow.email_click_thru || 0}`,
            click_thru_rate: `${mainRow.click_thru_rate || 0}% vs ${compRow.click_thru_rate || 0}%`,
            entries: `${mainRow.entries || 0} vs ${compRow.entries || 0}`,
            leads: `${mainRow.leads || 0} vs ${compRow.leads || 0}`,
            conversion_rate: `${mainRow.conversion_rate || 0}% vs ${compRow.conversion_rate || 0}%`,
            trend: this.compareSnapshots(mainRow, compRow)
          };
        }
        // If we only have data from the main snapshot
        else if (mainRow) {
          return {
            ...mainRow,
            trend: { status: 'neutral', details: 'No comparison data available' }
          };
        }
        // If we only have data from the comparison snapshot
        else if (compRow) {
          return {
            period,
            delivered: `- vs ${compRow.delivered || 0}`,
            email_click_thru: `- vs ${compRow.email_click_thru || 0}`,
            click_thru_rate: `- vs ${compRow.click_thru_rate || 0}%`,
            entries: `- vs ${compRow.entries || 0}`,
            leads: `- vs ${compRow.leads || 0}`,
            conversion_rate: `- vs ${compRow.conversion_rate || 0}%`,
            trend: { status: 'neutral', details: 'Data only available in comparison snapshot' }
          };
        }
        return null;
      }).filter(Boolean).sort((a, b) => {
        // Sort by period
        return new Date(b.period) - new Date(a.period);
      });
    },

    handleComparisonChange(selectedId) {
      if (selectedId) {
        const selectedSnapshot = this.snapshots.find(s => s.id === selectedId);
        if (selectedSnapshot) {
          this.comparisonSnapshot = selectedSnapshot;
        }
      } else {
        this.comparisonSnapshot = null;
      }
    }
  }
}
</script>

<template>
  <Layout>
    <PageHeader title="Campaign Snapshots" pageTitle="CRM" />

    <BRow>
      <!-- Snapshots List -->
      <BCol md="4" xl="3">
        <BCard>
          <BCardBody>
            <div class="d-flex align-items-center mb-4">
              <h5 class="card-title flex-grow-1 mb-0">Saved Snapshots</h5>
            </div>

            <BFormInput
              v-model.trim="searchQuery"
              placeholder="Search snapshots..."
              class="mb-3"
              size="sm"
              debounce="300"
              autocomplete="off"
              @input="val => searchQuery = val.trim()"
            >
              <template #prepend>
                <div class="input-group-text">
                  <i class="ri-search-line"></i>
                </div>
              </template>
            </BFormInput>

            <BListGroup>
              <BListGroupItem
                v-for="snapshot in filteredSnapshots"
                :key="snapshot.id"
                href="#"
                class="list-group-item-action"
                variant="light"
                :variant="getSnapshotVariant(snapshot)"
                :active="selectedSnapshot?.id === snapshot.id"
                @click="selectSnapshot(snapshot)"
              >
                <div class="d-flex w-100 justify-content-between">
                  <h6 class="mb-1">{{ snapshot.name }}</h6>
                  <BDropdown
                    variant="link"
                    no-caret
                    right
                    toggle-class="text-decoration-none p-0"
                    @click.stop
                  >
                    <template #button-content>
                      <i class="ri-more-2-fill"></i>
                    </template>
                    
                    <BDropdownItem @click="editSnapshot(snapshot)">
                      <i class="ri-edit-line me-2"></i> Edit
                    </BDropdownItem>
                    <BDropdownItem 
                      @click="confirmDelete(snapshot)" 
                      variant="danger"
                      :disabled="isDeleting"
                    >
                      <i class="ri-delete-bin-line me-2"></i>
                      {{ isDeleting ? 'Deleting...' : 'Delete' }}
                    </BDropdownItem>
                  </BDropdown>
                </div>
                <p class="mb-1">{{ snapshot.campaign_name }}</p>
                <small>
                  <span class="ms-2" v-if="snapshot.notes">
                    <i class="ri-information-line" v-b-tooltip :title="snapshot.notes"></i>
                  </span>
                  <small class="ms-2 text-muted">{{ formatDate(snapshot.created_at) }}</small>
                </small>
              </BListGroupItem>
            </BListGroup>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Snapshot Details -->
      <BCol md="8" xl="9">
        <BCard v-if="selectedSnapshot">
          <BCardBody>
            <div class="d-flex align-items-center mb-4">
              <h5 class="card-title flex-grow-1 mb-0">
                {{ selectedSnapshot.name }}
                <small class="text-muted ms-2">
                  Saved on {{ formatDate(selectedSnapshot.created_at) }}
                </small>
              </h5>
              <div class="flex-shrink-0 d-flex gap-2">
                <BButton
                  variant="outline-primary"
                  size="sm"
                  @click="showComparison = !showComparison"
                  :pressed="showComparison"
                >
                  <i class="ri-git-compare-line"></i> Compare
                </BButton>

                <BFormSelect
                  v-if="showComparison"
                  :model-value="comparisonSnapshot?.id"
                  :options="filteredSnapshots
                    .filter(s => s.id !== selectedSnapshot?.id)
                    .map(s => ({
                      value: s.id,
                      text: s.name
                    }))"
                  size="sm"
                  class="w-auto"
                  @change="handleComparisonChange"
                >
                  <template #first>
                    <option :value="null">Select snapshot to compare</option>
                  </template>
                </BFormSelect>

                <BButtonGroup size="sm">
                  <BButton
                    v-for="period in ['daily', 'weekly', 'monthly', 'yearly']"
                    :key="period"
                    :variant="selectedComparison === period ? 'primary' : 'outline-primary'"
                    @click="selectedComparison = period"
                  >
                    {{ period.charAt(0).toUpperCase() + period.slice(1) }}
                  </BButton>
                </BButtonGroup>
                
                <BButton 
                  variant="soft-primary" 
                  size="sm"
                  @click="exportData"
                >
                  <i class="ri-file-download-line align-bottom"></i> Export
                </BButton>
              </div>
            </div>

            <div class="d-flex align-items-center mb-3 text-muted">
              <small>
                Comparing: 
                <span class="fw-medium">
                  {{ getComparisonLabel(selectedComparison) }} (Note: For accurate trend analysis, data must be in descending date order)
                </span>
              </small>
            </div>

            <GridJs
              :data="showComparison ? combinedGridData : sortedGridData"
              :columns="[
                { 
                  name: getPeriodLabel(selectedComparison),
                  id: 'period'
                },
                { 
                  name: showComparison ? 'Delivered (A vs B)' : 'Delivered',
                  id: 'delivered'
                },
                {
                  name: showComparison ? 'Email Click-Thru (A vs B)' : 'Email Click-Thru',
                  id: 'email_click_thru'
                },
                {
                  name: showComparison ? 'Click-Thru Rate % (A vs B)' : 'Click-Thru Rate (%)',
                  id: 'click_thru_rate',
                  formatter: (cell) => `${cell}%`
                },
                { 
                  name: showComparison ? 'Entries (A vs B)' : 'Entries',
                  id: 'entries'
                },
                { 
                  name: showComparison ? 'Leads (A vs B)' : 'Leads',
                  id: 'leads'
                },
                { 
                  name: showComparison ? 'Conv. Rate % (A vs B)' : 'Conversion Rate (%)',
                  id: 'conversion_rate',
                  formatter: (cell) => `${cell}%`
                },
                { 
                  name: 'Trend',
                  id: 'trend',
                  formatter: (cell) => this.formatTrend(cell)
                }
              ]"
              :search="true"
              :sort="true"
              :pagination="true"
              @sort="handleSort"
            />

            <div class="mt-4">
              <h6 class="mb-3">Performance Trend</h6>
              <!-- Add your chart component here -->
            </div>
          </BCardBody>
        </BCard>

        <div v-else class="text-center mt-5">
          <i class="ri-file-list-3-line display-4 text-muted"></i>
          <p class="mt-2">Select a snapshot to view details</p>
        </div>
      </BCol>
    </BRow>

    <!-- Add this modal for editing -->
    <BModal
      v-model="showEditModal"
      title="Edit Snapshot"
      @hidden="resetEditForm"
      hide-footer
    >
      <BForm @submit.prevent="updateSnapshot">
        <BFormGroup
          label="Name"
          label-for="snapshot-name"
        >
          <BFormInput
            id="snapshot-name"
            v-model="form.name"
            required
          />
        </BFormGroup>

        <BFormGroup
          label="Notes"
          label-for="snapshot-notes"
        >
          <BFormTextarea
            id="snapshot-notes"
            v-model="form.notes"
            rows="3"
          />
        </BFormGroup>

        <div class="d-flex justify-content-end gap-2 pt-3">
          <BButton
            variant="secondary"
            @click="showEditModal = false"
            :disabled="form.processing"
          >
            Cancel
          </BButton>
          <BButton
            type="submit"
            variant="primary"
            :disabled="form.processing"
          >
            {{ form.processing ? 'Saving...' : 'Save Changes' }}
          </BButton>
        </div>
      </BForm>
    </BModal>

    <!-- Add this delete confirmation modal -->
    <BModal
      v-model="showDeleteModal"
      title="Confirm Delete"
      hide-footer
      centered
    >
      <div class="text-center mb-4">
        <i class="ri-error-warning-line text-danger display-4 mb-3"></i>
        <h5>Are you sure?</h5>
        <p class="text-muted">
          Do you really want to delete this snapshot? This process cannot be undone.
        </p>
      </div>
      
      <div class="d-flex justify-content-center gap-2">
        <BButton
          variant="secondary"
          @click="showDeleteModal = false"
          :disabled="isDeleting"
        >
          Cancel
        </BButton>
        <BButton
          variant="danger"
          @click="handleDelete(snapshotToDelete)"
          :disabled="isDeleting"
        >
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </BButton>
      </div>
    </BModal>
  </Layout>
</template>

<style scoped>
/* Replace the entire style block */
:deep(.dropdown-toggle::after),
:deep(.dropdown-toggle::before),
:deep(.btn::after),
:deep(.btn::before) {
  display: none !important;
  content: none !important;
  border: none !important;
}

.dropdown-toggle {
  color: inherit;
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.list-group-item-action:hover .dropdown-toggle {
  opacity: 1;
}

.dropdown-toggle {
  opacity: 0.7;
  transition: opacity 0.2s;
}

:deep(.btn.dropdown-toggle) {
  border: 0 !important;
  background: transparent !important;
}

:deep(.btn.dropdown-toggle:focus),
:deep(.btn.dropdown-toggle:active) {
  box-shadow: none !important;
  outline: none !important;
}
</style> 