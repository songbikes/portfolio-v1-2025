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

<style>
  .project-card {
    width: 240px;
    height: 240px;
    /* background: white; */
    /* border: 1px solid #ddd; */
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 2, 0.6, 1);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    margin: 0 0 0 0;
    position: relative;
    transform-origin: bottom center; /* 從底部中心開始變化 */
  }


  .project-card:hover,
  .project-card.active {
    width: 300px;
    height: 300px;
    z-index: 1000; /* 提高z-index確保遮擋 */
    /* border-color: #007acc; */
    /* box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); */
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
    overflow: hidden;
  }

  .project-card:hover .project-image {
    height: 100%;
  }

  .project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    color: var(--grey-300);
    transform: translateY(50%);
    -webkit-user-drag: none;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    /* 只在拖曳時全域加 pointer-events: none，平時讓圖片可互動 */
  }

  .project-info {
    padding: 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    overflow: hidden;
  }

  h2 {
    margin: 0 0 8px 0;
    font-size: 2rem;
    color: var(--grey-100);
    font-weight: 600;
    font-family: Arial, Helvetica, sans-serif;
  }

  .project-description {
    margin: 0 0 12px 0;
    font-size: 0.875rem;
    color: var(--grey-600);
    flex: 1;
    line-height: 1.4;
  }

  /* .project-tech {
    margin: 0;
    font-size: 0.75rem;
    color: var(--grey-900);
    background-color: var(--grey-300);
    font-weight: 500;
  } */
</style>