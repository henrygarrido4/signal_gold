<template>
  <div class="upcoming-scheduled">
    <div class="mini-calendar mb-4">
      <!-- Add your calendar implementation here -->
    </div>
    <div class="upcoming-events">
      <h5 class="mb-3">Upcoming Campaigns</h5>
      <div class="scheduled-event mb-3" v-for="event in upcomingEvents" :key="event.id">
        <div class="d-flex">
          <div class="flex-grow-1">
            <h6 class="mb-1">{{ event.title }}</h6>
            <p class="text-muted mb-0">{{ event.date }}</p>
          </div>
          <div class="flex-shrink-0">
            <i :class="`ri-${event.icon} text-${event.color}`"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      upcomingEvents: [
        {
          id: 1,
          title: 'Product Launch Campaign',
          date: '10 May 2024',
          icon: 'rocket-2-line',
          color: 'primary'
        },
        // Add more events
      ]
    }
  }
}
</script> 