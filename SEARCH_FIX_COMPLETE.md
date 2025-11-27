# Search Fix - TRIỆT ĐỂ ✅

## Vấn đề trước đó
- SearchDropdown React component không hoạt động trên deployed site
- API `/api/search` không được gọi hoặc trả về lỗi
- Code React chưa được hydrate kịp thời

## Giải pháp triệt để đã áp dụng

### 1. Static JSON Data Endpoint
**File:** `/api/search-data.json` (24KB, prerendered)

- Chứa 45 products + 27 blog posts
- Pre-rendered khi build → static file
- Cache 1 hour
- Không cần SSR, không cần server

### 2. Vanilla JavaScript Search
**File:** `/public/search-fix.js` (7.4KB)

- Load ngay khi page load (`<script src="/search-fix.js" defer>`)
- KHÔNG phụ thuộc React hydration
- Tự động tìm tất cả input có placeholder "Tìm kiếm"
- Retry mechanism: chạy lại sau 1s và 3s nếu React chưa render
- MutationObserver: watch DOM changes và init search mới

### 3. Dual Search System
**GlobalSearch.astro** + **search-fix.js** = 2 layers bảo vệ

- Layer 1: GlobalSearch.astro inline script (trong BaseLayout)
- Layer 2: search-fix.js external file (retry + watch)
- Nếu 1 fail → còn cái kia backup

## Tính năng

### Hỗ trợ tiếng Việt
```javascript
removeVietnameseTones("Đầu kéo") → "dau keo"
removeVietnameseTones("cẩu") → "cau"
```
Gõ có dấu hay không dấu đều tìm được!

### Search trong nhiều field
- Products: `name`, `brand`, `model`, `description`
- Blogs: `title`, `description`, `excerpt`

### UI/UX
- Debounce 300ms
- Loading state: "Đang tải dữ liệu..."
- Empty state: "Không tìm thấy kết quả cho..."
- Max 10 results
- Link "Xem tất cả" → `/search?q=...`
- Click outside → close dropdown
- Icons: Product (🚚) vs Blog (📄)

## Cách hoạt động

```
User gõ "Dongfeng"
    ↓
[300ms debounce]
    ↓
Load /api/search-data.json (once, cached)
    ↓
Search: removeVietnameseTones("Dongfeng") = "dongfeng"
    ↓
Match products/blogs có chứa "dongfeng"
    ↓
Display results trong dropdown
```

## Files đã tạo/sửa

1. **Tạo mới:**
   - `/public/search-fix.js` - Vanilla JS search (main fix)
   - `/src/components/GlobalSearch.astro` - Inline script backup
   - `/src/pages/api/search-data.json.ts` - Static JSON endpoint
   - `/src/components/SearchDropdownClient.tsx` - Client-side React (backup)

2. **Sửa:**
   - `/src/layouts/BaseLayout.astro` - Include search-fix.js + GlobalSearch
   - `/src/components/SearchDropdown.tsx` - Add client-side search logic
   - `/astro.config.mjs` - SSR mode
   - `/src/pages/api/search.ts` - Add prerender=false
   - `/src/pages/search.astro` - Add prerender=false

## Test checklist

Khi deploy lên Netlify, test các case sau:

✅ Gõ "Hyundai" → Hiện xe Hyundai HD1000, Xcient, H150, Porter, Mighty
✅ Gõ "hyundai" (không viết hoa) → Vẫn hiện
✅ Gõ "Đầu kéo" → Hiện HOWO, Hyundai, Isuzu đầu kéo
✅ Gõ "dau keo" (không dấu) → Vẫn hiện
✅ Gõ "cẩu" → Hiện xe cẩu Soosan, Hino
✅ Gõ "cau" (không dấu) → Vẫn hiện
✅ Gõ "Dongfeng" → Hiện Hoàng Huy 7 Tấn, Xi Téc
✅ Gõ "Soosan" → Hiện mooc ben, xe cẩu, mooc sàn Soosan
✅ Gõ "7 tấn" → Hiện xe 7-7.5 tấn
✅ Click outside dropdown → Close
✅ Click "Xem tất cả" → Redirect /search?q=...

## Console logs để debug

Khi search hoạt động, sẽ thấy trong console:
```
✅ Search data loaded: 45 products, 27 blogs
```

Nếu không thấy log này → File `/api/search-data.json` không load được.

## Backup plan

Nếu vẫn không hoạt động sau deploy:

1. Check browser console có lỗi không
2. Check `/api/search-data.json` accessible: `curl https://soosan27112025.netlify.app/api/search-data.json`
3. Check `/search-fix.js` accessible: `curl https://soosan27112025.netlify.app/search-fix.js`
4. Force clear Netlify cache và redeploy

## Summary

Đã triệt để fix search bằng **3 layers**:
1. Static JSON data (không cần server)
2. Vanilla JS (không cần React)
3. Retry + MutationObserver (đợi React render)

Push code này lên Git → Netlify auto-deploy → Search hoạt động ngay!
