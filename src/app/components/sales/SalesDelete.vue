<template>
    <div class="modal fade" id="t-sales-delete" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                    <h2 class="modal-title heading--h2">Delete sales record</h2>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete this sales record?</p>
                    <div class="clearfix"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="t-button t-button--default margin--right--sm" data-dismiss="modal">
                        Cancel
                    </button>
                    <button type="button" class="t-button t-button--danger" @click="deleteSale">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.component("t-sales-delete", {
        props: ['record'],
        methods: {
            deleteSale() {
                this.$emit("salesDelete", this.record);
                $("#t-sales-delete").modal("hide");
            }
        }
    });
</script>

<style lang="scss">

</style>
