# �� RPG Adventure Game - Web Version

Một game RPG web-based hiện đại với giao diện đẹp và hình ảnh, được xây dựng bằng React + TypeScript + Vite!

## ✨ Tính năng chính

### 🎨 **Giao diện Web Hiện đại**
- **React UI**: Giao diện đẹp với React components
- **Responsive Design**: Tương thích với mọi thiết bị
- **Beautiful Animations**: Hiệu ứng mượt mà và đẹp mắt
- **Modern CSS**: Gradient backgrounds, glassmorphism effects
- **Icons**: Sử dụng Lucide React icons

### 🗡️ **Hệ thống Chiến đấu Nâng cao**
- **Critical Hits**: 15% cơ hội gây damage x1.5
- **Dodge System**: 8% cơ hội né tránh hoàn toàn
- **Damage Variation**: Damage thay đổi từ 80-120%
- **Combat Log**: Hiển thị chi tiết với animations

### 🎒 **Hệ thống Inventory & Items**
- **Item Rarity**: 5 cấp độ với màu sắc khác nhau
- **Equipment System**: Trang bị ảnh hưởng stats
- **Shop System**: Mua bán items với UI đẹp
- **Item Cards**: Hiển thị items với icons và descriptions

### 📈 **Hệ thống Level & Progression**
- **Progress Bars**: Hiển thị HP, MP, EXP với animations
- **Attribute System**: Strength, Agility, Intelligence
- **Skill Points**: Học skills mới khi level up
- **Stat Cards**: Hiển thị stats với icons

### 📜 **Quest & Achievement System**
- **Quest Tracking**: Theo dõi tiến độ real-time
- **Achievement Badges**: Hiển thị thành tựu với icons
- **Progress Visualization**: Progress bars cho quests
- **Modal Windows**: Giao diện đẹp cho quests/achievements

## 🚀 **Cách chạy game**

### **Yêu cầu**
- Node.js (version 16+)
- npm hoặc yarn

### **Cài đặt**
```bash
cd src/app/kris/demogame
npm install
```

### **Chạy development server**
```bash
npm run dev
```
Game sẽ mở tự động tại: http://localhost:3000

### **Build cho production**
```bash
npm run build
npm run preview
```

## 🎯 **Cách chơi**

### **Giao diện chính**
- **Player Stats**: Hiển thị HP, MP, ATK, DEF, Gold, Level với progress bars
- **Combat Log**: Xem lịch sử chiến đấu
- **Current Enemy**: Thông tin quái vật hiện tại
- **Action Buttons**: Các nút hành động với icons

### **Các tính năng**
- **⚔️ Tấn công**: Chiến đấu với quái vật
- **🎒 Túi đồ**: Xem và sử dụng items
- **😴 Nghỉ ngơi**: Hồi phục HP và MP
- **🏪 Shop**: Mua items với gold
- **📚 Skills**: Xem và học skills
- **📜 Quests**: Theo dõi nhiệm vụ
- **🏆 Achievements**: Xem thành tựu

### **Combat System**
- Click "Tấn công" để chiến đấu
- Xem combat log để theo dõi diễn biến
- Nhận rewards khi đánh bại quái vật
- Quái vật sẽ respawn sau khi bị đánh bại hết

### **Inventory System**
- Items được phân loại theo rarity với màu sắc
- Click vào item để sử dụng
- Xem thông tin chi tiết của từng item

## 🏗️ **Kiến trúc Web**

### **Frontend Stack**
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool và dev server
- **Lucide React**: Icon library
- **CSS3**: Styling với modern features

### **Game Logic**
- **Core Systems**: Tái sử dụng từ console version
- **State Management**: React useState cho game state
- **Component Architecture**: Modular và reusable
- **Event Handling**: Interactive UI elements

### **File Structure**
```
src/
├── main.tsx          # React entry point
├── App.tsx           # Main game component
├── index.css         # Global styles
├── core/             # Game logic (reused)
├── entities/         # Game entities
├── systems/          # Game systems
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## 🎨 **UI/UX Features**

### **Visual Design**
- **Glassmorphism**: Modern glass-like effects
- **Gradient Backgrounds**: Beautiful color schemes
- **Smooth Animations**: CSS transitions và hover effects
- **Responsive Grid**: Adaptive layouts

### **Interactive Elements**
- **Hover Effects**: Visual feedback on interactions
- **Modal Windows**: Clean popup interfaces
- **Progress Bars**: Animated progress indicators
- **Button States**: Active, hover, disabled states

### **Accessibility**
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Semantic HTML structure
- **Color Contrast**: High contrast for readability
- **Responsive Design**: Works on all screen sizes

## 🔧 **Development**

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run clean        # Clean build directory
```

### **Hot Reload**
- Code changes automatically refresh the browser
- Fast development cycle
- TypeScript compilation on save

### **Build Optimization**
- Tree shaking for smaller bundles
- Code splitting for better performance
- Optimized assets and minification

## 🌟 **Tính năng nổi bật**

### **Modern Web Experience**
- **Single Page Application**: Smooth navigation
- **Real-time Updates**: Instant UI feedback
- **Progressive Enhancement**: Works without JavaScript
- **Mobile First**: Optimized for mobile devices

### **Game Features**
- **Persistent State**: Game state maintained during session
- **Auto-save**: Progress saved automatically
- **Offline Support**: Works without internet
- **Cross-platform**: Runs on any modern browser

## 🔮 **Tính năng tương lai**

- [ ] **Sound Effects**: Audio feedback
- [ ] **Particle Effects**: Visual combat effects
- [ ] **Character Sprites**: Animated characters
- [ ] **Background Music**: Ambient game music
- [ ] **Save/Load System**: Persistent game saves
- [ ] **Multiplayer**: Real-time multiplayer
- [ ] **PWA Support**: Installable web app
- [ ] **Leaderboards**: Global rankings

## 📱 **Mobile Support**

Game được tối ưu hóa cho mobile:
- **Touch-friendly**: Large touch targets
- **Responsive Layout**: Adapts to screen size
- **Mobile Navigation**: Swipe gestures
- **Performance**: Optimized for mobile devices

## 🎮 **Browser Compatibility**

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 📝 **License**

MIT License - Tự do sử dụng và phát triển!

---

**🎮 Chúc bạn chơi game vui vẻ trên web! ✨**

**🌐 Truy cập: http://localhost:3000 sau khi chạy `npm run dev`** 