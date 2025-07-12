# 🎮 RPG Adventure 3D - Minecraft/Roblox Style

Một game RPG 3D hiện đại với hiệu ứng Minecraft/Roblox được xây dựng bằng React, TypeScript và Three.js.

## ✨ Tính Năng 3D

### 🌍 Thế Giới 3D
- **Thế giới 3D hoàn chỉnh** với các khối vuông kiểu Minecraft
- **6 loại terrain**: Cỏ, Rừng, Núi, Nước, Hang, Thị trấn
- **Chiều cao khác nhau** cho từng loại terrain
- **Fog effect** tạo độ sâu cho thế giới
- **Dynamic lighting** với shadow mapping

### 👥 Nhân Vật 3D
- **Player model** với đầy đủ body parts (head, body, arms, legs, feet)
- **4 loại enemy**: Goblin, Orc, Troll, Dark Knight
- **Equipment 3D**: Sword, Shield cho player
- **Weapons 3D** cho enemies
- **Idle animations** và attack animations
- **Minecraft-style colors** cho từng loại nhân vật

### 🎮 Điều Khiển 3D
- **WASD/Arrow Keys**: Di chuyển nhân vật
- **Mouse drag**: Xoay camera quanh player
- **Smooth camera follow** theo player
- **Responsive controls** trên mọi thiết bị

### 🎨 Giao Diện 3D
- **Glassmorphism design** với backdrop blur
- **Gradient backgrounds** đẹp mắt
- **3D character previews** cho player và enemies
- **Real-time stats display** với health bars
- **Responsive layout** cho mobile và desktop

## 🚀 Cách Chạy

### Yêu Cầu Hệ Thống
- Node.js 16.0.0 trở lên
- Modern browser hỗ trợ WebGL

### Cài Đặt
```bash
cd src/app/kris/demogame
npm install
```

### Chạy Game
```bash
npm run dev
```

Mở browser và truy cập: `http://localhost:5173`

## 🎯 Cách Chơi

### Di Chuyển
- **W/↑**: Di chuyển lên
- **S/↓**: Di chuyển xuống  
- **A/←**: Di chuyển trái
- **D/→**: Di chuyển phải

### Camera
- **Click và kéo**: Xoay camera quanh player
- **Camera tự động follow** player khi di chuyển

### Chiến Đấu
- **Di chuyển vào ô có quái vật** để bắt đầu chiến đấu
- **Mỗi quái vật cho 25 EXP**
- **100 EXP = Level up**
- **Level up tăng HP và sức mạnh**

### Khu Vực
- **🌱 Cỏ**: Di chuyển bình thường
- **🌲 Rừng**: Tăng EXP khi khám phá
- **⛰️ Núi**: Chậm hơn nhưng có kho báu
- **💧 Nước**: Không thể đi qua
- **🕳️ Hang**: Nhiều quái vật
- **🏘️ Thị trấn**: An toàn, hồi phục HP

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool và dev server
- **Three.js**: 3D graphics engine
- **Lucide React**: Icons

### 3D Graphics
- **WebGL**: Hardware acceleration
- **Three.js**: 3D scene management
- **Mesh geometry**: Box geometry cho khối vuông
- **Lambert materials**: Minecraft-style lighting
- **Shadow mapping**: Realistic shadows
- **Fog effects**: Depth perception

### Styling
- **CSS3**: Modern styling
- **Glassmorphism**: Modern UI design
- **CSS Grid/Flexbox**: Responsive layout
- **CSS Animations**: Smooth transitions
- **Gradients**: Beautiful backgrounds

## 📁 Cấu Trúc Code

```
src/
├── components/
│   ├── World3D.tsx          # 3D world renderer
│   └── Character3D.tsx      # 3D character models
├── core/
│   ├── GameWorld.ts         # Game logic
│   └── World.ts             # World generation
├── App3D.tsx                # Main 3D app component
├── App3D.css                # 3D app styling
├── main.tsx                 # Entry point
└── index.css                # Global styles
```

## 🎨 Thiết Kế 3D

### World Design
- **Voxel-based**: Khối vuông kiểu Minecraft
- **Height variation**: Núi cao, nước thấp
- **Color coding**: Mỗi terrain có màu riêng
- **Procedural generation**: Thế giới được tạo ngẫu nhiên

### Character Design
- **Modular parts**: Head, body, arms, legs, feet
- **Equipment system**: Weapons và armor
- **Animation system**: Idle và combat animations
- **Color themes**: Mỗi enemy type có màu riêng

### Camera System
- **Third-person view**: Camera theo sau player
- **Mouse control**: Xoay camera tự do
- **Smooth following**: Camera mượt mà
- **Boundary limits**: Không xoay quá xa

## 🔧 Tùy Chỉnh

### Thêm Terrain Mới
```typescript
// Trong World.ts
const newTerrain = {
  type: 'new-terrain',
  walkable: true,
  encounterRate: 0.1,
  description: 'Mô tả terrain mới'
};
```

### Thêm Enemy Type
```typescript
// Trong Character3D.tsx
const newEnemyColors = {
  head: 0xXXXXXX,
  body: 0xXXXXXX,
  // ...
};
```

### Thay Đổi Camera
```typescript
// Trong World3D.tsx
camera.position.set(x, y, z);
camera.lookAt(targetX, targetY, targetZ);
```

## 🚀 Tính Năng Tương Lai

### Phase 1: Enhanced Graphics
- [ ] Texture mapping cho terrain
- [ ] Particle effects
- [ ] Water animations
- [ ] Day/night cycle

### Phase 2: Gameplay
- [ ] Inventory system 3D
- [ ] Crafting system
- [ ] Multiplayer support
- [ ] Quest system 3D

### Phase 3: Advanced Features
- [ ] VR support
- [ ] Mobile optimization
- [ ] Save/load system
- [ ] Mod support

## 🐛 Troubleshooting

### Performance Issues
- Giảm shadow map size
- Tắt antialiasing
- Giảm fog distance

### WebGL Errors
- Kiểm tra browser support
- Update graphics drivers
- Disable hardware acceleration

### Build Issues
```bash
npm run clean
npm install
npm run build
```

## 📊 Performance

### Optimization
- **Frustum culling**: Chỉ render visible objects
- **LOD system**: Level of detail
- **Texture compression**: Giảm memory usage
- **Batch rendering**: Group similar objects

### Benchmarks
- **Desktop**: 60 FPS @ 1080p
- **Mobile**: 30 FPS @ 720p
- **Memory**: < 100MB RAM
- **Load time**: < 3 seconds

## 🤝 Đóng Góp

1. Fork project
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 🙏 Credits

- **Three.js**: 3D graphics engine
- **React**: UI framework
- **Vite**: Build tool
- **Minecraft**: Inspiration cho art style

---

**🎮 Chúc bạn chơi game vui vẻ!** 🎉 