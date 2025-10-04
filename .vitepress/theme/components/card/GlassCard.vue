<template>
  <div class="glassCard">
    <div class="title">
      <div class="title-dec">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <slot name="title"> 主题</slot>
    </div>
    <div class="description">
      <slot name="description"> 一些描述信息</slot>
    </div>
    <div ref="card3d" class="content" :style="{ '--rotateX': rotateX + 'deg', '--rotateY': rotateY + 'deg' }">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { use3DCardEffect } from '../../composables/3DCardEffect';
const card3d = ref<HTMLDivElement>();
const rotateX = ref(0); // 数值
const rotateY = ref(0);
onMounted(() => {
  use3DCardEffect(card3d.value);
});
</script>
<style lang="scss" scoped>
.glassCard {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem 1rem;
  overflow: hidden;
  backdrop-filter: blur(2px);
  background-color: rgba(171, 167, 167, 0.1);
  border: 2px solid #8283d6;
  border-radius: 0.5rem;
  .title {
    position: relative;
    width: 100%;
    color: rgb(97, 119, 243);
    font-size: 1rem;
    font-weight: bold;
    letter-spacing: 0.7rem;
    text-align: center;
    .title-dec {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-end;

      div {
        height: 80%;
        aspect-ratio: 1/1;
        border-radius: 50%;
      }
      div:nth-child(1) {
        background: #7e80ce;
      }
      div:nth-child(2) {
        margin: 0 0.3rem;
        background: #e7dd7d;
      }
      div:nth-child(3) {
        background: #6ccc64;
      }
    }
  }
  .description {
    width: 100%;
    font-size: 0.8rem;
    font-family: firacode, Consolas, Menlo, monospace;
    margin: 0.4rem 0;
  }
  .content {
    flex: 1;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: #3327bd 0px 0px 4px 0px;
    transform: perspective(500px) rotateX(var(--rotateX, 0deg)) rotateY(var(--rotateY, 0deg));
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
}
</style>
