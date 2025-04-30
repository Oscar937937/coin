// 教學系統
class TutorialSystem {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.customPositions = {};
        this.isSettingPosition = false;
        this.setupEventListeners();
        this.createHighlightBox();
    }

    createHighlightBox() {
        const highlight = document.createElement('div');
        highlight.className = 'tutorial-highlight';
        highlight.style.display = 'none';
        document.body.appendChild(highlight);
    }

    setupEventListeners() {
        document.getElementById('tutorialButton').addEventListener('click', () => {
            if (this.isSettingPosition) {
                alert('請先完成位置設置');
                return;
            }
            this.showTutorial();
        });

        // 添加控制按鈕到 body
        const controls = document.createElement('div');
        controls.className = 'tutorial-controls';
        controls.style.display = 'none';
        controls.innerHTML = `
            <button id="prevStep">上一步</button>
            <span id="stepIndicator">1 / 5</span>
            <button id="nextStep">下一步</button>
            <button id="setPositions">設置位置</button>
        `;
        document.body.appendChild(controls);

        document.getElementById('prevStep').addEventListener('click', () => this.prevStep());
        document.getElementById('nextStep').addEventListener('click', () => this.nextStep());
        
        // 修改設置位置按鈕的事件處理
        document.getElementById('setPositions').addEventListener('click', (e) => {
            e.stopPropagation();  // 防止事件冒泡
            if (!this.isSettingPosition) {
                this.startPositionSetting();
            }
        });

        // 添加滑鼠移動事件來預覽位置
        document.addEventListener('mousemove', (e) => {
            if (this.isSettingPosition) {
                const pointer = document.querySelector('.tutorial-pointer');
                pointer.style.left = `${e.clientX}px`;
                pointer.style.top = `${e.clientY}px`;
                
                const textElement = pointer.querySelector('.tutorial-text');
                const stepNames = {
                    1: '硬幣位置',
                    2: '猜數字按鈕',
                    3: '猜圖案按鈕',
                    4: '排行榜',
                    5: '教學按鈕'
                };
                textElement.textContent = `設置第 ${this.currentStep} 個位置：${stepNames[this.currentStep]}`;
                pointer.classList.add('active');
            }
        });

        // 修改點擊事件處理
        document.addEventListener('click', (e) => {
            if (this.isSettingPosition) {
                // 檢查點擊的不是控制按鈕
                if (!e.target.closest('.tutorial-controls')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.setCustomPosition(e.clientX, e.clientY);
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (this.isVisible()) {
                if (e.key === 'ArrowRight' || e.key === 'Enter') {
                    this.nextStep();
                } else if (e.key === 'ArrowLeft') {
                    this.prevStep();
                } else if (e.key === 'Escape') {
                    if (this.isSettingPosition) {
                        this.cancelPositionSetting();
                    } else {
                        this.hideTutorial();
                    }
                }
            }
        });
    }

    startPositionSetting() {
        this.isSettingPosition = true;
        this.currentStep = 1;
        this.customPositions = {};
        document.body.style.cursor = 'crosshair';
        
        // 顯示預覽
        const pointer = document.querySelector('.tutorial-pointer');
        pointer.classList.add('active');
        const textElement = pointer.querySelector('.tutorial-text');
        textElement.textContent = '設置第 1 個位置：硬幣位置';
    }

    cancelPositionSetting() {
        this.isSettingPosition = false;
        document.body.style.cursor = 'default';
        document.querySelector('.tutorial-pointer').classList.remove('active');
        alert('已取消位置設置');
    }

    setCustomPosition(x, y) {
        if (!this.isSettingPosition) return;

        this.customPositions[this.currentStep] = { x, y };
        
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            const stepNames = {
                1: '硬幣位置',
                2: '猜數字按鈕',
                3: '猜圖案按鈕',
                4: '排行榜',
                5: '教學按鈕'
            };
            const textElement = document.querySelector('.tutorial-pointer .tutorial-text');
            textElement.textContent = `設置第 ${this.currentStep} 個位置：${stepNames[this.currentStep]}`;
        } else {
            this.isSettingPosition = false;
            document.body.style.cursor = 'default';
            document.querySelector('.tutorial-pointer').classList.remove('active');
            alert('位置設置完成！');
            localStorage.setItem('tutorialPositions', JSON.stringify(this.customPositions));
        }
    }

    loadCustomPositions() {
        const saved = localStorage.getItem('tutorialPositions');
        if (saved) {
            this.customPositions = JSON.parse(saved);
        }
    }

    isVisible() {
        return document.querySelector('.tutorial-pointer').classList.contains('active');
    }

    showTutorial() {
        this.currentStep = 1;
        this.loadCustomPositions();
        document.querySelector('.tutorial-controls').style.display = 'flex';
        document.querySelector('.tutorial-highlight').style.display = 'block';
        this.updateTutorialContent();
    }

    hideTutorial() {
        const pointer = document.querySelector('.tutorial-pointer');
        pointer.classList.remove('active');
        document.querySelector('.tutorial-controls').style.display = 'none';
        document.querySelector('.tutorial-highlight').style.display = 'none';
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateTutorialContent();
        }
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateTutorialContent();
        } else {
            this.hideTutorial();
        }
    }

    updateTutorialContent() {
        const pointer = document.querySelector('.tutorial-pointer');
        const highlight = document.querySelector('.tutorial-highlight');
        pointer.classList.add('active');
        
        // 更新步驟指示器
        document.getElementById('stepIndicator').textContent = `${this.currentStep} / ${this.totalSteps}`;
        
        // 更新按鈕狀態
        document.getElementById('prevStep').disabled = this.currentStep === 1;
        document.getElementById('nextStep').textContent = this.currentStep === this.totalSteps ? '完成' : '下一步';

        const elements = {
            1: { selector: '.coin', text: '這是硬幣，點擊按鈕開始猜測！', padding: 20 },
            2: { selector: '#guessHeads', text: '點擊這裡猜測硬幣正面（數字）', padding: 10 },
            3: { selector: '#guessTails', text: '點擊這裡猜測硬幣反面（圖案）', padding: 10 },
            4: { selector: '#leaderboard', text: '這裡顯示排行榜，記錄你的最高分數', padding: 10 },
            5: { selector: '#tutorialButton', text: '隨時點擊這裡可以再次查看教學', padding: 10 }
        };

        const element = elements[this.currentStep];
        const targetElement = document.querySelector(element.selector);
        
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            
            // 設置高亮框位置和大小
            highlight.style.top = `${rect.top - element.padding}px`;
            highlight.style.left = `${rect.left - element.padding}px`;
            highlight.style.width = `${rect.width + element.padding * 2}px`;
            highlight.style.height = `${rect.height + element.padding * 2}px`;

            // 設置指示器位置
            if (this.customPositions[this.currentStep]) {
                const pos = this.customPositions[this.currentStep];
                pointer.style.left = `${pos.x}px`;
                pointer.style.top = `${pos.y}px`;
            } else {
                pointer.style.left = `${rect.left + rect.width / 2}px`;
                pointer.style.top = `${rect.top - 60}px`;
            }

            // 設置文本
            const textElement = pointer.querySelector('.tutorial-text');
            textElement.textContent = element.text;
            textElement.style.top = '-80px';
            textElement.style.left = '50%';
        }
    }
}

// 用戶系統
class UserSystem {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('users')) || {};
        this.dailyLeaderboard = JSON.parse(localStorage.getItem('dailyLeaderboard')) || {};
        this.lastResetDate = localStorage.getItem('lastResetDate');
        this.guestScores = JSON.parse(localStorage.getItem('guestScores')) || [];
        this.guestAchievements = JSON.parse(localStorage.getItem('guestAchievements')) || {};
        this.guestAchievementStats = JSON.parse(localStorage.getItem('guestAchievementStats')) || {};
        this.setupEventListeners();
        this.checkLoginStatus();
        this.checkAndResetDailyLeaderboard();
        
        // 添加頁面切換監聽器
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                this.checkLoginStatus();
            }
        });
        
        // 添加頁面可見性監聽器
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.checkLoginStatus();
            }
        });
    }

    checkAndResetDailyLeaderboard() {
        const today = new Date().toDateString();
        if (this.lastResetDate !== today) {
            this.dailyLeaderboard = {};
            localStorage.setItem('dailyLeaderboard', JSON.stringify(this.dailyLeaderboard));
            localStorage.setItem('lastResetDate', today);
        }
    }

    setupEventListeners() {
        // 登入表單處理
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            this.login(username, password);
        });

        // 註冊表單處理
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            this.register(username, password, confirmPassword);
        });

        // 切換登入/註冊表單
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });
    }

    checkLoginStatus() {
        // 首先從 localStorage 檢查登入狀態
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = savedUser;
        }

        const userInfo = document.getElementById('userInfo');
        const authContainer = document.getElementById('authContainer');
        const registerContainer = document.getElementById('registerContainer');
        const gameContainer = document.getElementById('gameContainer');

        if (this.currentUser) {
            userInfo.classList.add('active');
            authContainer.style.display = 'none';
            registerContainer.style.display = 'none';
            gameContainer.classList.add('active');
            this.updateUserInfo();
        } else {
            userInfo.classList.remove('active');
            authContainer.style.display = 'block';
            registerContainer.style.display = 'none';
            gameContainer.classList.remove('active');
        }
    }

    login(username, password) {
        if (this.users[username] && this.users[username].password === password) {
            this.currentUser = username;
            localStorage.setItem('currentUser', username);
            
            // 轉移未登入時的記錄
            if (this.guestScores.length > 0) {
                const highestGuestScore = Math.max(...this.guestScores.map(record => record.score));
                if (highestGuestScore > 0) {
                    // 更新用戶最高分
                    if (!this.users[username].highestScore || highestGuestScore > this.users[username].highestScore) {
                        this.users[username].highestScore = highestGuestScore;
                        localStorage.setItem('users', JSON.stringify(this.users));
                    }
                    
                    // 更新每日排行榜
                    const today = new Date().toDateString();
                    if (!this.dailyLeaderboard[username] || highestGuestScore > this.dailyLeaderboard[username]) {
                        this.dailyLeaderboard[username] = highestGuestScore;
                        localStorage.setItem('dailyLeaderboard', JSON.stringify(this.dailyLeaderboard));
                    }
                }
                
                // 清空未登入記錄
                this.guestScores = [];
                localStorage.removeItem('guestScores');
            }

            // 轉移未登入時的成就記錄
            if (Object.keys(this.guestAchievements).length > 0) {
                const savedAchievements = localStorage.getItem('achievements');
                const currentAchievements = savedAchievements ? JSON.parse(savedAchievements) : {};
                
                // 合併成就記錄
                for (const key in this.guestAchievements) {
                    if (this.guestAchievements[key]) {
                        currentAchievements[key] = true;
                    }
                }
                localStorage.setItem('achievements', JSON.stringify(currentAchievements));
                
                // 合併成就統計
                const savedStats = localStorage.getItem('achievementStats');
                const currentStats = savedStats ? JSON.parse(savedStats) : {};
                for (const key in this.guestAchievementStats) {
                    if (currentStats[key] === undefined || this.guestAchievementStats[key] > currentStats[key]) {
                        currentStats[key] = this.guestAchievementStats[key];
                    }
                }
                localStorage.setItem('achievementStats', JSON.stringify(currentStats));
                
                // 清空訪客成就記錄
                this.guestAchievements = {};
                this.guestAchievementStats = {};
                localStorage.removeItem('guestAchievements');
                localStorage.removeItem('guestAchievementStats');
            }
            
            this.showGame();
            this.updateUserInfo();
            
            // 刷新排行榜顯示
            if (window.game) {
                window.game.displayLeaderboard();
            }
        } else {
            alert('用戶名或密碼錯誤！');
        }
    }

    showLoginForm() {
        document.getElementById('authContainer').style.display = 'block';
        document.getElementById('registerContainer').style.display = 'none';
    }

    showRegisterForm() {
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('registerContainer').style.display = 'block';
    }

    register(username, password, confirmPassword) {
        if (password !== confirmPassword) {
            alert('兩次輸入的密碼不一致！');
            return;
        }

        if (this.users[username]) {
            alert('用戶名已存在！');
            return;
        }

        // 創建新用戶
        this.users[username] = {
            password: password,
            highestScore: 0,
            hasSeenTutorial: false
        };

        // 轉移未登入時的記錄
        if (this.guestScores.length > 0) {
            const highestGuestScore = Math.max(...this.guestScores.map(record => record.score));
            if (highestGuestScore > 0) {
                this.users[username].highestScore = highestGuestScore;
                
                // 更新每日排行榜
                const today = new Date().toDateString();
                if (!this.dailyLeaderboard[username] || highestGuestScore > this.dailyLeaderboard[username]) {
                    this.dailyLeaderboard[username] = highestGuestScore;
                }
            }
            
            // 清空未登入記錄
            this.guestScores = [];
            localStorage.removeItem('guestScores');
        }

        // 轉移未登入時的成就記錄
        if (Object.keys(this.guestAchievements).length > 0) {
            localStorage.setItem('achievements', JSON.stringify(this.guestAchievements));
            localStorage.setItem('achievementStats', JSON.stringify(this.guestAchievementStats));
            
            // 清空訪客成就記錄
            this.guestAchievements = {};
            this.guestAchievementStats = {};
            localStorage.removeItem('guestAchievements');
            localStorage.removeItem('guestAchievementStats');
        }

        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('dailyLeaderboard', JSON.stringify(this.dailyLeaderboard));
        
        // 註冊成功後自動登入
        this.currentUser = username;
        localStorage.setItem('currentUser', username);
        
        // 更新界面顯示
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('registerContainer').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        this.updateUserInfo();
        
        alert('註冊成功！已自動登入。您的遊戲記錄和成就已保存。');
        
        // 立即刷新排行榜顯示
        if (window.game) {
            window.game.displayLeaderboard();
        }
    }

    showGame() {
        const gameContainer = document.getElementById('gameContainer');
        const authContainer = document.getElementById('authContainer');
        const registerContainer = document.getElementById('registerContainer');
        
        gameContainer.style.display = 'block';
        
        if (this.currentUser) {
            authContainer.style.display = 'none';
            registerContainer.style.display = 'none';
        } else {
            authContainer.style.display = 'block';
            registerContainer.style.display = 'none';
        }
        
        this.updateUserInfo();
    }

    updateUserInfo() {
        const userInfo = document.getElementById('userInfo');
        if (this.currentUser) {
            userInfo.innerHTML = `
                <div>歡迎，${this.currentUser}！</div>
                <button onclick="userSystem.logout()">登出</button>
                <button onclick="userSystem.deleteAccount()">註銷賬戶</button>
            `;
            userInfo.classList.add('active');
        } else {
            userInfo.classList.remove('active');
        }
    }

    logout() {
        this.currentUser = null;
        // 重置成就系統
        if (window.game && window.game.achievementSystem) {
            window.game.achievementSystem = new AchievementSystem();
        }
        this.showLoginForm();
    }

    saveScore(score) {
        if (score <= 0) return; // 只有當分數大於0時才記錄

        if (this.currentUser) {
            // 已登入用戶的記錄
            if (!this.users[this.currentUser].highestScore || score > this.users[this.currentUser].highestScore) {
                this.users[this.currentUser].highestScore = score;
                localStorage.setItem('users', JSON.stringify(this.users));
            }

            // 更新每日排行榜
            if (!this.dailyLeaderboard[this.currentUser] || score > this.dailyLeaderboard[this.currentUser]) {
                this.dailyLeaderboard[this.currentUser] = score;
                localStorage.setItem('dailyLeaderboard', JSON.stringify(this.dailyLeaderboard));
            }
        } else {
            // 未登入用戶的記錄
            this.guestScores.push({
                score: score,
                date: new Date().toISOString()
            });
            // 只保留最近的10條記錄
            if (this.guestScores.length > 10) {
                this.guestScores = this.guestScores.slice(-10);
            }
            localStorage.setItem('guestScores', JSON.stringify(this.guestScores));
        }
    }

    getDailyLeaderboard() {
        const scores = [];
        
        // 添加已登入用戶的記錄
        for (const username in this.dailyLeaderboard) {
            // 只顯示仍然存在的用戶的記錄
            if (this.users[username] && this.dailyLeaderboard[username] > 0) {
                scores.push({
                    username: username,
                    score: this.dailyLeaderboard[username]
                });
            }
        }
        
        // 添加未登入用戶的記錄
        if (!this.currentUser && this.guestScores.length > 0) {
            const highestGuestScore = Math.max(...this.guestScores.map(record => record.score));
            if (highestGuestScore > 0) {
                scores.push({
                    username: '訪客',
                    score: highestGuestScore
                });
            }
        }
        
        return scores.sort((a, b) => b.score - a.score).slice(0, 5);
    }

    getAllTimeLeaderboard() {
        const allTimeScores = [];
        for (const username in this.users) {
            const score = this.users[username].highestScore || 0;
            if (score > 0) {
                allTimeScores.push({
                    username: username,
                    score: score
                });
            }
        }
        return allTimeScores.sort((a, b) => b.score - a.score).slice(0, 5);
    }

    deleteAccount() {
        if (this.currentUser) {
            delete this.users[this.currentUser];
            localStorage.setItem('users', JSON.stringify(this.users));
            // 重置成就系統
            if (window.game && window.game.achievementSystem) {
                window.game.achievementSystem = new AchievementSystem();
            }
            this.currentUser = null;
            this.showLoginForm();
        }
    }
}

// 成就系統
class AchievementSystem {
    constructor() {
        this.achievements = {
            beginner: {
                name: "初學者",
                description: "完成第一次猜測",
                type: "basic",
                unlocked: false
            },
            luckyOne: {
                name: "幸運兒",
                description: "連續猜對3次",
                type: "basic",
                unlocked: false
            },
            coinExpert: {
                name: "硬幣達人",
                description: "累計猜對10次",
                type: "basic",
                unlocked: false
            },
            perfectPrediction: {
                name: "完美預測",
                description: "連續猜對5次",
                type: "basic",
                unlocked: false
            },
            marathon: {
                name: "持久戰",
                description: "遊戲時間超過30分鐘",
                type: "basic",
                unlocked: false
            },
            probabilityMaster: {
                name: "概率大師",
                description: "連續猜對8次（概率低於0.0039）",
                type: "advanced",
                unlocked: false
            },
            luckyStar: {
                name: "幸運星",
                description: "連續猜對10次（概率低於0.00097）",
                type: "advanced",
                unlocked: false
            },
            coinCollector: {
                name: "硬幣收藏家",
                description: "完成所有成就",
                type: "advanced",
                unlocked: false
            },
            luckyGod: {
                name: "幸運之神",
                description: "連續猜對25次（幾乎不可能的概率）",
                type: "advanced",
                unlocked: false
            }
        };
        
        this.stats = {
            totalGuesses: 0,
            correctGuesses: 0,
            consecutiveCorrect: 0,
            startTime: null,
            lastGuessTime: null
        };
        
        this.loadAchievements();
    }

    loadAchievements() {
        const userSystem = window.userSystem;
        if (userSystem.currentUser) {
            // 已登入用戶
            const savedAchievements = localStorage.getItem('achievements');
            if (savedAchievements) {
                const parsed = JSON.parse(savedAchievements);
                for (const key in parsed) {
                    if (this.achievements[key]) {
                        this.achievements[key].unlocked = parsed[key];
                    }
                }
            }
            
            const savedStats = localStorage.getItem('achievementStats');
            if (savedStats) {
                this.stats = JSON.parse(savedStats);
            }
        } else {
            // 未登入用戶
            const savedAchievements = localStorage.getItem('guestAchievements');
            if (savedAchievements) {
                const parsed = JSON.parse(savedAchievements);
                for (const key in parsed) {
                    if (this.achievements[key]) {
                        this.achievements[key].unlocked = parsed[key];
                    }
                }
            }
            
            const savedStats = localStorage.getItem('guestAchievementStats');
            if (savedStats) {
                this.stats = JSON.parse(savedStats);
            }
        }
    }

    saveAchievements() {
        const userSystem = window.userSystem;
        const achievementsToSave = {};
        for (const key in this.achievements) {
            achievementsToSave[key] = this.achievements[key].unlocked;
        }
        
        if (userSystem.currentUser) {
            // 已登入用戶
            localStorage.setItem('achievements', JSON.stringify(achievementsToSave));
            localStorage.setItem('achievementStats', JSON.stringify(this.stats));
        } else {
            // 未登入用戶
            localStorage.setItem('guestAchievements', JSON.stringify(achievementsToSave));
            localStorage.setItem('guestAchievementStats', JSON.stringify(this.stats));
        }
    }

    startGame() {
        this.stats.startTime = Date.now();
        this.stats.lastGuessTime = Date.now();
    }

    recordGuess(isCorrect) {
        this.stats.totalGuesses++;
        
        if (isCorrect) {
            this.stats.correctGuesses++;
            this.stats.consecutiveCorrect++;
            this.stats.lastGuessTime = Date.now();
            
            // 檢查成就
            this.checkAchievements();
        } else {
            this.stats.consecutiveCorrect = 0;
        }
        
        this.saveAchievements();
    }

    checkAchievements() {
        // 基礎成就檢查
        if (this.stats.totalGuesses === 1) {
            this.unlockAchievement('beginner');
        }
        
        if (this.stats.consecutiveCorrect >= 3) {
            this.unlockAchievement('luckyOne');
        }
        
        if (this.stats.correctGuesses >= 10) {
            this.unlockAchievement('coinExpert');
        }
        
        if (this.stats.consecutiveCorrect >= 5) {
            this.unlockAchievement('perfectPrediction');
        }
        
        if (this.stats.startTime && (Date.now() - this.stats.startTime) >= 30 * 60 * 1000) {
            this.unlockAchievement('marathon');
        }
        
        // 進階成就檢查
        if (this.stats.consecutiveCorrect >= 8) {
            this.unlockAchievement('probabilityMaster');
        }
        
        if (this.stats.consecutiveCorrect >= 10) {
            this.unlockAchievement('luckyStar');
        }
        
        if (this.stats.consecutiveCorrect >= 25) {
            this.unlockAchievement('luckyGod');
        }
        
        // 檢查硬幣收藏家成就
        let allUnlocked = true;
        for (const key in this.achievements) {
            if (this.achievements[key].type !== 'advanced' && !this.achievements[key].unlocked) {
                allUnlocked = false;
                break;
            }
        }
        if (allUnlocked) {
            this.unlockAchievement('coinCollector');
        }
    }

    unlockAchievement(key) {
        if (!this.achievements[key].unlocked) {
            this.achievements[key].unlocked = true;
            this.showAchievementNotification(key);
            this.saveAchievements();
        }
    }

    showAchievementNotification(key) {
        const achievement = this.achievements[key];
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-content">
                <div class="achievement-title">成就解鎖！</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 添加動畫效果
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // 3秒後移除通知
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    getUnlockedAchievements() {
        const unlocked = [];
        for (const key in this.achievements) {
            if (this.achievements[key].unlocked) {
                unlocked.push({
                    key: key,
                    ...this.achievements[key]
                });
            }
        }
        return unlocked;
    }
}

// 遊戲邏輯
class Game {
    constructor(userSystem) {
        this.userSystem = userSystem;
        this.achievementSystem = new AchievementSystem();
        this.correctCount = 0;
        this.isAnimating = false;
        this.setupEventListeners();
        // 初始顯示排行榜
        this.displayLeaderboard();
    }

    setupEventListeners() {
        const headsButton = document.getElementById('guessHeads');
        const tailsButton = document.getElementById('guessTails');
        
        if (headsButton && tailsButton) {
            headsButton.addEventListener('click', () => this.handleGuess('數字'));
            tailsButton.addEventListener('click', () => this.handleGuess('圖案'));
        }
    }

    toggleButtons(disabled) {
        const headsButton = document.getElementById('guessHeads');
        const tailsButton = document.getElementById('guessTails');
        headsButton.disabled = disabled;
        tailsButton.disabled = disabled;
        headsButton.style.opacity = disabled ? '0.5' : '1';
        tailsButton.style.opacity = disabled ? '0.5' : '1';
    }

    tossCoin() {
        return Math.random() < 0.5 ? '數字' : '圖案';
    }

    calculateProbability(count) {
        return (1 / Math.pow(2, count)).toFixed(4);
    }

    updateResult(message) {
        const resultDiv = document.getElementById('result');
        resultDiv.innerText = message;
        resultDiv.style.display = 'block';
    }

    handleGuess(guess) {
        if (this.isAnimating) return;

        const coin = document.getElementById('flipCoin');
        const result = this.tossCoin();
        
        this.isAnimating = true;
        this.toggleButtons(true);

        // 如果是第一次猜測，開始遊戲計時
        if (this.correctCount === 0) {
            this.achievementSystem.startGame();
        }

        // 重置硬幣的初始狀態
        coin.style.transform = 'rotateY(0deg)';
        
        // 根據結果決定最終旋轉角度
        const finalRotation = result === '數字' ? 1800 : 1980;
        
        // 設置自定義屬性來控制動畫
        coin.style.setProperty('--final-rotation', `${finalRotation}deg`);
        
        // 開始翻轉動畫
        requestAnimationFrame(() => {
            coin.classList.add('flipping');
        });

        // 3秒後（動畫結束時）顯示結果
        setTimeout(() => {
            coin.classList.remove('flipping');
            
            // 確保最終位置正確
            coin.style.transform = `rotateY(${result === '數字' ? 0 : 180}deg)`;

            if (result === guess) {
                this.correctCount++;
                const probability = this.calculateProbability(this.correctCount);
                this.updateResult(`你猜對了！結果是 ${result}。\n連續猜對次數：${this.correctCount}\n當前概率：${probability}`);
                
                // 記錄正確的猜測
                this.achievementSystem.recordGuess(true);
            } else {
                this.updateResult(`你猜錯了！結果是 ${result}。遊戲結束，重新開始。`);
                this.userSystem.saveScore(this.correctCount);
                
                // 記錄錯誤的猜測
                this.achievementSystem.recordGuess(false);
                
                this.correctCount = 0;
            }
            this.displayLeaderboard();
            
            this.isAnimating = false;
            this.toggleButtons(false);
        }, 3000);
    }

    displayLeaderboard() {
        const leaderboardDiv = document.getElementById('leaderboard');
        const dailyLeaderboard = this.userSystem.getDailyLeaderboard();
        const allTimeLeaderboard = this.userSystem.getAllTimeLeaderboard();
        
        let html = '<div class="leaderboards-container">';
        
        // 每日排行榜
        html += '<div class="leaderboard-section">';
        html += '<h2>今日排行榜</h2>';
        if (dailyLeaderboard.length > 0) {
            html += dailyLeaderboard.map((entry, index) => {
                const probability = entry.score > 0 ? this.calculateProbability(entry.score) : '0';
                return `<p>${index + 1}. ${entry.username}: ${entry.score} 次 (概率: ${probability})</p>`;
            }).join('');
        } else {
            html += '<p>今日還沒有記錄</p>';
        }
        html += '</div>';

        // 永久排行榜
        html += '<div class="leaderboard-section">';
        html += '<h2>永久排行榜</h2>';
        if (allTimeLeaderboard.length > 0) {
            html += allTimeLeaderboard.map((entry, index) => {
                const probability = entry.score > 0 ? this.calculateProbability(entry.score) : '0';
                return `<p>${index + 1}. ${entry.username}: ${entry.score} 次 (概率: ${probability})</p>`;
            }).join('');
        } else {
            html += '<p>還沒有記錄</p>';
        }
        html += '</div>';
        
        html += '</div>';
        
        leaderboardDiv.innerHTML = html;
        leaderboardDiv.style.display = 'block';
    }
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    window.userSystem = new UserSystem();
    window.game = new Game(window.userSystem);
    
    // 確保初始顯示狀態正確
    const gameContainer = document.getElementById('gameContainer');
    const authContainer = document.getElementById('authContainer');
    const registerContainer = document.getElementById('registerContainer');
    
    // 強制設置初始顯示狀態
    gameContainer.style.display = 'block';
    
    if (window.userSystem.currentUser) {
        authContainer.style.display = 'none';
        registerContainer.style.display = 'none';
    } else {
        authContainer.style.display = 'block';
        registerContainer.style.display = 'none';
    }
});

// 添加成就通知的樣式
const style = document.createElement('style');
style.textContent = `
    .achievement-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ffd700, #ffa500);
        color: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        transform: translateX(120%);
        transition: transform 0.5s ease;
        z-index: 1000;
    }

    .achievement-notification.show {
        transform: translateX(0);
    }

    .achievement-icon {
        font-size: 2em;
        margin-right: 15px;
    }

    .achievement-content {
        flex: 1;
    }

    .achievement-title {
        font-size: 0.8em;
        opacity: 0.8;
    }

    .achievement-name {
        font-size: 1.2em;
        font-weight: bold;
        margin: 5px 0;
    }

    .achievement-description {
        font-size: 0.9em;
        opacity: 0.9;
    }
`;
document.head.appendChild(style);

let consecutiveCorrectGuesses = 0;
let totalCorrectGuesses = 0;
let gameStartTime = Date.now();
let lastGuessTime = Date.now();

function flipCoin() {
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const coin = document.getElementById('flipCoin');
    coin.classList.add('flipping');
    
    setTimeout(() => {
        coin.classList.remove('flipping');
        const resultDiv = document.getElementById('result');
        resultDiv.style.display = 'block';
        
        if (result === 'heads') {
            resultDiv.textContent = '數字！';
        } else {
            resultDiv.textContent = '圖案！';
        }
        
        // 檢查成就
        checkAchievements(result);
    }, 3000);
}

function checkAchievements(result) {
    const currentTime = Date.now();
    const gameDuration = (currentTime - gameStartTime) / 1000 / 60; // 轉換為分鐘
    
    // 檢查初學者成就
    if (!window.game.achievementSystem.achievements.beginner.unlocked) {
        window.game.achievementSystem.unlockAchievement('beginner');
    }
    
    // 檢查持久戰成就
    if (gameDuration >= 30 && !window.game.achievementSystem.achievements.marathon.unlocked) {
        window.game.achievementSystem.unlockAchievement('marathon');
    }
    
    // 更新連續猜對次數
    if (result === 'heads' && document.getElementById('guessHeads').classList.contains('selected') ||
        result === 'tails' && document.getElementById('guessTails').classList.contains('selected')) {
        consecutiveCorrectGuesses++;
        totalCorrectGuesses++;
        
        // 檢查幸運兒成就
        if (consecutiveCorrectGuesses >= 3 && !window.game.achievementSystem.achievements.luckyOne.unlocked) {
            window.game.achievementSystem.unlockAchievement('luckyOne');
        }
        
        // 檢查完美預測成就
        if (consecutiveCorrectGuesses >= 5 && !window.game.achievementSystem.achievements.perfectPrediction.unlocked) {
            window.game.achievementSystem.unlockAchievement('perfectPrediction');
        }
        
        // 檢查概率大師成就
        if (consecutiveCorrectGuesses >= 8 && !window.game.achievementSystem.achievements.probabilityMaster.unlocked) {
            window.game.achievementSystem.unlockAchievement('probabilityMaster');
        }
        
        // 檢查幸運星成就
        if (consecutiveCorrectGuesses >= 10 && !window.game.achievementSystem.achievements.luckyStar.unlocked) {
            window.game.achievementSystem.unlockAchievement('luckyStar');
        }
        
        // 檢查幸運之神成就
        if (consecutiveCorrectGuesses >= 25 && !window.game.achievementSystem.achievements.luckyGod.unlocked) {
            window.game.achievementSystem.unlockAchievement('luckyGod');
        }
        
        // 檢查硬幣達人成就
        if (totalCorrectGuesses >= 10 && !window.game.achievementSystem.achievements.coinExpert.unlocked) {
            window.game.achievementSystem.unlockAchievement('coinExpert');
        }
    } else {
        consecutiveCorrectGuesses = 0;
    }
    
    // 檢查硬幣收藏家成就
    const allAchievements = window.game.achievementSystem.achievements;
    const allUnlocked = Object.values(allAchievements).every(achievement => 
        achievement.unlocked || achievement.name === '硬幣收藏家'
    );
    if (allUnlocked && !window.game.achievementSystem.achievements.coinCollector.unlocked) {
        window.game.achievementSystem.unlockAchievement('coinCollector');
    }
}

// 更新按鈕點擊事件
document.getElementById('guessHeads').addEventListener('click', function() {
    this.classList.add('selected');
    document.getElementById('guessTails').classList.remove('selected');
    lastGuessTime = Date.now();
    flipCoin();
});

document.getElementById('guessTails').addEventListener('click', function() {
    this.classList.add('selected');
    document.getElementById('guessHeads').classList.remove('selected');
    lastGuessTime = Date.now();
    flipCoin();
});
