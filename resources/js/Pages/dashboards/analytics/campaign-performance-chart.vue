<script>
export default {
  props: {
    campaignAMetrics: {
      type: Object,
      default: () => null
    },
    campaignBMetrics: {
      type: Object,
      default: () => null
    },
    selectedCampaigns: {
      type: Array,
      required: true
    }
  },
  computed: {
    isDateRangeValid() {
      if (!this.campaignAMetrics?.dailyMetrics && !this.campaignBMetrics?.dailyMetrics) return false;
      
      // Get all dates from both campaigns
      const allDates = Object.entries(this.campaignAMetrics?.dailyMetrics || {})
        .concat(Object.entries(this.campaignBMetrics?.dailyMetrics || {}))
        .map(([_, data]) => {
          const [month, day] = [data.monthDate, data.dayDate];
          return new Date(2024, month - 1, day);
        })
        .sort((a, b) => a - b);
      
      if (!allDates.length) return false;
      
      // Calculate months difference
      const monthsDiff = 
        (allDates[allDates.length - 1].getMonth() - allDates[0].getMonth() + 
        (allDates[allDates.length - 1].getFullYear() - allDates[0].getFullYear()) * 12);
      
      return monthsDiff <= 2;
    },
    chartData() {
      // Group metrics by date for each campaign
      const campaignADaily = this.groupMetricsByDate(this.campaignAMetrics);
      const campaignBDaily = this.groupMetricsByDate(this.campaignBMetrics);

      // Get all unique dates from both campaigns
      const allDates = [...new Set([
        ...Object.keys(campaignADaily),
        ...Object.keys(campaignBDaily)
      ])].sort();

      // Ensure we have valid numbers for our data points
      const getMetricValue = (metrics, date, metric) => {
        const value = Number(metrics[date]?.[metric] || 0);
        return metric === 'leads' ? Math.round(value) : value;
      };

      return {
        series: [
          {
            name: `${this.selectedCampaigns[0] || 'Campaign A'} - Entries`,
            data: allDates.map(date => getMetricValue(campaignADaily, date, 'entries')),
            type: 'bar',
          },
          {
            name: `${this.selectedCampaigns[0] || 'Campaign A'} - Delivered`,
            data: allDates.map(date => getMetricValue(campaignADaily, date, 'delivered')),
            type: 'bar',
          },
          {
            name: `${this.selectedCampaigns[0] || 'Campaign A'} - Leads`,
            data: allDates.map(date => getMetricValue(campaignADaily, date, 'leads')),
            type: 'bar',
          },
          {
            name: `${this.selectedCampaigns[1] || 'Campaign B'} - Entries`,
            data: allDates.map(date => getMetricValue(campaignBDaily, date, 'entries')),
            type: 'bar',
          },
          {
            name: `${this.selectedCampaigns[1] || 'Campaign B'} - Delivered`,
            data: allDates.map(date => getMetricValue(campaignBDaily, date, 'delivered')),
            type: 'bar',
          },
          {
            name: `${this.selectedCampaigns[1] || 'Campaign B'} - Leads`,
            data: allDates.map(date => getMetricValue(campaignBDaily, date, 'leads')),
            type: 'bar',
          }
        ],
        chartOptions: {
          chart: {
            type: 'line',
            height: 350,
            zoom: {
              enabled: true,
              type: 'x',
              autoScaleYaxis: true
            },
            toolbar: {
              show: true,
              tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: false,
                reset: true
              },
              autoSelected: 'zoom'
            }
          },
          colors: [
            '#0ea5e9', // Campaign A - Delivered (blue)
            '#22c55e', // Campaign A - Entries (green)
            '#8b5cf6', // Campaign A - Leads (purple)
            '#eab308', // Campaign B - Delivered (yellow)
            '#ef4444', // Campaign B - Entries (red)
            '#f97316'  // Campaign B - Leads (orange)
          ],
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: 0
          },
          markers: {
            size: 0,
            strokeWidth: 2,
            hover: {
              size: 4
            }
          },
          xaxis: {
            categories: allDates,
            title: {
              text: 'Date'
            },
            type: 'datetime',
            labels: {
              formatter: function(value) {
                const date = new Date(value);
                return date.toLocaleString('default', { 
                  month: 'short',
                  day: 'numeric'
                });
              },
              style: {
                fontSize: '12px'
              }
            }
          },
          yaxis: {
            title: {
              text: 'Count'
            },
            labels: {
              formatter: (value) => value ? value.toLocaleString() : '0'
            }
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left',
            formatter: function(seriesName, opts) {
              // Split series name to get campaign and metric
              const [campaign, metric] = seriesName.split(' - ');
              return `<div class="legend-entry">${metric}</div>`;
            },
            customLegendItems: [],
            onItemClick: {
              toggleDataSeries: true
            },
            onItemHover: {
              highlightDataSeries: true
            }
          },
          tooltip: {
            x: {
              format: 'dd MMM'
            }
          },
          fill: {
            opacity: 1
          },
          plotOptions: {
            bar: {
              columnWidth: '30%',
              barHeight: '70%'
            }
          }
        }
      };
    }
  },
  methods: {
    toggleSeries(index) {
      this.chartData.series[index].show = !this.chartData.series[index].show;
      // Force chart update
      this.$refs.chart?.updateSeries(this.chartData.series);
    },
    groupMetricsByDate(metrics) {
      if (!metrics?.dailyMetrics) return {};
      
      // Debug log to see what data we're getting
      // console.log('Daily Metrics Data:', metrics.dailyMetrics);
      
      // Create a map of date to metrics
      const dailyMetrics = {};
      
      // Process daily metrics
      Object.entries(metrics.dailyMetrics).forEach(([dateKey, data]) => {
        // Debug log for each date entry
        // console.log('Processing date entry:', { dateKey, data });
        
        const [month, day] = [data.monthDate, data.dayDate];
        if (month && day) {
          // For now, use the date string as is if it contains a year
          // or construct it with the current year
          let formattedDate;
          if (dateKey.includes('-')) {
            // If dateKey is already a full date string (YYYY-MM-DD)
            formattedDate = dateKey;
          } else {
            // If we only have month and day, use current year
            const year = new Date().getFullYear();
            const date = new Date(year, month - 1, day);
            formattedDate = date.toISOString().split('T')[0];
          }
          
          // console.log('Formatted date:', formattedDate);
          
          dailyMetrics[formattedDate] = {
            delivered: data.metrics?.totalDelivered || 0,
            entries: data.metrics?.entries || 0,
            leads: data.metrics?.totalLeads || 0
          };
        }
      });
      
      // Debug log final processed metrics
      // console.log('Processed Daily Metrics:', dailyMetrics);
      
      return dailyMetrics;
    }
  }
};
</script>

<template>
  <BCard no-body>
    <BCardHeader>
      <BCardTitle class="mb-0">Campaign Performance</BCardTitle>
    </BCardHeader>
    <BCardBody>
      <template v-if="isDateRangeValid">
        <div class="d-flex justify-content-between mb-3">
          <!-- Campaign A Legend -->
          <div class="legend-column">
            <h6 class="mb-2">{{ selectedCampaigns[0] || 'Campaign A' }}</h6>
            <div class="custom-legend">
              <div 
                v-for="(series, index) in chartData.series.slice(0, 3)" 
                :key="index"
                class="legend-item"
                :class="{ 'active': series.show }"
                @click="toggleSeries(index)"
              >
                <span class="legend-marker" :style="{ backgroundColor: chartData.chartOptions.colors[index] }"></span>
                <span class="legend-text">{{ series.name.split(' - ')[1] }}</span>
              </div>
            </div>
          </div>
          
          <!-- Campaign B Legend -->
          <div class="legend-column">
            <h6 class="mb-2">{{ selectedCampaigns[1] || 'Campaign B' }}</h6>
            <div class="custom-legend">
              <div 
                v-for="(series, index) in chartData.series.slice(3, 6)" 
                :key="index + 3"
                class="legend-item"
                :class="{ 'active': series.show }"
                @click="toggleSeries(index + 3)"
              >
                <span class="legend-marker" :style="{ backgroundColor: chartData.chartOptions.colors[index + 3] }"></span>
                <span class="legend-text">{{ series.name.split(' - ')[1] }}</span>
              </div>
            </div>
          </div>
        </div>
        <apexchart
          class="apex-charts"
          height="350"
          dir="ltr"
          :series="chartData.series"
          :options="chartData.chartOptions"
        />
      </template>
      <template v-else>
        <div class="text-center py-4">
          <p class="text-muted mb-0">
            Daily performance chart is only available for date ranges of 2 months or less.
          </p>
        </div>
      </template>
    </BCardBody>
  </BCard>
</template>

<style scoped>
.legend-column {
  min-width: 150px;
}

.custom-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.legend-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.legend-item.active {
  font-weight: 500;
}

.legend-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.legend-text {
  font-size: 0.875rem;
}
</style> 