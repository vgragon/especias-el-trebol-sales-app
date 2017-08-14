<template>
    <div class="t-date-picker">
        <input type="text" :id="id" name="Date picker" :placeholder="placeholder" title="Select a date"
               class="t-input--date"/>
        <span class="glyphicon glyphicon-calendar t-icon--calendar" @click="toggleDatePicker"></span>
    </div>
</template>

<script>
    import Vue from 'vue';
    import $ from 'jquery';
    import * as datePicker from "eonasdan-bootstrap-datetimepicker";

    export default Vue.component("t-date-picker", {
        props: ['id', 'isDisabled', 'busEvent', 'linkedId', 'placeholder'],
        methods: {
            emitSelectedDate: function (ev) {
                if (typeof this.linkedId !== "undefined") {
                    let linkedDataPicker = $(`#${this.linkedId}`);
                    let datePicker = $(`#${this.id}`);
                    linkedDataPicker.data("DateTimePicker").minDate(ev.date);
                    if (datePicker.val() > linkedDataPicker.val()) linkedDataPicker.val(datePicker.val());
                }
                this.$emit("selectedOption", ev.date.startOf('day').toDate());
            },
            toggleDatePicker: function () {
                $(`#${this.id}`).data("DateTimePicker").toggle();
            }
        },
        mounted: function () {
            let datePicker = $(`#${this.id}`);
            datePicker.datetimepicker({
                format: "DD/MMM/YYYY",
                useCurrent: false,
                showClear: true
            });

            datePicker.on("dp.change", this.emitSelectedDate.bind(this));
        }
    });
</script>

<style lang="scss">
    @import '../../variables.scss';

    .t-date-picker {
        position: relative;
        width: 222px;
        display: inline-block;

        .t-icon--calendar {
            position: absolute;
            cursor: pointer;
            right: 5%;
            top: 25%;
        }
    }
</style>
