<style scoped>
/* สามารถเพิ่ม CSS เฉพาะส่วนนี้ได้ตามต้องการ */
/* แต่โค้ดนี้ใช้ Bootstrap เป็นหลัก */
</style>

<template>
  <nav class="navbar">
    <router-link to="/ocr/v1">OCR Tool</router-link>
    <router-link to="/ocr/v2">OCR Tool</router-link>
  </nav>

  <router-view />
</template>

<style>
.navbar {
  padding: 20px;
  background: #2c3e50;
  color: white;
}
.navbar a {
  color: white;
  text-decoration: none;
  margin: 0 10px;
  font-weight: bold;
}
.navbar a.router-link-active {
  color: #42b983;
}
body {
  margin: 0;
  font-family: sans-serif;
}
</style>
