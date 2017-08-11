<template>
<div class="t-dropdown" @click="toggleVisibility">
    <div class="t-dropdown__main">
        <span :class="{'t-dropdown__placeholder': !selectedOption}">{{getDisplayText(selectedOption, displayProperty) || placeholder || 'Select'}}</span>
    </div>
    <div class="t-dropdown__chevron">
        <i class="glyphicon glyphicon-chevron-down"></i>
    </div>
    <div class="t-dropdown__options background--grey" :class="{'visibility--hidden': !isVisible}">
        <div class="t-dropdown__option t-dropdown__option--clean" @click="cleanSelection">Clean selection</div>
        <div class="t-dropdown__option" v-for="option in data" @click="selectOption(option)">
            <span>{{getDisplayText(option, displayProperty)}}</span></div>
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import $ from 'jquery';

export default Vue.component("t-dropdown", {
    props: ['data', 'placeholder', 'displayProperty', 'predefinedValue'],
    data() {
        return {
            selectedOption: this.predefinedValue,
            isVisible: false
        }
    },
    methods: {
        cleanSelection: function() {
            this.selectedOption = undefined;
            this.$emit("selectedOption", this.selectedOption);
        },
        getDisplayText: function(option, property) {
            if (!option) return;
            let text = "";
            if (!!property) {
                if (Array.isArray(property)) {
                    text = property.map(value => option[value]).join(" ")
                } else {
                    text += option[property];
                }
            } else {
                text += option;
            }

            return text;
        },
        toggleVisibility: function() {
            this.isVisible = !this.isVisible;
        },
        selectOption: function(option) {
            this.selectedOption = option;
            this.$emit("selectedOption", this.selectedOption);
        }
    },
    mounted: function() {
        let _this = this;
        document.body.addEventListener('click', function(ev) {
            let touchedElement = $(ev.target);
            let component = $(_this.$el);
            if ($(touchedElement).closest(component).length === 0) {
                _this.isVisible = false;
            }
        });
    }
});
</script>

<style lang="scss">
@import '../../variables.scss';

.t-dropdown {
    position: relative;
    cursor: pointer;
    display: inline-block;
    vertical-align: top;
    background-color: $grey;
    width: 20%;
    height: 34px;
    padding: 8px;
    min-width: 90px;
    max-width: 318px;

    .t-dropdown__placeholder {
        font-style: italic;
        font-weight: lighter;
        color: $lightGrey;
    }

    .t-dropdown__main {
        display: inline-block;
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: top;
    }

    .t-dropdown__chevron {
        display: inline-block;
        width: 10%;
        height: 100%;
        float: right;
        position: relative;
    }

    .t-dropdown__options {
        position: absolute;
        width: 100%;
        top: 34px;
        left: 0;
        box-shadow: 0 1px 1px $lightGrey;
        z-index: 1;
    }

    .t-dropdown__option {
        border-top: 1px solid $lightGrey;
        padding: 5px;
        &:hover {
            background-color: $darkgrey;
        }

        &.t-dropdown__option--clean {
            font-weight: lighter;
            color: #858585;
            font-style: italic;
        }
    }
}
</style>
