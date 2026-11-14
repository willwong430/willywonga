# Deploying qualityofthought.com (S3 + CloudFront)

Static files: `index.html`, `style.css`, `app.js`, `quotes.json`.
The daily quote is chosen in the browser from `quotes.json` by date, so there is no server, cron job, or Lambda to run. To add quotes, edit `quotes.json` and re-upload.

## 1. Create the S3 bucket
1. S3 console > **Create bucket**, name e.g. `qualityofthought.com`, region `us-east-1`.
2. Leave **Block all public access ON** (CloudFront will access it privately via OAC).
3. Don't enable S3 static website hosting.

## 2. Request an SSL certificate (must be in us-east-1)
1. AWS Certificate Manager (region **us-east-1**) > Request public certificate.
2. Domain names: `qualityofthought.com` and `www.qualityofthought.com`.
3. Choose DNS validation. If the domain is in Route 53, click "Create records in Route 53". Otherwise add the CNAMEs at your registrar. Wait for status **Issued**.

## 3. Create the CloudFront distribution
1. CloudFront > **Create distribution**.
2. Origin domain: your S3 bucket. Origin access: **Origin access control (OAC)** > create new.
3. Viewer protocol policy: **Redirect HTTP to HTTPS**.
4. Default root object: `index.html`.
5. Alternate domain names (CNAMEs): `qualityofthought.com`, `www.qualityofthought.com`.
6. Custom SSL certificate: select the one from step 2.
7. Create, then copy the bucket policy CloudFront offers and paste it into the bucket's **Permissions > Bucket policy**.

## 4. Upload the site
```
aws s3 sync qualityofthought/ s3://qualityofthought.com \
  --exclude "DEPLOY.md" --exclude ".git*" --delete
```
(Or drag the four files into the bucket in the console.) After changing files, invalidate the cache:
```
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

## 5. Point your domain at CloudFront
- **Route 53:** create an **A (Alias)** record, and an **AAAA (Alias)** record, for `qualityofthought.com` and `www` pointing to the CloudFront distribution.
- **Other registrar:** use a CNAME for `www` to the `dxxxx.cloudfront.net` name. For the root/apex domain you need ALIAS/ANAME support, or move DNS to Route 53 (recommended).

## Optional: auto-deploy from GitHub
Add a GitHub Actions workflow that runs the `s3 sync` and invalidation above on push to main, using an IAM role (OIDC) limited to that bucket and distribution.
