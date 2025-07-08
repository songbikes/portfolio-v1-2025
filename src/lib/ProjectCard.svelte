<!-- @ts-nocheck -->
<script>
  export let project
  export let onSelect

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
</script>

<div 
  class="project-card"
  role="button"
  tabindex="0"
  on:click={handleClick}
  on:keydown={handleKeyDown}
>
  <div class="project-image">
    <img src={project.image} alt={project.title} />
  </div>
  <div class="project-info">
    <h3>{project.title}</h3>
    <p class="project-description">{project.description}</p>
    <p class="project-tech">{project.tech}</p>
  </div>
</div>

<style>
  .project-card {
    width: 240px;
    height: 240px;
    background: white;
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

  .project-card:hover {
    width: 300px;
    height: 300px;
    z-index: 1000; /* 提高z-index確保遮擋 */
    /* border-color: #007acc; */
    /* box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); */
  }

  .project-image {
    width: 100%;
    height: 160px;
    background: var(--grey-50);
    overflow: hidden;
  }

  .project-card:hover .project-image {
    height: 200px;
  }

  .project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .project-info {
    padding: 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  h3 {
    margin: 0 0 8px 0;
    font-size: 1rem;
    color: #333;
    font-weight: 600;
  }

  .project-description {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #666;
    flex: 1;
    line-height: 1.4;
  }

  .project-tech {
    margin: 0;
    font-size: 12px;
    color: #888;
    font-weight: 500;
  }
</style>