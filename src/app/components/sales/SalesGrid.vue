<template>
<div class="t-sales-grid">
    <div class="t-grid__section" v-for="section in data">
        <div class="t-grid__section__title">
            {{getTimeValue("MONTH", section.dateTime)}}, {{getTimeValue("YEAR", section.dateTime)}}
        </div>
        <div class="t-grid__section__content">
            <div class="t-grid__section__element" v-for="sale in section.records">
                <div class="t-grid__element__title">
                    {{getTimeValue("DAY", sale.dateTime)}}
                </div>
                <div class="t-grid__element__content">
                    {{sale.amount}}
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import SalesService from './SalesService.js';

export default Vue.component("t-sales-grid", {
    props: ['data'],
    methods: {
        getTimeValue(criteria, dateTime) {
            let date = new Date(dateTime);
            if (criteria === "DAY") {
                return date.getDate();
            } else if (criteria === "YEAR") {
                return date.getFullYear();
            } else if (criteria === "MONTH") {
                return SalesService.getNaturalMonth(date);
            }
        }
    }
});
</script>

<style lang="scss">
.t-grid__section {
    .t-grid__section__title {
        font-weight: bold;
    }

    .t-grid__element__title {
        font-weight: bold;
    }

    .t-grid__section__element {
        display: inline-block;
        max-width: 150px;
        width: 10%;
        background-color: #f0f0f0;
        margin: 12px 12px 12px 0;
        padding: 12px;
        text-align: center;
    }

    .t-grid__element__content {
        &::before {
            content: "$";
        }
    }
}
</style>
