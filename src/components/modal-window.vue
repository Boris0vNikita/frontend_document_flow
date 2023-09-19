<template>
    <transition name="modal">
        <div v-if="show" class="modal-shadow" @click.self="closeModal">
            <div class="modal">
                <div class="modal-close" @click="closeModal">&#10006;</div>
                <slot name="title">
                    <h3 class="modal-title">Переназначено сотруднику:</h3>
                </slot>
                <slot name="body">
                    <div class="modal-content">
                        {{ child.fio_user }}
                    </div>
                </slot>
            </div>
        </div>
    </transition>
</template>
 
<script>
export default {
    name: "ModalWindow",
    props: {
        info: String,
        child: Object
    },
    data: function () {
        return {
            show: false
        }
    },
    methods: {
        closeModal: function () {
            this.show = false
        }
    }
}
</script>
 
<style lang="scss">
.modal-shadow {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.39);
}

.modal {
    background: #fff;
    border-radius: 8px;
    padding: 15px;
    min-width: 420px;
    max-width: 560px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    max-height: 300px;

    &-close {
        border-radius: 50%;
        color: #fff;
        background: #2a4cc7;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 7px;
        right: 7px;
        width: 30px;
        height: 30px;
        cursor: pointer;
    }

    &-title {
        color: #0971c7;
    }

    &-content {
        margin-bottom: 20px
    }

    &-footer {
        &__button {
            background-color: #0971c7;
            color: #fff;
            border: none;
            text-align: center;
            padding: 8px;
            font-size: 17px;
            font-weight: 500;
            border-radius: 8px;
            min-width: 150px;
        }
    }
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 1s
}

.modal-enter,
.modal-leave-to {
    opacity: 0
}
</style>