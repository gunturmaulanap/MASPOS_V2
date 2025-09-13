import { defineStore } from "pinia";
import { ref } from "vue";

export const useProfileStore = defineStore("profile", () => {
  // State global untuk dropdown profile
  const isDropdownOpen = ref(false);
  const profileRef = ref(null);

  // Fungsi global untuk handle click outside
  function handleClickOutside(event) {
    if (profileRef.value && !profileRef.value.contains(event.target)) {
      isDropdownOpen.value = false;
    }
  }

  return {
    isDropdownOpen,
    profileRef,
    handleClickOutside,
  };
});