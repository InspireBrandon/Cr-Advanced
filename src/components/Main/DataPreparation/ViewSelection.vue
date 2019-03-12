<template>
  <div class="holder">
    <table class="noselect">
      <tr>
        <th class="topHeader" colspan="7">Data Preparation - Products</th>
      </tr>
      <tr class="th-holder">
        <th class="black">Image Management</th>
        <th colspan="3" class="afterBlack">Target Vs Actual</th>
        <th class="afterBlack">Process</th>
        <th class="afterBlack">Progress</th>
      </tr>
      <!-- Image - Product Catalogue -->
      <tr class="activate" @click="$router.push('/DataPreparation/ProductCatalogue')">
        <td>Image - Product Catalogue</td>
        <td>500</td>
        <td>75</td>
        <td>
          <v-icon>arrow_downward</v-icon>
        </td>
        <td></td>
        <td></td>
      </tr>
      <!-- Image - Tray -->
      <tr class="activate" @click="$router.push('/DataPreparation/Tray')">
        <td>Image - Tray</td>
        <td>0</td>
        <td>0</td>
        <td>
          <v-icon>arrow_downward</v-icon>
        </td>
        <td></td>
        <td></td>
      </tr>
      <!-- Image - Shrink -->
      <tr class="activate" @click="$router.push('/DataPreparation/Shrink')">
        <td>Image - Shrink</td>
        <td>0</td>
        <td>0</td>
        <td>
          <v-icon>arrow_downward</v-icon>
        </td>
        <td></td>
        <td></td>
      </tr>
      <!-- Image - Case -->
      <tr class="activate">
        <td>Image - Case</td>
        <td>0</td>
        <td>0</td>
        <td>
          <v-icon>arrow_downward</v-icon>
        </td>
        <td></td>
        <td></td>
      </tr>
      <!-- Image - Pallet -->
      <tr class="activate">
        <td>Image - Pallet</td>
        <td>0</td>
        <td>0</td>
        <td>
          <v-icon>arrow_downward</v-icon>
        </td>
        <td></td>
        <td></td>
      </tr>
      <!-- Image - Advertising -->
      <tr class="activate">
        <td>Image - Advertising</td>
        <td>0</td>
        <td>0</td>
        <td>
          <v-icon>arrow_downward</v-icon>
        </td>
        <td>Image Management</td>
        <td>100%</td>
      </tr>
      <tr class="th-holder">
        <th class="black">Data Preparation - Products</th>
        <th colspan="3" class="afterBlack">Target Vs Actual</th>
        <th class="afterBlack">Process</th>
        <th class="afterBlack">Progress</th>
      </tr>
      <!-- Manage Category Structure -->
      <tr class="activate">
        <td>Manage Category Structure</td>
        <td>0</td>
        <td>0</td>
        <td>
          <v-icon>arrow_downward</v-icon>
        </td>
        <td></td>
        <td></td>
      </tr>
      <!-- Manage Category Codes -->
      <tr class="activate">
        <td>Manage Category Codes</td>
        <td>0</td>
        <td>0</td>
        <td>
          <v-icon>arrow_downward</v-icon>
        </td>
        <td></td>
        <td></td>
      </tr>
      <!-- Category Hierarchy -->
      <tr class="activate">
        <td>Category Hierarchy</td>
        <td>0</td>
        <td>0</td>
        <td>
          <v-icon>arrow_downward</v-icon>
        </td>
        <td></td>
        <td></td>
      </tr>
      <!-- Image - Advertising -->
      <tr class="activate">
        <td>Image - Advertising</td>
        <td>0</td>
        <td>0</td>
        <td>
          <v-icon>arrow_downward</v-icon>
        </td>
        <td>Data Preparation - Products</td>
        <td>100%</td>
      </tr>
      <tr>
        <th class="topHeader" colspan="7">Data Preparation - Stores</th>
      </tr>
      <tr class="th-holder">
        <th class="black">Data Preparation - Stores</th>
        <th colspan="3" class="afterBlack">Target Vs Actual</th>
        <th class="afterBlack">Process</th>
        <th class="afterBlack">Progress</th>
      </tr>
      <!-- Geographic Location -->
      <tr class="activate">
        <td>Geographic Location</td>
        <td>500</td>
        <td>75</td>
        <td>
          <v-icon>arrow_downward</v-icon>
        </td>
        <td></td>
        <td></td>
      </tr>
      <!-- Contact Details -->
      <tr class="activate">
        <td>Contact Details</td>
        <td>0</td>
        <td>0</td>
        <td>
          <v-icon>arrow_downward</v-icon>
        </td>
        <td></td>
        <td></td>
      </tr>
      <!-- Store Details -->
      <tr class="activate">
        <td>Store Details</td>
        <td>0</td>
        <td>0</td>
        <td>
          <v-icon>arrow_downward</v-icon>
        </td>
        <td>Data Preparation - Stores</td>
        <td>100%</td>
      </tr>
    </table>
  </div>
</template>

<script>
  import axios from 'axios'
  import jwt from 'jsonwebtoken';

  export default {
    data() {
      return {

      }
    }
  }

</script>

<style scoped>
  .breadcrumb {
    padding: 6px;
  }

  .breadcrumb:hover {
    background: #474747;
    cursor: pointer;
  }

  .topHeader {
    background: #1976d2;
    color: white;
  }

  .activate:hover {
    background: rgb(211, 237, 246);
    cursor: pointer;
  }

  .holder {
    padding: 15px;
    overflow: auto;
    max-height: 90vh;
  }

  .black {
    background: black;
    color: white;
  }

  .afterBlack {
    background: lightblue;
  }

  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  .th-holder {
    border: 1px solid gray;
  }

  td,
  th {
    text-align: left;
    padding: 0px;
  }

  .noMarg {
    margin: 0px;
  }

  .noselect {
    -webkit-touch-callout: none;
    /* iOS Safari */
    -webkit-user-select: none;
    /* Safari */
    -khtml-user-select: none;
    /* Konqueror HTML */
    -moz-user-select: none;
    /* Firefox */
    -ms-user-select: none;
    /* Internet Explorer/Edge */
    user-select: none;
    /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
  }

</style>
