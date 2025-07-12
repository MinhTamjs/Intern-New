# 🗺️ World-Based RPG Adventure Game

## 🎮 Tổng quan

Game RPG Adventure đã được nâng cấp thành một **world-based RPG** với hệ thống di chuyển tự do, thay vì chỉ tương tác qua nút bấm. Bây giờ bạn có thể di chuyển nhân vật trong một thế giới 2D với các khu vực khác nhau.

## 🎯 Tính năng chính

### 🌍 **World System**
- **Thế giới 20x15 tiles** với các loại terrain khác nhau
- **Di chuyển tự do** bằng WASD hoặc Arrow Keys
- **Camera tự động** theo dõi player
- **Collision detection** - không thể đi qua núi và nước

### 🎨 **Terrain Types**
- **🌱 Grass**: Khu vực an toàn, ít gặp quái vật
- **🌲 Forest**: Rừng rậm, tỷ lệ gặp quái vật cao hơn
- **⛰️ Mountain**: Không thể đi qua
- **💧 Water**: Không thể đi qua
- **🕳️ Cave**: Hang động, tỷ lệ gặp quái vật cao nhất
- **🏘️ Town**: Thị trấn an toàn, không có quái vật

### ⚔️ **Combat System**
- **Di chuyển vào quái vật** để bắt đầu chiến đấu
- **Random encounters** khi di chuyển trong rừng/cave
- **Turn-based combat** với các action: Attack, Skill, Item, Flee
- **Combat log** hiển thị chi tiết trận đấu
- **Experience & Gold** khi đánh bại quái vật

### 🎒 **Inventory & Shop**
- **Item system** với rarity levels
- **Shop system** để mua potions và items
- **Equipment system** (sẽ được implement)

## 🎮 Cách chơi

### **Di chuyển**
- **W/↑**: Di chuyển lên
- **S/↓**: Di chuyển xuống  
- **A/←**: Di chuyển trái
- **D/→**: Di chuyển phải

### **Chiến đấu**
1. **Di chuyển vào quái vật** (điểm đỏ trên map)
2. **Chọn action**:
   - ⚔️ **Attack**: Tấn công cơ bản
   - ⚡ **Skill**: Sử dụng skill (chưa implement)
   - 🎒 **Item**: Sử dụng item (chưa implement)
   - 🏃 **Flee**: Chạy thoát (50% thành công)

### **Quản lý**
- **Túi đồ**: Xem và sử dụng items
- **Shop**: Mua potions và items
- **Respawn**: Hồi sinh quái vật để tiếp tục chiến đấu

## 🎨 Visual Features

### **Sprite System**
- **Player sprite** với animation idle/attack
- **Enemy sprites** cho từng loại quái vật
- **Pixel art style** với Minecraft color palette
- **Glow effects** cho player level cao

### **World Visualization**
- **Tile-based world** với màu sắc và symbols
- **Real-time rendering** với canvas
- **Smooth camera** theo dõi player
- **Enemy indicators** hiển thị vị trí quái vật

## 🚀 Cách chạy game

```bash
cd src/app/kris/demogame
npm run dev
```

Sau đó mở browser và truy cập `http://localhost:3000`

## 🎯 Gameplay Tips

### **Cho người mới**
1. **Bắt đầu ở Town** (điểm vàng) - khu vực an toàn
2. **Di chuyển cẩn thận** - tránh đi vào núi/nước
3. **Tìm quái vật yếu** trước (goblin)
4. **Sử dụng potions** khi HP thấp

### **Cho người chơi nâng cao**
1. **Khám phá cave** để tìm quái vật mạnh
2. **Farm quái vật** để level up nhanh
3. **Quản lý inventory** hiệu quả
4. **Sử dụng flee** khi gặp quái vật quá mạnh

## 🔧 Technical Details

### **Architecture**
- **World.ts**: Quản lý game world và movement
- **GameWorld.ts**: Game logic và state management
- **WorldView.tsx**: React component cho world rendering
- **PlayerSprite.tsx**: Sprite components

### **Performance**
- **Canvas rendering** cho smooth graphics
- **Efficient collision detection**
- **Optimized state updates**

## 🎨 Customization

### **Thay đổi World Size**
```typescript
// Trong World.ts
constructor(width: number = 20, height: number = 15)
```

### **Thay đổi Terrain Generation**
```typescript
// Trong World.ts - generateWorld()
if (rand < 0.6) {
  // Grass generation
} else if (rand < 0.75) {
  // Forest generation
}
```

### **Thêm Enemy Types**
```typescript
// Trong GameWorld.ts - createEnemyFromType()
case 'new-enemy':
  return new Enemy("New Enemy", 100, 30, 10, "rare");
```

## 🚀 Roadmap

### **Phase 2: Enhanced Combat**
- [ ] Skill system với mana cost
- [ ] Item usage trong combat
- [ ] Status effects (poison, stun, etc.)
- [ ] Critical hit animations

### **Phase 3: World Expansion**
- [ ] Multiple areas/zones
- [ ] NPCs và dialogue system
- [ ] Quest system integration
- [ ] Boss battles

### **Phase 4: Advanced Features**
- [ ] Save/load system
- [ ] Multiplayer support
- [ ] Sound effects
- [ ] Particle effects

## 🐛 Troubleshooting

### **Game không load**
- Kiểm tra console errors
- Đảm bảo tất cả dependencies đã install
- Restart development server

### **Movement không hoạt động**
- Kiểm tra keyboard focus
- Đảm bảo không có modal đang mở
- Refresh page nếu cần

### **Performance issues**
- Giảm world size nếu cần
- Kiểm tra browser performance
- Đóng các tab khác

---

**🎮 Chúc bạn chơi game vui vẻ! Hãy khám phá thế giới và trở thành hero mạnh nhất!** 🚀 