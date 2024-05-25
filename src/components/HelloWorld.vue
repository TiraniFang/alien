<template>
  <div>
    <h1>Hello from Vue!</h1>
    <button @click="callJavaMethod">Call Java Method</button>
    <div v-if="info">
      <h2>Received Information:</h2>
      <ul>
        <li v-for="(value, key) in info" :key="key">{{ key }}: {{ value }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      info: null,
    };
  },
  mounted() {
    console.log("Vue component mounted");
    if (window.client) {
      console.log("Java bridge found");
    } else {
      console.log("Java bridge not found");
    }
  },
  methods: {
    callJavaMethod() {
      console.log("Button clicked");
      if (window.client) {
        try {
          const jsonString = window.client.getClientInfo();
          console.log("Received JSON from Java:", jsonString);
          const data = JSON.parse(jsonString);
          console.log("Parsed JSON Data:", data);
          this.info = data;
        } catch (error) {
          console.error("Failed to call Java method or parse JSON:", error);
        }
      } else {
        console.log("Java bridge not found");
      }
    }
  }
}
</script>

<style scoped>
h1 {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
