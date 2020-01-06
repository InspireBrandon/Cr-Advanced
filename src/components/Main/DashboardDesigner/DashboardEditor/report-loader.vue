<template>
  <component :is="loadWidget" :config="ReportData" :id="id" :editing="editing" ref="ReportComponent"></component>
</template>

<script>
export default {
  props: ["ReportData", "id","editing"],
  data() {
    return {};
  },
  mounted() {
    let self = this;

    setTimeout(() => {
      //   let height = self.$refs.ReportComponent.$el.clientHeight;
      //   self.ReportData.ReportLayout.h = height;
      self.$parent.autoSize();
    }, 50);
  },
  computed: {
    loadWidget() {
      let self = this;
      let key = self.ReportData.key;

      console.log(key);
      return () => import(`./Widgets/${key}`);
    }
  }
};
</script>