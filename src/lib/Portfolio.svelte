<!-- @ts-nocheck -->
<script>
  import ProjectCard from './ProjectCard.svelte'
  import './LazyImg.js';
  
  export let projects = []
  
let selectedProjectId = null
  let scrollContainer
  let contentScrollContainer
  let isDown = false
  let startX
  let scrollLeft

  // 慣性滾動變數
  let velocity = 0
  let lastPosition = 0
  let lastTime = 0
  let animationFrame = null
  let isDragging = false

  function selectProject(projectId) {
    selectedProjectId = projectId
    // 找到對應的內容並滾動到該位置
    const projectIndex = displayProjects.findIndex(p => p.id === projectId)
    if (contentScrollContainer && projectIndex !== -1) {
      // 停止現有的慣性滾動
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
        animationFrame = null
      }
      const slides = contentScrollContainer.querySelectorAll('.content-slide')
      if (slides[projectIndex]) {
        slides[projectIndex].scrollIntoView({ behavior: 'smooth', inline: 'start' })
      }
      // 重置速度
      velocity = 0
      isDragging = false
    }
  }

  // 滑鼠拖拽滾動功能 - 卡片區域
  function handleMouseDown(e) {
    isDown = true
    scrollContainer.style.cursor = 'grabbing'
    startX = e.pageX - scrollContainer.offsetLeft
    scrollLeft = scrollContainer.scrollLeft
  }

  function handleMouseLeave() {
    isDown = false
    scrollContainer.style.cursor = 'grab'
  }

  function handleMouseUp() {
    isDown = false
    scrollContainer.style.cursor = 'grab'
  }

  function handleMouseMove(e) {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - scrollContainer.offsetLeft
    const walk = (x - startX) * 2
    scrollContainer.scrollLeft = scrollLeft - walk
  }

  // 慣性滾動功能 - 內容區域
  let contentIsDown = false
  let contentStartX
  let contentScrollLeft

  function handleContentMouseDown(e) {
    contentIsDown = true
    isDragging = true
    contentScrollContainer.style.cursor = 'grabbing'
    contentStartX = e.pageX - contentScrollContainer.offsetLeft
    contentScrollLeft = contentScrollContainer.scrollLeft
    lastPosition = contentScrollContainer.scrollLeft
    lastTime = Date.now()
    velocity = 0
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
  }

  function handleContentMouseLeave() {
    if (contentIsDown) {
      contentIsDown = false
      isDragging = false
      contentScrollContainer.style.cursor = 'grab'
      startInertialScroll()
    }
  }

  function handleContentMouseUp() {
    if (contentIsDown) {
      contentIsDown = false
      isDragging = false
      contentScrollContainer.style.cursor = 'grab'
      startInertialScroll()
    }
  }

  function handleContentMouseMove(e) {
    if (!contentIsDown) return
    if (e.buttons === 0) {
      contentIsDown = false;
      isDragging = false;
      contentScrollContainer.style.cursor = 'grab';
      startInertialScroll();
      return;
    }
    e.preventDefault();
    const currentTime = Date.now();
    const x = e.pageX - contentScrollContainer.offsetLeft;
    const walk = (x - contentStartX) * 1.5;
    const newScrollLeft = contentScrollLeft - walk;
    const deltaTime = currentTime - lastTime;
    if (deltaTime > 0) {
      const deltaPosition = newScrollLeft - lastPosition;
      velocity = deltaPosition / deltaTime;
    }
    contentScrollContainer.scrollLeft = newScrollLeft;
    lastPosition = newScrollLeft;
    lastTime = currentTime;
  }

  function startInertialScroll() {
    if (Math.abs(velocity) < 0.1 || isDragging) return
    const friction = 0.95
    const minVelocity = 0.1
    function animate() {
      if (isDragging) return
      velocity *= friction
      if (Math.abs(velocity) < minVelocity) {
        velocity = 0
        return
      }
      const currentScroll = contentScrollContainer.scrollLeft
      const newScroll = currentScroll + velocity * 16
      const maxScroll = contentScrollContainer.scrollWidth / 2
      if (newScroll >= maxScroll) {
        contentScrollContainer.scrollLeft = newScroll - maxScroll
      } else if (newScroll < 0) {
        contentScrollContainer.scrollLeft = maxScroll + newScroll
      } else {
        contentScrollContainer.scrollLeft = newScroll
      }
      animationFrame = requestAnimationFrame(animate)
    }
    animationFrame = requestAnimationFrame(animate)
  }

  // 無限循環滾動處理
  function handleContentScroll() {
    if (!contentScrollContainer || isDragging) return
    const maxScroll = contentScrollContainer.scrollWidth / 2 // 因為內容重複了一次
    const currentScroll = contentScrollContainer.scrollLeft
    // 如果滾動到第二組內容的開始，跳回第一組
    if (currentScroll >= maxScroll) {
      contentScrollContainer.scrollLeft = currentScroll - maxScroll
    }
    // 如果滾動到第一組內容之前，跳到第二組
    else if (currentScroll < 0) {
      contentScrollContainer.scrollLeft = maxScroll + currentScroll
    }
  }

  // 範例專案資料 - 使用HTML內容以便完全自由編輯
  const defaultProjects = [
    {
      id: 'project-a',
      title: 'digiHi',
      description: 'Event driven tech & startup platform',
      tech: 'Figma, Next.js, Tailwind, Convex, Stripe, Clerk',
      image: 'https://xb8rnillf1.ufs.sh/f/697Z538ULBF9Mm59vq4IfuUjg3Oyt4ZxvpsCKAde0wmRShFl',
      demoUrl: 'https://digihi.io',
      // githubUrl: 'https://github.com',
      htmlContent: `
        <div class="custom-content di-base">
          <h1 class="hero">A PLATFORM FOR THE TECH AND STARTUP COMMUNITIES TO CONNECT EASIER.</h1>
          
          <div class="di-hero-wrapper">
            <div class="di-hero-text">
              <div class="hero-text-group">
                <p>What Problems </p>
                <ul>
                  <li>Tech & startup events are on many websites</li>	
                  <li>Using Google Sheet to share events</li>	
                  <li>For busy entrepreneurs and investors, the absence of a unified, efficient platform means missing critical business opportunities.</li>	
                </ul>
              </div>
  
              <div class="hero-text-group">
                <p>Why are they problems</p>
                <ul>
                  <li>Lost opportunities for connection</li>	
                  <li>Google Sheets offers unfriendly for browsing events</li>	
                  <li>An </li>	
                </ul>
              </div>
              
              <div class="hero-text-group">
                <p>Remedies</p>
                <ul>
                  <li>Build a website for tech and startup community</li>	
                  <li>A quicker way to build connections</li>	
                  <li>A place to showcase themselves</li>	
                </ul>
              </div>
                  
              <div class="hero-text-group">
                <p>Why remedies works</p>
                <ul>
                  <li>Website is by far the best way to find events</li>	
                  <li>Essentially it' all about promotion</li>	
                  <li>And also about getting more opportunities</li>	
                </ul>
              </div>
                    
              <div class="hero-text-group">
                <p>Outcome</p>
                <ul>
                  <li>Developed a user-centric website with a seamless event browsing experience.</li>	
                  <li>Users can easily post events, search for connections, and showcase products visually.</li>	
                </ul>
              </div>
            </div>
            <h5>After attending several technology and startup events, I observed that event information is scattered across multiple platforms such as Humanitix, Eventbrite, Meetup and other websites, making it difficult for users to find suitable events quickly. Additionally, many rely on Google Sheets to share event details, but its tabular format lacks filtering capabilities, is slow to update, and is not optimised for mobile browsing, significantly impacting efficiency.</h5>
          </div>
        
      `
    },
    {
      id: 'project-b',
      title: 'Dacreed',
      description: 'Professional Development Platform',
      tech: 'Figma',
      image: 'https://via.placeholder.com/240x160/ff3e00/ffffff?text=Social+App',
      // demoUrl: 'https://example.com',
      // githubUrl: 'https://github.com',
      htmlContent: `
        <div class="custom-content">
          <h1>Dacreed</h1>
          <h1>Placeholder</h1>
          <img src="https://placehold.co/600x400" alt="Asobi Interior Design" style="width: 100%; max-width: 600px; border-radius: 8px; margin-bottom: 20px;">
        </div>
      `
    },
    {
      id: 'project-c',
      title: 'Asobi',
      description: 'An Interior Design Company Website',
      tech: 'Figma, Next.js, Tailwind, Convex',
      image: 'https://via.placeholder.com/240x160/42b883/ffffff?text=Task+Manager',
      demoUrl: 'https://asobi.tw',
      // githubUrl: 'https://github.com',
      htmlContent: `
        <div class="custom-content">
          <h1>Asobi</h1>
          <h1>Placeholder</h1>
          <img src="https://placehold.co/600x400" alt="Asobi Interior Design" style="width: 100%; max-width: 600px; border-radius: 8px; margin-bottom: 20px;">
        </div>
      `
    },
    {
      id: 'project-d',
      title: 'Trade Me',
      description: 'Feature Exercise - Compare Listings',
      tech: 'Figma',
      image: 'https://via.placeholder.com/240x160/f7931e/ffffff?text=AI+Generator',
      demoUrl: 'https://example.com',
      // githubUrl: 'https://github.com',
      htmlContent: `
        <div class="custom-content">
          <h1>Trade Me</h1>
          <h1>Placeholder</h1>
          <img src="https://placehold.co/600x400" alt="Asobi Interior Design" style="width: 100%; max-width: 600px; border-radius: 8px; margin-bottom: 20px;">
        </div>
      `
    },
    {
      id: 'project-e',
      title: 'Air NZ',
      description: 'UI Exercise - Redesign mobile app',
      tech: 'Figma',
      image: 'https://via.placeholder.com/240x160/61dafb/ffffff?text=Banking+App',
      // demoUrl: 'https://example.com',
      // githubUrl: 'https://github.com',
      htmlContent: `
        <div class="custom-content">
          <h1>Air NZ</h1>
          <h1>Placeholder</h1>
          <img src="https://placehold.co/600x400" alt="Asobi Interior Design" style="width: 100%; max-width: 600px; border-radius: 8px; margin-bottom: 20px;">
        </div>
      `
    },
    {
      id: 'project-f',
      title: 'UX Design Notes',
      description: 'I need notes to help me remember stuff',
      tech: 'Figma, Pen',
      image: 'https://via.placeholder.com/240x160/8b5cf6/ffffff?text=Blockchain',
      // demoUrl: 'https://example.com',
      // githubUrl: 'https://github.com',
      htmlContent: `
        <div class="custom-content">
          <h1>UX Notes</h1>
          <h1>Placeholder</h1>
          <img src="https://placehold.co/600x400" alt="Asobi Interior Design" style="width: 100%; max-width: 600px; border-radius: 8px; margin-bottom: 20px;">
        </div>
      `
    },
    {
      id: 'project-g',
      title: 'Song',
      description: 'Hiya!',
      tech: 'Pizza, Music, Burger, Pets',
      image: 'https://via.placeholder.com/240x160/10b981/ffffff?text=Data+Viz',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      htmlContent: `
        <div class="custom-content">
          <h1>About me</h1>
          <h1>Placeholder</h1>
          <img src="https://placehold.co/600x400" alt="Asobi Interior Design" style="width: 100%; max-width: 600px; border-radius: 8px; margin-bottom: 20px;">
        </div>
      `
    }
  ]

  $: displayProjects = projects.length > 0 ? projects : defaultProjects
</script>

<div class="portfolio-container">
  <!-- 上半部：內容展示區域 -->
  <div class="content-display">
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div 
      class="content-scroll-container"
      role="application"
      aria-label="Project content display"
      bind:this={contentScrollContainer}
      on:mousedown={handleContentMouseDown}
      on:mouseleave={handleContentMouseLeave}
      on:mouseup={handleContentMouseUp}
      on:mousemove={handleContentMouseMove}
    >
      <div class="content-slides">
        {#each displayProjects as project, index (project.id)}
          <div class="content-slide" class:alternate={index % 2 === 1}>
            <div class="content-inner">
              {@html project.htmlContent}
            </div>
          </div>
        {/each}
        <!-- 複製第一個元素以實現無限循環 -->
        {#each displayProjects as project, index (project.id + '_copy')}
          <div class="content-slide" class:alternate={index % 2 === 1}>
            <div class="content-inner">
              {@html project.htmlContent}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- 下半部：專案卡片區域 -->
  <div class="projects-section">
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div 
      class="scroll-container" 
      role="application"
      aria-label="Project cards navigation"
      bind:this={scrollContainer}
      on:mousedown={handleMouseDown}
      on:mouseleave={handleMouseLeave}
      on:mouseup={handleMouseUp}
      on:mousemove={handleMouseMove}
    >
      <div class="projects-grid">
        {#each displayProjects as project, idx (project.id)}
          <ProjectCard
            {project}
            onSelect={selectProject}
          />
        {/each}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .portfolio-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    position: relative;
  }

  /* 上半部：內容展示區域 */
  .content-display {
    height: calc(100vh - 240px); /* 預留300px給卡片區域 */
    overflow: hidden;
    position: relative;
    z-index: 0; /* 確保內容區域在卡片之下 */
  }

  .content-scroll-container {
    width: 100%;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    cursor: grab;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    /* 恢復預設選取，僅在拖曳時於 JS 動態加 user-select: none */
  }

  .portfolio-container
  .content-scroll-container::-webkit-scrollbar {
    display: none;
  }

  /* 全域隱藏所有滾動條（橫向與縱向，針對所有元素） */
  :global(html),
  :global(body),
  :global(*),
  :global(*::before),
  :global(*::after) {
    scrollbar-width: none !important; /* Firefox */
    -ms-overflow-style: none !important; /* IE and Edge */
  }
  :global(*::-webkit-scrollbar) {
    display: none !important;
  }

  .content-scroll-container:active {
    cursor: grabbing;
  }

  .content-slides {
    display: flex;
    height: 100%;
    width: calc(200vw * 7); /* 雙倍寬度以實現無限循環 */
  }

  .content-slide {
    width: auto;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0; /* 移除padding，讓內容貼近viewport邊緣 */
    box-sizing: border-box;
    background-color: #f5f5f5;
  }

  .content-slide.alternate {
    background-color: #e8e8e8; /* 稍微深一點的背景色 */
  }

  .content-inner {
    width: auto; /* 移除 max-width 限制 */
    height: 100%;
    overflow-y: auto;
    padding: 0; /* 完全移除padding，讓內容填滿整個區域 */
    box-sizing: border-box;
    /* 恢復預設選取 */
  }

  /* 為自定義HTML內容提供基本樣式 */
  .content-inner :global(.custom-content) {
    /* line-height: 1.6; */
    color: var(--grey-800);
    box-sizing: border-box;
    height: 100%;
    /* 恢復預設選取 */
  }

  // .content-inner :global(.custom-content h1) {
  //   font-size: 2.5rem;
  //   color: #333;
  //   /* margin: 0 0 16px 0; */
  //   font-weight: 700;
  //   text-align: center;
  // }

  .content-inner :global(.custom-content h2) {
    font-size: 1.3rem;
    // color: #666;
    /* margin: 0 0 24px 0; */
    font-weight: 400;
    text-align: center;
  }

  .content-inner :global(.custom-content h3) {
    font-size: 1.2rem;
    // color: #333;
    /* margin: 20px 0 10px 0; */
    font-weight: 600;
  }

  .content-inner :global(.custom-content p) {
    /* margin: 16px 0; */
    line-height: 1.6;
  }

  .content-inner :global(.custom-content img) {
    max-width: 100%;
    height: auto;
  }

  .content-inner :global(.custom-content a) {
    transition: all 0.3s ease;
  }

  .content-inner :global(.custom-content a:hover) {
    transform: translateY(-2px);
  }

  /* 下半部：專案卡片區域 */
  .projects-section {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 300px; /* 設為300px，確保hover放大卡片不被切掉 */
    background: transparent;
    display: flex;
    align-items: flex-end;
    pointer-events: none;
    overflow: visible; /* 允許hover放大的卡片超出 */
    z-index: 10;
  }

  .scroll-container {
    width: 100%;
    height: 300px; /* 改為300px，給hover放大卡片足夠空間 */
    overflow-x: auto;
    overflow-y: visible; /* 關鍵：允許卡片向上延伸不被切掉 */
    cursor: grab;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    display: flex;
    align-items: flex-end; /* 保持底部對齊 */
    pointer-events: auto;
    position: relative;
    /* 恢復預設選取，圖片可拖曳 */
  }

  .scroll-container:active {
    cursor: grabbing;
  }

  .projects-grid {
    display: flex;
    height: 240px; /* 基礎卡片高度 */
    width: max-content;
    align-items: flex-end;
    gap: 0;
    /* padding-top: 60px; 給hover放大的卡片預留頂部空間 */
    box-sizing: border-box;
  }

  /* 滾動條樣式 */
  .scroll-container::-webkit-scrollbar {
    display: none;
  }

/* digihi styling */
:global(.di-base){
  display: flex;
  align-items: end;
  // background-color: aquamarine;
}

:global(.hero){
  font-size: clamp(3rem, 10vw, 8rem);
  color: var(--grey-100);
  background-color: var(--digihi-blue);
  height: auto;
  width: 880px;
  line-height: 0.8;
  display: block;
  margin-top: auto;
  padding: 3rem 1rem;
  z-index: 1;
}

:global(.di-hero-wrapper){
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--grey-900);
}

:global(.di-hero-wrapper h5){
  width: 950px;
  font-size: 2rem;
  text-align: center;
  line-height: 0.9;
  position:absolute;
  bottom:0;
  color:var(--grey-800);
  display: block;
  // margin-bottom: 0;
  // padding: 0 1rem;
  // z-index: 0;
}

:global(.di-hero-text){
  display: flex;
  position: relative;
  align-items: center;
  // background-color: var(--grey-900);
  height: 100vh;
  z-index: 1;
}

:global(.di-hero-text .hero-text-group){
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position:relative;
  top: -20%;
  border: 1px solid var(--grey-800);
  border-top: none;
  border-bottom: none;

  &:first-of-type {
    border-left: none;
  }
  &:last-of-type {
    border-right: none;
  }
  padding: 0 1rem;
}

:global(.di-hero-text p){
  width: 400px;
  text-align: center;
  font-size: 2rem;
  // background-color: var(--grey-900);
  color: var(--grey-100);
  font-weight: 500;

}

:global(.di-hero-text ul){
  display: block;
  font-size: 1rem;
  color: var(--grey-500);
  max-width: 500px;
}

:global(.di-img-1){
  position: absolute;
  top: 0;
  width:500px
}

</style>
