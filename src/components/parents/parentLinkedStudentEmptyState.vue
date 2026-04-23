<template>
  <EmptyState
    icon="fa-regular fa-user"
    heading="Nothing to see here yet"
    :description="resolvedDescription"
  />
</template>

<script setup>
import { computed } from "vue";
import EmptyState from "../emptyState.vue";

const props = defineProps({
  description: {
    type: String,
    default: "",
  },
  resourceLabel: {
    type: String,
    default: "updates",
  },
});

const resolvedDescription = computed(() => {
  if (props.description) {
    return props.description;
  }

  return `Once the school links your child to this parent account, this page will start showing their ${props.resourceLabel}.`;
});
</script>
