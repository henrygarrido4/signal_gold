<script>
import getChartColorsArray from "@/common/getChartColorsArray";

export default {
  setup() {
    return {
      series: [{
        name: "Campaign Revenue",
        data: [12000, 15000, 18000, 22000, 25000, 28000, 32000, 38000, 45000, 52000, 58000, 65000],
      },
      {
        name: "Campaign Cost",
        data: [8000, 9500, 11000, 13500, 15000, 16500, 18000, 21000, 24000, 27000, 30000, 33000],
      }],
      chartOptions: {
        chart: {
          height: 290,
          type: "area",
          toolbar: "false",
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: 2,
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return "$" + value;
            },
          },
          title: {
            text: "Campaign Performance (USD)",
          }
        },
        colors: getChartColorsArray('["--vz-success", "--vz-danger"]'),
        fill: {
          opacity: 0.06,
          colors: ["#0AB39C", "#F06548"],
          type: "solid",
        },
      },
    };
  },
};
</script>

<template>
  <BCard no-body class="card-height-100">
    <BCardHeader class="align-items-center d-flex py-0">
      <BCardTitle class="mb-0 flex-grow-1">Balance Overview</BCardTitle>
      <div class="flex-shrink-0">
        <BDropdown variant="link" class="card-header-dropdown" toggle-class="text-reset dropdown-btn arrow-none"
          menu-class="dropdown-menu-end" aria-haspopup="true" :offset="{ alignmentAxis: -3, crossAxis: 0, mainAxis: 0 }">
          <template #button-content> <span class="fw-semibold text-uppercase fs-12">Sort by: </span><span
              class="text-muted">Current Year<i class="mdi mdi-chevron-down ms-1"></i></span>
          </template>
          <BDropdownItem>Today</BDropdownItem>
          <BDropdownItem>Last Week</BDropdownItem>
          <BDropdownItem>Last Month</BDropdownItem>
          <BDropdownItem>Current Year</BDropdownItem>
        </BDropdown>
      </div>
    </BCardHeader>
    <BCardBody class="px-0">
      <ul class="list-inline main-chart text-center mb-0">
        <li class="list-inline-item chart-border-left me-0 border-0">
          <h5 class="text-primary">
            $584k
            <span class="text-muted d-inline-block fs-13 align-middle ms-2">Revenue</span>
          </h5>
        </li>
        <li class="list-inline-item chart-border-left me-0">
          <h5>
            $497k<span class="text-muted d-inline-block fs-13 align-middle ms-2">Expenses</span>
          </h5>
        </li>
        <li class="list-inline-item chart-border-left me-0">
          <h5>
            <span data-plugin="counterup">3.6</span>%<span
              class="text-muted d-inline-block fs-13 align-middle ms-2">Profit Ratio</span>
          </h5>
        </li>
      </ul>

      <apexchart class="apex-charts" height="290" dir="ltr" :series="series" :options="chartOptions"></apexchart>
    </BCardBody>
  </BCard>
</template>