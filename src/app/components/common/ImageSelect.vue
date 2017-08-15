<template>
    <div class="t-image-select">
        <input type="file" :id="id + '--input'" class="t-input--file"
               style="display: none;"/>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf2u0RWmYALKJ431XNoTKjzu77ERLBIvXKlOEA-Q3DPo2h2rCB"
             :id="id + '--image'" class="t-image--element margin--bottom--sm"/>
        <a class="t-link" @click="toggleImageSelection">Change image</a>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.component("t-image-select", {
        props: ['id'],
        methods: {
            toggleImageSelection() {
                $(`#${this.id}--input`).click();
            },
            handleFileSelect(ev) {
                let file = ev.target.files[0];
                if (!!file) {
                    let imageElement = document.getElementById(`${this.id}--image`);
                    this.getBase64(file).then((base64) => {
                        imageElement.src = base64;
                        this.$emit("imageSelect", base64);
                    });
                }
                else {
                    this.$emit("imageSelect", undefined);
                }
            },
            getBase64(file) {
                return new Promise(function (resolve, reject) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        resolve(reader.result);
                    };
                    reader.onerror = function (error) {
                        reject(error);
                    };
                });
            }
        },
        mounted() {
            document.getElementById(`${this.id}--input`).addEventListener('change', this.handleFileSelect, false);
        }
    });
</script>

<style lang="scss">
    .t-image--element {
        max-width: 100%;
        position: relative;
        width: 170px;
        height: 170px;
        border-radius: 100%;
        display: block;
        margin: auto;
        border: 8px solid #F0F0F0;
    }
</style>
