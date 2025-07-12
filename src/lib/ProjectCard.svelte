<!-- @ts-nocheck -->
<script>
  export let project
  export let onSelect
  export let active = false

  function handleClick() {
    if (onSelect) {
      onSelect(project.id)
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  function truncateText(text, maxLength = 24) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength - 1) + '…' : text;
  }
</script>

<div 
  class="project-card {active ? 'active' : ''}"
  role="button"
  tabindex="0"
  on:click={handleClick}
  on:keydown={handleKeyDown}
>
  <div class="project-image">
    <img src={project.image} alt={project.title} loading="lazy"/>
  </div>

  <div class="project-info">
    <h2>{project.title}</h2>
    <p class="project-description">{project.description}</p>
    <!-- <p class="project-tech">{project.tech}</p> -->
  </div>
</div>

<style lang="scss">
  .project-card {
    width: 12.5vw;
    height: 12.5vw;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 2, 0.6, 1);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    margin: 0 0 0 0;
    position: relative;
    transform-origin: bottom center; /* 從底部中心開始變化 */
    box-sizing: border-box;
    filter: 
      grayscale(0.8) 
      saturate(0.2);
      // brightness(0.9); /* 降低對比度和亮度 */
  }


  .project-card:hover,
  .project-card.active {
    width: calc(12.5vw * 1.2);
    height: calc(12.5vw * 1.2);
    z-index: 1000; /* 提高z-index確保遮擋 */
    filter: 
      grayscale(0)
      saturate(1);
  }
  .project-card:hover .project-image img,
  .project-card.active .project-image img {
    transform: translateY(40%);
    transition: transform 0.3s cubic-bezier(0.4, 2, 0.6, 1);
  }

  .project-image {
    width: 100%;
    height: 100%;
    background: var(--grey-900);
    // overflow: hidden;
    display: flex;
    justify-content: center;

  }

  .project-card:hover .project-image {
    height: 100%;
  }

  .project-image img {
    width: 70%;
    height: 70%;
    object-fit: cover;
    color: var(--grey-300);
    transform: translateY(56%);
    -webkit-user-drag: none;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    /* 只在拖曳時全域加 pointer-events: none，平時讓圖片可互動 */
  }

  .project-info {
    padding: 0.5rem 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    overflow: hidden;

    h2 {
      display: block;
      margin: 0 0 clamp(0.25rem, 1vw, 0.5rem) 0;
      font-size: clamp(0.8rem, 1.5vw, 1.125rem);
      color: var(--grey-100);
      font-weight: 600;
      font-family: Arial, Helvetica, sans-serif;
    }

    .project-description {
      margin: 0 0 clamp(0.25rem, 1vw, 0.75rem) 0;
      font-size: clamp(0.75rem, 1vw, 0.875rem);
      color: var(--grey-600);
      flex: 1;
      line-height: 1.2;

      @media screen and (max-width: 1100px) {
        display: none;
        &:hover {
          display: block;
        }
      }
    }
  }



  /* .project-tech {
    margin: 0;
    font-size: 0.75rem;
    color: var(--grey-900);
    background-color: var(--grey-300);
    font-weight: 500;
  } */
</style>