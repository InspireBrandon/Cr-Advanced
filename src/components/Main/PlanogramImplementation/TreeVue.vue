<template>
  <li>
    <div>
        asdf
    </div>
    <ul>
      <item class="item" v-for="(model, index) in data.children" :key="index" :model="model" :module="module">
      </item>
    </ul>
  </li>
</template>

<script>
export default {
    name: 'item',
    props: ['data']
}
</script>
