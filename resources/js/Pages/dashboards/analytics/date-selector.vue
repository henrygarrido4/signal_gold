<template>
  <div class="date-selector">
    <!-- Period Type Tabs -->
    <BTabs v-model="activeTab" pills class="mb-3">
      <BTab title="Years" active>
        <div class="period-options">
          <BFormRadioGroup v-model="selectedPeriod" class="radio-grid">
            <!-- Left column - regular options -->
            <div class="left-column">
              <BFormRadio value="prev-year">Previous Year</BFormRadio>
              <BFormRadio value="this-year">This Year</BFormRadio>
              <BFormRadio value="next-year">Next Year</BFormRadio>
            </div>
            
            <!-- Right column - special options and inputs -->
            <div class="right-column">
              <BFormRadio value="ytd">Year to Date</BFormRadio>
              <BFormRadio value="last-n-years">
                <div class="d-flex align-items-center"
                  @click.stop
                  @keydown.stop
                  @mousedown.stop
                >
                  <span>Last</span>
                  <BFormInput 
                    v-model.number="customPeriods.lastYears"
                    type="number"
                    class="number-input"
                    :min="1"
                    :max="99"
                    step="1"
                    @change="updatePeriod('lastYears')"
                  />
                  <span>Years</span>
                </div>
              </BFormRadio>
              <BFormRadio value="next-n-years">
                <div class="d-flex align-items-center"
                  @click.stop
                  @keydown.stop
                  @mousedown.stop
                >
                  <span>Next</span>
                  <BFormInput 
                    v-model.number="customPeriods.nextYears"
                    type="number"
                    class="mx-2 number-input"
                    :min="1"
                    :max="99"
                    step="1"
                    @click.stop="$event.target.select()"
                    @change="updatePeriod('nextYears')"
                  />
                  <span>Years</span>
                </div>
              </BFormRadio>
            </div>
          </BFormRadioGroup>
        </div>
      </BTab>

      <BTab title="Quarters">
        <div class="period-options">
          <BFormRadioGroup v-model="selectedPeriod" class="radio-grid">
            <!-- Left column - regular options -->
            <div class="left-column">
              <BFormRadio value="prev-quarter">Previous Quarter</BFormRadio>
              <BFormRadio value="this-quarter">This Quarter</BFormRadio>
              <BFormRadio value="next-quarter">Next Quarter</BFormRadio>
            </div>
            
            <!-- Right column - special options and inputs -->
            <div class="right-column">
              <BFormRadio value="qtd">Quarter to Date</BFormRadio>
              <BFormRadio value="last-n-quarters">
                <div class="d-flex align-items-center"
                  @click.stop
                  @keydown.stop
                  @mousedown.stop
                >
                  <span>Last</span>
                  <BFormInput 
                    v-model.number="customPeriods.lastQuarters"
                    type="number"
                    class="mx-2 number-input"
                    :min="1"
                    :max="99"
                    step="1"
                    @click.stop="$event.target.select()"
                    @change="updatePeriod('lastQuarters')"
                  />
                  <span>Quarters</span>
                </div>
              </BFormRadio>
              <BFormRadio value="next-n-quarters">
                <div class="d-flex align-items-center"
                  @click.stop
                  @keydown.stop
                  @mousedown.stop
                >
                  <span>Next</span>
                  <BFormInput 
                    v-model.number="customPeriods.nextQuarters"
                    type="number"
                    class="mx-2 number-input"
                    :min="1"
                    :max="99"
                    step="1"
                    @click.stop="$event.target.select()"
                    @change="updatePeriod('nextQuarters')"
                  />
                  <span>Quarters</span>
                </div>
              </BFormRadio>
            </div>
          </BFormRadioGroup>
        </div>
      </BTab>

      <BTab title="Months">
        <div class="period-options">
          <BFormRadioGroup
            v-model="selectedPeriod"
            class="radio-grid"
          >
            <div class="left-column">
              <BFormRadio value="prev-month">Previous Month</BFormRadio>
              <BFormRadio value="this-month">This Month</BFormRadio>
              <BFormRadio value="next-month">Next Month</BFormRadio>
            </div>
            
            <div class="right-column">
              <BFormRadio value="mtd">Month to Date</BFormRadio>
              <BFormRadio value="last-n-months">
                <div class="d-flex align-items-center"
                  @click.stop
                  @keydown.stop
                  @mousedown.stop
                >
                  <span>Last</span>
                  <BFormInput 
                    v-model.number="customPeriods.lastMonths"
                    type="number"
                    class="mx-2 number-input"
                    :min="1"
                    :max="99"
                    step="1"
                    @click.stop="$event.target.select()"
                    @change="updatePeriod('lastMonths')"
                  />
                  <span>Months</span>
                </div>
              </BFormRadio>
              <BFormRadio value="next-n-months">
                <div class="d-flex align-items-center"
                  @click.stop
                  @keydown.stop
                  @mousedown.stop
                >
                  <span>Next</span>
                  <BFormInput 
                    v-model.number="customPeriods.nextMonths"
                    type="number"
                    class="mx-2 number-input"
                    :min="1"
                    :max="99"
                    step="1"
                    @click.stop="$event.target.select()"
                    @change="updatePeriod('nextMonths')"
                  />
                  <span>Months</span>
                </div>
              </BFormRadio>
            </div>
          </BFormRadioGroup>
        </div>
      </BTab>

      <BTab title="Weeks">
        <div class="period-options">
          <BFormRadioGroup
            v-model="selectedPeriod"
            class="radio-grid"
          >
            <div class="left-column">
              <BFormRadio value="prev-week">Previous Week</BFormRadio>
              <BFormRadio value="this-week">This Week</BFormRadio>
              <BFormRadio value="next-week">Next Week</BFormRadio>
            </div>
            
            <div class="right-column">
              <BFormRadio value="wtd">Week to Date</BFormRadio>
              <BFormRadio value="last-n-weeks">
                <div class="d-flex align-items-center"
                  @click.stop
                  @keydown.stop
                  @mousedown.stop
                >
                  <span>Last</span>
                  <BFormInput 
                    v-model.number="customPeriods.lastWeeks"
                    type="number"
                    class="mx-2 number-input"
                    :min="1"
                    :max="99"
                    step="1"
                    @click.stop="$event.target.select()"
                    @change="updatePeriod('lastWeeks')"
                  />
                  <span>Weeks</span>
                </div>
              </BFormRadio>
              <BFormRadio value="next-n-weeks">
                <div class="d-flex align-items-center"
                  @click.stop
                  @keydown.stop
                  @mousedown.stop
                >
                  <span>Next</span>
                  <BFormInput 
                    v-model.number="customPeriods.nextWeeks"
                    type="number"
                    class="mx-2 number-input"
                    :min="1"
                    :max="99"
                    step="1"
                    @click.stop="$event.target.select()"
                    @change="updatePeriod('nextWeeks')"
                  />
                  <span>Weeks</span>
                </div>
              </BFormRadio>
            </div>
          </BFormRadioGroup>
        </div>
      </BTab>

      <BTab title="Days">
        <div class="period-options">
          <BFormRadioGroup
            v-model="selectedPeriod"
            class="radio-grid"
          >
            <div class="left-column">
              <BFormRadio value="prev-day">Previous Day</BFormRadio>
              <BFormRadio value="today">Today</BFormRadio>
              <BFormRadio value="next-day">Next Day</BFormRadio>
            </div>
            
            <div class="right-column">
              <BFormRadio value="last-n-days">
                <div class="d-flex align-items-center"
                  @click.stop
                  @keydown.stop
                  @mousedown.stop
                >
                  <span>Last</span>
                  <BFormInput 
                    v-model.number="customPeriods.lastDays"
                    type="number"
                    class="mx-2 number-input"
                    :min="1"
                    :max="99"
                    step="1"
                    @click.stop="$event.target.select()"
                    @change="updatePeriod('lastDays')"
                  />
                  <span>Days</span>
                </div>
              </BFormRadio>
              <BFormRadio value="next-n-days">
                <div class="d-flex align-items-center"
                  @click.stop
                  @keydown.stop
                  @mousedown.stop
                >
                  <span>Next</span>
                  <BFormInput 
                    v-model.number="customPeriods.nextDays"
                    type="number"
                    class="mx-2 number-input"
                    :min="1"
                    :max="99"
                    step="1"
                    @click.stop="$event.target.select()"
                    @change="updatePeriod('nextDays')"
                  />
                  <span>Days</span>
                </div>
              </BFormRadio>
            </div>
          </BFormRadioGroup>
        </div>
      </BTab>
    </BTabs>

    <!-- Selected Period Display -->
    <div class="selected-period mt-3 p-2 border rounded">
      <small class="text-muted">Selected Period:</small>
      <div>{{ formattedSelectedPeriod }}</div>
      <div v-if="selectedPeriod" class="text-muted small">
        {{ formatDateRange }}
      </div>
    </div>

    <!-- Custom Date Range -->
    <div v-if="showDatePicker" class="date-range-picker flex-grow-1">
      <flat-pickr
        v-model="dateRange"
        :config="dateConfig"
        class="form-control form-control-sm"
        placeholder="Select date range"
      />
    </div>

    <!-- Period Selection -->
    <!-- <div class="d-flex flex-wrap align-items-center gap-2">
      <BButtonGroup size="sm">
        <BButton
          v-for="period in periodOptions"
          :key="period.value"
          :variant="selectedPeriod === period.value ? 'primary' : 'outline-primary'"
          @click="selectPeriod(period.value)"
        >
          {{ period.text }}
        </BButton>
      </BButtonGroup>
    </div> -->
  </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import "flatpickr/dist/flatpickr.css";

export default {
  components: {
    'flat-pickr': flatPickr
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeTab: 0,
      selectedPeriod: null,
      customPeriods: {
        lastYears: 3,
        nextYears: 3,
        lastQuarters: 3,
        nextQuarters: 3,
        lastMonths: 3,
        nextMonths: 3,
        lastWeeks: 3,
        nextWeeks: 3,
        lastDays: 3,
        nextDays: 3
      },
      startDate: '',
      endDate: '',
      showDatePicker: false,
      dateRange: [],
      dateConfig: {
        mode: 'range',
        dateFormat: 'Y-m-d',
        onChange: (selectedDates) => {
          if (selectedDates.length === 2) {
            this.$emit('period-selected', {
              start: selectedDates[0],
              end: selectedDates[1]
            });
          }
        },
        disable: this.disabled
      },
      periodOptions: [
        { value: 'mtd', text: 'Month to Date' },
        { value: 'ytd', text: 'Year to Date' }
      ],
    }
  },
  computed: {
    formattedSelectedPeriod() {
      if (!this.selectedPeriod) return 'No period selected';
      
      const now = new Date();
      const periods = {
        // Years
        'prev-year': `Previous Year (${now.getFullYear() - 1})`,
        'this-year': `This Year (${now.getFullYear()})`,
        'next-year': `Next Year (${now.getFullYear() + 1})`,
        'last-n-years': `Last ${this.customPeriods.lastYears} Years`,
        'next-n-years': `Next ${this.customPeriods.nextYears} Years`,
        'ytd': 'Year to Date',
        
        // Quarters
        'prev-quarter': `Previous Quarter (Q${this.getPreviousQuarter()})`,
        'this-quarter': `This Quarter (Q${this.getCurrentQuarter()})`,
        'next-quarter': `Next Quarter (Q${this.getNextQuarter()})`,
        'last-n-quarters': `Last ${this.customPeriods.lastQuarters} Quarters`,
        'next-n-quarters': `Next ${this.customPeriods.nextQuarters} Quarters`,
        'qtd': 'Quarter to Date',
        
        // Months
        'prev-month': `Previous Month (${this.formatMonth(now, -1)})`,
        'this-month': `This Month (${this.formatMonth(now, 0)})`,
        'next-month': `Next Month (${this.formatMonth(now, 1)})`,
        'last-n-months': `Last ${this.customPeriods.lastMonths} Months`,
        'next-n-months': `Next ${this.customPeriods.nextMonths} Months`,
        'mtd': 'Month to Date',
        
        // Weeks
        'prev-week': 'Previous Week',
        'this-week': 'This Week',
        'next-week': 'Next Week',
        'last-n-weeks': `Last ${this.customPeriods.lastWeeks} Weeks`,
        'next-n-weeks': `Next ${this.customPeriods.nextWeeks} Weeks`,
        'wtd': 'Week to Date',
        
        // Days
        'prev-day': 'Yesterday',
        'today': 'Today',
        'next-day': 'Tomorrow',
        'last-n-days': `Last ${this.customPeriods.lastDays} Days`,
        'next-n-days': `Next ${this.customPeriods.nextDays} Days`
      };

      return periods[this.selectedPeriod] || this.selectedPeriod;
    },
    formatDateRange() {
      if (!this.selectedPeriod) return '';
      
      const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('default', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      };

      let start, end;
      const now = new Date();
      
      // Reuse the same logic from calculateDateRange but just for display
      switch (this.selectedPeriod) {
        case 'prev-year':
          start = new Date(now.getFullYear() - 1, 0, 1);
          end = new Date(now.getFullYear() - 1, 11, 31);
          break;
        case 'this-year':
          start = new Date(now.getFullYear(), 0, 1);
          end = new Date(now.getFullYear(), 11, 31);
          break;
        case 'next-year':
          start = new Date(now.getFullYear() + 1, 0, 1);
          end = new Date(now.getFullYear() + 1, 11, 31);
          break;
        case 'last-n-years':
          end = new Date(now.getFullYear(), 11, 31);
          start = new Date(now.getFullYear() - (this.customPeriods.lastYears - 1), 0, 1);
          break;
        case 'next-n-years':
          start = new Date(now.getFullYear() + 1, 0, 1);
          end = new Date(now.getFullYear() + this.customPeriods.nextYears, 11, 31);
          break;
        case 'ytd':
          start = new Date(now.getFullYear(), 0, 1);
          end = now;
          break;

        case 'prev-quarter':
          start = this.getQuarterStart(-1);
          end = this.getQuarterEnd(-1);
          break;
        case 'this-quarter':
          start = this.getQuarterStart(0);
          end = this.getQuarterEnd(0);
          break;
        case 'next-quarter':
          start = this.getQuarterStart(1);
          end = this.getQuarterEnd(1);
          break;
        case 'last-n-quarters':
          end = this.getQuarterEnd(0);
          start = this.getQuarterStart(-(this.customPeriods.lastQuarters - 1));
          break;
        case 'next-n-quarters':
          start = this.getQuarterStart(1);
          end = this.getQuarterEnd(this.customPeriods.nextQuarters);
          break;
        case 'qtd':
          start = this.getQuarterStart(0);
          end = now;
          break;

        case 'prev-month':
          start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          end = new Date(now.getFullYear(), now.getMonth(), 0);
          break;
        case 'this-month':
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'next-month':
          start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
          break;
        case 'last-n-months':
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          start = new Date(now.getFullYear(), now.getMonth() - (this.customPeriods.lastMonths - 1), 1);
          break;
        case 'next-n-months':
          start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          end = new Date(now.getFullYear(), now.getMonth() + this.customPeriods.nextMonths + 1, 0);
          break;
        case 'mtd':
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = now;
          break;

        case 'prev-week':
          start = this.getWeekStart(-1);
          end = this.getWeekEnd(-1);
          break;
        case 'this-week':
          start = this.getWeekStart(0);
          end = this.getWeekEnd(0);
          break;
        case 'next-week':
          start = this.getWeekStart(1);
          end = this.getWeekEnd(1);
          break;
        case 'last-n-weeks':
          end = this.getWeekEnd(0);
          start = this.getWeekStart(-(this.customPeriods.lastWeeks - 1));
          break;
        case 'next-n-weeks':
          start = this.getWeekStart(1);
          end = this.getWeekEnd(this.customPeriods.nextWeeks);
          break;
        case 'wtd':
          start = this.getWeekStart(0);
          end = now;
          break;

        case 'prev-day':
          start = end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          break;
        case 'today':
          start = end = now;
          break;
        case 'next-day':
          start = end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          break;
        case 'last-n-days':
          end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (this.customPeriods.lastDays - 1));
          break;
        case 'next-n-days':
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + this.customPeriods.nextDays);
          break;
        default:
          return '';
      }

      return `${formatDate(start)} - ${formatDate(end)}`;
    }
  },
  methods: {
    formatMonth(date, offset = 0) {
      const d = new Date(date);
      d.setMonth(d.getMonth() + offset);
      return d.toLocaleString('default', { month: 'long', year: 'numeric' });
    },
    getCurrentQuarter() {
      return Math.floor((new Date().getMonth() + 3) / 3);
    },
    getPreviousQuarter() {
      const current = this.getCurrentQuarter();
      return current === 1 ? 4 : current - 1;
    },
    getNextQuarter() {
      const current = this.getCurrentQuarter();
      return current === 4 ? 1 : current + 1;
    },
    calculateDateRange() {
      if (!this.selectedPeriod) return;
      
      let start, end;
      const now = new Date();
      
      switch (this.selectedPeriod) {
        case 'prev-year':
          start = new Date(now.getFullYear() - 1, 0, 1);
          end = new Date(now.getFullYear() - 1, 11, 31);
          break;
        case 'this-year':
          start = new Date(now.getFullYear(), 0, 1);
          end = new Date(now.getFullYear(), 11, 31);
          break;
        case 'next-year':
          start = new Date(now.getFullYear() + 1, 0, 1);
          end = new Date(now.getFullYear() + 1, 11, 31);
          break;
        case 'last-n-years':
          end = new Date(now.getFullYear(), 11, 31);
          start = new Date(now.getFullYear() - (this.customPeriods.lastYears - 1), 0, 1);
          break;
        case 'next-n-years':
          start = new Date(now.getFullYear() + 1, 0, 1);
          end = new Date(now.getFullYear() + this.customPeriods.nextYears, 11, 31);
          break;
        case 'ytd':
          start = new Date(now.getFullYear(), 0, 1);
          end = now;
          break;

        case 'prev-quarter':
          start = this.getQuarterStart(-1);
          end = this.getQuarterEnd(-1);
          break;
        case 'this-quarter':
          start = this.getQuarterStart(0);
          end = this.getQuarterEnd(0);
          break;
        case 'next-quarter':
          start = this.getQuarterStart(1);
          end = this.getQuarterEnd(1);
          break;
        case 'last-n-quarters':
          end = this.getQuarterEnd(0);
          start = this.getQuarterStart(-(this.customPeriods.lastQuarters - 1));
          break;
        case 'next-n-quarters':
          start = this.getQuarterStart(1);
          end = this.getQuarterEnd(this.customPeriods.nextQuarters);
          break;
        case 'qtd':
          start = this.getQuarterStart(0);
          end = now;
          break;

        case 'prev-month':
          start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          end = new Date(now.getFullYear(), now.getMonth(), 0);
          break;
        case 'this-month':
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'next-month':
          start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
          break;
        case 'last-n-months':
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          start = new Date(now.getFullYear(), now.getMonth() - (this.customPeriods.lastMonths - 1), 1);
          break;
        case 'next-n-months':
          start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          end = new Date(now.getFullYear(), now.getMonth() + this.customPeriods.nextMonths + 1, 0);
          break;
        case 'mtd':
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = now;
          break;

        case 'prev-week':
          start = this.getWeekStart(-1);
          end = this.getWeekEnd(-1);
          break;
        case 'this-week':
          start = this.getWeekStart(0);
          end = this.getWeekEnd(0);
          break;
        case 'next-week':
          start = this.getWeekStart(1);
          end = this.getWeekEnd(1);
          break;
        case 'last-n-weeks':
          end = this.getWeekEnd(0);
          start = this.getWeekStart(-(this.customPeriods.lastWeeks - 1));
          break;
        case 'next-n-weeks':
          start = this.getWeekStart(1);
          end = this.getWeekEnd(this.customPeriods.nextWeeks);
          break;
        case 'wtd':
          start = this.getWeekStart(0);
          end = now;
          break;

        case 'prev-day':
          start = end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          break;
        case 'today':
          start = end = now;
          break;
        case 'next-day':
          start = end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          break;
        case 'last-n-days':
          end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (this.customPeriods.lastDays - 1));
          break;
        case 'next-n-days':
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + this.customPeriods.nextDays);
          break;
      }

      this.$emit('period-selected', { 
        start: start,
        end: end
      });
    },
    getQuarterStart(offset = 0) {
      const now = new Date();
      const quarter = Math.floor(now.getMonth() / 3);
      const startMonth = (quarter + offset) * 3;
      return new Date(now.getFullYear(), startMonth, 1);
    },
    getQuarterEnd(offset = 0) {
      const start = this.getQuarterStart(offset);
      return new Date(start.getFullYear(), start.getMonth() + 3, 0);
    },
    getWeekStart(offset = 0) {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (offset * 7);
      return new Date(now.getFullYear(), now.getMonth(), diff);
    },
    getWeekEnd(offset = 0) {
      const start = this.getWeekStart(offset);
      return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
    },
    applyDates() {
      // Implementation of applyDates method
    },
    updatePeriod(type) {
      if (!this.selectedPeriod) return;
      this.calculateDateRange();
    },
    selectPeriod(period) {
      this.selectedPeriod = period;
      this.calculateDateRange();
    }
  },
  watch: {
    selectedPeriod() {
      this.calculateDateRange();
    },
    customPeriods: {
      deep: true,
      handler() {
        if (this.selectedPeriod?.includes('n-')) {
          this.calculateDateRange();
        }
      }
    }
  },
  mounted() {
    // Empty - we don't need this anymore
  },
  beforeUnmount() {
    // Empty - we don't need this anymore
  }
}
</script>

<style scoped>


.radio-grid {
  display: flex;
  gap: 0.5rem;
  align-items: start;
  min-width: 300px;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.left-column {
  grid-column: 1;
}

.right-column {
  grid-column: 2;
}

.period-options {
  min-width: 300px;
  padding: 1rem;
}

.form-control {
  min-width: 31px;
  position: relative;
  z-index: 1;
}

/* Ensure radio buttons don't interfere with inputs */
:deep(.form-check) {
  position: relative;
  
  .form-check-input {
    z-index: 1;
  }
}

:deep(.form-check-input:checked ~ .form-check-label) {
  color: var(--vz-primary);
  font-weight: 500;
}

.selected-period {
  background-color: var(--vz-light);
  border-color: var(--vz-border-color) !important;
}

/* Style for number inputs */
.number-input {
  background-color: var(--vz-light);
  border: 1px solid var(--vz-border-color);
  color: var(--vz-body-color);
  padding: 2px 8px;
  border-radius: 0.25rem;
  transition: all 0.2s;
  font-size: 0.875rem;
  text-align: center;
  font-weight: 500;
  height: 24px;
  width: 40px;
  margin: 0 0.25rem;
}

/* Reset and show spinners */
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: inner-spin-button;
  appearance: inner-spin-button;
  height: 20px;
  margin: 0;
}

/* Style for the dropdown when custom range is selected */
:deep(.dropdown-menu.show) {
  min-width: 300px !important;
}

/* Style for radio buttons with inputs */
:deep(.form-check) {
  margin-bottom: 0;
  
  .form-check-label {
    width: 100%;
    display: flex;
    align-items: center;
    
    /* Align the flex container */
    .d-flex {
      display: flex;
      align-items: center;
      height: 24px;
    }
    
    /* Style the text spans */
    span {
      white-space: nowrap;
      font-size: 0.875rem;
      line-height: 1;
      display: flex;
      align-items: center;
    }
  }
}

/* Consistent spacing for all radio options */
.right-column {

    
    .form-check-input {
      margin-top: 0;
      align-self: center;
    }
  }


@media (max-width: 768px) {
  .date-range-picker {
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .d-flex.flex-wrap {
    width: 100%;
    justify-content: flex-start;
  }
  
  .btn-group {
    flex-wrap: wrap;
  }
  
  .btn-group .btn {
    margin: 2px;
  }
}

.date-range-picker {
  min-width: 180px;
}

.flatpickr-input {
  background-color: var(--vz-input-bg);
}
</style> 
