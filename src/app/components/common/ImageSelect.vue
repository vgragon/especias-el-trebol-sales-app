<template>
    <div class="t-image-select">
        <input type="file" :id="id + '--input'" class="t-input--file" ref="inputFile"
               style="display: none;"/>
        <img :src="defaultImage" :id="id + '--image'" class="t-image--element margin--bottom--sm"/>
        <a class="t-link" @click="$refs.inputFile.click()">Change image</a>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.component("t-image-select", {
        props: ['id', 'clean', 'defaultImage'],
        watch: {
            clean: function ([value]) {
                if (value) {
                    let imageElement = document.getElementById(`${this.id}--image`);
                    imageElement.src = this.defaultImage;
                }
            }
        },
        methods: {
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
    .t-image-select {
        text-align: center;
        width: 170px;
        height: 200px;
        margin: auto;

        .t-image--element {
            width: 100%;
            position: relative;
            height: 170px;
            border-radius: 100%;
            display: block;
            margin: auto;
            border: 8px solid #F0F0F0;
        }
    }
</style>
