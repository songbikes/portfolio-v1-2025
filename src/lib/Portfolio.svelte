<!-- @ts-nocheck -->
<script>
  import ProjectCard from './ProjectCard.svelte'
  import { imageUrls } from './UXNoteImageURL.js';
  import '../styles/airnz.scss';
  import '../styles/aboutme.scss';
  import '../styles/uxnotes.css';
  import '../styles/digihi.css';
  import '../styles/asobi.scss';
  import '../styles/trademe.scss';
  
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

// 產生每排最多4張
const UXNotes = `
  <div class="UXSection">
    <div class="UXNotes">
      ${imageUrls.map(url => `<img src="${url}" loading="lazy" draggable="false" />`).join('')}
    </div>
  </div>
`;



  // 範例專案資料 - 使用HTML內容以便完全自由編輯
  const defaultProjects = [
    // digihi
    {
      id: 'project-a',
      title: 'digiHi',
      description: 'Event driven tech & startup platform',
      tech: 'Figma, Next.js, Tailwind, Convex, Stripe, Clerk',
      image: 'https://xb8rnillf1.ufs.sh/f/697Z538ULBF9vi5kVcTHbjBL8eOS9FpXnM5CGJDVyqQkZfso',
      demoUrl: 'https://digihi.io',
      htmlContent: `
        <div class="custom-content di-base">
          <h1 class="hero">WHERE THE TECH AND STARTUP PEOPLE TO SHINE.</h1>
          
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
    // macroactive
    {
      id: 'project-b',
      title: 'MacroActive',
      description: 'Design Challenge - Retention & Engagement',
      tech: 'Figma',
      image: 'https://xb8rnillf1.ufs.sh/f/697Z538ULBF9ZtNIvdEhcNbi3ptFv0UHqy6Lxa1hoC5B4fPm',
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
    // dacreed
    {
      id: 'project-c',
      title: 'Dacreed',
      description: 'Professional Development Platform',
      tech: 'Figma',
      image: 'https://xb8rnillf1.ufs.sh/f/697Z538ULBF9VlCXU5DZK8MN6L24SBxf1eahlQdu9wJOTHGy',
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
    // asobi
    {
      id: 'project-d',
      title: 'Asobi',
      description: 'My Interior Design Portfolio Website',
      tech: 'Figma, Next.js, Tailwind, Convex',
      image: 'https://xb8rnillf1.ufs.sh/f/697Z538ULBF9QISWSmYEfjk7F2w3AruKIUzcPbe60gnmZ5oR',
      demoUrl: 'https://asobi.tw',
      // githubUrl: 'https://github.com',
      htmlContent: `
      <div class="asobiContainer">
        <h1>ASOBI WAS MY LITTLE INTERIOR DESIGN COMPANY REPRESENTS SPATIAL WORKS</h1>
        <div class="designReasoning">
          <div class="designReasoningContent">
            <h2>Reasoning my design!</h2>
            <p>The mission is to figure out a way to display my works and the content doesn't seem to be too little. Because I didn't organise my photos very well and am not good at taking photos hence there are not many facinating nor heaps of photos to illustrate an image showing I am a cool designer, I have a great business. Responsiveness design is another key consideraion and using my preferred dark theme making it easier with my eyes same as 99% of my own stuff.</p>
            <p>So I decided to centralise everything and leave a huge white space and have a special nav panel on the bottom right corner giving navigation a bit of fun</p>
            <a href="https://asobi.tw" target="_blank" rel="noopener noreferrer">
              <button class="viewWebsiteButton">Visit Website</button>
            </a>
          
          </div>
        </div>
        <video class="asobiVideo" controls controlsList="nodownload nofullscreen noremoteplayback" autoplay muted loop>
          <source src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF9PpgUXvsMEwKYURTVvWXpNklMISGh156nfABO" type="video/mp4"
          >
        </video>
        <div class="designReasoning">
          <div class="designReasoningContent">
            <h2>Things to improve!</h2>
            <p>Image optimisation before upload interms of sizes, quality, etc, and I should have taken more photos back then...</p>
          </div>
        </div>
      </div>
      `
    },
    // airnz
    {
      id: 'project-f',
      title: 'Air NZ',
      description: 'UI Exercise - Redesign mobile app',
      tech: 'Figma',
      image: 'https://xb8rnillf1.ufs.sh/f/697Z538ULBF9aXX34KC7Ad6yWHS3cjPgwJf1Tt2uob0LDxiF',
 
      htmlContent: `
        <div class="AirNZContainer">
          <h1>UI & USER FLOW REVISION EXERCISE</h1>
          
          <video class="AirNZVideo" controls controlsList="nodownload nofullscreen noremoteplayback" autoplay muted loop>
            <source src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF9kah9UDCh4TPYHUfIwknrimsoezySMpZ319d5" type="video/mp4"
            >
          </video>
         
          <div class="airnzImages">
            <div class="airnzTextImgContainer">
              <div class="airnzText">
                <h3>Flight</h3>
                <small>
                  1. These blocks lead to Air NZ website for flight booking actionsI was expecting they will bring me some holiday suggestions but they all only take me to the booking flight section, just like the “Book” button in the nav will do.
                  *The book flight function is quite detailed, 5-step online booking process. I won't touch on that in this exercise.
                  *Try keeping the images giving a good vibe but remove their booking function to avoid frustration.
                </small><br/>
                <small>
                  2. Add booking manually if needed
                  - A bit confusing, a dedicated page for boarding pass, and move this function over that page.
                </small><br/>
                <small>
                  3. Assume these are the main functions for the mobile app
                </small>
              </div>
              <img src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF9HSZS5fnNL4jdyCfwVonh2kTOxib6tXvWlgsJ" alt="Air NZ Design" loading="lazy" draggable="false" class="airnzAfterImg"/>

              <img src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF9I8EyqhRgVBrx1PjfWlo6RN92iTpaOSJY8XcE" alt="Air NZ Design" loading="lazy" draggable="false"/>
            </div>

        
            <div class="airnzTextImgContainer">
              <div class="airnzText">
                <h3>Book</h3>
                <small>1. Set notification can be replaced by something more important? This might be coming from user feedback but I think it would be great putting it with the booking results to notify users' bookings</small><br/>
                <small>2. Book a flight leads to Air NZ website for flight booking actions</small><br/>
                <small>3. A variety of services that are available for booking in which they are either related to the trip/flight or can be booked individually *Parts related to book a flight will remain included in the booking process and those don't will be integrated into another section.</small><br/>
                <small>So far I feel these features compliment each other but can be organised or categorised as well as reinforcing with more pleasing visual design</small><br/>
              </div>
              
              <img src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF9IYKKhARgVBrx1PjfWlo6RN92iTpaOSJY8XcE" alt="Air NZ Design" loading="lazy" draggable="false" class="airnzAfterImg"/>
              
              <img src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF907Yy3B99FdxzmYA6eiPQ83BNSDCZVqlRMn4U" alt="Air NZ Design" loading="lazy" draggable="false"/>
            </div>
  
            <div class="airnzTextImgContainer">
              <div class="airnzText">
                <h3>Airpoints</h3>
                <small>1. Shows the Airpoints membership number</small><br/>
                <small>2. Brings up the barcode by tapping on it</small><br/>
                <small>3. Your balance can go with the 1 and 2</small><br/>
                <small>4. The 2nd section of this page that shows how many points needed for next tier with progress bar and shows the activities in the past</small><br/>
                <small>5. The 3rd section of the page</small><br/>
                <small>6. The 4th section of the page</small><br/>
                <small>7. Those light pink spots indicate the functions redirect users to website</small><br/>
                <small></small>
              </div>
              
              <img src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF9xklumV376fXkqauQE91iJWYnAFHgZyjTGwIK" alt="Air NZ Design" loading="lazy" draggable="false" class="airnzAfterImg"/>
              <img src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF9jUxvzwC6dbmNKiUAoW8gF4D6QLTZR3qeOE1l" alt="Air NZ Design" loading="lazy" draggable="false"/>
            </div>
  
            <div class="airnzTextImgContainer">
              <div class="airnzText">
                <h3>More</h3>
                <small>1. Good to have but in the more section is a little bit counter-intuitive</small><br/>
                <small>2. A great secondary function</small><br/>
                <small>3. Quite crucial for a smooth travel experience</small><br/>
                <small>4. Notification can stay here just fine as a secondary function setting up all notifications for different features</small><br/>
                <small>5. I thought this was a checklist to prepare myself for arrival & departure. But it’s actually checking flights. Maybe another name? And maybe another page?</small><br/>
                <small>6. Sign out</small><br/>
                <small>v</small>
              </div>

              <img src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF9dTkWRWNArmiAK2MEIR5Qq6aYf4O1Bx8SgscH" loading="lazy" draggable="false" class="airnzAfterImg"/>
              <img src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF9kwp72l0Ch4TPYHUfIwknrimsoezySMpZ319d" loading="lazy" draggable="false"/>
  
            </div>
          </div>
      `
    },
    // trade me
    {
      id: 'project-e',
      title: 'Trade Me',
      description: 'Feature Exercise - Compare Listings',
      tech: 'Figma',
      image: 'https://xb8rnillf1.ufs.sh/f/697Z538ULBF99oQaH7Fiso6r4wZNfEplMyUeb1vOa2LDnVxc',
      demoUrl: 'https://example.com',
      // githubUrl: 'https://github.com',
      htmlContent: `
        <div class="trademeContanier">
          <img src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF9fF8kgFampb2Icui3Bo6thfyzgaNnRdUOxHW5" alt="Trade Me Kiwi Bird Compare Listing Button" loading="lazy" draggable="false"
          class="kiwibird"
          >

          
          <img src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF9upYyKhwt4jNavY6SPXCcoW0lknfLxR9Fw2Qp" alt="Trade Me listing card checked compare" loading="lazy" draggable="false">
          <img src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF95OELPHueoRNUDBwuAnqspY6J0jyXVIb9aOdP" alt="Trade Me listing card unchecked compare" loading="lazy" draggable="false">
          <h1>Trade Me</h1>
          </div>
      `
    },

    // UX Notes
    {
      id: 'project-g',
      title: 'UX Notes',
      description: 'I need notes to help me remember stuff',
      tech: 'Figma, Pen',
      image: 'https://xb8rnillf1.ufs.sh/f/697Z538ULBF9mlsnTLKktpLuPXUHeqEs48z6Yyc1DIbSQhZB',
      htmlContent: UXNotes
    },
    // about me
    {
      id: 'project-h',
      title: 'About Me',
      description: 'Hiya!',
      tech: 'Pizza, Music, Burger, Pets',
      image: 'https://xb8rnillf1.ufs.sh/f/697Z538ULBF9PG6Jl2MEwKYURTVvWXpNklMISGh156nfABOD',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com',
      htmlContent: `
        <div class="AboutMeSection">
          <div class="resume-container">
            <header class="resume-header">
              <h1 class="name">Song-Yi Feng</h1>
              <p class="title">Product Designer</p>
              <a href="https://www.linkedin.com/in/songyifeng/" target="_blank" rel="noopener noreferrer" class="linkedin-link">
                <svg viewBox="0 0 24 24" class="linkedin-icon">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
                </svg>
              </a>
            </header>
            
            <section class="about-section">
              <h2>About</h2>
              <p class="about-text">Hi there! I am pizza and burger lover, and the guy who built and designed digiHi, a platform for the tech and startup people. I am building other new stuff atm as I am passionate about building products. Contact me if you want to work with me or if you want me work for you. Cheers Have a great day!</p><br/>
              <p class="about-text"> Otherwise, I just shifted my career from architecture to product design in 2024 both are about collaboration and listening and communication and creativity and usability and user-centric design (Well, architecture is more complex tbh). These skills makes me proud of myself.</p><br/>
              <p class="about-text">I love using Figma to illustrate my ideas, and then prototyping by coding. I use Next.js, Convex, Tailwind, SCSS and Lucide mostly, still pretty green in the world of programming but comfortable enough with the help of AI and my persistent mindset. </p>
            </section>
            
            <section class="experience-section">
              <h2>Experience</h2>
              <div class="timeline">
                <div class="timeline-item">
                  <div class="timeline-date">
                    <span class="date-range">Aug.2024<br>Present</span>
                  </div>
                  <div class="timeline-content">
                    <h3>Product Designer / Founder <span class="company">@ digiHi</span></h3>
                    <p>Designed and built digiHi from scratch based on some conversation in a few startup events and lens of observation</p>
                  </div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-date">
                    <span class="date-range">May.2024<br>Aug.2024</span>
                  </div>
                  <div class="timeline-content">
                    <h3>Contract UX/UI Designer <span class="company">@ Dacreed</span></h3>
                    <p>Refactored information architecture and user flow and features of the Professional Development Platform. Redesigned the UI, colour selections and layout</p>
                  </div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-date">
                    <span class="date-range">Jan.2020 -<br>April.2024</span>
                  </div>
                  <div class="timeline-content">
                    <h3>Architectural Technician <span class="company">@ Assemble</span></h3>
                    <p>BC & RC architecture documentation and code compliance.</p>
                  </div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-date">
                    <span class="date-range">Aug.2019 -<br>2021.May</span>
                  </div>
                  <div class="timeline-content">
                    <h3>Assistant Tutor <span class="company">@ Unitec</span></h3>
                    <p>Assisted with lecturers and students to be successful</p>
                  </div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-date">
                    <span class="date-range">2008 - 2017</span>
                  </div>
                  <div class="timeline-content">
                    <h3>Founder / Interior Designer <span class="company">@ Asobi</span></h3>
                    <p>Excelled in commercial, residential interior design projects. Click ASOBI to check out my interior design stuff there</p>
                  </div>
                </div>
              </div>
            </section>

            <div class="tech-section">
              <h2>I use</h2>
              <div class="tech-icons">
                <img class="figma" src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF9n41tdTcD3RIOQ6ljPp0fUmZYFs5zEyhJoVCM" alt="Figma logo" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js logo" />
                <img src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF9hdE5Y9PiTknVi2zXWZ1ByA6cbdDq4h537sHR" alt="Convex logo" />
                <img src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF9bELy7aZTOgBp5SZ7jHEl8UzLMRaiD1WY9Cs3" alt="Tailwind CSS logo" />
                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" alt="SCSS logo" />
              </div>
            </div>
            
            <section class="skills-section">
              <h2>I love</h2>
              <ul class="skills-list">
                <li>Product Design</li>
                <li>UX/UI Design</li>
                <li>Team Collaboration</li>
                <li>Research</li>
                <li>Usability Testing</li>
              </ul>
            </section>

            </div>
            <div class="aboutMeFooter">
              <img src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF9PG6Jl2MEwKYURTVvWXpNklMISGh156nfABOD" alt="Profile Picture" class="pizza">

              <video 
                class="aboutMeVideo" controls controlsList="nodownload nofullscreen noremoteplayback" muted loop>
                <source 
                  src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF95SmFOOeoRNUDBwuAnqspY6J0jyXVIb9aOdPe" 
                  type="video/mp4">
              </video>

              <img src="https://xb8rnillf1.ufs.sh/f/697Z538ULBF9PG6Jl2MEwKYURTVvWXpNklMISGh156nfABOD" alt="Profile Picture" class="pizza">
            </div>
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

  .portfolio-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  /* 上半部：內容展示區域 */
  .content-display {
    height: calc(100vh - 12.5vw); /* 100 / 8 = 12.5 */
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

    &:active {
      cursor: grabbing;
    }
  }

  .content-slides {
    display: flex;
    height: 100%;
    width: calc(200vw * 8); /* 雙倍寬度以實現無限循環 */
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
  }

  .content-inner {
    width: auto; /* 移除 max-width 限制 */
    min-width: 100vw;
    height: 100%;
    overflow-y: auto;
    padding: 0; /* 完全移除padding，讓內容填滿整個區域 */
    box-sizing: border-box;
    /* 恢復預設選取 */
  }

  /* 為自定義HTML內容提供基本樣式 */
  .content-inner :global(.custom-content) {
    color: var(--grey-800);
    box-sizing: border-box;
    height: 100%;
    /* 恢復預設選取 */
  }

  /* 下半部：專案卡片區域 */
  .projects-section {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: calc(12.5vw * 1.2); /* 設為300px，確保hover放大卡片不被切掉 */
    background: transparent;
    display: flex;
    align-items: flex-end;
    pointer-events: none;
    overflow: visible; /* 允許hover放大的卡片超出 */
    z-index: 10;

    .scroll-container {
      width: 100%;
      height: calc(12.5vw * 1.2); /* 改為300px，給hover放大卡片足夠空間 */
      overflow-x: auto;
      overflow-y: visible; /* 關鍵：允許卡片向上延伸不被切掉 */
      cursor: grab;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */
      display: flex;
      align-items: flex-end; /* 保持底部對齊 */
      justify-content: center;
      pointer-events: auto;
      position: relative;

      &:active {
        cursor: grabbing;
      }
      /* 滾動條樣式 */
      &::-webkit-scrollbar {
        display: none; /* 隱藏滾動條 */
      }

      .projects-grid {
        display: flex;
        height: 12.5vw; /* 基礎卡片高度 */
        width: max-content;
        align-items: flex-end;
        box-sizing: border-box;
      }
    }
  }

</style>
