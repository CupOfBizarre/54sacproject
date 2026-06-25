/* ════════════════════════════════════════════════════════════════════
   infinite-canvas2.js
   Infinite-scroll storytelling grid — FLIP engine + 50 stories
   ════════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── 1. Story Dataset (50 entries) ─────────────────────────────── */
const STORIES = [
  { id:  1, title: "Tiếng Ru Đại Ngàn",           subtitle: "Ngôn Ngữ & Ký Ức",              type: "image", src: "https://i.pinimg.com/736x/99/3a/4e/993a4eef98c6c13ebd3805a74066d677.jpg", aspect: "16:9", colorClass: "cell--ink",    tag: "Khởi Điểm · 001",
    content: "<p>Tiếng hát, lời ru vang vọng trên núi cao không đơn thuần là âm thanh — đó là tấm gương phản chiếu hệ giá trị và niềm tin của cả một cộng đồng qua nhiều thế hệ.</p><p>SẮC lựa chọn ngôn ngữ làm điểm khởi đầu để đánh thức những căn tính văn hóa đang dần vắng bóng trong nhịp sống hiện đại.</p>" },

  { id:  2, title: "Bóng Dưới Mái Rông",          subtitle: "Kiến Trúc & Tự Sự",             type: "image", src: "https://i.pinimg.com/736x/62/ad/bb/62adbb90a748050d8633edf9e3a38ad4.jpg", aspect: "4:5",  colorClass: "cell--ink",   tag: "Không Gian · 002",
    content: "<p>Nhà rông không chỉ che mưa che nắng, nó là trung tâm vũ trụ thu nhỏ của buôn làng, nơi lưu giữ những sử thi truyền miệng và các quyết sách hệ trọng.</p><p>Khi một nếp nhà cũ phai màu, một phần ký ức tập thể cũng đứng trước nguy cơ bị lãng quên.</p>" },

  { id:  3, title: "Hệ Giá Trị Song Hành",         subtitle: "Lắng Nghe Thế Hệ",              type: "image", src: "https://i.pinimg.com/736x/4b/b1/1c/4bb11cedaa515e32cea7bb76d427e779.jpg", aspect: "1:1",  colorClass: "cell--ink",  tag: "Cộng Đồng · 003",
    content: "<p>Khoảng cách giữa người già giữ lửa và người trẻ sinh ra ở bản làng đang ngày một rộng hơn do làn sóng đô thị hóa.</p><p>Sự kết nối chỉ thực sự xảy ra khi người trẻ thấu hiểu chữ nghĩa của ông bà, biến di sản thành dòng chảy tiếp nối trong hiện tại.</p>" },

  { id:  4, title: "Bản Đồ 54 Sắc Độ",           subtitle: "Cơ Sở Dữ Liệu Trực Quan",       type: "image", src: "https://i.pinimg.com/736x/06/4d/3c/064d3c328c0698c87103b3950aeb723f.jpg", aspect: "4:5",  colorClass: "cell--ink",    tag: "Nghiên Cứu · 004",
    content: "<p>Dự án hướng tới xây dựng một hệ thống lưu trữ trực quan về 54 dân tộc anh em. Mỗi bản sắc là một mảnh ghép không thể tách rời trong bức tranh toàn cảnh.</p><p>Đây không phải là một bảo tàng tĩnh lặng, mà là không gian động để văn hóa bản địa đối thoại và tự định hình giá trị.</p>" },

  { id:  5, title: "Nhịp Điệu Đất Nước",          subtitle: "Thư & Thơ Cổ Truyền",           type: "image", src: "https://i.pinimg.com/736x/be/63/62/be63624038ecbfbe685e2c6ca517f658.jpg", aspect: "1:1",  colorClass: "cell--ink", tag: "Ấn Phẩm · 005",
    content: "<p>Những câu ca dao tục ngữ được đúc kết từ ngàn đời ẩn chứa tri thức bản địa sâu sắc về tự nhiên, thời tiết và quy luật ứng xử nhân sinh.</p><p>Việc biên soạn và chuyển dịch các tác phẩm này là cách để quá khứ bước tiếp một bước dài vào đời sống đương đại.</p>" },

  { id:  6, title: "Khung Cửi Thời Gian",         subtitle: "Sợi Chỉ Kết Nối Kinh Tế",       type: "image", src: "https://i.pinimg.com/736x/ab/16/d5/ab16d54b65b1fe78fa2a137edf942e6e.jpg", aspect: "16:9", colorClass: "cell--ink",    tag: "Phát Triển · 006",
    content: "<p>Các sản phẩm sáng tạo từ dự án đóng vai trò như nhịp cầu kinh tế, giúp cộng đồng bản địa tự nuôi dưỡng và tiếp tục kể câu chuyện của chính mình.</p><p>Văn hóa chỉ có sức sống bền bỉ khi nó trực tiếp tạo ra giá trị bền vững và nâng cao sinh kế cho người dân.</p>" },

  { id:  7, title: "Thước Phim Bản Địa",          subtitle: "Phương Thức Biểu Đạt",          type: "image", src: "https://i.pinimg.com/736x/07/2f/c1/072fc1c2bba3ee7c1689ceba636d953c.jpg", aspect: "4:5",  colorClass: "cell--ink",   tag: "Điện Ảnh · 007",
    content: "<p>Ghi lại vẻ đẹp của các lễ hội, điệu múa và những khoảnh khắc đời thường thông qua ống kính điện ảnh chân thực, không tô vẽ.</p><p>Mỗi thước phim là một nỗ lực xóa bỏ định kiến, mang đến cái nhìn sâu sắc thay vì những góc nhìn hời hợt của khách du lịch vội vã.</p>" },

  { id:  8, title: "Sự Gắn Bó Lâu Dài",           subtitle: "Bộ Tiêu Chí Đánh Giá ASK",       type: "image", src: "https://i.pinimg.com/736x/a7/ec/cc/a7ecccdf11f4a96eeae3fed62b4a94f1.jpg", aspect: "1:1",  colorClass: "cell--ink",    tag: "Khảo Sát · 008",
    content: "<p>Tác động của dự án được đo lường khắt khe theo hai khung: Skill-based đối với cộng đồng thiểu số và Cultural-based đối với người trẻ tiêu thụ sản phẩm.</p><p>Mục tiêu tối thượng là sự đồng sáng tạo, nơi người bản địa thực sự làm chủ câu chuyện văn hóa của họ.</p>" },

  { id:  9, title: "Thế Ứng Xử Tự Nhiên",         subtitle: "Tri Thức Sinh Thái",            type: "image", src: "https://i.pinimg.com/736x/4f/cb/09/4fcb09a9ceee311ad4dac9ea297123c9.jpg", aspect: "16:9", colorClass: "cell--ink", tag: "Sinh Thái · 009",
    content: "<p>Cách người đồng bào chọn đất dựng bản, bảo vệ nguồn nước và nương tựa vào rừng già chứa đựng những bài học lớn về phát triển bền vững.</p><p>Khi thiên nhiên bị xâm hại, toàn bộ hệ thống biểu tượng tôn giáo và nghệ thuật gắn liền với nó cũng sụp đổ theo.</p>" },

  { id: 10, title: "Lửa Đêm Xoang",                subtitle: "Vòng Xoắn Ốc Văn Hóa",          type: "image", src: "https://i.pinimg.com/736x/61/e8/41/61e841334bc2f7d7b05614b333ffca2f.jpg", aspect: "4:5",  colorClass: "cell--ink",  tag: "Âm Nhạc · 010",
    content: "<p>Tiếng cồng chiêng vang lên trong đêm không chỉ để giải trí. Đó là sợi dây tâm linh nối kết con người với thần linh, nối kết cá thể với cộng đồng.</p><p>SẮC tôn vinh các phương thức biểu đạt nghệ thuật này bằng cách đưa chúng vào các không gian trải nghiệm đương đại.</p>" },

  { id: 11, title: "Chân Dung Người Giữ Lửa",     subtitle: "Đại Diện Bản Sắc",              type: "image", src: "https://i.pinimg.com/736x/c7/3d/54/c73d542d78849102afb73b65d39fd20d.jpg", aspect: "1:1",  colorClass: "cell--ink",    tag: "Con Người · 011",
    content: "<p>Những nghệ nhân già chính là những pho từ điển sống của buôn làng. Thời gian trôi đi, những nếp nhăn trên khuôn mặt họ khắc ghi lịch sử của cả một tộc người.</p><p>Lắng nghe họ kể chuyện là cách chúng ta tìm lại những mảnh vỡ ký ức bị đánh rơi.</p>" },

  { id: 12, title: "Tương Lai Của Quá Khứ",        subtitle: "Đồng Sáng Tạo Bền Vững",        type: "image", src: "https://i.pinimg.com/736x/81/ee/1c/81ee1c1fe079e394184ff29006919158.jpg", aspect: "16:9", colorClass: "cell--ink",   tag: "Tầm Nhìn · 012",
    content: "<p>Dự án SẮC cam kết giao tiếp minh bạch và phân chia lợi ích công bằng. Di sản văn hóa phải được bảo tồn bằng hành động trao quyền trực tiếp cho người bản địa.</p><p>Chỉ khi cộng đồng thấy mình được đại diện đúng đắn, câu chuyện văn hóa mới có sức sống lâu bền.</p>" },

  { id: 13, title: "Ký Tự Trên Thổ Cẩm",          subtitle: "Biểu Tượng Học",                type: "image", src: "https://i.pinimg.com/736x/99/3a/4e/993a4eef98c6c13ebd3805a74066d677.jpg", aspect: "4:5",  colorClass: "cell--ink",    tag: "Nghệ Thuật · 013",
    content: "<p>Mỗi hoa văn dệt trên tấm vải không phải là những nét trang trí ngẫu nhiên. Chúng là ngôn ngữ viết không lời, kể về những chuyến di cư, truyền thuyết chim muông và nguồn cội dòng tộc.</p>" },

  { id: 14, title: "Tiếng Vọng Sông Dài",          subtitle: "Dấu Ấn Phù Sa",                type: "image", src: "https://i.pinimg.com/736x/62/ad/bb/62adbb90a748050d8633edf9e3a38ad4.jpg", aspect: "1:1",  colorClass: "cell--ink",  tag: "Lịch Sử · 014",
    content: "<p>Những dòng sông chảy qua các bản làng mang theo phù sa nuôi dưỡng đất đai và cả những câu hát đối đáp giao duyên bên bến nước.</p><p>Hành trình đi tìm lại tiếng nói sâu xa của đất nước chính là dòng chảy đưa chúng ta về với bản ngã nguyên bản.</p>" }
];

/* ─── 2. Configuration & Shared State ───────────────────────────── */
const GRID_COLS = 6;
const GAP = 5;

const state = {
  offsetX: 0, offsetY: 0,
  isDragging: false,
  lastX: 0, lastY: 0,
  velX: 0, velY: 0,
  startX: 0, startY: 0,
  gridW: 0, gridH: 0,
  rafId: null,
  layoutArray: []
};

const root = document.getElementById('canvas-root');

/* ─── 3. Vector Icon SVGs ───────────────────────────────────────── */
function imageIconSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
}
function textIconSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="14" y2="15"/><line x1="10" y1="21" x2="10" y2="3"/></svg>`;
}

/* ─── 4. Geometric Layout Packer (Skyline algorithm) ─────────────
   Finds the lowest available row for each cell by scanning every
   possible column position, rather than marching forward only.
   This is what makes the Mondrian grid pack tightly — a small 1×1
   cell that comes later in the dataset can still fill a gap left
   behind by a taller neighbour earlier in the row, instead of being
   forced to start a brand new row underneath everything.            */
function buildDynamicLayout(unitW) {
  const packed = [];
  // columnHeights[c] = the next free row index in column c
  const columnHeights = new Array(GRID_COLS).fill(0);

  function findBestSlot(colSpan, rowSpan) {
    let bestCol = 0;
    let bestRow = Infinity;

    // Scan every possible starting column, find the row at which
    // this span would actually sit (limited by its tallest blocking
    // column), then keep whichever option gives the LOWEST row —
    // i.e. the slot that lets this cell sit as high up as possible.
    for (let col = 0; col <= GRID_COLS - colSpan; col++) {
      let rowForThisCol = 0;
      for (let c = col; c < col + colSpan; c++) {
        rowForThisCol = Math.max(rowForThisCol, columnHeights[c]);
      }
      if (rowForThisCol < bestRow) {
        bestRow = rowForThisCol;
        bestCol = col;
      }
    }

    return { col: bestCol, row: bestRow };
  }

  STORIES.forEach((story) => {
    let colSpan = 1;
    let rowSpan = 1;

    if (story.aspect === "16:9") { colSpan = 3; rowSpan = 2; }
    else if (story.aspect === "4:5") { colSpan = 2; rowSpan = 3; }
    else if (story.aspect === "2:1") { colSpan = 2; rowSpan = 1; }
    else if (story.aspect === "1:1") { colSpan = 2; rowSpan = 2; }

    if (story.type === "empty") { colSpan = 1; rowSpan = 1; }

    const { col, row } = findBestSlot(colSpan, rowSpan);

    const posX = col * (unitW + GAP);
    const posY = row * (unitW + GAP);
    const cellW = colSpan * unitW + (colSpan - 1) * GAP;
    const cellH = rowSpan * unitW + (rowSpan - 1) * GAP;

    packed.push({ story, x: posX, y: posY, w: cellW, h: cellH });

    for (let c = col; c < col + colSpan; c++) {
      columnHeights[c] = row + rowSpan;
    }
  });

  const maxColumnRowHeight = Math.max(...columnHeights);
  const totalGridHeight = maxColumnRowHeight * (unitW + GAP);

  return { cells: packed, totalHeight: totalGridHeight };
}

/* ─── 5. DOM Cell Generator ─────────────────────────────────────── */
function createDOMCellNode(item) {
  const cell = document.createElement('div');
  cell.className = `cell ${item.story.colorClass}`;
  cell.style.left = `${item.x}px`;
  cell.style.top  = `${item.y}px`;
  cell.style.width  = `${item.w}px`;
  cell.style.height = `${item.h}px`;
  cell.setAttribute('data-story-id', item.story.id);


  if (item.story.type === 'empty') {
    const meta = document.createElement('div');
    meta.className = 'cell__meta';
    meta.innerHTML = `<div class="meta-coord" style="font-family:var(--font-mono); font-size:9px; opacity:0.4; color:#fff;">${item.story.tag}</div>`;
    cell.appendChild(meta);
    return cell;
  }

  const caption = document.createElement('div');
  caption.className = 'cell__caption';

  const header = document.createElement('div');
  header.innerHTML = `<div class="cell__tag">${item.story.tag}</div><div class="cell__title">${item.story.title}</div>`;
  caption.appendChild(header);

  const footer = document.createElement('div');
  footer.innerHTML = `<div class="cell__subtitle">${item.story.subtitle}</div><div class="cell__cta">Read Story</div>`;
  caption.appendChild(footer);

  cell.appendChild(caption);

  if (item.story.src) {
    const media = document.createElement('img');
    media.className = 'cell__media';
    media.src = item.story.src;
    media.alt = item.story.title;
    media.loading = 'lazy';
    media.draggable = false;
    media.setAttribute('ondragstart', 'return false');
    cell.appendChild(media);
  } else {
    const mock = document.createElement('div');
    mock.className = 'cell__img-mock';
    mock.innerHTML = item.story.type === 'image' ? imageIconSVG() : textIconSVG();
    cell.appendChild(mock);
  }

  return cell;
}

/* ─── 6. Matrix View Builder ────────────────────────────────────── */
function build() {
  const vw = window.innerWidth;
  
  // Apply layout expansion configuration to create a noticeably wider canvas view
  const scaleFactor = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--grid-scale-factor') || 1);
  const baseUnitW = Math.floor((vw - (GAP * (GRID_COLS - 1))) / GRID_COLS);
  const unitW = Math.floor(baseUnitW * scaleFactor);

  const layout = buildDynamicLayout(unitW);
  state.layoutArray = layout.cells;
  state.gridW = GRID_COLS * (unitW + GAP);
  state.gridH = layout.totalHeight;

  for (let i = 0; i < 9; i++) {
    const container = document.getElementById(`tile-${i}`);
    if (!container) continue;
    container.innerHTML = '';
    container.style.width  = `${state.gridW}px`;
    container.style.height = `${state.gridH}px`;
    state.layoutArray.forEach(item => container.appendChild(createDOMCellNode(item)));
  }

  if (state.offsetX === 0 && state.offsetY === 0) {
    state.offsetX = -Math.floor(state.gridW  - window.innerWidth  / 2);
    state.offsetY = -Math.floor(state.gridH - window.innerHeight / 2);
  }
}

/* ─── 7. Render / Tick Loop ─────────────────────────────────────── */
function tick() {
  if (isAnimatingModal) {
    state.rafId = requestAnimationFrame(tick);
    return;
  }

  if (!state.isDragging) {
    state.velX *= 0.92;
    state.velY *= 0.92;
    
    if (Math.abs(state.velX) < 0.005) state.velX = 0;
    if (Math.abs(state.velY) < 0.005) state.velY = 0;
    
    state.offsetX += state.velX;
    state.offsetY += state.velY;
  }

  const wrappedX = ((state.offsetX % state.gridW) + state.gridW) % state.gridW;
  const wrappedY = ((state.offsetY % state.gridH) + state.gridH) % state.gridH;

  for (let ty = 0; ty < 3; ty++) {
    for (let tx = 0; tx < 3; tx++) {
      const tileIndex = ty * 3 + tx;
      const tile = document.getElementById(`tile-${tileIndex}`);
      if (!tile) continue;

      let renderX = (tx - 1) * state.gridW + wrappedX;
      let renderY = (ty - 1) * state.gridH + wrappedY;

      if (renderX >= state.gridW)  renderX -= 3 * state.gridW;
      if (renderX < -state.gridW)  renderX += 3 * state.gridW;
      if (renderY >= state.gridH)  renderY -= 3 * state.gridH;
      if (renderY < -state.gridH)  renderY += 3 * state.gridH;

      tile.style.transform = `translate3d(${renderX}px, ${renderY}px, 0)`;
    }
  }

  const hudCoords = document.getElementById('hud-coords');
  if (hudCoords) {
    const lon = Math.floor(Math.abs(state.offsetX) % 180);
    const lat = Math.floor(Math.abs(state.offsetY) % 90);
    hudCoords.textContent = `${lat}°N / ${lon}°E`;
  }

  state.rafId = requestAnimationFrame(tick);
}

/* ─── 8. FLIP Animation Controller ─────────────────────────────── */
let activeStory    = null;
let activeCellEl   = null;
let isAnimatingModal = false;

function populateModalContent(story, mediaContainer) {
  document.getElementById('modal-story-tag').textContent      = story.tag      || '';
  document.getElementById('modal-story-title').textContent    = story.title    || '';
  document.getElementById('modal-story-subtitle').textContent = story.subtitle || '';

  const bodyEl = document.getElementById('modal-story-body');
  bodyEl.innerHTML = story.content || `<p>Expanded record for <strong>${story.title}</strong>.</p>`;

  mediaContainer.innerHTML = '';
  if (story.src) {
    const img = document.createElement('img');
    img.src = story.src;
    img.alt = story.title;
    img.draggable = false;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    mediaContainer.appendChild(img);
  } else {
    const mock = document.createElement('div');
    mock.className = 'cell__img-mock';
    mock.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0.15;color:#111;';
    mock.innerHTML = story.type === 'image' ? imageIconSVG() : textIconSVG();
    mediaContainer.appendChild(mock);
  }
}

function openStoryModal(story, cellEl) {
  if (isAnimatingModal) return;
  isAnimatingModal = true;
  activeStory  = story;
  activeCellEl = cellEl;

  state.velX = 0;
  state.velY = 0;

  const modalOverlay   = document.getElementById('modal-stage');
  const mediaContainer = document.getElementById('modal-media-frame');
  const card           = document.getElementById('modal-card');

  // §1 Measure cell FIRST before any DOM changes
  const cellRect = cellEl.getBoundingClientRect();

  // §2 Populate content silently — modal still invisible
  populateModalContent(story, mediaContainer);
  mediaContainer.style.opacity = '0';
  card.style.opacity = '0';

  // §3 Make modal layout-present but visually invisible
  modalOverlay.style.cssText = `
    visibility: visible;
    pointer-events: none;
    background: rgba(4,4,4,0);
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
    transition: none;
    display: flex;
  `;

  // CRITICAL FIX FOR MOBILE: Temporarily flatten the 3D transform 
  // so we measure the true, final resting dimensions of the media frame.
  card.style.setProperty('transform', 'none', 'important');
  card.style.setProperty('transition', 'none', 'important');
  modalOverlay.classList.add('is-open');

  // §4 Two rAF — guarantees full layout pass with the flattened state
  requestAnimationFrame(() => requestAnimationFrame(() => {
    // Measure the true final layout geometry
    const targetRect = mediaContainer.getBoundingClientRect();

    // Reset the card back to its initial tilted state immediately 
    // so it can transition normally alongside the clone
    modalOverlay.classList.remove('is-open');
    card.style.transform = '';
    card.style.transition = '';
    
    // Force a single synthetic reflow to lock the initial tilt state back in
    card.getBoundingClientRect();

    // §5 Build clone at cell position
    const existingClone = document.getElementById('flip-clone');
    if (existingClone) existingClone.remove();

    const cellBg = window.getComputedStyle(cellEl).backgroundColor;
    const clone  = document.createElement('div');
    clone.id = 'flip-clone';
    clone.style.cssText = `
      position: fixed;
      left: ${cellRect.left}px;
      top: ${cellRect.top}px;
      width: ${cellRect.width}px;
      height: ${cellRect.height}px;
      background: ${cellBg};
      overflow: hidden;
      z-index: 9999;
      pointer-events: none;
    `;

    if (story.src) {
      const img = document.createElement('img');
      img.src = story.src;
      img.draggable = false;
      img.style.cssText = `
        position: absolute; inset: 0;
        width: 100%; height: 100%;
        object-fit: cover;
        display: block;
      `;
      clone.appendChild(img);
    }

    document.body.appendChild(clone);

    // §6 Force reflow for clone positioning
    clone.getBoundingClientRect();

    // §7 & §8 Morph seamlessly to the true un-warped target layout coordinates
    clone.style.willChange = 'left, top, width, height';
    clone.style.transition = `
      left 0.9s cubic-bezier(0.16, 1, 0.3, 1),
      top 0.9s cubic-bezier(0.16, 1, 0.3, 1),
      width 0.9s cubic-bezier(0.16, 1, 0.3, 1),
      height 0.9s cubic-bezier(0.16, 1, 0.3, 1)
    `;
    
    clone.style.left   = `${targetRect.left}px`;
    clone.style.top    = `${targetRect.top}px`;
    clone.style.width  = `${targetRect.width}px`;
    clone.style.height = `${targetRect.height}px`;

    // Fire the CSS transforms entry animations now
    modalOverlay.classList.add('is-open');

    requestAnimationFrame(() => {
      modalOverlay.style.cssText = `
        visibility: visible;
        pointer-events: none;
        display: flex;
        transition: background 0.45s cubic-bezier(0.16, 1, 0.3, 1),
                    backdrop-filter 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        background: rgba(4,4,4,0.82);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      `;
    });

    // §10 Swap clone out for real structural card view components
    let settled = false;
    function onOpenDone() {
      if (settled) return;
      settled = true;

      clone.style.willChange = '';
      clone.remove();

      card.style.transition = 'opacity 0.2s ease';
      card.style.opacity    = '1';

      mediaContainer.style.transition = 'opacity 0.2s ease';
      mediaContainer.style.opacity    = '1';

      modalOverlay.classList.add('content-visible');
      modalOverlay.style.pointerEvents = 'auto';

      isAnimatingModal = false;
    }

    clone.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'width') onOpenDone();
    }, { once: true });

    setTimeout(onOpenDone, 680);
  }));
}

function closeStoryModal() {
  if (isAnimatingModal || !activeStory || !activeCellEl) return;
  isAnimatingModal = true;

  state.velX = 0;
  state.velY = 0;

  const modalOverlay   = document.getElementById('modal-stage');
  const mediaContainer = document.getElementById('modal-media-frame');
  const card           = document.getElementById('modal-card');

  // §1 Capture real-time dimensions of the active open media viewport and destination cell
  const targetRect = mediaContainer.getBoundingClientRect();
  const cellRect   = activeCellEl.getBoundingClientRect();

  // §2 Immediately hide the real card layout and clear state classes to initiate mobile CSS slide-down
  card.style.transition  = 'none';
  card.style.opacity     = '0';
  mediaContainer.style.opacity = '0';
  modalOverlay.classList.remove('content-visible');
  modalOverlay.classList.remove('is-open');
  modalOverlay.style.pointerEvents = 'none';

  // §3 Smoothly fade out the backdrop blurring overlay
  modalOverlay.style.transition = `
    background 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    backdrop-filter 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    visibility 0s linear 0.95s
  `;
  modalOverlay.style.background = 'rgba(4,4,4,0)';
  modalOverlay.style.backdropFilter = 'blur(0px)';
  modalOverlay.style.webkitBackdropFilter = 'blur(0px)';

  // §4 Build the canvas morphing clone starting at the open media container's bounds
  const existingClone = document.getElementById('flip-clone');
  if (existingClone) existingClone.remove();

  const cellBg = window.getComputedStyle(activeCellEl).backgroundColor;
  const clone  = document.createElement('div');
  clone.id = 'flip-clone';
  clone.style.cssText = `
    position: fixed;
    left: ${targetRect.left}px;
    top: ${targetRect.top}px;
    width: ${targetRect.width}px;
    height: ${targetRect.height}px;
    background: ${cellBg};
    overflow: hidden;
    z-index: 9999;
    pointer-events: none;
    will-change: left, top, width, height, opacity;
  `;

  if (activeStory.src) {
    const img = document.createElement('img');
    img.src = activeStory.src;
    img.draggable = false;
    img.style.cssText = `
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      display: block;
    `;
    clone.appendChild(img);
  }

  document.body.appendChild(clone);

  // Force layout engine recalculation pass
  clone.getBoundingClientRect();

  // §5 Transition dimensions and positions smoothly back into the native grid row/column matrix
  clone.style.transition = `
    left 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    top 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    width 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    height 0.9s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s ease 0.18s
  `;
  clone.style.left    = `${cellRect.left}px`;
  clone.style.top     = `${cellRect.top}px`;
  clone.style.width   = `${cellRect.width}px`;
  clone.style.height  = `${cellRect.height}px`;
  clone.style.opacity = '0';

  const capturedCell = activeCellEl;
  let settled = false;

  function onCloseDone() {
    if (settled) return;
    settled = true;

    clone.remove();
    capturedCell.style.opacity = '';

    // Reset overlay layout back to standard hidden base state
    modalOverlay.style.cssText = `
      display: flex;
      visibility: hidden;
      pointer-events: none;
      background: rgba(4,4,4,0);
      backdrop-filter: blur(0px);
      transition: none;
    `;

    // Completely scrub custom inline style attributes to keep DOM pristine
    card.style.cssText = '';
    mediaContainer.style.cssText = '';
    mediaContainer.innerHTML = '';

    // Cleanly clear away the temporary !important properties we injected during measurement
    card.style.removeProperty('transform');
    card.style.removeProperty('transition');

    activeStory      = null;
    activeCellEl     = null;
    isAnimatingModal = false;
  }

  // Listen to 'opacity' or 'top' transitions (on mobile, width might be matching, which bypasses width events)
  clone.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'opacity' || e.propertyName === 'top') onCloseDone();
  }, { once: true });

  // Ultimate fallback execution boundary
  setTimeout(onCloseDone, 620);
}
/* ─── 9. Pointer Interaction Layer ─────────────────────────────── */
function onPointerDown(e) {

  state.isDragging = true;
  state.startX = e.clientX;
  state.startY = e.clientY;
  state.lastX  = e.clientX;
  state.lastY  = e.clientY;
  state.velX   = 0;
  state.velY   = 0;
  root.classList.add('dragging');
  if (root.setPointerCapture) root.setPointerCapture(e.pointerId);
}

function onPointerMove(e) {
  if (!state.isDragging) return;
  const dx = e.clientX - state.lastX;
  const dy = e.clientY - state.lastY;
  state.velX     = dx;
  state.velY     = dy;
  state.offsetX += dx;
  state.offsetY += dy;
  state.lastX    = e.clientX;
  state.lastY    = e.clientY;
}

function onPointerUp(e) {
  if (!state.isDragging) return;
  state.isDragging = false;
  root.classList.remove('dragging');
  if (root.releasePointerCapture) {
    try { root.releasePointerCapture(e.pointerId); } catch (_) {}
  }

  const dragDistance = Math.hypot(e.clientX - state.startX, e.clientY - state.startY);

  if (dragDistance < 6) {
    const target = document.elementFromPoint(e.clientX, e.clientY);
    const cell   = target ? target.closest('.cell') : null;
    if (cell) {
      const storyId = parseInt(cell.getAttribute('data-story-id'), 10);
      const story   = STORIES.find(s => s.id === storyId);
      if (story && story.type !== 'empty') {
        openStoryModal(story, cell);
      }
    }
  }
}

/* ─── 10. Initialization ────────────────────────────────────────── */
root.addEventListener('pointerdown',   onPointerDown);
root.addEventListener('pointermove',   onPointerMove);
root.addEventListener('pointerup',     onPointerUp);
root.addEventListener('pointercancel', onPointerUp);
root.addEventListener('pointerleave',  onPointerUp);
root.addEventListener('touchstart', e => {
  if (e.target.closest('#canvas-root')) e.preventDefault();
}, { passive: false });

/* Macro View Event State Transition Logic Trigger Configuration */
/* ─── Replay SAC Splash Animation ───────────────────────────────── */
const macroToggleBtn = document.getElementById('macro-toggle-btn');
if (macroToggleBtn) {
  macroToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (typeof window.replaySplash === 'function') {
      window.replaySplash();
    }
  });
}

document.getElementById('modal-close-trigger').addEventListener('click', e => {
  e.stopPropagation();
  closeStoryModal();
});

document.getElementById('modal-stage').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-stage')) closeStoryModal();
});

document.getElementById('modal-like-button').addEventListener('click', function () {
  this.classList.toggle('liked');
  document.getElementById('modal-likes-counter').textContent =
    this.classList.contains('liked') ? '1 Verified Signature' : '0 Signatures';
});

document.getElementById('modal-share-button').addEventListener('click', function () {
  navigator.clipboard.writeText(window.location.href).catch(() => {});
  const orig = this.innerHTML;
  this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#0077B6" stroke-width="1.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  setTimeout(() => { this.innerHTML = orig; }, 2000);
});

window.addEventListener('keydown', e => { if (e.key === 'Escape') closeStoryModal(); });

window.addEventListener('resize', () => {
  cancelAnimationFrame(state.rafId);
  build();
  state.rafId = requestAnimationFrame(tick);
});

/* Boot Setup Execution */
build();
state.rafId = requestAnimationFrame(tick);
