# 🎨 Sprite System Guide

## Tổng quan

Game RPG Adventure đã được tích hợp hệ thống sprite pixel art với phong cách Minecraft. Hệ thống này cho phép hiển thị nhân vật và quái vật với animation mượt mà.

## 🎯 Các thành phần chính

### 1. Player Sprite (`src/assets/sprites/player.ts`)
- **Định nghĩa**: Chứa data pixel art cho player character
- **Animation**: Idle, Attack, Cast spell
- **Equipment**: Hỗ trợ overlay cho weapon và armor
- **Colors**: Minecraft-style palette

### 2. Sprite Renderer (`src/utils/SpriteRenderer.ts`)
- **Chức năng**: Render pixel art từ ASCII data
- **Features**: Animation, effects, equipment overlay
- **Canvas**: Sử dụng HTML5 Canvas để render

### 3. React Components (`src/components/PlayerSprite.tsx`)
- **PlayerSprite**: Component cho player character
- **EnemySprite**: Component cho enemy characters
- **Props**: Animation, equipment, effects, pixelSize

## 🎮 Cách sử dụng

### Player Sprite
```tsx
<PlayerSprite 
  animation="idle"
  pixelSize={6}
  equipment={{
    weapon: "sword",
    armor: "helmet"
  }}
  effects={{
    glow: true,
    glowColor: "#FFD700"
  }}
/>
```

### Enemy Sprite
```tsx
<EnemySprite 
  type="goblin"
  animation="idle"
  pixelSize={6}
/>
```

## 🎨 Tạo sprite mới

### 1. Tạo ASCII Art
```typescript
const newSprite = {
  colors: {
    outline: '#000000',
    body: '#FFB366'
  },
  idle: [
    [
      '    ██████    ',
      '   ████████   ',
      '   ████████   ',
      // ... thêm các dòng khác
    ]
  ]
}
```

### 2. Thêm vào Sprite Data
```typescript
// Trong file sprite tương ứng
export const NEW_SPRITE = {
  // ... sprite data
}
```

### 3. Tạo Component
```tsx
const NewSprite: React.FC<NewSpriteProps> = ({ /* props */ }) => {
  // Implementation
}
```

## 🎭 Animation System

### Frame Timing
```typescript
const ANIMATION_CONFIG = {
  idle: {
    frameDuration: 500, // 500ms per frame
    loop: true
  },
  attack: {
    frameDuration: 200, // 200ms per frame
    loop: false
  }
}
```

### Effects
- **Glow**: Hiệu ứng phát sáng
- **Particles**: Hiệu ứng hạt
- **Equipment Overlay**: Hiển thị trang bị

## 🎨 Color Palette (Minecraft Style)

### Base Colors
- **Skin**: `#FFB366` - Màu da
- **Hair**: `#8B4513` - Màu tóc nâu
- **Shirt**: `#4A90E2` - Màu áo xanh
- **Pants**: `#8B4513` - Màu quần nâu
- **Shoes**: `#654321` - Màu giày đen
- **Outline**: `#000000` - Màu viền đen

### Enemy Colors
- **Goblin**: `#4CAF50` - Xanh lá
- **Orc**: `#795548` - Nâu
- **Dragon**: `#D32F2F` - Đỏ
- **Dark Knight**: `#424242` - Xám đen

## 🔧 Customization

### Pixel Size
```tsx
// Thay đổi kích thước pixel
<PlayerSprite pixelSize={8} /> // Lớn hơn
<PlayerSprite pixelSize={2} /> // Nhỏ hơn
```

### Custom Effects
```tsx
effects={{
  glow: true,
  glowColor: "#FF0000",
  particles: [
    { x: 5, y: 5, color: "#FFD700" },
    { x: 8, y: 3, color: "#FF6B6B" }
  ]
}}
```

## 📱 Responsive Design

Sprite system tự động điều chỉnh theo kích thước màn hình:
- **Desktop**: pixelSize = 6
- **Tablet**: pixelSize = 4
- **Mobile**: pixelSize = 3

## 🎯 Best Practices

1. **Consistent Sizing**: Sử dụng kích thước 16x16 cho tất cả sprites
2. **Color Harmony**: Tuân thủ Minecraft color palette
3. **Animation Smoothness**: Giữ frame duration phù hợp
4. **Performance**: Sử dụng canvas thay vì DOM elements
5. **Accessibility**: Đảm bảo contrast ratio tốt

## 🚀 Next Steps

### Phase 2: Environment Sprites
- [ ] Background tiles
- [ ] Tree sprites
- [ ] Rock formations
- [ ] Water effects

### Phase 3: UI Sprites
- [ ] Button icons
- [ ] Menu backgrounds
- [ ] Status indicators
- [ ] Loading animations

### Phase 4: Special Effects
- [ ] Magic spells
- [ ] Combat effects
- [ ] Particle systems
- [ ] Screen transitions

## 🛠️ Development Tools

### Recommended Tools
- **Aseprite**: Pixel art editor
- **Piskel**: Free online pixel art tool
- **GIMP**: Image manipulation
- **Inkscape**: Vector graphics

### Online Resources
- **OpenGameArt.org**: Free game assets
- **Itch.io**: Pixel art packs
- **DeviantArt**: Community art

---

**Lưu ý**: Hệ thống sprite này được thiết kế để dễ dàng mở rộng và tùy chỉnh. Hãy thử nghiệm với các style khác nhau và chia sẻ kết quả! 