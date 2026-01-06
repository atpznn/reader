<template>
  <div class="table-container">
    <table v-if="items.length > 0">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">
            {{ formatHeader(header) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in items" :key="index">
          <td v-for="header in headers" :key="header">
            {{ row[header] }}
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No data available.</p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// คำนวณหา Headers อัตโนมัติจาก Object ตัวแรก
const headers = computed(() => {
  if (props.items.length === 0) return [];
  return Object.keys(props.items[0]);
});

// ฟังก์ชันช่วยปรับรูปแบบตัวอักษรหัวตาราง (เช่น userId -> User Id)
const formatHeader = (text) => {
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f4f4f4;
}
</style>
