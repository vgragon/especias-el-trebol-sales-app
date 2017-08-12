<template>
    <input class="t-input--text" name="Employee Name" title="i.e. Vicente Grajeda"
           :placeholder="placeholder" @keyup="handleKeyUp"/>
</template>

<script>
    import Vue from 'vue';
    import $ from 'jquery';

    export default Vue.component("simple-text-filter", {
        props: ['data', 'propertyName', 'placeholder'],
        data() {
            return {}
        },
        methods: {
            handleKeyUp(ev) {
                let value = ev.target.value;
                if (value === "") {
                    this.$emit("textFiltered", this.data);
                    return;
                }
                let data = this.data.filter(record => {
                    return typeof this.propertyName === "undefined" ? record.indexOf(value.toLowerCase()) >= 0 : record[this.propertyName].toLowerCase().indexOf(value.toLowerCase()) >= 0;
                });
                this.$emit("textFiltered", data);
            }
        }
    });
</script>

<style lang="scss">

</style>
