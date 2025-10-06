# Vercel Blob Setup Guide

This application now uses Vercel Blob for file storage instead of local file system storage.

## Environment Variables Required

To use Vercel Blob, you need to set up the following environment variable:

### For Development

Add to your `.env.local` file:

```
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

### For Production (Vercel)

Add to your Vercel project environment variables:

```
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

## How to Get Your Vercel Blob Token

1. Go to your Vercel dashboard
2. Navigate to your project
3. Go to Settings → Environment Variables
4. Add a new environment variable:
   - Name: `BLOB_READ_WRITE_TOKEN`
   - Value: Your Vercel Blob token (get this from Vercel Blob dashboard)
   - Environment: Production, Preview, Development (select all)

## Changes Made

### 1. Updated Image Upload API (`app/api/admin/images/route.ts`)

- Replaced local file system storage with Vercel Blob
- Files are now uploaded to `images/` folder in Vercel Blob
- Database now stores both `url` and `blobUrl` fields

### 2. Updated Image Delete API (`app/api/admin/images/[id]/route.ts`)

- Now deletes files from Vercel Blob instead of local filesystem
- Uses the `del` function from `@vercel/blob`

### 3. Updated Hardcoded Paths

- Replaced hardcoded `/uploads/` paths with placeholder URLs
- These should be updated with actual Vercel Blob URLs when images are uploaded

## Benefits of Vercel Blob

1. **Scalable**: No file size limits on the server
2. **Global CDN**: Fast image delivery worldwide
3. **Automatic optimization**: Images are automatically optimized
4. **Secure**: Files are stored securely in Vercel's infrastructure
5. **Easy management**: Files can be managed through Vercel dashboard

## Migration Notes

- Existing images in the database will need to be migrated to Vercel Blob
- The old `/uploads/` folder can be removed after migration
- All new image uploads will automatically use Vercel Blob

## Testing

To test the implementation:

1. Set up the `BLOB_READ_WRITE_TOKEN` environment variable
2. Start the development server: `npm run dev`
3. Go to the admin panel and try uploading an image
4. Check that the image URL is a Vercel Blob URL (starts with `https://`)

## Troubleshooting

If you get "No token found" error:

- Make sure `BLOB_READ_WRITE_TOKEN` is set in your environment
- Restart your development server after adding the environment variable
- Check that the token is valid in your Vercel dashboard
