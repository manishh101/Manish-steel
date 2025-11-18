# Category Thumbnail Feature

## Overview
This feature allows you to control which product image appears as the thumbnail for each category in the "Browse Our Collections" section on the homepage.

## How It Works

### For Admin Users

1. **Navigate to Admin Panel**
   - Go to `/admin/products`
   - You'll see all your products listed

2. **Set Category Thumbnail**
   - Find the product whose image you want to use as the category thumbnail
   - Click the "Category Image" button (green when active, gray when inactive)
   - The button has an image icon 🖼️

3. **Automatic Behavior**
   - When you set a product as the category thumbnail, any other product in the same category that was previously set as the thumbnail will be automatically unset
   - Only ONE product per category can be the category thumbnail at a time
   - The category thumbnail image will appear in the "Browse Our Collections" section on the homepage

4. **Visual Indicators**
   - **Mobile View**: Products marked as category thumbnails show a green "Category Image" badge
   - **Desktop View**: The "Category Image" button appears green and shows "✓ Category Image" when active

### Frontend Display Priority

The system uses the following priority when selecting category thumbnails:

1. **First Priority**: Product marked with `usedAsCategoryThumbnail = true`
2. **Second Priority**: First product with a Cloudinary image
3. **Third Priority**: First product with additional images
4. **Fallback**: Placeholder image

### Technical Details

#### Backend Changes
- **Model**: Added `usedAsCategoryThumbnail` boolean field to Product schema
- **Route**: Added `PATCH /api/products/:id/category-thumbnail` endpoint
- **Controller**: Added `updateCategoryThumbnailStatus` method
- **Index**: Added compound index on `(usedAsCategoryThumbnail, categoryId)`

#### Frontend Changes
- **API Service**: Added `updateCategoryThumbnailStatus` method
- **CategoryImageService**: Updated to prioritize products marked as category thumbnails
- **Admin Products Page**: Added toggle button and handler for category thumbnail status

## Benefits

1. **Full Control**: You decide exactly which image represents each category
2. **Easy Management**: Simple one-click toggle to set/unset category thumbnails
3. **Automatic Conflict Resolution**: System ensures only one thumbnail per category
4. **Visual Feedback**: Clear indicators show which products are category thumbnails
5. **Cache-Friendly**: Works seamlessly with existing caching mechanisms
6. **Fallback System**: If no thumbnail is set, system intelligently selects the best available image

## Example Use Case

If you have a "Office Furniture" category with 10 products:
1. Upload your best-looking office desk product
2. Go to Admin > Products
3. Find that desk product
4. Click "Category Image" button
5. Now the "Browse Our Collections" section will show that desk image for the Office Furniture category
6. Visitors clicking on it will be taken to all Office Furniture products

## Notes

- Changes take effect immediately after clicking the button
- The homepage will show the new thumbnail on next page load (existing users may need to refresh)
- Category thumbnails are stored in the database and persist across server restarts
- If a product marked as category thumbnail is deleted, the system falls back to automatic selection
