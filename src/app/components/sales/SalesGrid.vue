<template>
    <div class="t-sales-grid">
        <div class="t-grid__section" v-for="section in data">
            <div class="t-grid__section__title">
                {{getTimeValue("MONTH", section.dateTime)}}, {{getTimeValue("YEAR", section.dateTime)}}
            </div>
            <div class="t-grid__section__content">
                <div class="t-grid__section__element" v-for="sale in section.dailyRecords">
                    <router-link :to="{ name: 'SalesDetail', params: { dateTime: sale.dateTime }}">
                        <div class="t-grid__element__title">
                            {{getTimeValue("FRIENDLY_DAY", sale.dateTime)}} {{getTimeValue("DAY", sale.dateTime)}}
                        </div>
                        <div class="t-grid__element__content"
                             :class="{'t-number--positive': sale.sumAmount > 0, 't-number--negative': sale.sumAmount < 0}">
                            {{formatNumber('CURRENCY', sale.sumAmount)}}
                        </div>
                    </router-link>
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
                } else if (criteria === "FRIENDLY_DAY") {
                    return SalesService.getNaturalDay(date);
                } else if (criteria === "YEAR") {
                    return date.getFullYear();
                } else if (criteria === "MONTH") {
                    return SalesService.getNaturalMonth(date);
                }
            },
            formatNumber(criteria, number) {
                if (criteria === "CURRENCY") {
                    let numberStringed = (number + "").split("").reverse().join("");
                    let formattedNumber = "";
                    let counter = 1;
                    for (let char of numberStringed) {
                        if (counter % 4 === 0 && !Number.isNaN(Number.parseInt(char))) formattedNumber = "," + formattedNumber;
                        formattedNumber = char + formattedNumber;
                        counter++;
                    }
                    return formattedNumber;
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
            color: #000;
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

            &:hover {
                background-color: #e8e6e6;
                cursor: pointer;
            }
        }

        .t-grid__element__content {
            &::before {
                content: "$";
            }
        }
    }
</style>
