<template>
  <div  class="calendar-skeleton-container">
    <div class="calendar-skeleton">
      <!-- Calendar Header Skeleton -->
      <div class="skeleton-header">
        <div class="skeleton-nav">
          <div class="skeleton-button"></div>
          <div class="skeleton-button"></div>
        </div>
        <div class="skeleton-title"></div>
        <div class="skeleton-view-options">
          <div class="skeleton-button"></div>
          <div class="skeleton-button"></div>
          <div class="skeleton-button"></div>
          <div class="skeleton-button"></div>
        </div>
      </div>
      
      <!-- Calendar Grid Skeleton -->
      <div class="skeleton-grid">
        <div class="skeleton-weekdays">
          <div class="skeleton-weekday" v-for="day in 7" :key="'weekday-'+day"></div>
        </div>
        <div class="skeleton-weeks">
          <div class="skeleton-week" v-for="week in 5" :key="'week-'+week">
            <div class="skeleton-day" v-for="day in 7" :key="'day-'+week+'-'+day">
              <div class="skeleton-day-number"></div>
              <div class="skeleton-event" v-for="event in getRandomEvents(day, week)" :key="'event-'+week+'-'+day+'-'+event"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>
<script setup>
const getRandomEvents = (day, week) => {
  // Generate a deterministic but seemingly random number of events (0-3)
  // Using day and week to make it consistent between renders
  return Math.max(0, Math.min(3, Math.floor((day * week * 13) % 4)));
};

</script>

<style scoped>
/* Skeleton Loader Styles */
.calendar-skeleton-container {
  width: 100%;
  background-color: #edf9fd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.calendar-skeleton {
  width: 100%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px 0;
}

.skeleton-nav, .skeleton-view-options {
  display: flex;
  gap: 8px;
}

.skeleton-button {
  width: 80px;
  height: 32px;
  background-color: #c3ebfa;
  border-radius: 6px;
}

.skeleton-title {
  width: 150px;
  height: 24px;
  background-color: #c3ebfa;
  border-radius: 4px;
}

.skeleton-grid {
  width: 100%;
}

.skeleton-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.skeleton-weekday {
  height: 24px;
  background-color: #c3ebfa;
  border-radius: 4px;
}

.skeleton-weeks {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.skeleton-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.skeleton-day {
  height: 100px;
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.skeleton-day-number {
  width: 24px;
  height: 24px;
  background-color: #c3ebfa;
  border-radius: 50%;
  margin-bottom: 4px;
}

.skeleton-event {
  height: 16px;
  background-color: #fae27c;
  border-radius: 4px;
  margin-bottom: 4px;
}

/* Responsive adjustments for skeleton */
@media (max-width: 768px) {
  .skeleton-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .skeleton-nav, .skeleton-view-options {
    width: 100%;
    justify-content: center;
  }
  
  .skeleton-title {
    margin: 8px 0;
  }
  
  .skeleton-day {
    height: 80px;
  }
}

@media (max-width: 640px) {
  .skeleton-button {
    width: 60px;
    height: 28px;
  }
  
  .skeleton-day {
    height: 60px;
    padding: 2px;
  }
  
  .skeleton-day-number {
    width: 20px;
    height: 20px;
  }
  
  .skeleton-event {
    height: 12px;
  }
}

</style>