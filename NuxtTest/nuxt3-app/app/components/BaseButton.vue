<template>
  <button 
    class="btn" 
    :class="[`btn-${variant}`, `btn-${size}`]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="spinner"></span>
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'outline'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  disabled: Boolean,
  loading: Boolean
})
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Sizes */
.btn-sm {
  padding: 8px 16px;
  font-size: 0.875rem;
}

.btn-md {
  padding: 12px 24px;
  font-size: 1rem;
}

.btn-lg {
  padding: 16px 32px;
  font-size: 1.125rem;
}

/* Variants */
.btn-primary {
  background: linear-gradient(135deg, #00dc82 0%, #00b86d 100%);
  color: #000;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 220, 130, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.btn-outline {
  background: transparent;
  color: #00dc82;
  border: 2px solid #00dc82;
}

.btn-outline:hover:not(:disabled) {
  background: rgba(0, 220, 130, 0.1);
}

/* Spinner */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>


