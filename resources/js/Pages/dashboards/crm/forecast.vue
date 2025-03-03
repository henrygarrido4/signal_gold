<script>
import getChartColorsArray from "@/common/getChartColorsArray";

export default {
  setup() {
    return {
      series: [{
        name: "Sent Emails",
        data: [5000, 6200, 4800, 7100, 5900, 8000],
      },
      {
        name: "Opened",
        data: [3200, 4100, 3000, 4800, 3900, 5600],
      },
      {
        name: "Clicked",
        data: [1800, 2300, 1600, 2900, 2200, 3100],
      },
      {
        name: "Converted",
        data: [450, 580, 400, 720, 550, 780],
      }],
      chartOptions: {
        chart: {
          type: "bar",
          height: 341,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "65%",
          },
        },
        stroke: {
          show: true,
          width: 5,
          colors: ["transparent"],
        },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          axisTicks: {
            show: false,
            borderType: "solid",
            color: "#78909C",
            height: 6,
            offsetX: 0,
            offsetY: 0,
          },
          title: {
            text: "Email Campaign Performance (Last 6 Months)",
            offsetX: 0,
            offsetY: -30,
            style: {
              color: "#78909C",
              fontSize: "12px",
              fontWeight: 400,
            },
          },
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return value;
            },
          },
          tickAmount: 4,
          min: 0,
        },
        fill: {
          opacity: 1,
        },
        legend: {
          show: true,
          position: "bottom",
          horizontalAlign: "center",
          fontWeight: 500,
          offsetX: 0,
          offsetY: -14,
          itemMargin: {
            horizontal: 8,
            vertical: 0,
          },
          markers: {
            width: 10,
            height: 10,
          },
        },
        colors: getChartColorsArray('["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger"]'),
      }
    };
  },
};
</script>

<template>
  <BCard no-body>
    <BCardHeader class="align-items-center d-flex py-0">
      <BCardTitle class="mb-0 flex-grow-1">Email Campaign Analytics</BCardTitle>
      <div class="flex-shrink-0">
        <div class="dropdown card-header-dropdown">
          <BDropdown variant="link" class="card-header-dropdown" toggle-class="text-reset dropdown-btn arrow-none"
            menu-class="dropdown-menu-end" aria-haspopup="true"
            :offset="{ alignmentAxis: -30, crossAxis: 0, mainAxis: 0 }">
            <template #button-content>
              <span class="fw-semibold text-uppercase fs-12">Campaign: </span>
              <span class="text-muted">Q1 Newsletter<i class="mdi mdi-chevron-down ms-1"></i></span>
            </template>
            <BDropdownItem>Q4 2023 Newsletter</BDropdownItem>
            <BDropdownItem>Product Launch</BDropdownItem>
            <BDropdownItem>Holiday Special</BDropdownItem>
            <BDropdownItem>Welcome Series</BDropdownItem>
          </BDropdown>
        </div>
      </div>
    </BCardHeader>

    <BCardBody class="pb-0">
      <apexchart class="apex-charts" height="341" dir="ltr" :series="series" :options="chartOptions"></apexchart>
    </BCardBody>
  </BCard>
</template>