<script setup>
import { ref } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  search: {
    type: Boolean,
    default: false
  },
  sort: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Boolean,
    default: false
  }
});

const sortState = ref({
  column: null,
  direction: 'asc'
});

const emit = defineEmits(['sort']);

const handleSort = (columnId) => {
  // Don't sort if sorting is disabled or if it's the trend column
  if (!props.sort || columnId === 'trend') return;
  
  if (sortState.value.column === columnId) {
    // Toggle direction if same column
    sortState.value.direction = sortState.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    // New column, default to ascending
    sortState.value.column = columnId;
    sortState.value.direction = 'asc';
  }
  
  emit('sort', { column: columnId, direction: sortState.value.direction });
};

const getSortClass = (columnId) => {
  // Don't show sort indicator for trend column
  if (columnId === 'trend') return '';
  if (sortState.value.column !== columnId) return 'sort';
  return `sort ${sortState.value.direction}`;
};
</script>

<template>
  <div class="table-responsive table-card">
    <table class="table align-middle table-nowrap" id="customerTable">
      <thead class="table-light text-muted">
        <tr>
          <th 
            v-for="column in columns" 
            :key="column.id"
            :class="getSortClass(column.id)"
            scope="col"
            @click="handleSort(column.id)"
          >
            {{ column.name }}
          </th>
        </tr>
      </thead>
      <tbody class="list form-check-all">
        <tr v-for="(item, index) in data" :key="index">
          <td v-for="column in columns" :key="column.id">
            <template v-if="column.formatter">
              <div v-html="column.formatter(item[column.id])"></div>
            </template>
            <template v-else>
              {{ item[column.id] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.sort:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>

