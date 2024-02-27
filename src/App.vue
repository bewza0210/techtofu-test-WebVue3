<template>
  <v-container>
    <v-row>
      <v-col class="ma-2 pa-2">
        <v-text-field v-model="partName" label="Part Name"></v-text-field>
      </v-col>
      <v-col class="ma-2 pa-2">
        <v-text-field v-model="partNumber" label="Part Number"></v-text-field>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="3">
        <v-row justify="center">
          <v-col>
            <v-btn color="primary" dark @click="funcSubmitForm">
              Save
            </v-btn>
          </v-col>
          <v-col>
            <v-btn color="blue-grey" @click="funcClearInput">
              Clear
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>

  <v-container>
    <v-row class="mb-2 pt-2" justify="end">
      <v-btn color="green-darken-3" @click="funcExportExcel">
        <v-icon icon="fa-download"/> Download Excel
      </v-btn>
      <v-btn color="green darken-3" @click="$refs.fileInput.click()">
        <v-icon icon="fa-upload"/> Upload Excel
      </v-btn>
      <input type="file" id="excel-input" ref="fileInput" @change="funcImportExcel" style="display: none;">
    </v-row>

    <v-table>
      <thead>
        <tr>
          <th class="text-center custom-th">
            Part Name
          </th>
          <th class="text-center custom-th">
            Number
          </th>
          <th class="text-center custom-th">
            Edit Time
          </th>
          <th class="text-center custom-th">
            <v-icon icon="fa-cogs"></v-icon>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in masterPartData"
          :key="item.id"
        >
          <td>{{ item.partName }}</td>
          <td>{{ item.partNumber }}</td>
          <td>{{ item.updateDate }}</td>
          <td>      
            <v-btn color="blue-grey-lighten-4" icon @click="funcEditItem(item.id)">
              <v-icon icon="fa-pencil" />
            </v-btn>
            <v-btn color="blue-grey-lighten-4" icon @click="funcDeleteItem(item.id)">
              <v-icon icon="fa-trash"></v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { 
          loadMasterPartData, 
          createMasterPartData, 
          loadMasterPartDataDetail, 
          deleteMasterPartData, 
          updateMasterPartData,
          exportExcelMasterPartData,
          importExcelMasterPartData
        } from './service'
import swal from 'sweetalert2'

export default {
  name: 'App',
  setup() {
    const partName = ref(null)
    const partNumber = ref(null)
    const masterPartData = ref([])
    let actionMode = 'Create'
    let updateId = 0

    const funcSubmitForm = async () => {
      if (!partName.value) {
        swal.fire({
          title: 'Error',
          text: 'Please fill partname.',
          icon: 'warning',
          confirmButtonText: 'OK'
        })
        return
      }
      if (!partNumber.value) {
        swal.fire({
          title: 'Error',
          text: 'Please fill partnumber.',
          icon: 'warning',
          confirmButtonText: 'OK'
        })
        return
      }

      let prePareData = {partName: partName.value, partNumber: partNumber.value}

      switch (actionMode) {
        case 'Create':
          funcCreatePart(prePareData)
          break;
        case 'Update':
          funcUpdatePart(prePareData)
          break;
      }
    }

    const funcCreatePart = async (data) => {
      const result = await createMasterPartData(data)
      if (result) {
        swal.fire({
          title: 'Success',
          text: 'Create success.',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        funcClearInput()
        funcLoadData()
      }
    }

    const funcUpdatePart = async (data) => {
      const result = await updateMasterPartData(updateId,data)
      if (result) {
        swal.fire({
          title: 'Success',
          text: 'Update success.',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        funcClearInput()
        funcLoadData()
      }
    }

    const funcEditItem = async (id) => {
      actionMode = 'Update'
      updateId = id
      const result = await loadMasterPartDataDetail(id)
      partName.value = result.body.partName
      partNumber.value = result.body.partNumber
    }

    const funcDeleteItem = async (id) => {
      const { isConfirmed } = await swal.fire({
        title: 'Do you want to delete this item?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      })

      if (isConfirmed) {
        const result = await deleteMasterPartData(id)
        if (result) {
          funcClearInput()
          funcLoadData()
          swal.fire({
            title: 'Success',
            text: 'Delete success.',
            icon: 'success',
            confirmButtonText: 'OK'
          })
        }
      }
    }
    
    const funcImportExcel = async () => {
      try {
        const input = document.getElementById('excel-input');
        const file = input.files[0];
        if (!file) {
          swal.fire({
            title: 'Error',
            text: 'No file selected.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          return;
        }
        if (!file.name.endsWith('.xlsx')) {
          swal.fire({
            title: 'Error',
            text: 'Invalid file format. Please select an Excel file (.xlsx).',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          return;
        }
        const result = await importExcelMasterPartData(file)
        if (result) {
          funcClearInput()
          masterPartData.value = []
          funcLoadData()
          swal.fire({
            title: 'Success',
            text: 'Import success.',
            icon: 'success',
            confirmButtonText: 'OK'
          })
        }
      } catch (error) {
        console.error('Failed to import master part data:', error);
      }
    }

    const funcExportExcel = async () => {
      await exportExcelMasterPartData();
    }

    const funcClearInput = () => {
      partName.value = ''
      partNumber.value = ''
      actionMode = 'Create'
    }

    const funcLoadData = async () => {
      masterPartData.value = await loadMasterPartData()
    }

    onMounted(funcLoadData);

    return {
      masterPartData,
      funcSubmitForm,
      funcClearInput,
      funcDeleteItem,
      funcEditItem,
      partName,
      partNumber,
      funcExportExcel,
      funcImportExcel
    };
  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  v-col {
    margin-left: 60px;
  }

  .custom-th {
    background-color: #D7CCC8; 
  }
</style>
