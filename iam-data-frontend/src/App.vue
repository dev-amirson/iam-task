<template>
  <div id="app">
    <h1>AWS IAM Data Viewer</h1>
    <form @submit.prevent="fetchIamData" class="form-container">
      <label for="accessKeyId">Access Key ID:</label>
      <input v-model="accessKeyId" type="text" required />

      <label for="secretAccessKey">Secret Access Key:</label>
      <input v-model="secretAccessKey" type="password" required />

      <label for="region">Region:</label>
      <input v-model="region" type="text" required />

      <div class="button-group">
        <button type="submit" class="submit-button">Fetch IAM Data</button>
        <button
          type="button"
          class="download-button"
          @click="downloadCSV"
          :disabled="!iamData.length"
        >
          Download CSV
        </button>
      </div>
    </form>

    <!-- Loader with Font Awesome Spinner -->
    <div v-if="loading" class="loader">
      <i class="fas fa-spinner fa-spin"></i> Loading...
    </div>

    <!-- Table for displaying the last 5 records -->
    <div class="table-container">
      <table v-if="!loading && iamData.length">
        <thead>
          <tr>
            <th>Resource Type</th>
            <th>Resource Name</th>
            <th>Resource ID</th>
            <th>Creation Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in recentIamData" :key="item.resourceId">
            <td>{{ item.resourceType }}</td>
            <td>{{ item.resourceName }}</td>
            <td>{{ item.resourceId }}</td>
            <td>{{ new Date(item.creationDate).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Error message -->
    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      accessKeyId: "",
      secretAccessKey: "",
      region: "",
      iamData: [], // All fetched records
      error: null,
      loading: false,
    };
  },
  computed: {
    recentIamData() {
      // Only the last 5 records for display
      return this.iamData.slice(-5).reverse();
    },
  },
  methods: {
    async fetchIamData() {
      this.error = null;
      this.loading = true;

      try {
        const response = await axios.post(process.env.VUE_APP_API_ENDPOINT, {
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey,
          region: this.region,
        });
        this.iamData = response.data; // Store all records
      } catch (error) {
        this.error = error.response?.data?.error || "Error fetching IAM data.";
      } finally {
        this.loading = false;
      }
    },
    downloadCSV() {
      const csvData = this.iamData.map((item) => ({
        ResourceType: item.resourceType,
        ResourceName: item.resourceName,
        ResourceID: item.resourceId,
        CreationDate: new Date(item.creationDate).toLocaleString(),
      }));

      // Generate CSV string
      const csvContent = [
        ["Resource Type", "Resource Name", "Resource ID", "Creation Date"],
        ...csvData.map((row) => [
          row.ResourceType,
          row.ResourceName,
          row.ResourceID,
          row.CreationDate,
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");

      // Create a download link and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "iam_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style>
body {
  background: linear-gradient(to right, #4e54c8, #8f94fb);
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

#app {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  color: #fff;
  text-align: center;
  border-radius: 10px;
}

h1 {
  font-size: 2em;
  margin-bottom: 10px;
}

.form-container {
  background: #ffffff10;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.form-container label {
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
  color: #ffffffcc;
}

.form-container input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  margin-bottom: 10px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
}

.submit-button,
.download-button {
  background-color: #ff7f50;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover,
.download-button:hover {
  background-color: #ff6347;
}

.download-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loader {
  font-size: 1.5em;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-container {
  background: #ffffff10;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ffffff50;
}

table th {
  background-color: #4e54c8;
  color: #ffffffcc;
}

table tr:hover {
  background-color: #ffffff20;
}

.error {
  color: #ff4d4d;
  margin-top: 20px;
}
</style>
