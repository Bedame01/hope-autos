# Hope Autos Vehicle QR Codes: Setup and Operations

This guide covers preparing, deploying, and validating the customer-facing vehicle QR code feature already integrated into Hope Autos. It uses each car's existing database ID and public `/cars/{id}` route. It does not create another vehicle record, a scanner page, or a stored QR image.

## 1. How the feature works

1. An admin saves a car through the existing admin create form.
2. The API persists the car and returns its database ID. Saving does not depend on QR generation.
3. The create screen opens QR controls for that saved car. The edit screen offers the same controls for existing cars.
4. An authorized admin request resolves the canonical URL from `NEXT_PUBLIC_BASE_URL` and the persisted car ID.
5. The browser creates a high-resolution PNG QR image from that URL when requested. QR generation is lazy; it does not run for every vehicle in inventory.
6. The admin can preview, copy the URL, download the PNG, or print a dedicated 4 × 6 inch label.
7. A customer's phone camera opens the vehicle's existing public detail page. The detail page loads the vehicle by ID and shows its availability, price, pictures, specifications, and existing contact actions.

The URL uses the immutable database ID, not editable vehicle details. Changing a car's make, model, year, price, or availability therefore does not change the QR destination.

## 2. Prerequisites

- A working Hope Autos deployment with the existing Next.js application, PostgreSQL database, and Prisma client.
- An administrator account with the existing `admin` role.
- A canonical public HTTPS domain for production.
- Access to the production database migration process.
- Browser access to the admin panel. Clipboard access normally requires HTTPS or localhost.

No WhatsApp service or phone number is configured by this QR feature. It keeps the existing detail-page contact actions.

## 3. Environment configuration

Set the following application environment variable for **local development and deployments that use a different canonical domain**:

```dotenv
NEXT_PUBLIC_BASE_URL=https://your-canonical-production-domain.example
```

Replace the example with the actual canonical origin serving the site. For example, if customers should use the Vercel domain, set that exact HTTPS origin. If the dealership uses a custom domain, use the custom domain instead. Do not include a path, query string, credentials, or trailing application route.

The production QR endpoint defaults to `https://hope-autos.com` when `NEXT_PUBLIC_BASE_URL` is unset or accidentally points to localhost. Set the variable explicitly when deploying a different canonical domain. A configured non-local production URL must use HTTPS.

Local-only example:

```dotenv
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Production requires HTTPS. The implementation does not use the incoming request host, which could produce incorrect links on preview deployments or behind proxies. Invalid configured origins still cause QR URL generation to report an error; correct the environment variable and use **Retry QR generation**.

Because this variable is read on the server by the QR URL endpoint, configure it in the hosting provider's server environment for the relevant deployment and redeploy/restart as required by that provider.

Do not place `DATABASE_URL`, `NEXTAUTH_SECRET`, or other private credentials in client code or in `NEXT_PUBLIC_*` variables. Continue to configure existing authentication, database, and image-storage variables as documented by the deployment.

## 4. Database change and deployment order

The existing `Car.id` remains the permanent identifier. The only schema addition is a nullable, unique `creationRequestId` on the existing `cars` table. It is used to make retries of one vehicle-create request idempotent; it is not a vehicle number or public identifier. Existing rows remain unchanged and can have a null value.

### Option A: Apply the schema through Prisma

From the project root, with the intended database environment configured:

```powershell
pnpm install --frozen-lockfile
pnpm run db:generate
pnpm exec prisma db push
```

Review the Prisma output and confirm it targets the correct database before applying the change. Do not use `--accept-data-loss` for this additive change.

### Option B: Apply the supplied PostgreSQL SQL

If the deployment process uses reviewed SQL migrations, apply [add-car-creation-request-id.sql](../prisma/add-car-creation-request-id.sql) to the correct PostgreSQL database. It adds the nullable text column and unique index inside a transaction. Then regenerate the Prisma client in the deployment build.

Do not apply both methods as competing migrations; choose the database-change process that the project already uses.

### Recommended rollout

1. Back up the production database using the existing backup procedure.
2. Configure `NEXT_PUBLIC_BASE_URL` for the production deployment.
3. Apply the additive database change to the correct database.
4. Deploy the application code and allow Prisma Client generation during installation/build (`pnpm run db:generate`).
5. Confirm the site, admin sign-in, car inventory, create/edit screens, and public detail route are healthy.
6. Create one test listing or use an approved existing listing to test QR actions before printing labels for the lot.

The repository's `vercel-build` script currently includes `prisma db push`. Review the target environment and deployment policy before relying on automatic schema pushes in production. The migration is also provided as SQL for deployments that require explicitly reviewed database changes.

## 5. Admin workflow

### Newly created vehicle

1. Sign in with an admin account and open **Admin → Cars → Add New Car**.
2. Enter and save the vehicle using the existing form.
3. Wait for the success state. The saved vehicle is displayed with its QR controls.
4. If the QR code did not load, read the displayed error, fix configuration/network issues, and retry. A QR failure does not undo or repeat the saved vehicle.
5. Check that the preview title names the correct year, make, and model.
6. Select **Copy vehicle URL** and verify that the URL ends in the saved car ID.
7. Select **Download PNG** to save the high-resolution QR image.
8. Select **Print QR label** and use the print preview to confirm only the Hope Autos vehicle label is printed.
9. Verify print scaling and margins in the browser's print dialog. Print at actual size or 100% where available; avoid settings that crop the label.
10. Scan the printed label with a phone camera and confirm the destination and vehicle identity.

If the create request times out or the admin retries after a network interruption, the form reuses its idempotency key. The API's unique key ensures the same request does not create a second car. A successful save clears the key for the next creation.

### Existing vehicle

1. Open **Admin → Cars**, choose a vehicle, and select its edit action.
2. Select **View QR code**.
3. Verify the displayed vehicle identity before downloading or printing.
4. Use **Copy vehicle URL**, **Download PNG**, or **Print QR label** as needed.

The QR image is generated when the QR controls are opened. It is not generated in bulk for the inventory table.

## 6. Label and print behavior

The print label includes Hope Autos branding, the vehicle year/make/model, the instruction “SCAN TO VIEW THIS VEHICLE”, and a QR code with a white quiet zone around it. The existing data model has no stock/reference number, so one is not printed. No editable field is used as the permanent QR identifier.

The current print layout is portrait 4 × 6 inches. Browser and printer drivers may override CSS page size, margins, or scaling. Always inspect the print preview and test a sample on the intended printer/material before bulk printing.

For vehicles already marked unavailable/sold, the QR remains associated with that vehicle ID. It must not be relabeled to point at a different car. The customer's detail page should show the existing Sold state.

## 7. Customer behavior and visibility

- Customers do not need the Hope Autos app or an account to scan a label.
- The QR opens the existing `/cars/{id}` detail route in the phone browser.
- The public car lookup supports available and sold records so sold labels still identify the correct vehicle.
- Invalid IDs produce an invalid-ID response; a well-formed ID that has no corresponding record returns not found.
- Database connection failures and other fetch failures show a retryable error on the detail page.
- Existing image storage, image ordering, price formatting, specifications, contact form, and call action are reused.

### Important: draft and published listings

The current Prisma `Car` model contains `isAvailable` (available/sold), but it has **no draft, private, or published field**. In the current application, a car record is addressable through the public detail endpoint by its ID; availability is not a publication-control setting. This feature does not invent publication rules or add a visibility column.

If staff need to save drafts or keep private listings, define the dealership's publication workflow first. Add an explicit publication field and a safe migration with existing records assigned the intended visibility, then enforce that rule consistently in public car listing/search APIs, detail lookup, related-vehicle APIs, view tracking, and any public metadata. Keep admin APIs separate and protected. Do not treat `isAvailable: false` as private: sold vehicles need to remain viewable at their own QR URL.

Until that separate publication control exists, only create records that are intended to be publicly addressable. This is an existing schema limitation, not a QR-specific privacy setting.

## 8. Verification checklist

### QR generation and admin behavior

- [ ] Admin can save a new vehicle when QR generation is unavailable.
- [ ] The successful save shows the persisted vehicle ID and correct name.
- [ ] Opening QR controls produces a QR image for the canonical production domain and correct car ID.
- [ ] Retrying after a QR/network failure works without another vehicle creation.
- [ ] Retrying a timed-out create request with the same key does not add another record.
- [ ] Existing vehicle edit screens can generate and preview a QR.
- [ ] Downloaded `.png` opens as an image and scans successfully.
- [ ] Copy action copies the same URL encoded in the QR image.
- [ ] Print preview contains only the label, with the logo, vehicle identity, QR code, and scan instruction.
- [ ] Phone camera opens the expected public URL without requiring sign-in.

### Vehicle states and IDs

- [ ] A valid available vehicle displays its current pictures, specifications, price, and contact options.
- [ ] A valid sold vehicle remains on its own detail URL and displays Sold.
- [ ] A malformed ID is rejected and an unknown ID shows not found.
- [ ] If draft/private listings are introduced later, the newly defined publication policy is checked on every public API before launch.

### Authorization and regression checks

- [ ] Signed-out users cannot access admin car list/create/edit/delete endpoints or the QR URL endpoint.
- [ ] A signed-in non-admin cannot access those endpoints.
- [ ] An admin can use the same management operations as before.
- [ ] Public car inventory, authentication, image uploads, and existing vehicle contacts still work.
- [ ] Test on a narrow mobile viewport and on a real phone camera.

## 9. Troubleshooting

| Symptom | Checks and action |
| --- | --- |
| QR URL reports that `NEXT_PUBLIC_BASE_URL` is missing | Set the environment variable in the server environment, redeploy/restart, then retry. |
| QR URL reports an invalid site URL | Use an absolute origin such as `https://cars.example.com`; remove paths, query strings, and fragments. Production must use HTTPS. |
| QR action returns Unauthorized | Sign in again with an account whose existing role is `admin`; check the current NextAuth session and role assignment. |
| QR action says the car was not found | Confirm the selected vehicle still exists and reload the edit screen; a deleted record cannot have a QR generated. |
| Create fails after deployment with an unknown `creationRequestId` field | Apply the additive SQL/Prisma schema update to the same database used by the app, then regenerate Prisma Client and redeploy. |
| Database reports an unknown unique index/column | Confirm schema deployment completed against the expected PostgreSQL database. Do not manually alter or delete car records to work around it. |
| Copy URL does nothing | Use HTTPS or localhost and grant clipboard permission; the read-only URL field can be selected and copied manually. |
| Printed label is clipped or too small | Use print preview, portrait orientation, 4 × 6 inch media, and actual-size/100% scaling; print a sample before production use. |
| QR opens the wrong domain | Correct `NEXT_PUBLIC_BASE_URL`; regenerate/download the QR. Old printed labels encode their original URL and need replacement if the canonical domain changes. |
| A customer cannot view an unavailable car | Confirm the record has not been deleted and the public API can reach the database. Sold (`isAvailable: false`) records are intended to remain viewable. |

## 10. Build, lint, and database notes

Useful project commands:

```powershell
pnpm run db:generate
pnpm exec prisma validate
pnpm exec tsc --noEmit
pnpm build
```

The project currently has unrelated type diagnostics and its lint script may require interactive ESLint setup in environments without an ESLint configuration. A successful production build also requires a reachable database for the existing homepage's data fetching and suitable filesystem/symlink permissions for standalone output on Windows. Treat those as separate environment/project issues if they occur; they do not confirm or invalidate an end-to-end scan test.

QR creation, camera scanning, and physical printing require a browser/phone and a database-backed deployment to verify completely. Unit-level PNG generation alone does not verify that the production origin, database record, public API, or printer settings are correct.

## 11. Changed implementation points

- `app/admin/cars/new/page.tsx` — create flow and post-save QR prompt.
- `app/admin/cars/[id]/edit/page.tsx` — QR controls for existing vehicles.
- `app/admin/cars/components/VehicleQrControls.tsx` — lazy QR generation, preview, copy, download, and print actions.
- `app/api/admin/cars/[id]/qr/route.ts` — authorized existing-car lookup and canonical URL response.
- `lib/vehicle-url.ts` — canonical URL and production URL validation.
- `lib/admin-auth.ts` — shared existing-session admin check.
- `lib/db.ts` and `app/api/admin/cars/route.ts` — idempotent car creation and inclusion of sold cars in admin inventory.
- `app/api/admin/cars/[id]/route.ts` — admin-only car management API.
- `app/api/cars/[id]/route.ts` and `app/cars/[id]/page.tsx` — validated public ID lookup and customer detail loading states.
- `app/globals.css` — responsive QR dialog and print-only label styles.
- `prisma/schema.prisma` and `prisma/add-car-creation-request-id.sql` — additive retry-protection field and SQL migration.
