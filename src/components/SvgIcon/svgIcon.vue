<!-- <template>
  <svg :class="svgClass" v-bind="$attrs" :color="color">
    <use :xlink:href="'#' + name" rel="external nofollow" />
  </svg>
</template>
<script setup>
  import { computed } from 'vue'
  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'currentColor'
    }
  })

  const svgClass = computed(() => {
    if (props.name) {
      return `svg-icon ${props.name}`
    }
    return 'svg-icon'
  })
</script>
<style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
    vertical-align: middle;
  }
</style> -->
<template>
  <svg :class="svgClass" v-bind="$attrs" :style="{ color }" aria-hidden="true">
    <use :href="`#icon-${name}`" />
  </svg>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    name: { type: String, required: true },
    color: { type: String, default: 'currentColor' }
  })

  const svgClass = computed(() =>
    props.name ? `svg-icon ${props.name}` : 'svg-icon'
  )
</script>

<style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
    vertical-align: middle;
  }
</style>
