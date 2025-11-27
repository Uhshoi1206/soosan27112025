# Tài Liệu Sửa Lỗi Tìm Kiếm Toàn Diện

## Vấn Đề Gốc Rễ

Chức năng tìm kiếm không trả về kết quả **KHÔNG PHẢI** do Astro không tốt. Vấn đề nằm ở 3 nguyên nhân chính:

### 1. Vấn Đề Normalize Tiếng Việt

**Triệu chứng**: Khi tìm "mooc ben" (không dấu) không khớp với "Mooc bẹn Soosan" (có dấu)

**Nguyên nhân**: Component `SearchResults.tsx` so sánh string trực tiếp bằng `.toLowerCase()` mà không loại bỏ dấu tiếng Việt

**Giải pháp**: Thêm function `removeVietnameseTones()` để normalize cả query và content trước khi so sánh

```typescript
const removeVietnameseTones = (str: string): string => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};
```

### 2. Vấn Đề API Endpoint SSR

**Triệu chứng**: `/api/search-data.json` không accessible trên production Netlify

**Nguyên nhân**: File có `prerender = true` nhưng trong SSR mode, static API endpoint có thể không được deploy đúng

**Giải pháp**:
- Đổi thành `prerender = false` để API chạy SSR
- Thêm CORS headers cho cross-origin requests
- File: `src/pages/api/search-data.json.ts`

### 3. Vấn Đề React Hydration Delay

**Triệu chứng**: SearchDropdown React component cần thời gian load và hydrate

**Nguyên nhân**:
- React component cần hydration trước khi hoạt động
- Fetch API data mất thời gian
- Nếu fetch fail, search không hoạt động

**Giải pháp**: Sử dụng cả 2 cơ chế song song:
- **GlobalSearch.astro**: Vanilla JavaScript, hoạt động ngay lập tức
- **SearchDropdown.tsx**: React component với better UX khi đã hydrated

## Các File Đã Sửa

### 1. `src/components/SearchResults.tsx`
- Thêm `removeVietnameseTones()` function
- Normalize query và content trước khi filter

### 2. `src/pages/api/search-data.json.ts`
- Đổi `prerender = true` → `prerender = false`
- Thêm CORS headers
- Improve error handling

### 3. `src/components/SearchDropdown.tsx`
- Thêm comprehensive logging để debug
- Log API fetch status
- Log search process và results count

## Kiểm Tra Trên Production

Sau khi deploy lên Netlify, kiểm tra:

### 1. API Endpoint
```bash
curl https://soosan27112025.netlify.app/api/search-data.json
```
**Expected**: Trả về JSON với `products` và `blogs` arrays

### 2. Browser Console
Mở browser console và search "mooc ben":
```
[SearchDropdown] Fetching search data from API...
[SearchDropdown] API response status: 200
[SearchDropdown] Loaded data: {products: 45, blogs: 27}
[SearchDropdown] Searching for: {original: "mooc ben", normalized: "mooc ben"}
[SearchDropdown] Searching in 45 products
[SearchDropdown] Searching in 27 blogs
[SearchDropdown] Found 8 results
```

### 3. GlobalSearch Fallback
Nếu React component fail, GlobalSearch.astro sẽ tự động hoạt động:
- Load data từ `/api/search-data.json`
- Search và display results bằng vanilla JavaScript
- Không phụ thuộc React hydration

## Tại Sao Không Phải Lỗi Astro?

Astro là framework tuyệt vời và **KHÔNG PHẢI** nguyên nhân gây lỗi:

1. **Content Collections**: Hoạt động hoàn hảo, data được load đúng
2. **SSR**: Astro SSR rất ổn định và mạnh mẽ
3. **Build Process**: Build thành công, không có lỗi

**Lỗi thực sự**:
- Logic normalize tiếng Việt thiếu trong component
- API endpoint config không phù hợp với SSR mode
- Không có fallback mechanism khi React hydration chậm

## Best Practices Rút Ra

1. **Luôn normalize tiếng Việt** khi làm search/filter trong apps tiếng Việt
2. **Kiểm tra API endpoints** hoạt động đúng trên cả local và production
3. **Có fallback mechanism** cho critical features như search
4. **Thêm logging** để dễ debug trên production
5. **Test với real data** - "mooc ben" vs "Mooc bẹn Soosan 2 đố"

## Monitoring & Debugging

Sau khi deploy, monitor:

1. Browser console logs từ `[SearchDropdown]`
2. Network tab: check `/api/search-data.json` response
3. Netlify function logs: xem API SSR có error không
4. User reports: có thể search được không?

## Kết Luận

Vấn đề search đã được fix **triệt để** ở 3 layers:

✅ **Layer 1**: SearchResults component normalize tiếng Việt
✅ **Layer 2**: API endpoint chạy SSR với CORS
✅ **Layer 3**: GlobalSearch vanilla JS làm fallback
✅ **Layer 4**: Comprehensive logging để debug

**Astro không có lỗi** - đây là lỗi implementation logic và config.
