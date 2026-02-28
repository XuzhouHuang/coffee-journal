# Coffee Journal — QA Test Report

**Date:** 2026-02-28  
**Server:** http://localhost:3001  
**Build:** ✅ Passes (`npm run build` — no errors)

---

## 1. API CRUD Tests

### `/api/beans` — Beans

| Route | Method | Input | Expected | Actual | Status |
|-------|--------|-------|----------|--------|--------|
| `/api/beans` | GET | — | 200 + list | 200, 3 beans returned with pagination | ✅ |
| `/api/beans` | GET | `?regionId=5` | Filtered list | 200, filtered correctly | ✅ |
| `/api/beans` | POST | `{"name":"QA测试豆","process":"水洗","roastLevel":"中烘","score":4.2}` | 201 | 201, bean created (id=4) | ✅ |
| `/api/beans` | POST | `{"process":"水洗"}` (missing name) | 400 | 400, validation error | ✅ |
| `/api/beans` | POST | `{"name":""}` (empty name) | 400 | 400, "豆名不能为空" | ✅ |
| `/api/beans/4` | GET | — | 200 + detail | 200, includes purchases & brewLogs | ✅ |
| `/api/beans/999` | GET | — | 404 | 404, "Not found" | ✅ |
| `/api/beans/abc` | GET | — | 400 | 400, "Invalid id" | ✅ |
| `/api/beans/4` | PUT | `{"name":"QA测试豆-updated","score":3.5}` | 200, partial update | 200 but **cleared** process/roastLevel to null | ❌ (fixed) |
| `/api/beans/999` | PUT | `{"name":"test"}` | 404 | **500** Internal server error | ❌ (fixed) |
| `/api/beans/999` | DELETE | — | 404 | **500** Internal server error | ❌ (fixed) |

### `/api/beans/[id]/purchases` — Bean Purchases

| Route | Method | Input | Expected | Actual | Status |
|-------|--------|-------|----------|--------|--------|
| `/api/beans/4/purchases` | POST | `{"price":128,"weight":250,"purchaseDate":"2026-02-28","source":"QA测试店"}` | 201 | 201, purchase created | ✅ |
| `/api/beans/4/purchases` | POST | `{"price":100}` (missing fields) | 400 | 400, validation error | ✅ |
| `/api/beans/999/purchases` | POST | valid data | 500 (FK violation) | 500 — no friendly error | ⚠️ |

### `/api/beans/[id]/brew-logs` — Brew Logs

| Route | Method | Input | Expected | Actual | Status |
|-------|--------|-------|----------|--------|--------|
| `/api/beans/4/brew-logs` | POST | `{"brewMethod":"手冲","dose":15,"waterAmount":250,"brewDate":"2026-02-28","rating":4}` | 201 | 201, brew log created | ✅ |
| `/api/beans/4/brew-logs` | POST | `{"dose":15}` (missing required) | 400 | 400, validation error | ✅ |

### `/api/cafe` — Cafe Purchases

| Route | Method | Input | Expected | Actual | Status |
|-------|--------|-------|----------|--------|--------|
| `/api/cafe` | GET | — | 200 + list | 200, 4 purchases | ✅ |
| `/api/cafe` | POST | `{"cafeName":"QA测试咖啡馆","drinkName":"拿铁","price":38,"purchaseDate":"2026-02-28"}` | 201 | 201, created | ✅ |
| `/api/cafe` | POST | `{}` (missing fields) | 400 | 400, validation error | ✅ |

### `/api/regions`, `/api/varieties`, `/api/roasters` — Knowledge

| Route | Method | Input | Expected | Actual | Status |
|-------|--------|-------|----------|--------|--------|
| `/api/regions` | GET | — | 200 | 200, 11 regions | ✅ |
| `/api/regions` | POST | `{"country":"QA测试国","region":"QA测试区"}` | 201 | 201 | ✅ |
| `/api/varieties` | GET | — | 200 | 200, 11 varieties | ✅ |
| `/api/varieties` | POST | `{"name":"QA测试品种"}` | 201 | 201 | ✅ |
| `/api/roasters` | GET | — | 200 | 200, 1 roaster | ✅ |
| `/api/roasters` | POST | `{"name":"QA测试烘焙","country":"QA测试国"}` | 201 | 201 | ✅ |

### `/api/purchases` & `/api/meta` — Aggregate

| Route | Method | Input | Expected | Actual | Status |
|-------|--------|-------|----------|--------|--------|
| `/api/purchases` | GET | — | 200, combined view | 200, bean + cafe purchases | ✅ |
| `/api/meta` | GET | — | 200, regions/varieties/roasters | 200 | ✅ |

---

## 2. Bugs Found & Fixed

### Bug 1: PUT/DELETE on non-existent bean returns 500 (CRITICAL)
- **File:** `src/app/api/beans/[id]/route.ts`
- **Issue:** Prisma throws when `update`/`delete` target doesn't exist. No existence check before operation.
- **Fix:** Added `findUnique` check before `update`/`delete`, returning 404 if not found.
- **Commit:** `ab9a3d6`

### Bug 2: PUT overwrites all fields — partial update not supported (MEDIUM)
- **File:** `src/app/api/beans/[id]/route.ts` + `src/lib/validations.ts`
- **Issue:** `updateBeanSchema` was identical to `createBeanSchema` (requiring `name`). PUT handler unconditionally set all fields, so omitted optional fields became `null`.
- **Fix:** Changed `updateBeanSchema` to `createBeanSchema.partial()`. PUT handler now only sets fields that are explicitly provided.
- **Commit:** `ab9a3d6`

---

## 3. Code Review Issues

### Missing API Routes (MEDIUM)
- **No PUT/DELETE** for `/api/regions`, `/api/varieties`, `/api/roasters` — knowledge entities can be created but not edited or deleted via API
- **No DELETE** for `/api/cafe/[id]` — cafe purchases cannot be deleted
- **No DELETE** for `/api/beans/[id]/purchases/[purchaseId]` — bean purchases cannot be deleted  
- **No PUT/DELETE** for `/api/beans/[id]/brew-logs/[logId]` — brew logs cannot be edited or deleted
- **Impact:** UI likely has no edit/delete functionality for these entities either

### Foreign Key Violation Returns 500 (LOW)
- **File:** `src/app/api/beans/[id]/purchases/route.ts`, `src/app/api/beans/[id]/brew-logs/route.ts`
- **Issue:** POSTing to a non-existent beanId results in Prisma FK error → 500 instead of 404/400
- **Recommendation:** Check bean exists before creating child records

### No Duplicate Handling for Knowledge Entities (LOW)
- **File:** `src/app/api/regions/route.ts`, `src/app/api/varieties/route.ts`, `src/app/api/roasters/route.ts`
- **Issue:** Prisma unique constraints will throw 500 on duplicate inserts (e.g., same region country+name, same variety name, same roaster name)
- **Recommendation:** Catch `PrismaClientKnownRequestError` with code `P2002` and return 409

### No Authentication/Authorization
- All routes are publicly accessible. Fine for personal use but worth noting.

### Bean DELETE Cascade Behavior (INFO)
- Schema uses `onDelete: Cascade` for BeanPurchase and BrewLog → deleting a bean deletes all its purchases and brew logs. This is correct behavior but should be confirmed with user via UI dialog.

---

## 4. Build Test

| Test | Result |
|------|--------|
| `npm run build` | ✅ Pass — all 19 routes compiled, no errors |

---

## 5. Summary

| Metric | Count |
|--------|-------|
| Total API tests | 24 |
| Passed | 21 |
| Failed (fixed) | 3 |
| Warnings | 1 |
| Code issues found | 5 |
| Critical bugs fixed | 2 |

### Recommendations
1. Add PUT/DELETE routes for knowledge entities (regions, varieties, roasters)
2. Add DELETE routes for cafe purchases, bean purchases, and brew logs
3. Handle Prisma unique constraint errors (P2002) gracefully
4. Validate foreign key existence before creating child records
5. Consider adding rate limiting for production use
