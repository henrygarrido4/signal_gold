<script>
import { ref, markRaw, watch } from 'vue';
import getChartColorsArray from "@/common/getChartColorsArray";

/**
 * Column Charts component
 */
export default {
  name: 'CrmChart',
  props: {
    metrics: {
      type: Object,
      default: () => ({
        dailyMetrics: {}
      })
    },
    selectedPeriod: {
      type: Object,
      default: () => ({
        startDate: null,
        endDate: null
      })
    }
  },
  setup(props) {
    const series = ref([]);
    
    const chartOptions = ref({
      chart: {
        height: 374,
        type: "line",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          },
          autoSelected: 'zoom'
        },
        zoom: {
          enabled: true,
          type: 'x',
          autoScaleYaxis: true,
          zoomedArea: {
            fill: {
              color: '#90CAF9',
              opacity: 0.4
            },
            stroke: {
              color: '#0D47A1',
              opacity: 0.4,
              width: 1
            }
          }
        }
      },
      stroke: {
        curve: "smooth",
        dashArray: [0, 3, 0],
        width: [0, 1, 0],
      },
      fill: {
        opacity: [1, 0.1, 1],
      },
      markers: {
        size: [0, 4, 0],
        strokeWidth: 2,
        hover: {
          size: 4,
        },
      },
      grid: {
        show: true,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } },
        padding: {
          top: 0,
          right: -2,
          bottom: 15,
          left: 10,
        },
      },
      legend: {
        show: true,
        horizontalAlign: "center",
        offsetX: 0,
        offsetY: -5,
        markers: {
          width: 9,
          height: 9,
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "30%",
          barHeight: "70%",
        },
      },
      colors: getChartColorsArray('["--vz-primary", "--vz-secondary", "--vz-danger"]'),
      tooltip: {
        shared: true,
        y: [{
          formatter: (y) => y?.toFixed(0) ?? y,
        },
        {
          formatter: (y) => y?.toFixed(0) ?? y,
        },
        {
          formatter: (y) => y?.toFixed(0) ?? y,
        }],
      },
    });

    // Watch for changes in metrics and update chart data
    watch(() => [props.metrics.dailyMetrics, props.selectedPeriod], ([newDailyMetrics]) => {
      if (!newDailyMetrics) return;

      // Get the year from selected period
      const periodYear = props.selectedPeriod?.startDate ? 
        new Date(props.selectedPeriod.startDate).getFullYear() : 
        new Date().getFullYear();

      // Process and sort the daily metrics
      const sortedData = Object.entries(newDailyMetrics)
        .map(([, data]) => ({
          date: new Date(periodYear, data.monthDate - 1, data.dayDate),
          metrics: data.metrics
        }))
        .sort((a, b) => a.date - b.date);

      // Check if data spans more than one month
      const firstDate = sortedData[0]?.date;
      const lastDate = sortedData[sortedData.length - 1]?.date;
      
      // Debug logs
      // console.log('First date:', firstDate);
      // console.log('Last date:', lastDate);
      
      // Calculate total days difference
      const daysDiff = lastDate ? Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)) : 0;
      
      // console.log('Days difference:', daysDiff);
      // console.log('Number of data points:', sortedData.length);

      let dates = [];
      let entries = [];
      let delivered = [];
      let leads = [];
      let isMonthlyView = false;

      if (daysDiff > 60 && sortedData.length > 60) {
        isMonthlyView = true;
        // Monthly grouping logic...
        const monthlyData = sortedData.reduce((acc, { date, metrics }) => {
          // Create sort key for proper ordering
          const sortKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
          
          // Create month names array for proper month display
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const monthKey = monthNames[date.getMonth()];
          
          if (!acc[sortKey]) {
            acc[sortKey] = {
              displayKey: monthKey,
              entries: 0,
              delivered: 0,
              leads: 0,
              count: 0,
              month: date.getMonth(),
              year: date.getFullYear()
            };
          }
          acc[sortKey].entries += metrics.entries || 0;
          acc[sortKey].delivered += metrics.totalDelivered || 0;
          acc[sortKey].leads += metrics.totalLeads || 0;
          acc[sortKey].count++;
          return acc;
        }, {});

        const sortedMonths = Object.entries(monthlyData)
          .sort(([keyA, keyB]) => keyA.localeCompare(keyB)); // Sort by the sortKey

        dates = sortedMonths.map(([, data]) => data.displayKey);
        entries = sortedMonths.map(([, data]) => Math.round(data.entries));
        delivered = sortedMonths.map(([, data]) => Math.round(data.delivered));
        leads = sortedMonths.map(([, data]) => Math.round(data.leads));
      } else {
        // Daily data
        dates = sortedData.map(d => {
          // Get month number (1-12) and day
          const monthNum = d.date.getMonth() + 1;
          const day = d.date.getDate();
          return `${monthNum}/${day}`; // Format as "M/D" (e.g., "2/1")
        });
        entries = sortedData.map(d => d.metrics.entries || 0);
        delivered = sortedData.map(d => d.metrics.totalDelivered || 0);
        leads = sortedData.map(d => Math.round(d.metrics.totalLeads || 0));
      }

      // Update the options
      chartOptions.value = {
        ...chartOptions.value,
        chart: {
          ...chartOptions.value.chart,
          id: 'campaign-performance-chart'
        },
        xaxis: {
          categories: dates,
          axisTicks: { show: false },
          axisBorder: { show: false },
          labels: {
            formatter: function(value) {
              if (!value) return '';
              return value;
            },
            style: {
              fontSize: '12px'
            },
            rotate: 0
          },
          tickPlacement: 'on'
        }
      };

      // Update both series and options
      series.value = [
        {
          name: "Entries",
          type: "bar",
          data: entries
        },
        {
          name: "Delivered",
          type: "area",
          data: delivered
        },
        {
          name: "Leads",
          type: "bar",
          data: leads
        }
      ];

      // Debug logs
      // console.log('View type:', isMonthlyView ? 'Monthly' : 'Daily');
      // console.log('Dates:', dates);
      // console.log('Chart updated with new options');
    }, { immediate: true });

    return {
      series,
      chartOptions,
    };
  },
};
</script>

<template>
  <BCard no-body>
    <BCardHeader class="border-0 align-items-center d-flex">
      <BCardTitle class="mb-0 flex-grow-1">Campaign Performance</BCardTitle>
    </BCardHeader>
    <BCardBody class="p-0 pb-2">
      <div>
        <apexchart
          :key="chartOptions?.xaxis?.categories ? JSON.stringify(chartOptions.xaxis.categories) : 'chart'"
          class="apex-charts"
          height="374"
          dir="ltr"
          :series="series"
          :options="chartOptions"
        />
      </div>
    </BCardBody>
  </BCard>
</template>
