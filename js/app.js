document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------
    // STATE & INITIALIZATION
    // -----------------------------------------------------
    let currentBook = 'Genesis';
    let currentChapter = 1;
    let savedVerses = JSON.parse(localStorage.getItem('cw_saved_verses')) || [];
    let savedTeachings = JSON.parse(localStorage.getItem('cw_saved_teachings')) || [];

    initTheme();
    initNavigation();
    renderDailyVerse();
    renderHomeTeachings();
    renderTeachingsPage();
    renderAnswersPage();
    initBibleReader();
    renderSavedItems();

    // -----------------------------------------------------
    // THEME HANDLING
    // -----------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('cw_theme', isDark ? 'dark' : 'light');
        themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
    });

    function initTheme() {
        const savedTheme = localStorage.getItem('cw_theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeIcon.textContent = 'light_mode';
        } else {
            themeIcon.textContent = 'dark_mode';
        }
    }

    // -----------------------------------------------------
    // NAVIGATION
    // -----------------------------------------------------
    window.switchTab = function(tabId) {
        // Hide all views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        // Deactivate all nav items
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        
        // Show target view
        document.getElementById(`view-${tabId}`).classList.add('active');
        // Activate target nav item
        const navBtn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
        if (navBtn) navBtn.classList.add('active');
        
        window.scrollTo(0, 0);
    };

    // -----------------------------------------------------
    // HOME VIEW
    // -----------------------------------------------------
    function renderDailyVerse() {
        if (window.dailyVerseData) {
            document.getElementById('daily-verse-text').textContent = `"${window.dailyVerseData.text}"`;
            document.getElementById('daily-verse-ref').textContent = window.dailyVerseData.reference;
        }
    }

    window.shareDailyVerse = function() {
        const text = `"${window.dailyVerseData.text}" - ${window.dailyVerseData.reference} (via Chosen Word App)`;
        if (navigator.share) {
            navigator.share({
                title: 'Verse of the Day',
                text: text,
            }).catch(console.error);
        } else {
            // Fallback for older browsers
            alert(`Copy this verse to share:\n\n${text}`);
        }
    };

    function renderHomeTeachings() {
        const container = document.getElementById('home-teachings-list');
        if (!window.teachingsData) return;

        // Show top 2 recent teachings
        const recent = window.teachingsData.slice(0, 2);
        container.innerHTML = recent.map(t => createTeachingCard(t)).join('');
    }

    // -----------------------------------------------------
    // TEACHINGS VIEW
    // -----------------------------------------------------
    function renderTeachingsPage() {
        const container = document.getElementById('teachings-page-list');
        if (!window.teachingsData) return;
        container.innerHTML = window.teachingsData.map(t => createTeachingCard(t)).join('');
    }

    function createTeachingCard(t) {
        const isSaved = savedTeachings.some(st => st.id === t.id);
        const icon = isSaved ? 'bookmark_added' : 'bookmark_add';
        
        return `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <span class="card-category">${t.category}</span>
                    <button class="icon-btn" onclick="toggleSaveTeaching(${t.id}, event)" style="padding: 0;">
                        <span class="material-symbols-rounded" style="font-size: 1.2rem; color: var(--accent-blue);">${icon}</span>
                    </button>
                </div>
                <h3 class="card-title">${t.title}</h3>
                <p class="card-preview">${t.preview}</p>
                <div style="margin-top: 12px; font-size: 0.85rem; color: var(--accent-gold); font-weight: 600;">
                    Ref: ${t.scripture}
                </div>
            </div>
        `;
    }

    // -----------------------------------------------------
    // ANSWERS VIEW
    // -----------------------------------------------------
    function renderAnswersPage() {
        const container = document.getElementById('answers-list');
        if (!window.answersData) return;
        container.innerHTML = window.answersData.map(a => `
            <div class="card">
                <span class="card-category">${a.category}</span>
                <h3 class="card-title">${a.question}</h3>
                <p style="font-size: 0.95rem; color: var(--text-secondary);">${a.answer}</p>
            </div>
        `).join('');
    }

    // -----------------------------------------------------
    // BIBLE READER
    // -----------------------------------------------------
    function initBibleReader() {
        if (!window.bibleData || window.bibleData.length === 0) return;
        
        // Ensure book exists
        const bookExists = window.bibleData.find(b => b.book === currentBook);
        if (!bookExists) {
            currentBook = window.bibleData[0].book;
        }

        renderBibleChapter();

        document.getElementById('book-select-btn').addEventListener('click', openBookSelector);
        document.getElementById('chapter-select-btn').addEventListener('click', openChapterSelector);
    }

    function renderBibleChapter() {
        const container = document.getElementById('bible-reader-content');
        if (!window.bibleData) return;

        const bookObj = window.bibleData.find(b => b.book === currentBook);
        if (!bookObj) return;

        const chapterObj = bookObj.chapters.find(c => c.chapter == currentChapter);
        
        document.getElementById('book-select-btn').innerHTML = `${currentBook} <span class="material-symbols-rounded">expand_more</span>`;
        document.getElementById('chapter-select-btn').innerHTML = `${currentChapter} <span class="material-symbols-rounded">expand_more</span>`;

        if (!chapterObj) {
            container.innerHTML = `<div class="placeholder-text">Chapter not found.</div>`;
            return;
        }

        let html = '';
        chapterObj.verses.forEach(v => {
            html += `
                <div class="verse">
                    <span class="verse-num">${v.verse}</span>
                    <span class="verse-text" onclick="toggleVerseHighlight(this, '${currentBook}', ${currentChapter}, ${v.verse})">${v.text}</span>
                </div>
            `;
        });
        container.innerHTML = html;
        window.scrollTo(0, 0);
    }

    window.toggleVerseHighlight = function(element, book, chapter, verseNum) {
        element.classList.toggle('highlighted');
        const text = element.innerText;
        const ref = `${book} ${chapter}:${verseNum}`;
        
        if (element.classList.contains('highlighted')) {
            // Save verse
            if (!savedVerses.some(v => v.ref === ref)) {
                savedVerses.push({ ref, text });
                localStorage.setItem('cw_saved_verses', JSON.stringify(savedVerses));
                renderSavedItems();
            }
        } else {
            // Remove verse
            savedVerses = savedVerses.filter(v => v.ref !== ref);
            localStorage.setItem('cw_saved_verses', JSON.stringify(savedVerses));
            renderSavedItems();
        }
    };

    // -----------------------------------------------------
    // BIBLE SELECTOR MODALS
    // -----------------------------------------------------
    const modal = document.getElementById('bible-selector-modal');
    const modalTitle = document.getElementById('modal-title');
    const selectorList = document.getElementById('selector-list');

    function openBookSelector() {
        modalTitle.textContent = "Select Book";
        let html = '';
        window.bibleData.forEach(b => {
            html += `<div class="list-item" onclick="selectBook('${b.book}')">${b.book}</div>`;
        });
        selectorList.innerHTML = html;
        selectorList.className = 'selector-list';
        modal.classList.remove('hidden');
    }

    function openChapterSelector() {
        const bookObj = window.bibleData.find(b => b.book === currentBook);
        if (!bookObj) return;

        modalTitle.textContent = `Select Chapter (${currentBook})`;
        let html = '<div class="grid-list">';
        bookObj.chapters.forEach(c => {
            html += `<div class="grid-item" onclick="selectChapter(${c.chapter})">${c.chapter}</div>`;
        });
        html += '</div>';
        selectorList.innerHTML = html;
        selectorList.className = 'selector-list'; // clear just in case
        modal.classList.remove('hidden');
    }

    window.selectBook = function(book) {
        currentBook = book;
        currentChapter = 1; // reset to chap 1
        closeModal();
        renderBibleChapter();
    };

    window.selectChapter = function(chapter) {
        currentChapter = chapter;
        closeModal();
        renderBibleChapter();
    };

    window.closeModal = function() {
        modal.classList.add('hidden');
    };

    // Close modal if clicked outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // -----------------------------------------------------
    // SAVED / PROFILE VIEW
    // -----------------------------------------------------
    window.switchSavedTab = function(tab) {
        document.getElementById('tab-btn-verses').classList.remove('active');
        document.getElementById('tab-btn-teachings').classList.remove('active');
        document.getElementById('saved-verses-list').classList.remove('active');
        document.getElementById('saved-teachings-list').classList.remove('active');

        document.getElementById(`tab-btn-${tab}`).classList.add('active');
        document.getElementById(`saved-${tab}-list`).classList.add('active');
    };

    window.toggleSaveTeaching = function(id, event) {
        if (event) event.stopPropagation(); // prevent card click
        
        const teaching = window.teachingsData.find(t => t.id === id);
        if (!teaching) return;

        const index = savedTeachings.findIndex(t => t.id === id);
        if (index > -1) {
            savedTeachings.splice(index, 1);
        } else {
            savedTeachings.push(teaching);
        }
        
        localStorage.setItem('cw_saved_teachings', JSON.stringify(savedTeachings));
        renderHomeTeachings(); // re-render to update icons
        renderTeachingsPage();
        renderSavedItems();
    };

    function renderSavedItems() {
        // Verses
        const vContainer = document.getElementById('saved-verses-list');
        if (savedVerses.length === 0) {
            vContainer.innerHTML = `<div class="placeholder-text">No saved verses yet. Highlight verses in the Bible to save them here.</div>`;
        } else {
            vContainer.innerHTML = savedVerses.map(v => `
                <div class="card">
                    <h3 class="card-title">${v.ref}</h3>
                    <p style="font-size: 0.95rem; color: var(--text-secondary);">${v.text}</p>
                </div>
            `).join('');
        }

        // Teachings
        const tContainer = document.getElementById('saved-teachings-list');
        if (savedTeachings.length === 0) {
            tContainer.innerHTML = `<div class="placeholder-text">No bookmarked teachings yet.</div>`;
        } else {
            tContainer.innerHTML = savedTeachings.map(t => createTeachingCard(t)).join('');
        }
    }

    function initNavigation() {
        // Handle hash routes if needed, otherwise default to home
    }
});
