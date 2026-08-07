# Sprint 9 — Real API Integration (ATS + Applications + Roadmap)

## Goal
Replace mock data with real API integrations where possible. Keep the UI exactly the same, no redesign, no auth/routing changes, no breaking changes. GitHub and LeetCode are already live-connected (prior sprints). This sprint wires ATS, Applications, and Roadmap.

## Backend — Applications CRUD module ✅
- [x] `backend/.../application/ApplicationEntity.java`
- [x] `backend/.../application/ApplicationRepository.java`
- [x] `backend/.../application/ApplicationRequest.java` (DTO)
- [x] `backend/.../application/ApplicationResponse.java` (DTO)
- [x] `backend/.../application/ApplicationService.java`
- [x] `backend/.../application/ApplicationServiceImpl.java`
- [x] `backend/.../application/ApplicationController.java`
- [x] `GET/POST/PUT/DELETE /api/v1/applications`

## Backend — Roadmap CRUD module ✅
- [x] `backend/.../roadmap/RoadmapEntity.java`
- [x] `backend/.../roadmap/RoadmapRepository.java`
- [x] `backend/.../roadmap/RoadmapRequest.java` (DTO)
- [x] `backend/.../roadmap/RoadmapResponse.java` (DTO)
- [x] `backend/.../roadmap/RoadmapService.java`
- [x] `backend/.../roadmap/RoadmapServiceImpl.java`
- [x] `backend/.../roadmap/RoadmapController.java`
- [x] `GET/POST/PUT/DELETE /api/v1/roadmaps`

## Frontend — API services & types ✅
- [x] `frontend/src/services/api/applicationService.ts` (full CRUD)
- [x] `frontend/src/services/api/roadmapService.ts` (full CRUD)
- [x] `frontend/src/services/api/endpoints.ts` (application & roadmap endpoints)
- [x] `frontend/src/services/api/types/index.ts` (ApplicationDto, RoadmapDto)
- [x] `frontend/src/services/api/index.ts` (export new services)

## Frontend — ATS real API integration ✅
- [x] `frontend/src/services/ats/atsMapper.ts` (backend AtsResponse → component data, mock fallback)
- [x] `frontend/src/hooks/useAts.ts` (upload → analyzeResumeById, loadMock)
- [x] `frontend/src/components/ats/ResumeUpload.tsx` (pass File to parent, isUploading prop)
- [x] `frontend/src/pages/ATSPage.tsx` (consume useAts, mock fallback)
- [x] `frontend/src/hooks/index.ts` (export useAts)

## Frontend — Wire Applications page to backend ✅
- [x] `frontend/src/pages/ApplicationTrackerPage.tsx` (GET on mount, POST via handleAdd, dto↔view mappers, mock fallback)

## Frontend — Wire Roadmap page to backend ✅
- [x] `frontend/src/pages/RoadmapPage.tsx` (GET saved roadmap on mount, POST generated roadmap, JSON-field parsing, mock fallback)

## Verification ✅
- [x] `mvn clean install` passes (backend)
- [x] `npm run build` passes (zero TS errors — `tsc -b` verified)
- [x] CRUD operations wired end-to-end
- [x] Mock fallback when backend unavailable
- [x] Existing routes/features still work (no auth/routing/UI changes)
