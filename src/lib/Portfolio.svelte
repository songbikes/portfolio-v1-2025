<!-- @ts-nocheck -->
<script>
  import ProjectCard from './ProjectCard.svelte'

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
      
      const scrollPosition = projectIndex * window.innerWidth
      contentScrollContainer.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
      
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
    
    // 停止現有的慣性滾動
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
    e.preventDefault()
    
    const currentTime = Date.now()
    const x = e.pageX - contentScrollContainer.offsetLeft
    const walk = (x - contentStartX) * 1.5
    const newScrollLeft = contentScrollLeft - walk
    
    // 計算速度
    const deltaTime = currentTime - lastTime
    if (deltaTime > 0) {
      const deltaPosition = newScrollLeft - lastPosition
      velocity = deltaPosition / deltaTime
    }
    
    contentScrollContainer.scrollLeft = newScrollLeft
    lastPosition = newScrollLeft
    lastTime = currentTime
  }

  // 慣性滾動動畫
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
      const newScroll = currentScroll + velocity * 16 // 16ms per frame
      
      // 處理無限循環
      const maxScroll = contentScrollContainer.scrollWidth / 2 // 因為內容重複了一次
      
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
      title: 'E-Commerce Platform',
      description: '全功能電商平台',
      tech: 'React, TypeScript, Tailwind CSS',
      image: 'https://via.placeholder.com/240x160/646cff/ffffff?text=E-Commerce',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      htmlContent: `
        <div class="custom-content">
          <h1>E-Commerce Platform</h1>
          <h2>現代化電商解決方案</h2>
          
          <p>這是一個完整的電商平台，包含商品展示、購物車、付款系統、用戶管理、訂單追蹤等功能。使用React建構前端，搭配Node.js後端API，提供流暢的購物體驗。</p>
          
          <img src="https://via.placeholder.com/600x300/646cff/ffffff?text=E-Commerce+Screenshot" alt="電商平台截圖" style="width: 100%; max-width: 600px; border-radius: 8px; margin: 20px 0;" />
          
          <h3>主要功能</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin: 20px 0;">
            <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #646cff;">響應式設計</div>
            <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #646cff;">多種付款方式</div>
            <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #646cff;">庫存管理</div>
            <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #646cff;">訂單追蹤</div>
            <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #646cff;">用戶評價系統</div>
          </div>
          
          <h3>技術棧</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin: 20px 0;">
            <span style="background: #646cff; color: white; padding: 8px 12px; border-radius: 20px; font-size: 0.9rem;">React</span>
            <span style="background: #646cff; color: white; padding: 8px 12px; border-radius: 20px; font-size: 0.9rem;">Node.js</span>
            <span style="background: #646cff; color: white; padding: 8px 12px; border-radius: 20px; font-size: 0.9rem;">MongoDB</span>
            <span style="background: #646cff; color: white; padding: 8px 12px; border-radius: 20px; font-size: 0.9rem;">Stripe API</span>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://example.com" target="_blank" style="display: inline-block; padding: 12px 24px; background: #646cff; color: white; text-decoration: none; border-radius: 6px; margin: 0 8px;">查看 Demo</a>
            <a href="https://github.com" target="_blank" style="display: inline-block; padding: 12px 24px; background: #333; color: white; text-decoration: none; border-radius: 6px; margin: 0 8px;">GitHub 代碼</a>
          </div>
        </div>
      `
    },
    {
      id: 'project-b',
      title: 'Social Media App',
      description: '社交媒體應用程式',
      tech: 'Vue.js, Node.js, MongoDB',
      image: 'https://via.placeholder.com/240x160/ff3e00/ffffff?text=Social+App',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      htmlContent: `
        <div class="custom-content">
          <h1>Social Media App</h1>
          <h2>連接世界的社交平台</h2>
          
          <p>一個現代化的社交媒體應用，讓用戶可以分享動態、照片、與朋友互動。具備即時聊天、動態推送、hashtag功能等。</p>
          
          <div style="display: flex; gap: 20px; margin: 30px 0; flex-wrap: wrap;">
            <img src="https://via.placeholder.com/280x200/ff3e00/ffffff?text=Mobile+View" alt="手機版" style="border-radius: 8px; flex: 1; min-width: 250px;" />
            <img src="https://via.placeholder.com/280x200/ff3e00/ffffff?text=Desktop+View" alt="桌面版" style="border-radius: 8px; flex: 1; min-width: 250px;" />
          </div>
          
          <h3>核心功能</h3>
          <ul style="line-height: 1.8; color: #555;">
            <li>即時聊天系統</li>
            <li>動態照片分享</li>
            <li>智能推送通知</li>
            <li>Hashtag 標籤系統</li>
            <li>朋友推薦算法</li>
          </ul>
          
          <blockquote style="background: #f9f9f9; padding: 20px; border-left: 4px solid #ff3e00; margin: 20px 0; font-style: italic;">
            "這個應用讓我能夠輕鬆地與朋友保持聯繫，界面設計非常直觀好用！" - 測試用戶反饋
          </blockquote>
        </div>
      `
    },
    {
      id: 'project-c',
      title: 'Task Management System',
      description: '專案管理系統',
      tech: 'Svelte, Express.js, PostgreSQL',
      image: 'https://via.placeholder.com/240x160/42b883/ffffff?text=Task+Manager',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      htmlContent: `
        <div class="custom-content">
          <h1>Task Management System</h1>
          <h2>高效團隊協作工具</h2>
          
          <p>專為團隊協作設計的任務管理系統，支援專案規劃、任務分配、進度追蹤、時間管理等功能。</p>
          
          <div style="background: linear-gradient(135deg, #42b883, #369870); color: white; padding: 30px; border-radius: 10px; margin: 30px 0; text-align: center;">
            <h3 style="margin: 0 0 10px 0; color: white;">提升團隊效率</h3>
            <p style="margin: 0; font-size: 1.1rem;">平均提升 40% 的專案完成速度</p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 30px 0;">
            <div style="text-align: center;">
              <div style="width: 60px; height: 60px; background: #42b883; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: white; font-weight: bold; font-size: 1.5rem;">📊</div>
              <h4 style="margin: 0;">甘特圖</h4>
            </div>
            <div style="text-align: center;">
              <div style="width: 60px; height: 60px; background: #42b883; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: white; font-weight: bold; font-size: 1.5rem;">👥</div>
              <h4 style="margin: 0;">團隊協作</h4>
            </div>
            <div style="text-align: center;">
              <div style="width: 60px; height: 60px; background: #42b883; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: white; font-weight: bold; font-size: 1.5rem;">⏰</div>
              <h4 style="margin: 0;">時間追蹤</h4>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'project-d',
      title: 'AI Content Generator',
      description: 'AI內容生成器',
      tech: 'Python, TensorFlow, FastAPI',
      image: 'https://via.placeholder.com/240x160/f7931e/ffffff?text=AI+Generator',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      htmlContent: `
        <div class="custom-content">
          <h1>AI Content Generator</h1>
          <h2>智能內容創作助手</h2>
          
          <p>運用先進的AI技術，幫助用戶快速生成高質量的文章、廣告文案、社交媒體內容等。</p>
          
          <video controls style="width: 100%; max-width: 600px; border-radius: 8px; margin: 20px 0;">
            <source src="#" type="video/mp4">
            您的瀏覽器不支援影片播放。
          </video>
          
          <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #f7931e; margin-top: 0;">AI 技術特色</h3>
            <p>✨ 支援多種語言和風格<br>
               🚀 毫秒級內容生成<br>
               🎯 SEO 優化建議<br>
               📝 自動校對和優化</p>
          </div>
        </div>
      `
    },
    {
      id: 'project-e',
      title: 'Mobile Banking App',
      description: '行動銀行應用',
      tech: 'React Native, Redux, Firebase',
      image: 'https://via.placeholder.com/240x160/61dafb/ffffff?text=Banking+App',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      htmlContent: `
        <div class="custom-content">
          <h1>Mobile Banking App</h1>
          <h2>安全便捷的行動金融</h2>
          
          <p>提供完整的行動銀行服務，包括帳戶查詢、轉帳、投資、貸款申請等功能。</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <img src="https://via.placeholder.com/200x400/61dafb/ffffff?text=Mobile+App" alt="手機應用截圖" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);" />
          </div>
          
          <div style="background: #f0f9ff; border: 2px solid #61dafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #61dafb; margin-top: 0;">🔒 安全保障</h3>
            <p>採用銀行級別的安全加密技術，確保您的資金和隱私安全。</p>
          </div>
        </div>
      `
    },
    {
      id: 'project-f',
      title: 'Blockchain Explorer',
      description: '區塊鏈瀏覽器',
      tech: 'Solidity, Web3.js, Ethereum',
      image: 'https://via.placeholder.com/240x160/8b5cf6/ffffff?text=Blockchain',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      htmlContent: `
        <div class="custom-content">
          <h1>Blockchain Explorer</h1>
          <h2>探索區塊鏈世界</h2>
          
          <p>專業的區塊鏈瀏覽器，讓用戶可以查詢交易記錄、智能合約、錢包地址等資訊。</p>
          
          <div style="font-family: 'Courier New', monospace; background: #1a1a1a; color: #8b5cf6; padding: 20px; border-radius: 8px; margin: 20px 0; overflow-x: auto;">
            <div>Block #15,234,567</div>
            <div>Hash: 0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08</div>
            <div>Transactions: 142</div>
            <div>Gas Used: 12,345,678</div>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #8b5cf6; color: white;">
                <th style="padding: 10px; text-align: left;">功能</th>
                <th style="padding: 10px; text-align: left;">描述</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px;">交易查詢</td>
                <td style="padding: 10px;">即時查詢鏈上交易</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px;">智能合約</td>
                <td style="padding: 10px;">檢視合約代碼和狀態</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px;">網路統計</td>
                <td style="padding: 10px;">實時網路數據分析</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: 'project-g',
      title: 'Data Visualization Platform',
      description: '數據視覺化平台',
      tech: 'D3.js, Python, Django',
      image: 'https://via.placeholder.com/240x160/10b981/ffffff?text=Data+Viz',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      htmlContent: `
        <div class="custom-content">
          <h1>Data Visualization Platform</h1>
          <h2>讓數據說話的平台</h2>
          
          <p>強大的數據視覺化平台，支援多種圖表類型、即時數據更新、互動式儀表板。</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
            <div style="background: linear-gradient(45deg, #10b981, #059669); height: 150px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">📊 圖表分析</div>
            <div style="background: linear-gradient(45deg, #3b82f6, #1d4ed8); height: 150px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">📈 趨勢預測</div>
          </div>
          
          <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
            <h3 style="color: #10b981; margin-top: 0;">數據洞察</h3>
            <p>透過先進的視覺化技術，將複雜的數據轉化為易於理解的圖表和報告，幫助企業做出更明智的決策。</p>
          </div>
          
          <canvas id="demo-chart" width="400" height="200" style="border: 1px solid #ddd; border-radius: 4px; width: 100%; max-width: 500px;"></canvas>
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
      on:scroll={handleContentScroll}
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
        {#each displayProjects as project (project.id)}
          <ProjectCard
            {project}
            onSelect={selectProject}
          />
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
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
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .content-scroll-container::-webkit-scrollbar {
    display: none;
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
    width: 100vw;
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
    width: 100%; /* 移除 max-width 限制 */
    height: 100%;
    overflow-y: auto;
    padding: 0; /* 完全移除padding，讓內容填滿整個區域 */
    box-sizing: border-box;
  }

  /* 為自定義HTML內容提供基本樣式 */
  .content-inner :global(.custom-content) {
    line-height: 1.6;
    color: #333;
    /* padding: 40px; 在內容層級加padding，避免文字貼邊 */
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .content-inner :global(.custom-content h1) {
    font-size: 2.5rem;
    color: #333;
    /* margin: 0 0 16px 0; */
    font-weight: 700;
    text-align: center;
  }

  .content-inner :global(.custom-content h2) {
    font-size: 1.3rem;
    color: #666;
    /* margin: 0 0 24px 0; */
    font-weight: 400;
    text-align: center;
  }

  .content-inner :global(.custom-content h3) {
    font-size: 1.2rem;
    color: #333;
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
    height: 301px; /* 改為300px，給hover放大卡片足夠空間 */
    overflow-x: auto;
    overflow-y: visible; /* 關鍵：允許卡片向上延伸不被切掉 */
    cursor: grab;
    scrollbar-width: auto;
    display: flex;
    align-items: flex-end; /* 保持底部對齊 */
    pointer-events: auto;
    position: relative;
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
    height: 1px;
  }

  .scroll-container::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .scroll-container::-webkit-scrollbar-thumb {
    background: #888;
    /* border-radius: 4px; */
  }

  .scroll-container::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
