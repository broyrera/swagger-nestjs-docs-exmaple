# TODO — Roadmap setelah Sprint 12

> Temporary working doc. Per-sprint detail tetap ditulis di `docs/02-scrum/sprint-N.md` saat sprint dimulai.

## Status sekarang

5 dari 7 modul sudah real-impl:

- [x] Sprint 9 — Database foundation (Prisma + Postgres + auto-id extension)
- [x] Sprint 10 — Real auth (JWT + global guard + @Public + @CurrentUser)
- [x] Sprint 11 — Organizations real impl (RBAC pattern locked)
- [x] Sprint 12 — Competitions real impl (two-tier RBAC + lifecycle state machine)

Belum di-implement (masih stub):

- [ ] Sprint 13 — Participants
- [ ] Sprint 14 — Matches & Scores
- [ ] Sprint 15 — Standings (computed)
- [ ] Sprint 16 — Brackets (knockout + bye handling)

## Sprint 13: Participants

**Endpoints stub yang di-replace:** create, list (per competition), get, update, approve, reject, remove (soft).

**Key decisions yang perlu di-lock saat planning:**
- Soft remove via `status = REMOVED` (sudah di schema). Hard delete tidak ada.
- `linkedUserId` optional — participant gak wajib punya user account ([adr-001](docs/04-decisions/adr-001-participants-do-not-require-user-account.md), penting!).
- Approve/reject lifecycle: PENDING → APPROVED/REJECTED. REMOVED dari mana saja.
- RBAC: manage participant butuh COMP_OWNER/COMP_ADMIN atau ORG_OWNER/ADMIN atau SUPER_ADMIN. Pola sama dengan competitions.
- View participant: visibility-aware seperti competition (PUBLIC competition → participants visible to all auth users).
- Lock untuk update setelah ada match yang reference participant? (contract: "Some changes may be blocked after matches exist")

**Dependency:** competitions sudah real, jadi unblocked.

## Sprint 14: Matches & Scores

**Endpoints stub yang di-replace:** create, list (per competition), get, update, update-score, update-status.

**Key decisions:**
- Reuse manage RBAC dari competition (OWNER/ADMIN). **Plus:** `SCORE_ADMIN` role gets unlocked di sprint ini — bisa input score tapi gak bisa modify match metadata.
- Match.status state machine: SCHEDULED → ONGOING → COMPLETED. DISPUTED dari ONGOING/COMPLETED. CANCELLED dari mana saja kecuali COMPLETED?
- Score update auto-set status ke COMPLETED (per contract).
- Validate: home != away participant, both participants belong to same competition, both APPROVED.
- Update match metadata: lock setelah score submitted? (contract: "Changing participants may be blocked after score submission")

**Dependency:** participants sudah real.

## Sprint 15: Standings (computed)

**Endpoints:** get standings, get results.

**Key decisions:**
- Standings adalah **computed read-only**. No persistence table.
- Algorithm: aggregate dari matches dengan status=COMPLETED, group by participant, hitung played/won/drawn/lost/scoreFor/scoreAgainst/points.
- Default points: Win=3, Draw=1, Loss=0 (sesuai project vision).
- Tie-breaker: belum di contract — gua usulkan default ke `points DESC, scoreDifference DESC, scoreFor DESC, name ASC`. Lock saat planning.
- Visibility: ikut competition visibility rule.
- Performance: untuk scope sprint ini, hitung in-memory. Caching/materialization itu future concern.

**Dependency:** matches sudah real (terutama score data).

## Sprint 16: Brackets (most complex)

**Endpoints:** get bracket, generate bracket, update bracket match.

**Key decisions yang akan paling makan waktu:**
- **Generation algorithm dengan bye handling untuk non-power-of-2 counts** (3, 5, 7, 9, 13 — ini DIFFERENTIATOR utama produk per [project-product-vision](memory/project_product_vision.md)).
- AUTO mode: seeding strategy (random vs registration-order vs manual placement?). Default random per contract.
- MANUAL mode: admin place participants per slot. Bracket structure tetap di-generate, slot kosong.
- Bye placement: round 1 first slots? Distributed evenly? Lock saat planning.
- BracketRound + BracketMatch population strategy.
- Update bracket match: linked Match optional. Manual winner override allowed.
- Status BYE handling — auto-advance.

**Dependency:** participants real (need APPROVED participants), matches real (bracket match → match link), competitions real.

**Effort estimate:** kemungkinan butuh 2x effort dibanding sprint sebelumnya karena bracket math. Pertimbangkan split jadi 16a (generate AUTO) dan 16b (MANUAL + update).

## Sisa contract drift / refactor candidates

Sudah dicatat sebelumnya, belum dikerjakan:

- [ ] **Validation error envelope** — default Nest pipe return `{message: [...errors], statusCode}`, beda dari `ErrorResponseDto`. Bikin `ValidationExceptionFactory` untuk normalize. Sprint kecil tersendiri (~30 min).
- [ ] **Generic exception filter** — sekarang setiap throw di service nulis envelope manual. Bisa di-DRY pakai global `HttpExceptionFilter` yang auto-wrap. Refactor opportunity setelah Sprint 16, biar semua module ke-cover.
- [ ] **Extract AuthorizationService** — pola `assertCanManage`/`assertCanCreate`/etc. udah duplikat di Organizations + Competitions. Setelah Participants/Matches dibikin (3+ modul), extract ke `src/common/auth/authorization.service.ts`. Sprint 13/14 candidate.
- [ ] **Pagination** — semua list endpoint sekarang return all rows. `pagination-meta.dto.ts` udah ada di common/dto tapi belum dipakai. Tambahkan saat butuh atau sebelum production.
- [ ] **Response interceptor** — service return envelope manually. Bisa di-refactor jadi service return raw data + global `ResponseInterceptor` yang wrap. Bigger refactor — pertimbangkan setelah semua modul real.

## Operational notes

- **Dev server lifecycle:** kalau lu `npm run start:dev` di terminal sendiri, gua gak bisa run `prisma generate` karena Windows file lock di engine .dll. Pastikan stop dulu sebelum schema change.
- **Port 3000 orphan:** kadang `TaskStop` cuma kill npm parent, leave node child. Cek `Get-NetTCPConnection -LocalPort 3000` dan kill PID kalau perlu.
- **DB reset blocked:** Prisma 6+ punya safety guard untuk `migrate reset` lewat AI agent. Lu perlu kasih explicit consent. Workaround sementara: pakai email berbeda per smoke test (suffix timestamp).

## Cara execute next sprint

Pattern yang kepegang sejauh ini:

1. Gua tulis `docs/02-scrum/sprint-N.md` dengan stories + RBAC table + lifecycle table + smoke test script + DoD.
2. Highlight decisions ke lu, ask clarification kalau ambiguous.
3. Lu approve / revise.
4. Eksekusi step-by-step (build verify per step).
5. Smoke test end-to-end.
6. Patch drift kalau ada.
7. Commit dengan message yang jelaskan WHY, bukan WHAT.
